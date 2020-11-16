var shatter = (function (exports) {
    'use strict';

    function obj2query(obj) {
        return Object.entries(obj).reduce((result, [key, value], index) => {
            if (typeof value === 'object') {
                value = JSON.stringify(value);
            }
            if (index !== 0) {
                result += '&';
            }
            result += `${key}=${value}`;
            return result;
        }, '');
    }

    const catchXhr = function (sendFn) {
        if (!window.XMLHttpRequest)
            return;
        const xmlhttp = window.XMLHttpRequest;
        const _oldSend = xmlhttp.prototype.send;
        const _handleEvent = function (event) {
            if (event && event.currentTarget && event.currentTarget.status !== 200) {
                sendFn && sendFn(event);
            }
        };
        xmlhttp.prototype.send = function () {
            if (this['addEventListener']) {
                this['addEventListener']('error', _handleEvent);
                this['addEventListener']('load', _handleEvent);
                this['addEventListener']('abort', _handleEvent);
            }
            else {
                const _oldStateChange = this['onreadystatechange'];
                this['onreadystatechange'] = function (event) {
                    if (this.readyState === 4) {
                        _handleEvent(event);
                    }
                    _oldStateChange && _oldStateChange.apply(this, arguments);
                };
            }
            return _oldSend.apply(this, arguments);
        };
    };
    const catchFetch = function (sendFn, errorFn) {
        if (!window.fetch)
            return;
        const _oldFetch = window.fetch;
        window.fetch = function () {
            const args = arguments;
            return _oldFetch.apply(this, arguments)
                .then((res) => {
                if (!res.ok) {
                    sendFn && sendFn(res);
                }
                return res;
            })
                .catch((error) => {
                errorFn && errorFn(error.toString(), args);
                throw error;
            });
        };
    };

    var ERRORTYPES;
    (function (ERRORTYPES) {
        ERRORTYPES["JAVASCRIPT_ERROR"] = "JAVASCRIPT_ERROR";
        ERRORTYPES["BUSINESS_ERROR"] = "BUSINESS_ERROR";
        ERRORTYPES["LOG_ERROR"] = "LOG_ERROR";
        ERRORTYPES["FETCH_ERROR"] = "HTTP_ERROR";
        ERRORTYPES["RESOURCE_ERROR"] = "RESOURCE_ERROR";
        ERRORTYPES["PROMISE_ERROR"] = "PROMISE_ERROR";
    })(ERRORTYPES || (ERRORTYPES = {}));

    const BindEvent = function (w) {
        const originAddEventListener = EventTarget.prototype.addEventListener;
        EventTarget.prototype.addEventListener = function (type, listener, options) {
            const wrappedListener = function () {
                try {
                    return listener.apply(this, arguments);
                }
                catch (err) {
                    throw err;
                }
            };
            return originAddEventListener.call(this, type, wrappedListener, options);
        };
        const oldError = window.onerror || null;
        window.onerror = (msg, url, line, col, error) => {
            w.log({
                name: 'jserror', msg, url, line, col, type: ERRORTYPES['JAVASCRIPT_ERROR']
            });
            oldError && oldError(msg, url, line, col, error);
        };
        window.addEventListener('error', event => {
            if (!event)
                return;
            const target = event.target || event.srcElement;
            const isElementTarget = target instanceof HTMLScriptElement || target instanceof HTMLLinkElement || target instanceof HTMLImageElement;
            if (!isElementTarget)
                return false;
            const url = target.src || target.href;
            w.log({
                name: 'sourceError', url, type: ERRORTYPES['RESOURCE_ERROR']
            });
        }, true);
        window.addEventListener('unhandledrejection', event => {
            if (!event.reason || !event.reason.stack) {
                w.log({
                    name: 'unhandledrejection',
                    type: ERRORTYPES['PROMISE_ERROR']
                });
                return;
            }
            const fileMsg = event.reason.stack.split('\n')[1].split('at ')[1];
            const fileArr = fileMsg.split(':');
            const line = fileArr[fileArr.length - 2];
            const col = fileArr[fileArr.length - 1];
            const url = fileMsg.slice(0, -line.length - col.length - 2);
            const msg = event.reason.message;
            w.log({
                name: 'unhandledrejection', msg, url, line, col, type: ERRORTYPES['PROMISE_ERROR']
            });
        }, true);
    };

    class Hooks {
        constructor(options) {
            this.options = options;
        }
        beforeSendData(params) {
            if (!this.options.beforeSendData)
                return true;
            try {
                return this.options.beforeSendData(params);
            }
            catch (e) {
                throw e;
            }
        }
    }

    function hasSendBeacon() {
        return window.navigator && !!window.navigator.sendBeacon;
    }
    function sendImgLog(url) {
        new Image().src = url;
    }
    function sendBeacon(params, type = 'formData') {
        if (type !== 'formData')
            return;
        const formData = new FormData();
        for (const item in params) {
            if (item === 'dsn')
                continue;
            let content = params[item];
            if (typeof content === 'object') {
                content = JSON.stringify(content);
            }
            formData.append(item, content);
        }
        window.navigator.sendBeacon(params.dsn, formData);
    }
    class init {
        constructor(options) {
            this.sendType = 'img';
            this.options = options;
            this.hooks = new Hooks(options);
            if (hasSendBeacon()) {
                this.sendType = 'beacon';
            }
            BindEvent(this);
            catchXhr((event) => {
                const target = event.currentTarget;
                this.log({
                    name: 'xhrError',
                    url: target.responseURL,
                    type: ERRORTYPES['FETCH_ERROR'],
                    response: {
                        status: target.status,
                        data: target.statusText
                    }
                });
            });
            catchFetch((res) => {
                this.log({
                    name: 'fetchError',
                    url: res.url,
                    msg: res.statusText,
                    type: ERRORTYPES['FETCH_ERROR'],
                    response: {
                        status: res.status,
                        data: res.statusText
                    }
                });
            }, (error, args) => {
                const httpType = args[0].substr(0, 5) === 'https' ? 'https' : 'other';
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
                });
            });
        }
        log(params) {
            const { dsn, appkey } = this.options;
            Object.assign(params, {
                _t: new Date().getTime(),
                appkey
            });
            const pass = this.hooks.beforeSendData();
            if (!pass)
                return false;
            const query = obj2query(params);
            if (this.options.debug) {
                console.log(`log to : ${dsn}?${query}`);
                return;
            }
            if (this.sendType === 'img') {
                sendImgLog(`${dsn}?${query}`);
            }
            else if (this.sendType === 'beacon') {
                sendBeacon(Object.assign(params, {
                    dsn
                }));
            }
        }
    }

    exports.init = init;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

}({}));
