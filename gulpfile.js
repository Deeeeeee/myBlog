"use strict";
var gulp = require('gulp');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sass = require('gulp-sass');

var path = {
	sass:["public/sass/**/*.scss"],
	css:['public/css/**/*']
};


// gulp.task('js',function  () {
// 	return	gulp.src(path.js)
// 		.pipe(uglify())
// 		.pipe(gulp.dest('static/js'))
// });


gulp.task('css',function  () {
	return	gulp.src(path.css)
		.pipe(gulp.dest('static/css'))
});

gulp.task('sass',function () {
	return 	gulp.src(path.sass)
		.pipe(sass())
		.pipe(minifyCss({
			keepSpecialComments: 0
		}))
		.pipe(rename({ extname: '.min.css' }))
		.pipe(gulp.dest('public' + '/css'));
});

gulp.task('watch',["sass"],function () {
	gulp.watch(path.sass,['sass']);
});

gulp.task('default', ['watch']);