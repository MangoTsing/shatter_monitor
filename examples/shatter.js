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
            result += `${key}=${encodeURIComponent(value)}`;
            return result;
        }, '');
    }

    function isString(param) {
        return typeof param === 'string';
    }
    function isError(param) {
        return Object.prototype.toString.call(param).indexOf('Error') > -1;
    }

    function getLocationHref() {
        if (typeof document === 'undefined' || document.location == null)
            return '';
        return document.location.href;
    }

    const catchXhr = function (sendFn) {
        if (!window.XMLHttpRequest)
            return;
        const xmlhttp = window.XMLHttpRequest;
        const _oldSend = xmlhttp.prototype.send;
        const _oldOpen = xmlhttp.prototype.open;
        const _handleEvent = function (event, args, openArgs, openTime) {
            if (event && event.currentTarget && event.currentTarget.status !== 200) {
                sendFn && sendFn(event, args, openArgs, openTime);
            }
        };
        xmlhttp.prototype.open = function () {
            const args = arguments;
            this._openArgs = args;
            this._openTime = new Date().getTime();
            return _oldOpen.apply(this, args);
        };
        xmlhttp.prototype.send = function () {
            const args = arguments;
            if (this['addEventListener']) {
                this['addEventListener']('error', function (e) { _handleEvent(e, args, this._openArgs, this._openTime); });
                this['addEventListener']('load', function (e) { _handleEvent(e, args, this._openArgs, this._openTime); });
                this['addEventListener']('abort', function (e) { _handleEvent(e, args, this._openArgs, this._openTime); });
            }
            else {
                const _oldStateChange = this['onreadystatechange'];
                this['onreadystatechange'] = function (event) {
                    if (this.readyState === 4) {
                        _handleEvent(event, args, this._openArgs, this._openTime);
                    }
                    _oldStateChange && _oldStateChange.apply(this, args);
                };
            }
            return _oldSend.apply(this, args);
        };
    };
    const catchFetch = function (sendFn, errorFn) {
        if (!window.fetch)
            return;
        const _oldFetch = window.fetch;
        window.fetch = function () {
            const args = arguments;
            const openTime = new Date().getTime();
            return _oldFetch.apply(this, args)
                .then((res) => {
                if (!res.ok) {
                    sendFn && sendFn(res, args, openTime);
                }
                return res;
            })
                .catch((error) => {
                errorFn && errorFn(error.toString(), args, openTime);
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
        ERRORTYPES["VUE_ERROR"] = "VUE_ERROR";
    })(ERRORTYPES || (ERRORTYPES = {}));
    var ERRORNAMETYPES;
    (function (ERRORNAMETYPES) {
        ERRORNAMETYPES["jsError"] = "JS_ERROR";
        ERRORNAMETYPES["sourceError"] = "SOURCE_ERROR";
        ERRORNAMETYPES["promiseError"] = "UNHANDLEDREJECTION";
        ERRORNAMETYPES["consoleError"] = "CONSOLE_ERROR";
        ERRORNAMETYPES["ajaxError"] = "AJAX_ERROR";
        ERRORNAMETYPES["fetchError"] = "FETCH_ERROR";
        ERRORNAMETYPES["VueError"] = "VueError";
    })(ERRORNAMETYPES || (ERRORNAMETYPES = {}));

    const BindStaticEvent = function (w, options) {
        if (!options.blockTry) {
            const originAddEventListener = EventTarget.prototype.addEventListener;
            const originRemoveEventListener = EventTarget.prototype.removeEventListener;
            const catchFuncStack = [];
            EventTarget.prototype.addEventListener = function (type, listener, options) {
                const wrappedListener = function () {
                    try {
                        return listener.apply(this, arguments);
                    }
                    catch (err) {
                        throw err;
                    }
                };
                catchFuncStack.push({
                    origin: listener,
                    wrap: wrappedListener
                });
                return originAddEventListener.call(this, type, wrappedListener, options);
            };
            EventTarget.prototype.removeEventListener = function (type, listener, options) {
                let wrap;
                const isInclude = catchFuncStack.some((item) => {
                    if (item.origin === listener) {
                        wrap = item.wrap;
                        return true;
                    }
                    else {
                        return false;
                    }
                });
                if (isInclude) {
                    return originRemoveEventListener.call(this, type, wrap, options);
                }
                else {
                    return originRemoveEventListener.call(this, type, listener, options);
                }
            };
        }
        if (!options.blockError) {
            const oldError = window.onerror || null;
            window.onerror = (msg, url, line, col, error) => {
                w.report({
                    name: ERRORNAMETYPES['jsError'], msg, url, line, col, type: ERRORTYPES['JAVASCRIPT_ERROR']
                });
                oldError && oldError(msg, url, line, col, error);
            };
        }
        if (!options.blockSource) {
            window.addEventListener('error', event => {
                if (!event)
                    return;
                const target = event.target || event.srcElement;
                const isElementTarget = target instanceof HTMLScriptElement || target instanceof HTMLLinkElement || target instanceof HTMLImageElement;
                if (!isElementTarget)
                    return false;
                const url = target.src || target.href;
                w.report({
                    name: ERRORNAMETYPES['sourceError'], url, type: ERRORTYPES['RESOURCE_ERROR']
                });
            }, true);
        }
        if (!options.blockPromise) {
            window.addEventListener('unhandledrejection', event => {
                if (!event.reason || !event.reason.stack || !event.reason.stack.includes('\n')) {
                    w.report({
                        name: ERRORNAMETYPES['promiseError'],
                        type: ERRORTYPES['PROMISE_ERROR'],
                        msg: (event.reason && event.reason.stack) || event.reason || ''
                    });
                    return;
                }
                const fileMsg = event.reason.stack.split('\n')[1].split('at ')[1];
                const fileArr = fileMsg.split(':');
                const line = fileArr[fileArr.length - 2];
                const col = fileArr[fileArr.length - 1];
                const url = fileMsg && fileMsg.slice(0, -line.length - col.length - 2);
                const msg = event.reason.message;
                w.report({
                    name: ERRORNAMETYPES['promiseError'], msg, url, line, col, type: ERRORTYPES['PROMISE_ERROR']
                });
            }, true);
        }
        if (!options.blockConsole) {
            const originConsoleError = window.console.error;
            window.console.error = (func => {
                return (...args) => {
                    args.forEach(item => {
                        if (isError(item)) {
                            let fileMsg;
                            if (item.stack && item.stack.split('\n')[1]) {
                                fileMsg = item.stack && item.stack.split('\n')[1].split('at ')[1];
                            }
                            else {
                                fileMsg = item.stack;
                            }
                            const fileArr = fileMsg.split(':');
                            const line = fileArr[fileArr.length - 2];
                            const col = fileArr[fileArr.length - 1];
                            const url = (fileMsg.split('(')[1] && fileMsg.split('(')[1].slice(0, -line.length - col.length - 2)) || 'anonymousFunction';
                            w.report({
                                name: ERRORNAMETYPES['consoleError'], msg: item.stack, url, line, col, type: ERRORTYPES['LOG_ERROR']
                            });
                        }
                        else {
                            w.report({
                                name: ERRORNAMETYPES['consoleError'],
                                msg: item,
                                type: ERRORTYPES['LOG_ERROR']
                            });
                        }
                    });
                    func.apply(console, args);
                };
            })(originConsoleError);
        }
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
    function getHttpType(url) {
        const first = url.substr && url.substr(0, 5);
        if (!first) {
            return 'unknown';
        }
        else if (first === 'https') {
            return 'https';
        }
        else if (first === 'http:') {
            return 'http';
        }
        else {
            return 'other';
        }
    }
    const sendImgLog = function (url) {
        new Image().src = url;
    };
    const sendBeacon = function (params, type = 'formData') {
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
    };
    class ErrorForShatter {
        constructor(options) {
            this.sendType = "img";
            this.options = options;
            this._init();
        }
        _init() {
            const op = this.options;
            const { blockConsole, blockPromise, blockError, blockSource, blockXhr, blockFetch, blockTry, blockHttpRequest, onlyHttpRequest } = op;
            this.hooks = new Hooks(op);
            if (hasSendBeacon() && !op.onlyImg) {
                this.sendType = "beacon";
            }
            if (!onlyHttpRequest) {
                BindStaticEvent(this, {
                    blockConsole,
                    blockPromise,
                    blockError,
                    blockSource,
                    blockTry
                });
            }
            if (!blockHttpRequest) {
                if (!blockXhr) {
                    catchXhr((event, args, openArgs, openTime) => {
                        const target = event.currentTarget;
                        const url = target.responseURL;
                        const fetchTimeline = new Date().getTime() - openTime;
                        this.report({
                            name: ERRORNAMETYPES['ajaxError'],
                            url: url,
                            type: ERRORTYPES['FETCH_ERROR'],
                            fetchTimeline,
                            request: {
                                method: openArgs[0],
                                httpType: getHttpType(url),
                                data: (args && args[0]) || ''
                            },
                            response: {
                                status: target.status,
                                data: target.statusText
                            }
                        });
                    });
                }
                if (!blockFetch) {
                    catchFetch((res, args, openTime) => {
                        res.text().then(text => {
                            const url = res.url || args[0];
                            const fetchTimeline = new Date().getTime() - openTime;
                            this.report({
                                name: ERRORNAMETYPES['fetchError'],
                                url: url,
                                msg: res.statusText,
                                type: ERRORTYPES['FETCH_ERROR'],
                                fetchTimeline,
                                request: {
                                    httpType: getHttpType(url),
                                    method: args[1].method,
                                    data: args[1].body || ''
                                },
                                response: {
                                    status: res.status,
                                    data: text || res.statusText
                                }
                            });
                        });
                    }, (error, args, openTime) => {
                        const httpType = getHttpType(args[0]);
                        const fetchTimeline = new Date().getTime() - openTime;
                        this.report({
                            name: ERRORNAMETYPES['fetchError'],
                            msg: error,
                            url: args[0],
                            fetchTimeline,
                            type: ERRORTYPES['FETCH_ERROR'],
                            request: {
                                httpType: httpType,
                                data: args[1].body,
                                method: args[1].method
                            }
                        });
                    });
                }
            }
        }
        report(params) {
            const { dsn, appkey } = this.options;
            Object.assign(params, {
                _t: new Date().getTime(),
                appkey
            });
            const pass = this.hooks.beforeSendData(params);
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

    class PerformanceForShatter {
        constructor() {
            console.log('performance');
        }
        init() {
            console.log('performance init');
        }
    }

    class BehaviorForShatter {
        constructor() {
            console.log('behavior');
        }
        init() {
            console.log('behavior init');
        }
    }

    function formatComponentName(vm) {
        if (vm.$root === vm)
            return 'root';
        const name = vm._isVue ? (vm.$options && vm.$options.name) || (vm.$options && vm.$options._componentTag) : vm.name;
        return ((name ? 'component <' + name + '>' : 'anonymous component') +
            (vm._isVue && vm.$options && vm.$options.__file ? ' at ' + (vm.$options && vm.$options.__file) : ''));
    }
    function handleVueError(err, vm, info) {
        const componentName = formatComponentName(vm);
        const propsData = vm.$options && vm.$options.propsData;
        const data = {
            type: ERRORTYPES.VUE_ERROR,
            msg: `${err.message}(${info})`,
            url: getLocationHref(),
            componentName: componentName,
            propsData: propsData || '',
            name: ERRORNAMETYPES['VueError'],
            stack: err.stack || []
        };
        return data;
    }

    class ShatterErrorVue {
        static install(Vue, options) {
            const shatter = new ErrorForShatter(options);
            const asyncErrorHandler = (err) => {
                throw new Error(err);
            };
            Vue.mixin({
                beforeCreate() {
                    const methods = this.$options.methods || {};
                    Object.keys(methods).forEach(key => {
                        let fn = methods[key];
                        this.$options.methods[key] = function (...args) {
                            let ret = fn.apply(this, args);
                            if (ret && typeof ret.catch === 'function') {
                                return ret.catch(asyncErrorHandler);
                            }
                            else {
                                return ret;
                            }
                        };
                    });
                }
            });
            if (Vue.config.errorHandler) {
                const oldHandler = Vue.config.errorHandler;
                Vue.config.errorHandler = function (err, vm, info) {
                    const errorData = handleVueError.apply(null, [err, vm, info]);
                    shatter.report(errorData);
                    oldHandler.call(this, err, vm, info);
                };
            }
            else {
                Vue.config.errorHandler = function (err, vm, info) {
                    const errorData = handleVueError.apply(null, [err, vm, info]);
                    shatter.report(errorData);
                };
            }
        }
    }

    class ShatterInit {
        constructor(options) {
            const { usage } = options;
            const defaultShatter = 'ErrorForShatter';
            const staticShatterSupport = ShatterInit.shatterSupport;
            const shatterArray = [];
            if (usage === 'all') {
                shatterArray.push(...Object.keys(staticShatterSupport));
            }
            else if (Array.isArray(usage)) {
                shatterArray.push(...usage);
            }
            else if (isString(usage)) {
                shatterArray.push(usage);
            }
            else {
                shatterArray.push(defaultShatter);
            }
            shatterArray.forEach((item) => {
                new staticShatterSupport[item](options);
            });
        }
    }
    ShatterInit.shatterSupport = {
        ErrorForShatter,
        PerformanceForShatter,
        BehaviorForShatter
    };

    exports.BehaviorForShatter = BehaviorForShatter;
    exports.ErrorForShatter = ErrorForShatter;
    exports.PerformanceForShatter = PerformanceForShatter;
    exports.ShatterErrorVue = ShatterErrorVue;
    exports.ShatterInit = ShatterInit;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

}({}));
