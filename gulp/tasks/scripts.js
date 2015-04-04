var gulp = require('gulp');
var config = require('../config').scripts;
var browserSync  = require('browser-sync');

gulp.task('scripts', function() {
  return gulp.src(config.src)
    .pipe(browserSync.reload({stream:true}));
});
