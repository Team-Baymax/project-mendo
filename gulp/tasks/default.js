var gulp = require('gulp');
var config = require('../config');

gulp.task('default', ['sass', 'images', 'scripts', 'markup', 'browser-sync'], function () {
	gulp.watch(config.sass.src,   ['sass']);
  gulp.watch(config.markup.src, ['markup']);
  gulp.watch(config.scripts.src, ['scripts']);
});

// gulp.task('default', ['browserSync']);
