var gulp = require('gulp');
var config = require('../config').webfonts;

gulp.task('webfonts', function() {
  return gulp.src(config.src)
  .pipe(gulp.dest(config.dest));
});
