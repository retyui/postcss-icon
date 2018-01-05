"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.objectMap = objectMap;
exports.asyncRun = asyncRun;
exports.isString = isString;
exports.isFunction = isFunction;
exports.to16Number = to16Number;
exports.generateHash = generateHash;

var _crypto = require("crypto");

var _crypto2 = _interopRequireDefault(_crypto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function objectMap(obj, callback) {
	return Object.keys(obj).map(function (prop) {
		return callback(obj[prop], prop, obj);
	});
}

function asyncRun(fn) {
	return Promise.resolve().then(fn);
}

function isString(s) {
	return typeof s === "string";
}

function isFunction(f) {
	return typeof f === "function";
}

function to16Number(n) {
	return Number(n).toString(16);
}

function generateHash(raw) {
	return _crypto2.default.createHash("md5").update(raw).digest("hex");
}