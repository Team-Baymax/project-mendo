var gulp = require('gulp');
var config = require('../config').server;
var server = require('gulp-develop-server');
var browserSync  = require('browser-sync');

gulp.task('server:start', function () {
  return server.listen(config);
});

gulp.task('server:restart', function () {
  browserSync.reload({stream:true});
  server.restart();
});
