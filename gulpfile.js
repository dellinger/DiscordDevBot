var gulp = require("gulp");
var sourcemaps = require("gulp-sourcemaps");
var babel = require("gulp-babel");
var concat = require("gulp-concat");
var exec = require('child_process').exec;

gulp.task("default", ["babel","copy"]);

gulp.task("babel", function() {
  return gulp.src("src/**/*.js")
      .pipe(sourcemaps.init())
      .pipe(babel())
      .pipe(concat("all.js"))
      .pipe(sourcemaps.write("."))
      .pipe(gulp.dest("dist"));
});

gulp.task("copy", function() {
    return gulp.src('.env').pipe(gulp.dest('dist'));
});

gulp.task("start",["default"], function(cb) {
  exec('node dist/all.js', function (err, stdout, stderr) {
    console.log(stdout);
    console.error(stderr);
    cb(err);
  });
});


