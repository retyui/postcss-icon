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
class FsWathc {
	constructor(w) {
		this.w = w;
		this.isStarted = false;
		this.wather = {};
	}
	startWathc() {
		if (!this.isStarted) {
			this.isStarted = true;
			this.wather = require("fs").watch(
				this.w,
				{ encoding: "buffer" },
				(eventType, filename) => {
					console.log(
						`fs.watch: ${eventType} ${
							filename
								? filename.toString("utf8").replace(cwd, "")
								: ""
						}`
					);
				}
			);
		}
	}
	close() {
		if (this.wather && this.wather.close) {
			this.wather.close();
			this.isStarted = false;
		}
	}
}
const cwd = process.cwd();
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

				compiler.plugin("invalid", (file, time) => {
					console.log(
						`on invalid ${("0" + counter.getN("invalid")).slice(
							-2
						)}: ${JSON.stringify({
							file: file.replace(cwd, ""),
							time
						})}`
					);
				});

				const tmpWather = new FsWathc("./src/icon-fonts/");
				tmpWather.startWathc();
				compiler.plugin("done", () => {
					tmpWather.close();
				});
			}
		},
		new ExtractTextPlugin({
			filename: "../css/style.css",
			disable: false
		})
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
