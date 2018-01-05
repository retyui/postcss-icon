export function objectMap(obj, callback) {
	return Object.keys(obj).map(prop => {
		return callback(obj[prop], prop, obj);
	});
}

export function asyncRun(fn) {
	return Promise.resolve().then(fn);
}

export function isString(s) {
	return typeof s === "string";
}

export function isFunction(f) {
	return typeof f === "function";
}

export function to16Number(n) {
	return Number(n).toString(16);
}

import crypto from "crypto";
export function generateHash(raw) {
	return crypto
		.createHash("md5")
		.update(raw)
		.digest("hex");
}

export function isNumber(num) {
	return !isNaN(parseFloat(num)) && typeof num !== "string";
}
