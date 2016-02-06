var gulp = require("gulp");
var sourcemaps = require("gulp-sourcemaps");
var babel = require("gulp-babel");
var concat = require("gulp-concat");
var exec = require('child_process').exec;
var nodemon = require('gulp-nodemon');

var nodemonOptions = {
	script: 'dist/all.js',
	ext: 'js',
	env: { 'NODE_ENV': 'development' },
	verbose: true,
	ignore: ['node_modules/**'],
	watch: ['src/*'],
	nodeArgs: ['--debug']
};

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

gulp.task('start', function () {
	nodemon(nodemonOptions)
		.on('restart',['default']);
});

