"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _postcss = require("postcss");

var _utils = require("./utils.js");

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NAME = "postcss-icon";

exports.default = (0, _postcss.plugin)(NAME, function () {
	for (var _len = arguments.length, listIconData = Array(_len), _key = 0; _key < _len; _key++) {
		listIconData[_key] = arguments[_key];
	}

	if (listIconData.length === 0) {
		console.log(`[${NAME}]`, "Error: Options data for the css icon can not be empty!");
		return function (root) {
			walkAtRuleIcon(root, nodeToComment);
		};
	}

	listIconData = listIconData.length === 1 ? Array.isArray(listIconData[0]) ? listIconData[0] : [listIconData[0]] : listIconData;

	var AllIcons = getMapAllIcons(listIconData);

	return function (root, result) {
		var currentList = new Map();

		// Step 1: find all icons in this file
		walkAtRuleIcon(root, function (atRuleIcon) {
			var iconName = clearValue(atRuleIcon.params);
			if (AllIcons.has(iconName)) {
				var rootOrMq = closestRoot(atRuleIcon);
				if (!currentList.has(rootOrMq)) {
					currentList.set(rootOrMq, new Map());
				}
				var rootMap = currentList.get(rootOrMq);
				if (!rootMap.get(iconName)) {
					rootMap.set(iconName, []);
				}
				var iconMap = rootMap.get(iconName);
				iconMap.push(atRuleIcon.parent);
				atRuleIcon.remove();
			} else {
				atRuleIcon.warn(result, `Icon with the name \`${atRuleIcon.params}\` not found!`);
				nodeToComment(atRuleIcon);
			}
		});

		// Step 2: Extend all finded icons
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = currentList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var _ref = _step.value;

				var _ref2 = _slicedToArray(_ref, 2);

				var rootOrMq = _ref2[0];
				var nodesSet = _ref2[1];
				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = nodesSet[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var _ref3 = _step2.value;

						var _ref4 = _slicedToArray(_ref3, 2);

						var iconName = _ref4[0];
						var nodes = _ref4[1];

						processExtend({
							extendRules: AllIcons.get(iconName),
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
	};
});


function nodeToComment(atRuleIcon) {
	atRuleIcon.replaceWith((0, _postcss.comment)({ text: atRuleIcon.toString() }));
}

function walkAtRuleIcon(root, func) {
	root.walkAtRules(function (atRuleIcon) {
		if (atRuleIcon.name && atRuleIcon.name === "icon" || atRuleIcon.name === "icon:") {
			func(atRuleIcon);
		}
	});
}

function getMapAllIcons(listIconData) {
	return listIconData.map(function (_ref5) {
		var _ref5$prefix = _ref5.prefix,
		    prefix = _ref5$prefix === undefined ? "" : _ref5$prefix,
		    _ref5$data = _ref5.data,
		    data = _ref5$data === undefined ? {} : _ref5$data;
		return prefixIconNames(prefix, data);
	}).reduce(function (allIcons, isonSet) {
		(0, _utils.objectMap)(isonSet, function (nodes, iconName) {
			if (allIcons.has(iconName)) {
				console.log(`[${NAME}]`, `Warn: the iconName \`${iconName}\` already declared! Use a different prefix to avoid conflicts.`);
			} else {
				allIcons.set(iconName, nodes);
			}
		});
		return allIcons;
	}, new Map());
}

function isOneUseIcon(userRules) {
	return userRules.length === 1;
}

function processExtend(_ref6) {
	var extendRules = _ref6.extendRules,
	    userRules = _ref6.userRules,
	    parent = _ref6.parent;

	if (userRules.length !== 0) {
		var allSelectors = userRules.map(function (_ref7) {
			var selector = _ref7.selector;
			return selector;
		});
		var tmpRoot = (0, _postcss.parse)(extendRules.join("\n"));
		var isOneUseRule = isOneUseIcon(userRules);
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
			tmpCloner.cloneProps();
		}
		if (tmpRoot.nodes.length) {
			parent.insertBefore(userRules[0], tmpRoot.nodes);
		}
	}
}

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
		key: "cloneProps",
		value: function cloneProps() {
			if (this.tmpNodes.length !== 0) {
				var _toNode;

				(_toNode = this.toNode).prepend.apply(_toNode, _toConsumableArray(this.tmpNodes));
			}
		}
	}]);

	return TmpContainer;
}();

function clearValue(val) {
	return val.replace(/['"]/g, "");
}

function prefixIconNames(prefix, obj) {
	var tmp = {};
	(0, _utils.objectMap)(obj, function (val, key) {
		tmp[prefix + key] = val;
	});
	return tmp;
}

function closestRoot(_ref9) {
	var parent = _ref9.parent;

	if (parent === undefined) {
		return false;
	}
	if (parent.type === "atrule" && parent.name === "media" || parent.type === "root") {
		return parent;
	}
	return closestRoot(parent);
}
module.exports = exports["default"];