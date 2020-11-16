import { InitOptions } from './types/index'
import { obj2query } from 'utils'
import { catchXhr, catchFetch } from './catchRequest'
import { SendType } from './types/sendType'
import { ERRORTYPES } from './common/errorType'
import { BindEvent } from './eventHandle'
import Hooks from './hooks'

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
        if (item === 'dsn') continue
        let content = params[item]
        if (typeof content === 'object') {
            content = JSON.stringify(content)
        }
        formData.append(item, content)
    }
    window.navigator.sendBeacon(params.dsn, formData)
}

export class init {
    private options: InitOptions
    private sendType = 'img'
    private hooks

    constructor(options:InitOptions){
        this.options = options
        this.hooks = new Hooks(options)

        if (hasSendBeacon()) {
            this.sendType = 'beacon'
        }

        BindEvent(this)


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

        const pass = this.hooks.beforeSendData()
        if (!pass) return false

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

