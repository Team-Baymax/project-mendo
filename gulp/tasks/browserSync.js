var browserSync = require('browser-sync');
var gulp        = require('gulp');
var nodemon = require('gulp-nodemon');
var config      = require('../config').browserSync;

gulp.task('browser-sync', ['nodemon'], function() {
  browserSync.init(null, config);
});

gulp.task('nodemon', function (cb) {
  var called = false;
  return nodemon({script: 'server/index.js'}).on('start', function () {
    if (!called) {
      called = true;
      cb();
    }
  });
});
