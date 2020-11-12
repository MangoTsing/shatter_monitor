import { InitOptions } from './types/index'
import { obj2query } from 'utils'
import { catchXhr, catchFetch } from './xhr'
import { SendType } from './types/sendType'
import { ERRORTYPES } from './common/errorType'

function hasSendBeacon() {
    return window.navigator && !!window.navigator.sendBeacon
}

function sendImgLog(url) {
    new Image().src = url;
}

function sendBeacon(params, type='formData') {
    if (type !== 'formData') return
    const formData = new FormData()
    for (const item in params) {
        if (item !== 'dsn') {
            let content = params[item]
            if (typeof content === 'object') {
                content = JSON.stringify(content)
            }
            formData.append(item, content)
        }
    }
    window.navigator.sendBeacon(params.dsn, formData)
}

export class init {
    private options: InitOptions
    private sendType = 'img'

    constructor(options:InitOptions){
        this.options = options

        if (hasSendBeacon()) {
            this.sendType = 'beacon'
        }

        window.onerror = (msg:string, url, line, col) => {
            this.log({
                name: 'onerror', msg, url, line, col, type: ERRORTYPES['JAVASCRIPT_ERROR']
            })
        }
        window.addEventListener('error', event => {
            // 过滤js error
            const target = event.target || event.srcElement
            const isElementTarget = target instanceof HTMLScriptElement || target instanceof HTMLLinkElement || target instanceof HTMLImageElement
            if (!isElementTarget) return false
            // 上报资源地址
            const url = (<HTMLImageElement>target).src || (<HTMLLinkElement>target).href
            this.log({
                name: 'addError', url, type: ERRORTYPES['RESOURCE_ERROR']
            })
        }, true)
        window.addEventListener('unhandledrejection', event => {
            if (!event.reason || !event.reason.stack) {
                this.log({
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
            this.log({
                name: 'unhandledrejection', msg, url, line, col, type: ERRORTYPES['PROMISE_ERROR']
            })
        }, true)
        catchXhr((event: any) => {
            const target = event.currentTarget
            this.log({
                name: 'xhrError',
                url: target.responseURL,
                type: ERRORTYPES['FETCH_ERROR'],
                response: {
                    status: target.status,
                    data: target.statusText
                }
            })
        })
        catchFetch((res: Response) => {
            this.log({
                name: 'fetchError',
                url: res.url,
                msg: res.statusText,
                type: ERRORTYPES['FETCH_ERROR'],
                response: {
                    status: res.status,
                    data: res.statusText
                }
            })
        }, (error: string, args) => {
            const httpType = args[0].substr(0, 5) === 'https' ? 'https' : 'other'
            this.log({
                name: 'fetchError',
                msg: error,
                type: ERRORTYPES['FETCH_ERROR'],
                request: {
                    httpType: httpType,
                    data: args[1].body,
                    method: args[1].method,
                    url: args[0]
                }
            })
        })
    }

    log(params:SendType) {
        const { dsn, appkey } = this.options
        Object.assign(params, {
            _t: new Date().getTime(),
            appkey
        })
        const query = obj2query(params)
        if (this.options.debug) {
            console.log(`log to : ${dsn}?${query}`)
            return
        }
        
        if (this.sendType === 'img') {
            sendImgLog(`${dsn}?${query}`)
        } else if (this.sendType === 'beacon') {
            sendBeacon(Object.assign(params, {
                dsn
            }))
        }
        
    }

}

