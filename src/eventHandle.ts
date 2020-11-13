import { ERRORTYPES } from './common/errorType'

export const BindEvent = function (w) {

    window.onerror = (msg:string, url, line, col) => {
        w.log({
            name: 'jserror', msg, url, line, col, type: ERRORTYPES['JAVASCRIPT_ERROR']
        })
    }

    window.addEventListener('error', event => {
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
