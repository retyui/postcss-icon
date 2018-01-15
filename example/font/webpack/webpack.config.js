// const helpLog = require("./_tmp.js");
const { resolve } = require("path");
const { sync: deleteSync } = require("del");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

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
				test: /\.(woff|ttf|svg|eot)$/,
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
						"postcss-loader" // options in ./postcss.config.js
					]
				})
			}
		]
	},
	plugins: [
		{
			apply(compiler) {
				deleteSync(
					["./public/assets/fonts/*", "./src/icon-fonts/*"].map(e =>
						resolve(__dirname, e)
					)
				);
				// helpLog(compiler);
			}
		},
		new ExtractTextPlugin({
			filename: "../css/style.css",
			disable: false
		})
	],
	// stats: "errors-only",
	context: resolve(__dirname, "src"),
	entry: {
		app: ["./js/app.js"]
	},
	output: {
		path: resolve(__dirname, "./public/assets/js/"),
		filename: "[name].js"
	}
};
