var shatter = (function (exports) {
    'use strict';

    function obj2query(obj) {
      return Object.entries(obj).reduce(function (result, _ref, index) {
        var key = _ref[0],
            value = _ref[1];

        if (typeof value === 'object') {
          value = JSON.stringify(value);
        }

        if (index !== 0) {
          result += '&';
        }

        result += key + "=" + encodeURIComponent(value);
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
      if (typeof document === 'undefined' || document.location == null) return '';
      return document.location.href;
    }

    var catchXhr = function catchXhr(sendFn) {
      if (!window.XMLHttpRequest) return;
      var xmlhttp = window.XMLHttpRequest;
      var _oldSend = xmlhttp.prototype.send;
      var _oldOpen = xmlhttp.prototype.open;

      var _handleEvent = function _handleEvent(event, args, openArgs, openTime) {
        if (event && event.currentTarget && event.currentTarget.status !== 200) {
          sendFn && sendFn(event, args, openArgs, openTime);
        }
      };

      xmlhttp.prototype.open = function () {
        var args = arguments;
        this._openArgs = args;
        this._openTime = new Date().getTime();
        return _oldOpen.apply(this, args);
      };

      xmlhttp.prototype.send = function () {
        var args = arguments;

        if (this['addEventListener']) {
          this['addEventListener']('error', function (e) {
            _handleEvent(e, args, this._openArgs, this._openTime);
          });
          this['addEventListener']('load', function (e) {
            _handleEvent(e, args, this._openArgs, this._openTime);
          });
          this['addEventListener']('abort', function (e) {
            _handleEvent(e, args, this._openArgs, this._openTime);
          });
        } else {
          var _oldStateChange = this['onreadystatechange'];

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
    var catchFetch = function catchFetch(sendFn, errorFn) {
      if (!window.fetch) return;
      var _oldFetch = window.fetch;

      window.fetch = function () {
        var args = arguments;
        var openTime = new Date().getTime();
        return _oldFetch.apply(this, args).then(function (res) {
          if (!res.ok) {
            sendFn && sendFn(res, args, openTime);
          }

          return res;
        })["catch"](function (error) {
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

    var BindStaticEvent = function BindStaticEvent(w, options) {
      if (!options.blockTry) {
        var originAddEventListener = EventTarget.prototype.addEventListener;
        var originRemoveEventListener = EventTarget.prototype.removeEventListener;
        var catchFuncStack = [];

        EventTarget.prototype.addEventListener = function (type, listener, options) {
          var wrappedListener = function wrappedListener() {
            try {
              return listener.apply(this, arguments);
            } catch (err) {
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
          var wrap;
          var isInclude = catchFuncStack.some(function (item) {
            if (item.origin === listener) {
              wrap = item.wrap;
              return true;
            } else {
              return false;
            }
          });

          if (isInclude) {
            return originRemoveEventListener.call(this, type, wrap, options);
          } else {
            return originRemoveEventListener.call(this, type, listener, options);
          }
        };
      }

      if (!options.blockError) {
        var oldError = window.onerror || null;

        window.onerror = function (msg, url, line, col, error) {
          w.report({
            name: ERRORNAMETYPES['jsError'],
            msg: msg,
            url: url,
            line: line,
            col: col,
            type: ERRORTYPES['JAVASCRIPT_ERROR']
          });
          oldError && oldError(msg, url, line, col, error);
        };
      }

      if (!options.blockSource) {
        window.addEventListener('error', function (event) {
          if (!event) return;
          var target = event.target || event.srcElement;
          var isElementTarget = target instanceof HTMLScriptElement || target instanceof HTMLLinkElement || target instanceof HTMLImageElement;
          if (!isElementTarget) return false;
          var url = target.src || target.href;
          w.report({
            name: ERRORNAMETYPES['sourceError'],
            url: url,
            type: ERRORTYPES['RESOURCE_ERROR']
          });
        }, true);
      }

      if (!options.blockPromise) {
        window.addEventListener('unhandledrejection', function (event) {
          if (!event.reason || !event.reason.stack || !event.reason.stack.includes('\n')) {
            w.report({
              name: ERRORNAMETYPES['promiseError'],
              type: ERRORTYPES['PROMISE_ERROR'],
              msg: event.reason && event.reason.stack || event.reason || ''
            });
            return;
          }

          var fileMsg = event.reason.stack.split('\n')[1].split('at ')[1];
          var fileArr = fileMsg.split(':');
          var line = fileArr[fileArr.length - 2];
          var col = fileArr[fileArr.length - 1];
          var url = fileMsg && fileMsg.slice(0, -line.length - col.length - 2);
          var msg = event.reason.message;
          w.report({
            name: ERRORNAMETYPES['promiseError'],
            msg: msg,
            url: url,
            line: line,
            col: col,
            type: ERRORTYPES['PROMISE_ERROR']
          });
        }, true);
      }

      if (!options.blockConsole) {
        var originConsoleError = window.console.error;

        window.console.error = function (func) {
          return function () {
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            args.forEach(function (item) {
              if (isError(item)) {
                var fileMsg;

                if (item.stack && item.stack.split('\n')[1]) {
                  fileMsg = item.stack && item.stack.split('\n')[1].split('at ')[1];
                } else {
                  fileMsg = item.stack;
                }

                var fileArr = fileMsg.split(':');
                var line = fileArr[fileArr.length - 2];
                var col = fileArr[fileArr.length - 1];
                var url = fileMsg.split('(')[1] && fileMsg.split('(')[1].slice(0, -line.length - col.length - 2) || 'anonymousFunction';
                w.report({
                  name: ERRORNAMETYPES['consoleError'],
                  msg: item.stack,
                  url: url,
                  line: line,
                  col: col,
                  type: ERRORTYPES['LOG_ERROR']
                });
              } else {
                w.report({
                  name: ERRORNAMETYPES['consoleError'],
                  msg: item,
                  type: ERRORTYPES['LOG_ERROR']
                });
              }
            });
            func.apply(console, args);
          };
        }(originConsoleError);
      }
    };

    var Hooks = /*#__PURE__*/function () {
      function Hooks(options) {
        this.options = options;
      }

      var _proto = Hooks.prototype;

      _proto.beforeSendData = function beforeSendData(params) {
        if (!this.options.beforeSendData) return true;

        try {
          return this.options.beforeSendData(params);
        } catch (e) {
          throw e;
        }
      };

      return Hooks;
    }();

    function hasSendBeacon() {
      return window.navigator && !!window.navigator.sendBeacon;
    }

    function getHttpType(url) {
      var first = url.substr && url.substr(0, 5);

      if (!first) {
        return 'unknown';
      } else if (first === 'https') {
        return 'https';
      } else if (first === 'http:') {
        return 'http';
      } else {
        return 'other';
      }
    }

    var sendImgLog = function sendImgLog(url) {
      new Image().src = url;
    };

    var sendBeacon = function sendBeacon(params, type) {
      if (type === void 0) {
        type = 'formData';
      }

      if (type !== 'formData') return;
      var formData = new FormData();

      for (var item in params) {
        if (item === 'dsn') continue;
        var content = params[item];

        if (typeof content === 'object') {
          content = JSON.stringify(content);
        }

        formData.append(item, content);
      }

      window.navigator.sendBeacon(params.dsn, formData);
    };

    var ErrorForShatter = /*#__PURE__*/function () {
      function ErrorForShatter(options) {
        this.sendType = "img";
        this.options = options;

        this._init();
      }

      var _proto = ErrorForShatter.prototype;

      _proto._init = function _init() {
        var _this = this;

        var op = this.options;
        var blockConsole = op.blockConsole,
            blockPromise = op.blockPromise,
            blockError = op.blockError,
            blockSource = op.blockSource,
            blockXhr = op.blockXhr,
            blockFetch = op.blockFetch,
            blockTry = op.blockTry,
            blockHttpRequest = op.blockHttpRequest,
            onlyHttpRequest = op.onlyHttpRequest;
        this.hooks = new Hooks(op);

        if (hasSendBeacon() && !op.onlyImg) {
          this.sendType = "beacon";
        }

        if (!onlyHttpRequest) {
          BindStaticEvent(this, {
            blockConsole: blockConsole,
            blockPromise: blockPromise,
            blockError: blockError,
            blockSource: blockSource,
            blockTry: blockTry
          });
        }

        if (!blockHttpRequest) {
          if (!blockXhr) {
            catchXhr(function (event, args, openArgs, openTime) {
              var target = event.currentTarget;
              var url = target.responseURL;
              var fetchTimeline = new Date().getTime() - openTime;

              _this.report({
                name: ERRORNAMETYPES['ajaxError'],
                url: url,
                type: ERRORTYPES['FETCH_ERROR'],
                fetchTimeline: fetchTimeline,
                request: {
                  method: openArgs[0],
                  httpType: getHttpType(url),
                  data: args && args[0] || ''
                },
                response: {
                  status: target.status,
                  data: target.statusText
                }
              });
            });
          }

          if (!blockFetch) {
            catchFetch(function (res, args, openTime) {
              res.text().then(function (text) {
                var url = res.url || args[0];
                var fetchTimeline = new Date().getTime() - openTime;

                _this.report({
                  name: ERRORNAMETYPES['fetchError'],
                  url: url,
                  msg: res.statusText,
                  type: ERRORTYPES['FETCH_ERROR'],
                  fetchTimeline: fetchTimeline,
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
            }, function (error, args, openTime) {
              var httpType = getHttpType(args[0]);
              var fetchTimeline = new Date().getTime() - openTime;

              _this.report({
                name: ERRORNAMETYPES['fetchError'],
                msg: error,
                url: args[0],
                fetchTimeline: fetchTimeline,
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
      };

      _proto.report = function report(params) {
        var _ref = params || this.options,
            dsn = _ref.dsn;

        var appkey = this.options.appkey;
        Object.assign(params, {
          _t: new Date().getTime(),
          appkey: appkey
        });
        var pass = this.hooks.beforeSendData(params);
        if (!pass) return false;
        var query = obj2query(params);

        if (this.options.debug) {
          console.log("log to : " + dsn + "?" + query);
          return;
        }

        if (this.sendType === 'img') {
          sendImgLog(dsn + "?" + query);
        } else if (this.sendType === 'beacon') {
          sendBeacon(Object.assign(params, {
            dsn: dsn
          }));
        }
      };

      return ErrorForShatter;
    }();

    var PerformanceForShatter = /*#__PURE__*/function () {
      function PerformanceForShatter() {
        console.log('performance');
      }

      var _proto = PerformanceForShatter.prototype;

      _proto.init = function init() {
        console.log('performance init');
      };

      return PerformanceForShatter;
    }();

    var BehaviorForShatter = /*#__PURE__*/function () {
      function BehaviorForShatter() {
        console.log('behavior');
      }

      var _proto = BehaviorForShatter.prototype;

      _proto.init = function init() {
        console.log('behavior init');
      };

      return BehaviorForShatter;
    }();

    function formatComponentName(vm) {
      if (vm.$root === vm) return 'root';
      var name = vm._isVue ? vm.$options && vm.$options.name || vm.$options && vm.$options._componentTag : vm.name;
      return (name ? 'component <' + name + '>' : 'anonymous component') + (vm._isVue && vm.$options && vm.$options.__file ? ' at ' + (vm.$options && vm.$options.__file) : '');
    }

    function handleVueError(err, vm, info) {
      var componentName = formatComponentName(vm);
      var propsData = vm.$options && vm.$options.propsData;
      var data = {
        type: ERRORTYPES.VUE_ERROR,
        msg: err.message + "(" + info + ")",
        url: getLocationHref(),
        componentName: componentName,
        propsData: propsData || '',
        name: ERRORNAMETYPES['VueError'],
        stack: err.stack || []
      };
      return data;
    }

    var ShatterErrorVue = /*#__PURE__*/function () {
      function ShatterErrorVue() {}

      ShatterErrorVue.install = function install(Vue, options) {
        var shatter = new ErrorForShatter(options);

        if (Vue.config.globalProperties) {
          Vue.config.globalProperties.$report = shatter.report;
        } else {
          Vue.prototype.$report = shatter.report;
        }

        var asyncErrorHandler = function asyncErrorHandler(err) {
          var errString;

          if (typeof err === 'object') {
            if (isError(err)) {
              throw err;
            } else {
              errString = JSON.stringify(err);
            }
          } else {
            errString = err;
          }

          throw new Error(errString);
        };

        Vue.mixin({
          beforeCreate: function beforeCreate() {
            var _this = this;

            var methods = this.$options.methods || {};
            Object.keys(methods).forEach(function (key) {
              var fn = methods[key];

              _this.$options.methods[key] = function () {
                for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                  args[_key] = arguments[_key];
                }

                var ret = fn.apply(this, args);

                if (ret && typeof ret["catch"] === 'function') {
                  return ret["catch"](asyncErrorHandler);
                } else {
                  return ret;
                }
              };
            });
          }
        });

        if (Vue.config.errorHandler) {
          var oldHandler = Vue.config.errorHandler;

          Vue.config.errorHandler = function (err, vm, info) {
            var errorData = handleVueError.apply(null, [err, vm, info]);
            shatter.report(errorData);
            oldHandler.call(this, err, vm, info);
          };
        } else {
          Vue.config.errorHandler = function (err, vm, info) {
            var errorData = handleVueError.apply(null, [err, vm, info]);
            shatter.report(errorData);
          };
        }
      };

      return ShatterErrorVue;
    }();

    var ShatterInit = function ShatterInit(options) {
      var usage = options.usage;
      var defaultShatter = 'ErrorForShatter';
      var staticShatterSupport = ShatterInit.shatterSupport;
      var shatterArray = [];

      if (usage === 'all') {
        shatterArray.push.apply(shatterArray, Object.keys(staticShatterSupport));
      } else if (Array.isArray(usage)) {
        shatterArray.push.apply(shatterArray, usage);
      } else if (isString(usage)) {
        shatterArray.push(usage);
      } else {
        shatterArray.push(defaultShatter);
      }

      shatterArray.forEach(function (item) {
        new staticShatterSupport[item](options);
      });
    };

    ShatterInit.shatterSupport = {
      ErrorForShatter: ErrorForShatter,
      PerformanceForShatter: PerformanceForShatter,
      BehaviorForShatter: BehaviorForShatter
    };

    exports.BehaviorForShatter = BehaviorForShatter;
    exports.ErrorForShatter = ErrorForShatter;
    exports.PerformanceForShatter = PerformanceForShatter;
    exports.ShatterErrorVue = ShatterErrorVue;
    exports.ShatterInit = ShatterInit;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

}({}));
