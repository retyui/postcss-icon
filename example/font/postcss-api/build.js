const { promisify } = require("util");
const fs = require("fs");
const { resolve, parse } = require("path");
const postcss = require("postcss");
const postcssIcon = require("../../../."); // analog require("postcss-icon");

const [readFileAsync, writeFileAsync] = [
	promisify(fs.readFile),
	promisify(fs.writeFile)
];
const [from, to] = ["./src/style.css", "./public/assets/css/style.css"].map(e => resolve(__dirname, e));

const output = {
	inline: ["woff2"], // inline only woff2 format
	path: resolve(__dirname, "./public/assets/fonts/"), // folder to save all font files
	formats: ["woff2", "woff" /*, "ttf", "svg", "eot"*/]
};

const PLUGINS = [
	postcssIcon({
		// lazy load
		"postcss-icon.material-design": {
			prefix: "md-",
			output
		},
		"postcss-icon.font-awesome-v4": {
			prefix: "fa-",
			output
		},
		"postcss-icon.font-awesome-v5": false // this icon set not used
	})
];

(async () => {
	const CSS = await readFileAsync(from);
	try {
		const { css, messages } = await postcss(PLUGINS)
			.process(CSS, {
				from,
				to
			});
		messages.map(msg => console.log(msg.toString()));
		await writeFileAsync(to, css);
	} catch (e) {
		console.error(e);
	}
})();
