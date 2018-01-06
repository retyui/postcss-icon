const { resolve } = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const baseConfigFontIconSets = {
	cache: true,
	output: {
		inline: false, // use url-loader
		formats: ["woff2", "woff", "ttf", "svg", "eot"],
		filename: "../icon-fonts/[css-name]-[set-name].[hash:4].[ext]"
	}
};

module.exports = {
	module: {
		rules: [
			{
				test: /\.(woff2)$/,
				use: [
					{
						loader: "url-loader",
						options: {
							limit: 10 * 1024
						}
					}
				]
			},
			{
				test: /\.(woff2?|ttf|svg|eot)$/,
				use: [
					{
						loader: "file-loader",
						options: {
							name: "../fonts/[name].[ext]" // output path
						}
					}
				]
			},
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					fallback: "style-loader",
					use: [
						{
							loader: "css-loader",
							options: { importLoaders: 1 }
						},
						{
							loader: "postcss-loader",
							options: {
								plugins: [
									require("../../../.")({ // analog require('postcss-icon')
										"postcss-icon.material-design": {
											prefix: "md-",
											...baseConfigFontIconSets
										},
										"postcss-icon.font-awesome-v4": {
											prefix: "fa-",
											...baseConfigFontIconSets
										},
										"postcss-icon.font-awesome-v5": false // this icon set not used
									})
								]
							}
						}
					]
				})
			}
		]
	},
	plugins: [new ExtractTextPlugin({
		filename: "../css/style.css",
		disable: false
	})],
	context: resolve(__dirname, "src"),
	entry: {
		app: ["./js/app.js"]
	},
	output: {
		path: resolve(__dirname, "./public/assets/js/"),
		filename: "[name].js"
	}
};
