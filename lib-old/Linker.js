"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Linker = exports.Linker = function () {
	function Linker() {
		_classCallCheck(this, Linker);

		this._rootsMap = new Map();
	}

	_createClass(Linker, [{
		key: "_getRootMap",
		value: function _getRootMap(rootOrMq) {
			if (!this._rootsMap.has(rootOrMq)) {
				this._rootsMap.set(rootOrMq, new Map());
			}
			return this._rootsMap.get(rootOrMq);
		}
	}, {
		key: "_getNodesArray",
		value: function _getNodesArray(root, iconName) {
			var _rootMap = this._getRootMap(root);

			if (!_rootMap.get(iconName)) {
				_rootMap.set(iconName, []);
			}
			return _rootMap.get(iconName);
		}
	}, {
		key: "push",
		value: function push(_ref) {
			var root = _ref.root,
			    iconName = _ref.iconName,
			    parent = _ref.parent;

			this._getNodesArray(root, iconName).push(parent);
		}
	}, {
		key: "rootMap",
		get: function get() {
			return this._rootsMap;
		}
	}]);

	return Linker;
}();