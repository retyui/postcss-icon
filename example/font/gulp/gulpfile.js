const gulp = require("gulp");
const clean = require("gulp-clean");
const postcss = require("gulp-postcss");

gulp.task("css", () => {
	return gulp
		.src("./src/*.css")
		.pipe(postcss()) // for options recomended use ./postcss.config.js
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
