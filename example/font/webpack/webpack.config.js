const { resolve } = require("path");
const { sync: deleteSync } = require("del");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const counter = {
	getN(key) {
		if (this[key] === undefined) {
			this[key] = 0;
		}
		return ++this[key];
	}
};
const pwd = process.cwd();
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
						"postcss-loader" // options in ./postcss.config.js
					]
				})
			}
		]
	},
	plugins: [
		{
			apply() {
				deleteSync(resolve(__dirname, "./src/icon-fonts/*"));
			}
		},
		new ExtractTextPlugin({
			filename: "../css/style.css",
			disable: false
		}),
		{
			apply(compiler) {
				compiler.plugin("compile", params => {
					console.log(`on compile ${counter.getN("compile")}`);
				});
				compiler.plugin("invalid", (file, time) => {
					console.log(
						`on invalid ${counter.getN(
							"invalid"
						)} args : ${JSON.stringify({
							file: file.replace(pwd, ""),
							time
						})}`
					);
				});
			}
		}
	],
	stats: "errors-only",
	context: resolve(__dirname, "src"),
	entry: {
		app: ["./js/app.js"]
	},
	output: {
		path: resolve(__dirname, "./public/assets/js/"),
		filename: "[name].js"
	}
};
