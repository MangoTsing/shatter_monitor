var shatter = (function (exports) {
	'use strict';

	function createCommonjsModule(fn, basedir, module) {
		return module = {
		  path: basedir,
		  exports: {},
		  require: function (path, base) {
	      return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
	    }
		}, fn(module, module.exports), module.exports;
	}

	function commonjsRequire () {
		throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
	}

	var _core = createCommonjsModule(function (module) {
	  var core = module.exports = {
	    version: '2.6.11'
	  };
	  if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef
	});

	var _global = createCommonjsModule(function (module) {
	  // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	  var global = module.exports = typeof window != 'undefined' && window.Math == Math ? window : typeof self != 'undefined' && self.Math == Math ? self // eslint-disable-next-line no-new-func
	  : Function('return this')();
	  if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef
	});

	var _shared = createCommonjsModule(function (module) {
	  var SHARED = '__core-js_shared__';
	  var store = _global[SHARED] || (_global[SHARED] = {});
	  (module.exports = function (key, value) {
	    return store[key] || (store[key] = value !== undefined ? value : {});
	  })('versions', []).push({
	    version: _core.version,
	    mode:  'global',
	    copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
	  });
	});

	var id = 0;
	var px = Math.random();

	var _uid = function (key) {
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

	var _wks = createCommonjsModule(function (module) {
	  var store = _shared('wks');
	  var Symbol = _global.Symbol;
	  var USE_SYMBOL = typeof Symbol == 'function';

	  var $exports = module.exports = function (name) {
	    return store[name] || (store[name] = USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : _uid)('Symbol.' + name));
	  };

	  $exports.store = store;
	});

	var _isObject = function (it) {
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

	var _anObject = function (it) {
	  if (!_isObject(it)) throw TypeError(it + ' is not an object!');
	  return it;
	};

	var _fails = function (exec) {
	  try {
	    return !!exec();
	  } catch (e) {
	    return true;
	  }
	};

	var _descriptors = !_fails(function () {
	  return Object.defineProperty({}, 'a', {
	    get: function () {
	      return 7;
	    }
	  }).a != 7;
	});

	var document$1 = _global.document; // typeof document.createElement is 'object' in old IE

	var is = _isObject(document$1) && _isObject(document$1.createElement);

	var _domCreate = function (it) {
	  return is ? document$1.createElement(it) : {};
	};

	var _ie8DomDefine = !_descriptors && !_fails(function () {
	  return Object.defineProperty(_domCreate('div'), 'a', {
	    get: function () {
	      return 7;
	    }
	  }).a != 7;
	});

	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string

	var _toPrimitive = function (it, S) {
	  if (!_isObject(it)) return it;
	  var fn, val;
	  if (S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
	  if (typeof (fn = it.valueOf) == 'function' && !_isObject(val = fn.call(it))) return val;
	  if (!S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
	  throw TypeError("Can't convert object to primitive value");
	};

	var dP = Object.defineProperty;
	var f = _descriptors ? Object.defineProperty : function defineProperty(O, P, Attributes) {
	  _anObject(O);
	  P = _toPrimitive(P, true);
	  _anObject(Attributes);
	  if (_ie8DomDefine) try {
	    return dP(O, P, Attributes);
	  } catch (e) {
	    /* empty */
	  }
	  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};
	var _objectDp = {
	  f: f
	};

	var _propertyDesc = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};

	var _hide = _descriptors ? function (object, key, value) {
	  return _objectDp.f(object, key, _propertyDesc(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};

	var UNSCOPABLES = _wks('unscopables');
	var ArrayProto = Array.prototype;
	if (ArrayProto[UNSCOPABLES] == undefined) _hide(ArrayProto, UNSCOPABLES, {});

	var _addToUnscopables = function (key) {
	  ArrayProto[UNSCOPABLES][key] = true;
	};

	var _iterStep = function (done, value) {
	  return {
	    value: value,
	    done: !!done
	  };
	};

	var _iterators = {};

	var toString = {}.toString;

	var _cof = function (it) {
	  return toString.call(it).slice(8, -1);
	};

	// eslint-disable-next-line no-prototype-builtins

	var _iobject = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
	  return _cof(it) == 'String' ? it.split('') : Object(it);
	};

	// 7.2.1 RequireObjectCoercible(argument)
	var _defined = function (it) {
	  if (it == undefined) throw TypeError("Can't call method on  " + it);
	  return it;
	};

	var _toIobject = function (it) {
	  return _iobject(_defined(it));
	};

	var hasOwnProperty = {}.hasOwnProperty;

	var _has = function (it, key) {
	  return hasOwnProperty.call(it, key);
	};

	var _functionToString = _shared('native-function-to-string', Function.toString);

	var _redefine = createCommonjsModule(function (module) {
	  var SRC = _uid('src');
	  var TO_STRING = 'toString';
	  var TPL = ('' + _functionToString).split(TO_STRING);

	  _core.inspectSource = function (it) {
	    return _functionToString.call(it);
	  };

	  (module.exports = function (O, key, val, safe) {
	    var isFunction = typeof val == 'function';
	    if (isFunction) _has(val, 'name') || _hide(val, 'name', key);
	    if (O[key] === val) return;
	    if (isFunction) _has(val, SRC) || _hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));

	    if (O === _global) {
	      O[key] = val;
	    } else if (!safe) {
	      delete O[key];
	      _hide(O, key, val);
	    } else if (O[key]) {
	      O[key] = val;
	    } else {
	      _hide(O, key, val);
	    } // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative

	  })(Function.prototype, TO_STRING, function toString() {
	    return typeof this == 'function' && this[SRC] || _functionToString.call(this);
	  });
	});

	var _aFunction = function (it) {
	  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
	  return it;
	};

	var _ctx = function (fn, that, length) {
	  _aFunction(fn);
	  if (that === undefined) return fn;

	  switch (length) {
	    case 1:
	      return function (a) {
	        return fn.call(that, a);
	      };

	    case 2:
	      return function (a, b) {
	        return fn.call(that, a, b);
	      };

	    case 3:
	      return function (a, b, c) {
	        return fn.call(that, a, b, c);
	      };
	  }

	  return function ()
	  /* ...args */
	  {
	    return fn.apply(that, arguments);
	  };
	};

	var PROTOTYPE = 'prototype';

	var $export = function (type, name, source) {
	  var IS_FORCED = type & $export.F;
	  var IS_GLOBAL = type & $export.G;
	  var IS_STATIC = type & $export.S;
	  var IS_PROTO = type & $export.P;
	  var IS_BIND = type & $export.B;
	  var target = IS_GLOBAL ? _global : IS_STATIC ? _global[name] || (_global[name] = {}) : (_global[name] || {})[PROTOTYPE];
	  var exports = IS_GLOBAL ? _core : _core[name] || (_core[name] = {});
	  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
	  var key, own, out, exp;
	  if (IS_GLOBAL) source = name;

	  for (key in source) {
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined; // export native or passed

	    out = (own ? target : source)[key]; // bind timers to global for call from export context

	    exp = IS_BIND && own ? _ctx(out, _global) : IS_PROTO && typeof out == 'function' ? _ctx(Function.call, out) : out; // extend global

	    if (target) _redefine(target, key, out, type & $export.U); // export

	    if (exports[key] != out) _hide(exports, key, exp);
	    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
	  }
	};

	_global.core = _core; // type bitmap

	$export.F = 1; // forced

	$export.G = 2; // global

	$export.S = 4; // static

	$export.P = 8; // proto

	$export.B = 16; // bind

	$export.W = 32; // wrap

	$export.U = 64; // safe

	$export.R = 128; // real proto method for `library`

	var _export = $export;

	// 7.1.4 ToInteger
	var ceil = Math.ceil;
	var floor = Math.floor;

	var _toInteger = function (it) {
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

	var min = Math.min;

	var _toLength = function (it) {
	  return it > 0 ? min(_toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

	var max = Math.max;
	var min$1 = Math.min;

	var _toAbsoluteIndex = function (index, length) {
	  index = _toInteger(index);
	  return index < 0 ? max(index + length, 0) : min$1(index, length);
	};

	// true  -> Array#includes

	var _arrayIncludes = function (IS_INCLUDES) {
	  return function ($this, el, fromIndex) {
	    var O = _toIobject($this);
	    var length = _toLength(O.length);
	    var index = _toAbsoluteIndex(fromIndex, length);
	    var value; // Array#includes uses SameValueZero equality algorithm
	    // eslint-disable-next-line no-self-compare

	    if (IS_INCLUDES && el != el) while (length > index) {
	      value = O[index++]; // eslint-disable-next-line no-self-compare

	      if (value != value) return true; // Array#indexOf ignores holes, Array#includes - not
	    } else for (; length > index; index++) if (IS_INCLUDES || index in O) {
	      if (O[index] === el) return IS_INCLUDES || index || 0;
	    }
	    return !IS_INCLUDES && -1;
	  };
	};

	var shared = _shared('keys');

	var _sharedKey = function (key) {
	  return shared[key] || (shared[key] = _uid(key));
	};

	var arrayIndexOf = _arrayIncludes(false);
	var IE_PROTO = _sharedKey('IE_PROTO');

	var _objectKeysInternal = function (object, names) {
	  var O = _toIobject(object);
	  var i = 0;
	  var result = [];
	  var key;

	  for (key in O) if (key != IE_PROTO) _has(O, key) && result.push(key); // Don't enum bug & hidden keys


	  while (names.length > i) if (_has(O, key = names[i++])) {
	    ~arrayIndexOf(result, key) || result.push(key);
	  }

	  return result;
	};

	// IE 8- don't enum bug keys
	var _enumBugKeys = 'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'.split(',');

	var _objectKeys = Object.keys || function keys(O) {
	  return _objectKeysInternal(O, _enumBugKeys);
	};

	var _objectDps = _descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
	  _anObject(O);
	  var keys = _objectKeys(Properties);
	  var length = keys.length;
	  var i = 0;
	  var P;

	  while (length > i) _objectDp.f(O, P = keys[i++], Properties[P]);

	  return O;
	};

	var document$2 = _global.document;

	var _html = document$2 && document$2.documentElement;

	var IE_PROTO$1 = _sharedKey('IE_PROTO');

	var Empty = function () {
	  /* empty */
	};

	var PROTOTYPE$1 = 'prototype'; // Create object with fake `null` prototype: use iframe Object with cleared prototype

	var createDict = function () {
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = _domCreate('iframe');
	  var i = _enumBugKeys.length;
	  var lt = '<';
	  var gt = '>';
	  var iframeDocument;
	  iframe.style.display = 'none';
	  _html.appendChild(iframe);
	  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
	  // createDict = iframe.contentWindow.Object;
	  // html.removeChild(iframe);

	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
	  iframeDocument.close();
	  createDict = iframeDocument.F;

	  while (i--) delete createDict[PROTOTYPE$1][_enumBugKeys[i]];

	  return createDict();
	};

	var _objectCreate = Object.create || function create(O, Properties) {
	  var result;

	  if (O !== null) {
	    Empty[PROTOTYPE$1] = _anObject(O);
	    result = new Empty();
	    Empty[PROTOTYPE$1] = null; // add "__proto__" for Object.getPrototypeOf polyfill

	    result[IE_PROTO$1] = O;
	  } else result = createDict();

	  return Properties === undefined ? result : _objectDps(result, Properties);
	};

	var def = _objectDp.f;
	var TAG = _wks('toStringTag');

	var _setToStringTag = function (it, tag, stat) {
	  if (it && !_has(it = stat ? it : it.prototype, TAG)) def(it, TAG, {
	    configurable: true,
	    value: tag
	  });
	};

	var IteratorPrototype = {}; // 25.1.2.1.1 %IteratorPrototype%[@@iterator]()

	_hide(IteratorPrototype, _wks('iterator'), function () {
	  return this;
	});

	var _iterCreate = function (Constructor, NAME, next) {
	  Constructor.prototype = _objectCreate(IteratorPrototype, {
	    next: _propertyDesc(1, next)
	  });
	  _setToStringTag(Constructor, NAME + ' Iterator');
	};

	var _toObject = function (it) {
	  return Object(_defined(it));
	};

	var IE_PROTO$2 = _sharedKey('IE_PROTO');
	var ObjectProto = Object.prototype;

	var _objectGpo = Object.getPrototypeOf || function (O) {
	  O = _toObject(O);
	  if (_has(O, IE_PROTO$2)) return O[IE_PROTO$2];

	  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
	    return O.constructor.prototype;
	  }

	  return O instanceof Object ? ObjectProto : null;
	};

	var ITERATOR = _wks('iterator');
	var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`

	var FF_ITERATOR = '@@iterator';
	var KEYS = 'keys';
	var VALUES = 'values';

	var returnThis = function () {
	  return this;
	};

	var _iterDefine = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
	  _iterCreate(Constructor, NAME, next);

	  var getMethod = function (kind) {
	    if (!BUGGY && kind in proto) return proto[kind];

	    switch (kind) {
	      case KEYS:
	        return function keys() {
	          return new Constructor(this, kind);
	        };

	      case VALUES:
	        return function values() {
	          return new Constructor(this, kind);
	        };
	    }

	    return function entries() {
	      return new Constructor(this, kind);
	    };
	  };

	  var TAG = NAME + ' Iterator';
	  var DEF_VALUES = DEFAULT == VALUES;
	  var VALUES_BUG = false;
	  var proto = Base.prototype;
	  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
	  var $default = $native || getMethod(DEFAULT);
	  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
	  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
	  var methods, key, IteratorPrototype; // Fix native

	  if ($anyNative) {
	    IteratorPrototype = _objectGpo($anyNative.call(new Base()));

	    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
	      // Set @@toStringTag to native iterators
	      _setToStringTag(IteratorPrototype, TAG, true); // fix for some old engines

	      if ( typeof IteratorPrototype[ITERATOR] != 'function') _hide(IteratorPrototype, ITERATOR, returnThis);
	    }
	  } // fix Array#{values, @@iterator}.name in V8 / FF


	  if (DEF_VALUES && $native && $native.name !== VALUES) {
	    VALUES_BUG = true;

	    $default = function values() {
	      return $native.call(this);
	    };
	  } // Define iterator


	  if ( (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
	    _hide(proto, ITERATOR, $default);
	  } // Plug for library


	  _iterators[NAME] = $default;
	  _iterators[TAG] = returnThis;

	  if (DEFAULT) {
	    methods = {
	      values: DEF_VALUES ? $default : getMethod(VALUES),
	      keys: IS_SET ? $default : getMethod(KEYS),
	      entries: $entries
	    };
	    if (FORCED) for (key in methods) {
	      if (!(key in proto)) _redefine(proto, key, methods[key]);
	    } else _export(_export.P + _export.F * (BUGGY || VALUES_BUG), NAME, methods);
	  }

	  return methods;
	};

	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()


	var es6_array_iterator = _iterDefine(Array, 'Array', function (iterated, kind) {
	  this._t = _toIobject(iterated); // target

	  this._i = 0; // next index

	  this._k = kind; // kind
	  // 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function () {
	  var O = this._t;
	  var kind = this._k;
	  var index = this._i++;

	  if (!O || index >= O.length) {
	    this._t = undefined;
	    return _iterStep(1);
	  }

	  if (kind == 'keys') return _iterStep(0, index);
	  if (kind == 'values') return _iterStep(0, O[index]);
	  return _iterStep(0, [index, O[index]]);
	}, 'values'); // argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)

	_iterators.Arguments = _iterators.Array;
	_addToUnscopables('keys');
	_addToUnscopables('values');
	_addToUnscopables('entries');

	var ITERATOR$1 = _wks('iterator');
	var TO_STRING_TAG = _wks('toStringTag');
	var ArrayValues = _iterators.Array;
	var DOMIterables = {
	  CSSRuleList: true,
	  // TODO: Not spec compliant, should be false.
	  CSSStyleDeclaration: false,
	  CSSValueList: false,
	  ClientRectList: false,
	  DOMRectList: false,
	  DOMStringList: false,
	  DOMTokenList: true,
	  DataTransferItemList: false,
	  FileList: false,
	  HTMLAllCollection: false,
	  HTMLCollection: false,
	  HTMLFormElement: false,
	  HTMLSelectElement: false,
	  MediaList: true,
	  // TODO: Not spec compliant, should be false.
	  MimeTypeArray: false,
	  NamedNodeMap: false,
	  NodeList: true,
	  PaintRequestList: false,
	  Plugin: false,
	  PluginArray: false,
	  SVGLengthList: false,
	  SVGNumberList: false,
	  SVGPathSegList: false,
	  SVGPointList: false,
	  SVGStringList: false,
	  SVGTransformList: false,
	  SourceBufferList: false,
	  StyleSheetList: true,
	  // TODO: Not spec compliant, should be false.
	  TextTrackCueList: false,
	  TextTrackList: false,
	  TouchList: false
	};

	for (var collections = _objectKeys(DOMIterables), i = 0; i < collections.length; i++) {
	  var NAME = collections[i];
	  var explicit = DOMIterables[NAME];
	  var Collection = _global[NAME];
	  var proto = Collection && Collection.prototype;
	  var key;

	  if (proto) {
	    if (!proto[ITERATOR$1]) _hide(proto, ITERATOR$1, ArrayValues);
	    if (!proto[TO_STRING_TAG]) _hide(proto, TO_STRING_TAG, NAME);
	    _iterators[NAME] = ArrayValues;
	    if (explicit) for (key in es6_array_iterator) if (!proto[key]) _redefine(proto, key, es6_array_iterator[key], true);
	  }
	}

	var TAG$1 = _wks('toStringTag'); // ES3 wrong here

	var ARG = _cof(function () {
	  return arguments;
	}()) == 'Arguments'; // fallback for IE11 Script Access Denied error

	var tryGet = function (it, key) {
	  try {
	    return it[key];
	  } catch (e) {
	    /* empty */
	  }
	};

	var _classof = function (it) {
	  var O, T, B;
	  return it === undefined ? 'Undefined' : it === null ? 'Null' // @@toStringTag case
	  : typeof (T = tryGet(O = Object(it), TAG$1)) == 'string' ? T // builtinTag case
	  : ARG ? _cof(O) // ES3 arguments fallback
	  : (B = _cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
	};

	var test = {};
	test[_wks('toStringTag')] = 'z';

	if (test + '' != '[object z]') {
	  _redefine(Object.prototype, 'toString', function toString() {
	    return '[object ' + _classof(this) + ']';
	  }, true);
	}

	var _objectSap = function (KEY, exec) {
	  var fn = (_core.Object || {})[KEY] || Object[KEY];
	  var exp = {};
	  exp[KEY] = exec(fn);
	  _export(_export.S + _export.F * _fails(function () {
	    fn(1);
	  }), 'Object', exp);
	};

	_objectSap('keys', function () {
	  return function keys(it) {
	    return _objectKeys(_toObject(it));
	  };
	});

	var f$1 = Object.getOwnPropertySymbols;
	var _objectGops = {
	  f: f$1
	};

	var f$2 = {}.propertyIsEnumerable;
	var _objectPie = {
	  f: f$2
	};

	var $assign = Object.assign; // should work with symbols and should have deterministic property order (V8 bug)

	var _objectAssign = !$assign || _fails(function () {
	  var A = {};
	  var B = {}; // eslint-disable-next-line no-undef

	  var S = Symbol();
	  var K = 'abcdefghijklmnopqrst';
	  A[S] = 7;
	  K.split('').forEach(function (k) {
	    B[k] = k;
	  });
	  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
	}) ? function assign(target, source) {
	  // eslint-disable-line no-unused-vars
	  var T = _toObject(target);
	  var aLen = arguments.length;
	  var index = 1;
	  var getSymbols = _objectGops.f;
	  var isEnum = _objectPie.f;

	  while (aLen > index) {
	    var S = _iobject(arguments[index++]);
	    var keys = getSymbols ? _objectKeys(S).concat(getSymbols(S)) : _objectKeys(S);
	    var length = keys.length;
	    var j = 0;
	    var key;

	    while (length > j) {
	      key = keys[j++];
	      if (!_descriptors || isEnum.call(S, key)) T[key] = S[key];
	    }
	  }

	  return T;
	} : $assign;

	_export(_export.S + _export.F, 'Object', {
	  assign: _objectAssign
	});

	// false -> String#codePointAt

	var _stringAt = function (TO_STRING) {
	  return function (that, pos) {
	    var s = String(_defined(that));
	    var i = _toInteger(pos);
	    var l = s.length;
	    var a, b;
	    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff ? TO_STRING ? s.charAt(i) : a : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};

	var at = _stringAt(true); // `AdvanceStringIndex` abstract operation
	// https://tc39.github.io/ecma262/#sec-advancestringindex

	var _advanceStringIndex = function (S, index, unicode) {
	  return index + (unicode ? at(S, index).length : 1);
	};

	var builtinExec = RegExp.prototype.exec; // `RegExpExec` abstract operation
	// https://tc39.github.io/ecma262/#sec-regexpexec

	var _regexpExecAbstract = function (R, S) {
	  var exec = R.exec;

	  if (typeof exec === 'function') {
	    var result = exec.call(R, S);

	    if (typeof result !== 'object') {
	      throw new TypeError('RegExp exec method returned something other than an Object or null');
	    }

	    return result;
	  }

	  if (_classof(R) !== 'RegExp') {
	    throw new TypeError('RegExp#exec called on incompatible receiver');
	  }

	  return builtinExec.call(R, S);
	};

	var _flags = function () {
	  var that = _anObject(this);
	  var result = '';
	  if (that.global) result += 'g';
	  if (that.ignoreCase) result += 'i';
	  if (that.multiline) result += 'm';
	  if (that.unicode) result += 'u';
	  if (that.sticky) result += 'y';
	  return result;
	};

	var nativeExec = RegExp.prototype.exec; // This always refers to the native implementation, because the
	// String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
	// which loads this file before patching the method.

	var nativeReplace = String.prototype.replace;
	var patchedExec = nativeExec;
	var LAST_INDEX = 'lastIndex';

	var UPDATES_LAST_INDEX_WRONG = function () {
	  var re1 = /a/,
	      re2 = /b*/g;
	  nativeExec.call(re1, 'a');
	  nativeExec.call(re2, 'a');
	  return re1[LAST_INDEX] !== 0 || re2[LAST_INDEX] !== 0;
	}(); // nonparticipating capturing group, copied from es5-shim's String#split patch.


	var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;
	var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED;

	if (PATCH) {
	  patchedExec = function exec(str) {
	    var re = this;
	    var lastIndex, reCopy, match, i;

	    if (NPCG_INCLUDED) {
	      reCopy = new RegExp('^' + re.source + '$(?!\\s)', _flags.call(re));
	    }

	    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re[LAST_INDEX];
	    match = nativeExec.call(re, str);

	    if (UPDATES_LAST_INDEX_WRONG && match) {
	      re[LAST_INDEX] = re.global ? match.index + match[0].length : lastIndex;
	    }

	    if (NPCG_INCLUDED && match && match.length > 1) {
	      // Fix browsers whose `exec` methods don't consistently return `undefined`
	      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
	      // eslint-disable-next-line no-loop-func
	      nativeReplace.call(match[0], reCopy, function () {
	        for (i = 1; i < arguments.length - 2; i++) {
	          if (arguments[i] === undefined) match[i] = undefined;
	        }
	      });
	    }

	    return match;
	  };
	}

	var _regexpExec = patchedExec;

	_export({
	  target: 'RegExp',
	  proto: true,
	  forced: _regexpExec !== /./.exec
	}, {
	  exec: _regexpExec
	});

	var SPECIES = _wks('species');
	var REPLACE_SUPPORTS_NAMED_GROUPS = !_fails(function () {
	  // #replace needs built-in support for named groups.
	  // #match works fine because it just return the exec results, even if it has
	  // a "grops" property.
	  var re = /./;

	  re.exec = function () {
	    var result = [];
	    result.groups = {
	      a: '7'
	    };
	    return result;
	  };

	  return ''.replace(re, '$<a>') !== '7';
	});

	var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = function () {
	  // Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
	  var re = /(?:)/;
	  var originalExec = re.exec;

	  re.exec = function () {
	    return originalExec.apply(this, arguments);
	  };

	  var result = 'ab'.split(re);
	  return result.length === 2 && result[0] === 'a' && result[1] === 'b';
	}();

	var _fixReWks = function (KEY, length, exec) {
	  var SYMBOL = _wks(KEY);
	  var DELEGATES_TO_SYMBOL = !_fails(function () {
	    // String methods call symbol-named RegEp methods
	    var O = {};

	    O[SYMBOL] = function () {
	      return 7;
	    };

	    return ''[KEY](O) != 7;
	  });
	  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL ? !_fails(function () {
	    // Symbol-named RegExp methods call .exec
	    var execCalled = false;
	    var re = /a/;

	    re.exec = function () {
	      execCalled = true;
	      return null;
	    };

	    if (KEY === 'split') {
	      // RegExp[@@split] doesn't call the regex's exec method, but first creates
	      // a new one. We need to return the patched regex when creating the new one.
	      re.constructor = {};

	      re.constructor[SPECIES] = function () {
	        return re;
	      };
	    }

	    re[SYMBOL]('');
	    return !execCalled;
	  }) : undefined;

	  if (!DELEGATES_TO_SYMBOL || !DELEGATES_TO_EXEC || KEY === 'replace' && !REPLACE_SUPPORTS_NAMED_GROUPS || KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC) {
	    var nativeRegExpMethod = /./[SYMBOL];
	    var fns = exec(_defined, SYMBOL, ''[KEY], function maybeCallNative(nativeMethod, regexp, str, arg2, forceStringMethod) {
	      if (regexp.exec === _regexpExec) {
	        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
	          // The native String method already delegates to @@method (this
	          // polyfilled function), leasing to infinite recursion.
	          // We avoid it by directly calling the native @@method method.
	          return {
	            done: true,
	            value: nativeRegExpMethod.call(regexp, str, arg2)
	          };
	        }

	        return {
	          done: true,
	          value: nativeMethod.call(str, regexp, arg2)
	        };
	      }

	      return {
	        done: false
	      };
	    });
	    var strfn = fns[0];
	    var rxfn = fns[1];
	    _redefine(String.prototype, KEY, strfn);
	    _hide(RegExp.prototype, SYMBOL, length == 2 // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
	    // 21.2.5.11 RegExp.prototype[@@split](string, limit)
	    ? function (string, arg) {
	      return rxfn.call(string, this, arg);
	    } // 21.2.5.6 RegExp.prototype[@@match](string)
	    // 21.2.5.9 RegExp.prototype[@@search](string)
	    : function (string) {
	      return rxfn.call(string, this);
	    });
	  }
	};

	_fixReWks('match', 1, function (defined, MATCH, $match, maybeCallNative) {
	  return [// `String.prototype.match` method
	  // https://tc39.github.io/ecma262/#sec-string.prototype.match
	  function match(regexp) {
	    var O = defined(this);
	    var fn = regexp == undefined ? undefined : regexp[MATCH];
	    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
	  }, // `RegExp.prototype[@@match]` method
	  // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@match
	  function (regexp) {
	    var res = maybeCallNative($match, regexp, this);
	    if (res.done) return res.value;
	    var rx = _anObject(regexp);
	    var S = String(this);
	    if (!rx.global) return _regexpExecAbstract(rx, S);
	    var fullUnicode = rx.unicode;
	    rx.lastIndex = 0;
	    var A = [];
	    var n = 0;
	    var result;

	    while ((result = _regexpExecAbstract(rx, S)) !== null) {
	      var matchStr = String(result[0]);
	      A[n] = matchStr;
	      if (matchStr === '') rx.lastIndex = _advanceStringIndex(S, _toLength(rx.lastIndex), fullUnicode);
	      n++;
	    }

	    return n === 0 ? null : A;
	  }];
	});

	var isEnum = _objectPie.f;

	var _objectToArray = function (isEntries) {
	  return function (it) {
	    var O = _toIobject(it);
	    var keys = _objectKeys(O);
	    var length = keys.length;
	    var i = 0;
	    var result = [];
	    var key;

	    while (length > i) {
	      key = keys[i++];

	      if (!_descriptors || isEnum.call(O, key)) {
	        result.push(isEntries ? [key, O[key]] : O[key]);
	      }
	    }

	    return result;
	  };
	};

	var $entries = _objectToArray(true);
	_export(_export.S, 'Object', {
	  entries: function entries(it) {
	    return $entries(it);
	  }
	});

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

	if (_descriptors && /./g.flags != 'g') _objectDp.f(RegExp.prototype, 'flags', {
	  configurable: true,
	  get: _flags
	});

	var TO_STRING = 'toString';
	var $toString = /./[TO_STRING];

	var define = function (fn) {
	  _redefine(RegExp.prototype, TO_STRING, fn, true);
	}; // 21.2.5.14 RegExp.prototype.toString()


	if (_fails(function () {
	  return $toString.call({
	    source: 'a',
	    flags: 'b'
	  }) != '/a/b';
	})) {
	  define(function toString() {
	    var R = _anObject(this);
	    return '/'.concat(R.source, '/', 'flags' in R ? R.flags : !_descriptors && R instanceof RegExp ? _flags.call(R) : undefined);
	  }); // FF44- RegExp#toString has a wrong name
	} else if ($toString.name != TO_STRING) {
	  define(function toString() {
	    return $toString.call(this);
	  });
	}

	var DateProto = Date.prototype;
	var INVALID_DATE = 'Invalid Date';
	var TO_STRING$1 = 'toString';
	var $toString$1 = DateProto[TO_STRING$1];
	var getTime = DateProto.getTime;

	if (new Date(NaN) + '' != INVALID_DATE) {
	  _redefine(DateProto, TO_STRING$1, function toString() {
	    var value = getTime.call(this); // eslint-disable-next-line no-self-compare

	    return value === value ? $toString$1.call(this) : INVALID_DATE;
	  });
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
	    }).catch(function (error) {
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

	var MATCH = _wks('match');

	var _isRegexp = function (it) {
	  var isRegExp;
	  return _isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : _cof(it) == 'RegExp');
	};

	var SPECIES$1 = _wks('species');

	var _speciesConstructor = function (O, D) {
	  var C = _anObject(O).constructor;
	  var S;
	  return C === undefined || (S = _anObject(C)[SPECIES$1]) == undefined ? D : _aFunction(S);
	};

	var $min = Math.min;
	var $push = [].push;
	var $SPLIT = 'split';
	var LENGTH = 'length';
	var LAST_INDEX$1 = 'lastIndex';
	var MAX_UINT32 = 0xffffffff; // babel-minify transpiles RegExp('x', 'y') -> /x/y and it causes SyntaxError

	var SUPPORTS_Y = !_fails(function () {
	  RegExp(MAX_UINT32, 'y');
	}); // @@split logic

	_fixReWks('split', 2, function (defined, SPLIT, $split, maybeCallNative) {
	  var internalSplit;

	  if ('abbc'[$SPLIT](/(b)*/)[1] == 'c' || 'test'[$SPLIT](/(?:)/, -1)[LENGTH] != 4 || 'ab'[$SPLIT](/(?:ab)*/)[LENGTH] != 2 || '.'[$SPLIT](/(.?)(.?)/)[LENGTH] != 4 || '.'[$SPLIT](/()()/)[LENGTH] > 1 || ''[$SPLIT](/.?/)[LENGTH]) {
	    // based on es5-shim implementation, need to rework it
	    internalSplit = function (separator, limit) {
	      var string = String(this);
	      if (separator === undefined && limit === 0) return []; // If `separator` is not a regex, use native split

	      if (!_isRegexp(separator)) return $split.call(string, separator, limit);
	      var output = [];
	      var flags = (separator.ignoreCase ? 'i' : '') + (separator.multiline ? 'm' : '') + (separator.unicode ? 'u' : '') + (separator.sticky ? 'y' : '');
	      var lastLastIndex = 0;
	      var splitLimit = limit === undefined ? MAX_UINT32 : limit >>> 0; // Make `global` and avoid `lastIndex` issues by working with a copy

	      var separatorCopy = new RegExp(separator.source, flags + 'g');
	      var match, lastIndex, lastLength;

	      while (match = _regexpExec.call(separatorCopy, string)) {
	        lastIndex = separatorCopy[LAST_INDEX$1];

	        if (lastIndex > lastLastIndex) {
	          output.push(string.slice(lastLastIndex, match.index));
	          if (match[LENGTH] > 1 && match.index < string[LENGTH]) $push.apply(output, match.slice(1));
	          lastLength = match[0][LENGTH];
	          lastLastIndex = lastIndex;
	          if (output[LENGTH] >= splitLimit) break;
	        }

	        if (separatorCopy[LAST_INDEX$1] === match.index) separatorCopy[LAST_INDEX$1]++; // Avoid an infinite loop
	      }

	      if (lastLastIndex === string[LENGTH]) {
	        if (lastLength || !separatorCopy.test('')) output.push('');
	      } else output.push(string.slice(lastLastIndex));

	      return output[LENGTH] > splitLimit ? output.slice(0, splitLimit) : output;
	    }; // Chakra, V8

	  } else if ('0'[$SPLIT](undefined, 0)[LENGTH]) {
	    internalSplit = function (separator, limit) {
	      return separator === undefined && limit === 0 ? [] : $split.call(this, separator, limit);
	    };
	  } else {
	    internalSplit = $split;
	  }

	  return [// `String.prototype.split` method
	  // https://tc39.github.io/ecma262/#sec-string.prototype.split
	  function split(separator, limit) {
	    var O = defined(this);
	    var splitter = separator == undefined ? undefined : separator[SPLIT];
	    return splitter !== undefined ? splitter.call(separator, O, limit) : internalSplit.call(String(O), separator, limit);
	  }, // `RegExp.prototype[@@split]` method
	  // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@split
	  //
	  // NOTE: This cannot be properly polyfilled in engines that don't support
	  // the 'y' flag.
	  function (regexp, limit) {
	    var res = maybeCallNative(internalSplit, regexp, this, limit, internalSplit !== $split);
	    if (res.done) return res.value;
	    var rx = _anObject(regexp);
	    var S = String(this);
	    var C = _speciesConstructor(rx, RegExp);
	    var unicodeMatching = rx.unicode;
	    var flags = (rx.ignoreCase ? 'i' : '') + (rx.multiline ? 'm' : '') + (rx.unicode ? 'u' : '') + (SUPPORTS_Y ? 'y' : 'g'); // ^(? + rx + ) is needed, in combination with some S slicing, to
	    // simulate the 'y' flag.

	    var splitter = new C(SUPPORTS_Y ? rx : '^(?:' + rx.source + ')', flags);
	    var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
	    if (lim === 0) return [];
	    if (S.length === 0) return _regexpExecAbstract(splitter, S) === null ? [S] : [];
	    var p = 0;
	    var q = 0;
	    var A = [];

	    while (q < S.length) {
	      splitter.lastIndex = SUPPORTS_Y ? q : 0;
	      var z = _regexpExecAbstract(splitter, SUPPORTS_Y ? S : S.slice(q));
	      var e;

	      if (z === null || (e = $min(_toLength(splitter.lastIndex + (SUPPORTS_Y ? 0 : q)), S.length)) === p) {
	        q = _advanceStringIndex(S, q, unicodeMatching);
	      } else {
	        A.push(S.slice(p, q));
	        if (A.length === lim) return A;

	        for (var i = 1; i <= z.length - 1; i++) {
	          A.push(z[i]);
	          if (A.length === lim) return A;
	        }

	        q = p = e;
	      }
	    }

	    A.push(S.slice(p));
	    return A;
	  }];
	});

	var $includes = _arrayIncludes(true);
	_export(_export.P, 'Array', {
	  includes: function includes(el
	  /* , fromIndex = 0 */
	  ) {
	    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});
	_addToUnscopables('includes');

	var _stringContext = function (that, searchString, NAME) {
	  if (_isRegexp(searchString)) throw TypeError('String#' + NAME + " doesn't accept regex!");
	  return String(_defined(that));
	};

	var MATCH$1 = _wks('match');

	var _failsIsRegexp = function (KEY) {
	  var re = /./;

	  try {
	    '/./'[KEY](re);
	  } catch (e) {
	    try {
	      re[MATCH$1] = false;
	      return !'/./'[KEY](re);
	    } catch (f) {
	      /* empty */
	    }
	  }

	  return true;
	};

	var INCLUDES = 'includes';
	_export(_export.P + _export.F * _failsIsRegexp(INCLUDES), 'String', {
	  includes: function includes(searchString
	  /* , position = 0 */
	  ) {
	    return !!~_stringContext(this, searchString, INCLUDES).indexOf(searchString, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

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
	          var url = target.responseURL || openArgs[1];
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
	    var dsn = params.dsn || this.options.dsn;
	    var appkey = this.options.appkey;
	    Object.assign(params, {
	      _t: new Date().getTime(),
	      appkey: appkey
	    });
	    var pass = this.hooks.beforeSendData(params);
	    if (!pass) return false;
	    var query = obj2query(params);

	    if (this.options.debug) {
	      console.log(this.sendType + " log to : " + dsn + "?" + query);
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

	var dP$1 = _objectDp.f;
	var FProto = Function.prototype;
	var nameRE = /^\s*function ([^ (]*)/;
	var NAME$1 = 'name'; // 19.2.4.2 name

	NAME$1 in FProto || _descriptors && dP$1(FProto, NAME$1, {
	  configurable: true,
	  get: function () {
	    try {
	      return ('' + this).match(nameRE)[1];
	    } catch (e) {
	      return '';
	    }
	  }
	});

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

	            if (ret && typeof ret.catch === 'function') {
	              return ret.catch(asyncErrorHandler);
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

	        if (options.debug) {
	          throw err;
	        }
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
