const { resolve } = require("path");

const gulp = require("gulp");
const clean = require("gulp-clean");
const postcss = require("gulp-postcss");
const postcssIcon = require("../../../."); // analog require("postcss-icon");

const output = {
	inline: ["woff2"],
	path: resolve(__dirname, "./public/assets/fonts/"), // folder to save all font files
	formats: ["woff2", "woff" /*, "ttf","svg", "eot"*/],
	url({ cssFile, fontName, hash }) { // function help fix resolve url
		// const urlWithQueryHash = `../fonts/${fontName}?v=${hash.substr(0, 5)}`;
		const exmapleResolveUrl = `../fonts/${fontName}`;
		return exmapleResolveUrl;
	}
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

gulp.task("css", () => {
	return gulp
		.src("./src/*.css")
		.pipe(postcss(PLUGINS))
		.pipe(gulp.dest("./public/assets/css/"));
});

gulp.task("clean-assets", () => {
	return gulp
		.src(["./public/assets/css/*.css", "./public/assets/fonts/*"], {
			read: false
		})
		.pipe(clean());
});

gulp.task("default", gulp.series("clean-assets", "css"));
