// css folder structure css/**/*.scss , final ./style.css
// js folder structure js/**/*.js, final ./index.js
// assets folder structure assets/**/*.* , final ./assets/**/*.*

// Load plugins
const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const concat = require("gulp-concat");
const uglifycss = require("gulp-uglifycss");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");
const browserSync = require("browser-sync").create();

// Compile Sass
gulp.task("sass", function () {
  return gulp
    .src("css/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest("css"))
    .pipe(browserSync.stream());
});

// Concat & Minify CSS
gulp.task("css", function () {
  return gulp
    .src("css/**/*.css")
    .pipe(concat("style.css"))
    .pipe(uglifycss())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("./"))
    .pipe(browserSync.stream());
});

// Concat & Minify JS
gulp.task("js", function () {
  return gulp
    .src("js/**/*.js")
    .pipe(concat("index.js"))
    .pipe(uglify())
    .pipe(rename("index.min.js"))
    .pipe(gulp.dest("./"))
    .pipe(browserSync.stream());
});

// Watch Files
gulp.task("watch", function () {
  browserSync.init({
    server: {
      baseDir: "./",
    },
  });
  gulp.watch("scss/**/*.scss", gulp.series("sass"));
  gulp.watch("css/**/*.css", gulp.series("css"));
  gulp.watch("js/**/*.js", gulp.series("js"));
  gulp.watch("./*.html").on("change", browserSync.reload);
});

// Default Task
gulp.task("default", gulp.series("sass", "css", "js", "watch"));
