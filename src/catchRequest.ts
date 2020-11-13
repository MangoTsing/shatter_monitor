
/* eslint-disable prefer-rest-params */
export const catchXhr = function(sendFn:(event: ProgressEvent) => void) {
    if(!window.XMLHttpRequest) return;
    const xmlhttp = window.XMLHttpRequest;
    const _oldSend = xmlhttp.prototype.send;
    const _handleEvent = function (event: any) {
        if (event && event.currentTarget && event.currentTarget.status !== 200) {
            sendFn && sendFn(event)
        }
    }
    xmlhttp.prototype.send = function () {
        if (this['addEventListener']) {
            this['addEventListener']('error', _handleEvent)
            this['addEventListener']('load', _handleEvent)
            this['addEventListener']('abort', _handleEvent)
        } else {
            const _oldStateChange = this['onreadystatechange']
            this['onreadystatechange'] = function (event) {
                if (this.readyState === 4) {
                    _handleEvent(event)
                }
                _oldStateChange && _oldStateChange.apply(this, arguments)
            }
        }
        return _oldSend.apply(this, arguments)
    }
}

export const catchFetch = function(sendFn:(res: Response) => void, errorFn:(error: string, args: IArguments) => void) {
    if(!window.fetch) return
    const _oldFetch = window.fetch
    window.fetch = function () {
        const args = arguments
        return _oldFetch.apply(this, arguments)
        .then((res:Response) => {
            if (!res.ok) {
                sendFn && sendFn(res)
            }
            return res
        })
        .catch((error:string) => {
            errorFn && errorFn(error.toString(), args)
            throw error
        })
    }
}