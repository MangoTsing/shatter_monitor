
/* eslint-disable prefer-rest-params */
export const catchXhr = function(sendFn:(event: ProgressEvent, args: IArguments, openArgs: IArguments) => void) {
    if(!window.XMLHttpRequest) return;
    const xmlhttp = window.XMLHttpRequest;
    const _oldSend = xmlhttp.prototype.send;
    const _oldOpen = xmlhttp.prototype.open;
    const _handleEvent = function (event: any, args: IArguments, openArgs: IArguments) {
        if (event && event.currentTarget && event.currentTarget.status !== 200) {
            sendFn && sendFn(event, args, openArgs)
        }
    }
    xmlhttp.prototype.open = function () {
        const args = arguments
        this._openArgs = args
        return _oldOpen.apply(this, args)
    }
    xmlhttp.prototype.send = function () {
        const args = arguments
        if (this['addEventListener']) {
            this['addEventListener']('error', function(e){_handleEvent(e,args,this._openArgs)})
            this['addEventListener']('load', function(e){_handleEvent(e,args,this._openArgs)})
            this['addEventListener']('abort', function(e){_handleEvent(e,args,this._openArgs)})
        } else {
            const _oldStateChange = this['onreadystatechange']
            this['onreadystatechange'] = function (event) {
                if (this.readyState === 4) {
                    _handleEvent(event, args, this._openArgs)
                }
                _oldStateChange && _oldStateChange.apply(this, args)
            }
        }
        return _oldSend.apply(this, args)
    }
}

export const catchFetch = function(sendFn:(res: Response, args: IArguments) => void, errorFn:(error: string, args: IArguments) => void) {
    if(!window.fetch) return
    const _oldFetch = window.fetch
    window.fetch = function () {
        const args = arguments
        return _oldFetch.apply(this, args)
        .then((res:Response) => {
            if (!res.ok) {
                sendFn && sendFn(res, args)
            }
            return res
        })
        .catch((error:string) => {
            errorFn && errorFn(error.toString(), args)
            throw error
        })
    }
}