const { readFileSync } = require("fs");
const { resolve } = require("path");
const { fontName, mapName } = require("./config.js");

module.exports = {
	type: 'font',
	names: require(`./${mapName}`),
	ttf: readFileSync(resolve(__dirname, fontName)),
	css: readFileSync(resolve(__dirname, 'base.css')).toString('utf8')
};
