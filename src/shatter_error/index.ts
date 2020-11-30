import { InitOptions } from '../types/index'
import { obj2query } from 'utils'
import { catchXhr, catchFetch } from './catchRequest'
import { SendType } from './types/sendType'
import { ERRORTYPES, ERRORNAMETYPES } from '../common/errorType'
import { logMethods } from '../common/logMethods'
import { BindStaticEvent } from './eventHandle'
import Hooks from './hooks'

function hasSendBeacon() {
    return window.navigator && !!window.navigator.sendBeacon
}

function getHttpType(url) {
    const first = url.substr && url.substr(0, 5)
    if (!first) {
        return 'unknown'
    } else if (first === 'https') {
        return 'https'
    } else if (first === 'http:') {
        return 'http'
    } else {
        return 'other'
    }
}

const sendImgLog = function(url) {
    new Image().src = url;
}

const sendBeacon = function(params, type='formData') {
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

class ErrorForShatter {
    private options: InitOptions
    private sendType: logMethods = logMethods['img']
    private hooks

    constructor(options: InitOptions){
        this.options = options
        this._init()
    }

    _init() {
        const op = this.options
        const { blockConsole, blockPromise, blockError, blockSource, blockXhr, blockFetch, blockTry, blockHttpRequest, onlyHttpRequest } = op
        this.hooks = new Hooks(op)

        if (hasSendBeacon() && !op.onlyImg) {
            this.sendType = logMethods['beacon']
        }

        if (!onlyHttpRequest) {
            BindStaticEvent(this, {
                blockConsole,
                blockPromise,
                blockError,
                blockSource,
                blockTry
            })
        }

        if (!blockHttpRequest) {
            if (!blockXhr) {
                catchXhr((event: any, args: IArguments, openArgs: IArguments) => {
                    const target = event.currentTarget
                    const url = target.responseURL
                    this.report({
                        name: ERRORNAMETYPES['ajaxError'],
                        url: url,
                        type: ERRORTYPES['FETCH_ERROR'],
                        request: {
                            method: openArgs[0],
                            httpType: getHttpType(url),
                            data: (args && args[0]) || ''
                        },
                        response: {
                            status: target.status,
                            data: target.statusText
                        }
                    })
                })
            }

            if (!blockFetch) {
                catchFetch((res: Response, args: IArguments) => {
                    res.text().then(text => {
                        const url = res.url || args[0]
                        this.report({
                            name: ERRORNAMETYPES['fetchError'],
                            url: url,
                            msg: res.statusText,
                            type: ERRORTYPES['FETCH_ERROR'],
                            request: {
                                httpType: getHttpType(url),
                                method: args[1].method,
                                data: args[1].body || ''
                            },
                            response: {
                                status: res.status,
                                data: text || res.statusText
                            }
                        })
                    })
                }, (error: string, args) => {
                    const httpType = getHttpType(args[0])
                    this.report({
                        name: ERRORNAMETYPES['fetchError'],
                        msg: error,
                        url: args[0],
                        type: ERRORTYPES['FETCH_ERROR'],
                        request: {
                            httpType: httpType,
                            data: args[1].body,
                            method: args[1].method
                        }
                    })
                })
            }
            
        }
    }

    report(params:SendType) {
        const { dsn, appkey } = this.options
        Object.assign(params, {
            _t: new Date().getTime(),
            appkey
        })

        const pass = this.hooks.beforeSendData(params)
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

export { ErrorForShatter, sendBeacon, sendImgLog }
