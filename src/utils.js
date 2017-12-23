export function objectMap(obj, callback) {
	return Object.keys(obj).map(prop => {
		return callback(obj[prop], prop, obj);
	});
}
