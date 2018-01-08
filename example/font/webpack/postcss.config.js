const baseConfigFontIconSets = {
	cache: true,
	output: {
		inline: false, // use url-loader
		formats: ["woff2"/*, "woff", "ttf", "svg", "eot"*/],
		filename: "../icon-fonts/[css-name]-[set-name].[hash:4].[ext]"
	}
};

module.exports = ({file, env}) => {
	// console.log({file, env});
	return {
		plugins: {
			"postcss-icon": {
				"postcss-icon.material-design": {
					prefix: "md-",
					...baseConfigFontIconSets
				},
				"postcss-icon.font-awesome-v4": {
					prefix: "fa-",
					...baseConfigFontIconSets
				},
				"postcss-icon.font-awesome-v5": false // this icon set not used
			}
		}
	};
};
