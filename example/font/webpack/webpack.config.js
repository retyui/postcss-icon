const { resolve } = require("path");
const { sync: deleteSync } = require("del");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const counter = {
	getN(key){
		if(this[key] === undefined){
			this[key] = 0;
		}
		return ++this[key];
	}
}
const all = [];
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
				deleteSync(resolve(__dirname, './src/icon-fonts/*'));
			}
		},
		new ExtractTextPlugin({
			filename: "../css/style.css",
			disable: false
		}),
		{
			apply(compiler) {
				compiler.plugin("compile", params => {
					console.log(`1) compile ${counter.getN(1)} Компилятор начинает компилировать ...`);
				});

				// compiler.plugin("compilation", compilation => {
				// 	console.log(`2) compilation ${counter.getN(2)} Компилятор запускает новую компиляцию ...`);

				// 	compilation.plugin("optimize", () => {
				// 		console.log(`3) optimize ${counter.getN(3)} Компиляция начинает оптимизировать файлы ...`);
				// 	});
				// });

				// compiler.plugin("emit", (compilation, callback) => {
				// 	console.log(`4) emit ${counter.getN(4)} Компиляция будет генерировать файлы ...`);
				// 	callback();
				// });

				// compiler.plugin("watch-run", (...args) => {
				// 	console.log(`5) watch-run ${counter.getN(5)} args : ${Object.keys(args)} type: ${args.map(e => typeof e)} \${}`)
				// 	args[1]();
				// })
				// compiler.plugin("watch-close", (...args) => {
				// 	console.log(`6) watch-close ${counter.getN(6)} args : ${Object.keys(args)} type: ${args.map(e => typeof e)} \${}`)
				// })
				compiler.plugin("invalid", (...args) => {
					debugger;
					console.log(`7) invalid ${counter.getN(7)} args : ${args}`)
				})

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
