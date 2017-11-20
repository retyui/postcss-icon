'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _postcss = require('postcss');

exports.default = (0, _postcss.plugin)('postcss-animations', function () {
	var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


	return function (css) {
		css.walkDecls('icon', function (decl) {// Find all `icon: <icon-name>; declaration`
			// extend
		});
	};
});
module.exports = exports['default'];