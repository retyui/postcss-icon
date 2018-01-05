"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.LazyIconSet = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.isCustomSet = isCustomSet;
exports.isCssSet = isCssSet;
exports.isFontSet = isFontSet;

var _helps = require("./helps.js");

var _CssIconSet = require("./CssIconSet.js");

var _FontIconSet = require("./FontIconSet.js");

var _config = require("./config");

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function isCustomSet(t) {
	var styles = t.styles,
	    keymap = t.keymap;

	return isCssSet(t) && styles || isFontSet(t) && keymap;
}
function isCssSet(_ref) {
	var type = _ref.type;

	return type === "css";
}
function isFontSet(_ref2) {
	var type = _ref2.type;

	return type === "font";
}

var LazyIconSet = exports.LazyIconSet = function () {
	function LazyIconSet(pluginOption) {
		var _this = this;

		_classCallCheck(this, LazyIconSet);

		this._unicSetList = new Map();
		this._badPrefixSetList = [];

		(0, _helps.objectMap)(pluginOption, function (options, name) {
			if (!options) {
				return;
			}
			var _options$prefix = options.prefix,
			    prefix = _options$prefix === undefined ? "" : _options$prefix;

			var configLazySet = {
				name,
				options,
				_iconSet: null,
				_loaded: false,
				get isLoaded() {
					return Boolean(this._loaded);
				},
				get iconSet() {
					if (this._loaded === true) {
						return this._iconSet;
					}

					if (isCustomSet(this.options)) {
						this._loaded = true;
						return this._iconSet = LazyIconSet.initIconSet(_extends({
							name: this.name
						}, options));
					}

					var dataIconSet = require(this.name);
					this._loaded = true;
					return this._iconSet = LazyIconSet.initIconSet(_extends({
						name: this.name
					}, dataIconSet, options));
				}
			};

			if (_this._unicSetList.has(prefix)) {
				_this._badPrefixSetList.push(configLazySet);
			} else {
				_this._unicSetList.set(prefix, configLazySet);
			}
		});
	}

	_createClass(LazyIconSet, [{
		key: "applySet",
		value: function () {
			var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
				for (var _len = arguments.length, opt = Array(_len), _key = 0; _key < _len; _key++) {
					opt[_key] = arguments[_key];
				}

				return regeneratorRuntime.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								_context.next = 2;
								return Promise.all(this._getLoadedSets().map(function (_ref4) {
									var iconSet = _ref4.iconSet;
									return iconSet.applyIcons.apply(iconSet, _toConsumableArray(opt));
								}));

							case 2:
							case "end":
								return _context.stop();
						}
					}
				}, _callee, this);
			}));

			function applySet() {
				return _ref3.apply(this, arguments);
			}

			return applySet;
		}()
	}, {
		key: "_getLoadedSets",
		value: function _getLoadedSets() {
			return this._badPrefixSetList.concat([].concat(_toConsumableArray(this._unicSetList.values()))).filter(function (_ref5) {
				var isLoaded = _ref5.isLoaded;
				return isLoaded === true;
			});
		}
	}, {
		key: "addIcon",
		value: function addIcon(addData) {
			var iconName = addData.iconName;
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = this._unicSetList.keys()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var prefix = _step.value;

					// try find/add by prefix
					if (iconName.indexOf(prefix) === 0) {
						var _unicSetList$get = this._unicSetList.get(prefix),
						    _iconSet = _unicSetList$get.iconSet;

						return _iconSet.addIcon(addData);
					}
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = this._badPrefixSetList[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var _ref6 = _step2.value;
					var iconSet = _ref6.iconSet;

					// try find/add in other set
					if (iconSet.addIcon(addData)) {
						return true;
					} // else find in another icon set
				}
			} catch (err) {
				_didIteratorError2 = true;
				_iteratorError2 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion2 && _iterator2.return) {
						_iterator2.return();
					}
				} finally {
					if (_didIteratorError2) {
						throw _iteratorError2;
					}
				}
			}

			return false;
		}
	}], [{
		key: "initIconSet",
		value: function initIconSet() {
			var configIconSet = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
			var name = configIconSet.name,
			    type = configIconSet.type;

			switch (type) {
				case "css":
					return new _CssIconSet.CssIconSet(configIconSet);
				case "font":
					return new _FontIconSet.FontIconSet(configIconSet);
				default:
					throw new Error(`[${_config.NAME}]: The plugin does not support this type \`${type}\`, for css icons \`${name}\``);
			}
		}
	}]);

	return LazyIconSet;
}();