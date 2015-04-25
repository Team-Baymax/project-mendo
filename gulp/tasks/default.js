var gulp = require('gulp');
var config = require('../config');

gulp.task('default', ['sass', 'fonts', 'images', 'markup', 'watchify', 'browser-sync'], function () {
  gulp.watch(config.sass.src,   ['sass']);
  gulp.watch(config.images.src, ['images']);
  gulp.watch(config.markup.src, ['markup']);
});

// gulp.task('default', ['browserSync']);
