/* Notes:
   - gulp/tasks/browserify.js handles js recompiling with watchify
   - gulp/tasks/browserSync.js watches and reloads compiled files
*/

var gulp     = require('gulp');
var config   = require('../config');
var browserSync  = require('browser-sync');

gulp.task('watch', ['browserSync'], function(callback) {
  gulp.watch(config.sass.src,   ['sass']);
  gulp.watch(config.markup.src, function(){
      browserSync.reload({stream:true});
  });
  // Watchify will watch and recompile our JS, so no need to gulp.watch it
});
