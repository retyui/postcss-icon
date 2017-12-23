"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.objectMap = objectMap;
function objectMap(obj, callback) {
	return Object.keys(obj).map(function (prop) {
		return callback(obj[prop], prop, obj);
	});
}