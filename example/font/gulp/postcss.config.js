const { resolve } = require("path");

const _output = {
	inline: ["woff2"],
	path: resolve(__dirname, "./public/assets/fonts/"), // folder to save all font files
	formats: ["woff2", "woff" /*, "ttf","svg", "eot"*/],
	url({ cssFile, fontName, hash }) {
		// function help fix resolve url
		// const urlWithQueryHash = `../fonts/${fontName}?v=${hash.substr(0, 5)}`;
		const exmapleResolveUrl = `../fonts/${fontName}`;
		return exmapleResolveUrl;
	}
};

module.exports = ctx => ({
	plugins: {
		"postcss-icon": {
			// lazy load icon set
			"postcss-icon.material-design": {
				prefix: "md-",
				output: _output
			},
			"postcss-icon.font-awesome-v4": {
				prefix: "fa-",
				output: _output
			},
			"postcss-icon.font-awesome-v5": false // this icon set not used
		}
	}
});
