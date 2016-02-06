var gulp = require("gulp");
var sourcemaps = require("gulp-sourcemaps");
var babel = require("gulp-babel");
var concat = require("gulp-concat");
var mocha = require("gulp-mocha");
var nodemon = require('gulp-nodemon');
require('babel-register');

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
gulp.task("continuous_integration", ["default", "test"]);

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

gulp.task('test', function() {
	return gulp.src('tests/**/*.js', {read : false})
		.pipe(mocha({reporter:'spec'}));
});


