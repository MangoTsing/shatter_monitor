/* eslint-disable prefer-rest-params */
import { ERRORTYPES } from './common/errorType'

export const BindEvent = function (w) {

    
    /**
     * 监听全局 addEventListener 事件，针对跨域脚本的 Script error 问题
     */
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


    /**
     * 统一对 js 错误进行处理
     */
    const oldError = window.onerror || null
    window.onerror = (msg:string, url, line, col, error) => {
        w.log({
            name: 'jserror', msg, url, line, col, type: ERRORTYPES['JAVASCRIPT_ERROR']
        })
        oldError && oldError(msg, url, line, col, error)
    }


    /**
     * 统一对 资源 加载错误进行处理
     */
    window.addEventListener('error', event => {
        if (!event) return
        // 过滤js error
        const target = event.target || event.srcElement
        const isElementTarget = target instanceof HTMLScriptElement || target instanceof HTMLLinkElement || target instanceof HTMLImageElement
        if (!isElementTarget) return false
        // 上报资源地址
        const url = (<HTMLImageElement>target).src || (<HTMLLinkElement>target).href
        w.log({
            name: 'sourceError', url, type: ERRORTYPES['RESOURCE_ERROR']
        })
    }, true)


    /**
     * 统一对 promise 错误进行处理
     */
    window.addEventListener('unhandledrejection', event => {
        if (!event.reason || !event.reason.stack) {
            w.log({
                name: 'unhandledrejection',
                type: ERRORTYPES['PROMISE_ERROR']
            })
            return
        }
        const fileMsg = event.reason.stack.split('\n')[1].split('at ')[1]
        const fileArr = fileMsg.split(':')
        const line = fileArr[fileArr.length - 2]
        const col = fileArr[fileArr.length - 1]
        const url = fileMsg.slice(0, -line.length -col.length - 2)
        const msg = event.reason.message;
        w.log({
            name: 'unhandledrejection', msg, url, line, col, type: ERRORTYPES['PROMISE_ERROR']
        })
    }, true)

}
