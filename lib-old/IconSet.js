"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.IconSet = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Linker = require("./Linker.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var IconSet = exports.IconSet = function () {
	function IconSet() {
		_classCallCheck(this, IconSet);

		this._linker = new _Linker.Linker();
	}

	_createClass(IconSet, [{
		key: "addIcon",
		value: function addIcon(data) {
			var iconName = data.iconName;

			if (this.hasIcon(iconName)) {
				this._linker.push(data);
				return true;
			}
			return false;
		}
	}]);

	return IconSet;
}();