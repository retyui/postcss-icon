"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.CssIconSet = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _IconSet2 = require("./IconSet");

var _postcss = require("postcss/lib/postcss");

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CssIconSet = exports.CssIconSet = function (_IconSet) {
	_inherits(CssIconSet, _IconSet);

	function CssIconSet(_ref) {
		var name = _ref.name,
		    styles = _ref.styles,
		    _ref$prefix = _ref.prefix,
		    prefix = _ref$prefix === undefined ? "" : _ref$prefix;

		_classCallCheck(this, CssIconSet);

		var _this = _possibleConstructorReturn(this, (CssIconSet.__proto__ || Object.getPrototypeOf(CssIconSet)).call(this));

		_this._name = name;
		_this._styles = styles;
		_this._prefix = prefix;
		return _this;
	}

	_createClass(CssIconSet, [{
		key: "get",
		value: function get(iconName) {
			var key = this._prefix === "" ? iconName : iconName.replace(this._prefix, "");
			return this._styles.get(key);
		}
	}, {
		key: "hasIcon",
		value: function hasIcon(name) {
			return this.get(name) !== undefined;
		}
	}, {
		key: "applyIcons",
		value: function applyIcons() {
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = this._linker.rootMap[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var _ref2 = _step.value;

					var _ref3 = _slicedToArray(_ref2, 2);

					var rootOrMq = _ref3[0];
					var nodesSet = _ref3[1];
					var _iteratorNormalCompletion2 = true;
					var _didIteratorError2 = false;
					var _iteratorError2 = undefined;

					try {
						for (var _iterator2 = nodesSet[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
							var _ref4 = _step2.value;

							var _ref5 = _slicedToArray(_ref4, 2);

							var iconName = _ref5[0];
							var nodes = _ref5[1];

							this.processExtend({
								extendRules: this.get(iconName),
								userRules: nodes,
								parent: rootOrMq
							});
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
		}
	}, {
		key: "processExtend",
		value: function processExtend(_ref6) {
			var extendRules = _ref6.extendRules,
			    userRules = _ref6.userRules,
			    parent = _ref6.parent;


			if (userRules.length !== 0) {
				var allSelectors = userRules.map(function (_ref7) {
					var selector = _ref7.selector;
					return selector;
				});
				var tmpRoot = (0, _postcss.parse)(extendRules.join("\n"));
				var isOneUseRule = CssIconSet.isOneUseIcon(userRules);
				var tmpCloner = void 0;

				if (isOneUseRule) {
					tmpCloner = new TmpContainer({ toNode: userRules[0] });
				}

				tmpRoot.walkRules(function (rule) {
					if (isOneUseRule && rule.selector === ".extend") {
						tmpCloner.addProps(rule);
						rule.remove();
					} else {
						var extendedSelector = rule.selectors.map(function (selector) {
							return allSelectors.map(function (userSelect) {
								return selector.replace(/\.extend/g, userSelect.trim());
							}).join(",");
						}).join(",");

						rule.selector = extendedSelector;
					}
				});

				if (isOneUseRule) {
					tmpCloner.applyClonedProps();
				}

				if (tmpRoot.nodes.length) {
					parent.insertBefore(userRules[0], tmpRoot.nodes);
				}
			}
		}
	}], [{
		key: "isOneUseIcon",
		value: function isOneUseIcon(userRules) {
			return userRules.length === 1;
		}
	}]);

	return CssIconSet;
}(_IconSet2.IconSet);

var TmpContainer = function () {
	function TmpContainer(_ref8) {
		var toNode = _ref8.toNode;

		_classCallCheck(this, TmpContainer);

		this.toNode = toNode;
		this.tmpNodes = [];
	}

	_createClass(TmpContainer, [{
		key: "addProps",
		value: function addProps(fromNode) {
			var _tmpNodes;

			(_tmpNodes = this.tmpNodes).push.apply(_tmpNodes, _toConsumableArray(fromNode.nodes));
		}
	}, {
		key: "applyClonedProps",
		value: function applyClonedProps() {
			if (this.tmpNodes.length !== 0) {
				var _toNode;

				(_toNode = this.toNode).prepend.apply(_toNode, _toConsumableArray(this.tmpNodes));
			}
		}
	}]);

	return TmpContainer;
}();