/* eslint-disable prefer-rest-params */
import { BlockEventSingleTypes } from 'types/index'
import { ERRORTYPES, ERRORNAMETYPES } from './common/errorType'
import { eventWarp } from './types/eventWarp'
import { isError } from './utils/typeCheck'
export const BindStaticEvent = function (w: eventWarp, options: BlockEventSingleTypes) {

    /**
     * 监听全局 addEventListener 事件，针对跨域脚本的 Script error 问题
     */
    if (!options.blockTry) {
        const originAddEventListener = EventTarget.prototype.addEventListener
        EventTarget.prototype.addEventListener = function (type, listener:any, options) {
            const wrappedListener = function () {
                try {
                    return listener.apply(this, arguments)
                }
                catch (err) {
                    throw err
                }
            }
            return originAddEventListener.call(this, type, wrappedListener, options)
        }
    }


    /**
     * 统一对 js 错误进行处理
     */
    if (!options.blockError) {
        const oldError = window.onerror || null
        window.onerror = (msg:string, url, line, col, error) => {
            w.report({
                name: ERRORNAMETYPES['jsError'], msg, url, line, col, type: ERRORTYPES['JAVASCRIPT_ERROR']
            })
            oldError && oldError(msg, url, line, col, error)
        }
    }


    /**
     * 统一对 资源 加载错误进行处理
     */
    if (!options.blockSource) {
        window.addEventListener('error', event => {
            if (!event) return
            // 过滤js error
            const target = event.target || event.srcElement
            const isElementTarget = target instanceof HTMLScriptElement || target instanceof HTMLLinkElement || target instanceof HTMLImageElement
            if (!isElementTarget) return false
            // 上报资源地址
            const url = (<HTMLImageElement>target).src || (<HTMLLinkElement>target).href
            w.report({
                name: ERRORNAMETYPES['sourceError'], url, type: ERRORTYPES['RESOURCE_ERROR']
            })
        }, true)
    }


    /**
     * 统一对 promise 错误进行处理
     */
    if (!options.blockPromise) {
        window.addEventListener('unhandledrejection', event => {
            if (!event.reason || !event.reason.stack || !event.reason.stack.includes('\n')) {
                w.report({
                    name: ERRORNAMETYPES['promiseError'],
                    type: ERRORTYPES['PROMISE_ERROR'],
                    msg: (event.reason && event.reason.stack) || ''
                })
                return
            }
            const fileMsg = event.reason.stack.split('\n')[1].split('at ')[1]
            const fileArr = fileMsg.split(':')
            const line = fileArr[fileArr.length - 2]
            const col = fileArr[fileArr.length - 1]
            const url = fileMsg.slice(0, -line.length -col.length - 2)
            const msg = event.reason.message;
            w.report({
                name: ERRORNAMETYPES['promiseError'], msg, url, line, col, type: ERRORTYPES['PROMISE_ERROR']
            })
        }, true)
    }

    /**
     * 监听全局 console.error 函数进行处理
     */
    if (!options.blockConsole) {
        const originConsoleError = window.console.error
        window.console.error = (func => {
            return (...args) => {
                args.forEach(item => {
                    if (isError(item)) {
                        const fileMsg = item.stack.split('\n')[1].split('at ')[1]
                        const fileArr = fileMsg.split(':')
                        const line = fileArr[fileArr.length - 2]
                        const col = fileArr[fileArr.length - 2]
                        const url = fileMsg.split('(')[1].slice(0, -line.length -col.length - 2)
                        w.report({
                            name: ERRORNAMETYPES['consoleError'], msg: item.stack, url, line, col, type: ERRORTYPES['LOG_ERROR']
                        })
                    } else { // 不是作为 Error 打印出来的 error 只发送 msg
                        w.report({
                            name: ERRORNAMETYPES['consoleError'],
                            msg: item,
                            type: ERRORTYPES['LOG_ERROR']
                        })
                    }
                })
                func.apply(console, args)
            }
          })(originConsoleError)
    }

}
