/* Notes:
   - gulp/tasks/browserify.js handles js recompiling with watchify
   - gulp/tasks/browserSync.js watches and reloads compiled files
*/

var gulp     = require('gulp');
var config   = require('../config');

gulp.task('watch', ['browserSync'], function(callback) {
  gulp.watch(config.less.src,   ['less']);
  gulp.watch(config.concat.src,   ['concat']);
  gulp.watch(config.images.src, ['images']);
  gulp.watch(config.jade.src, ['jade']);
  gulp.watch(config.revall.src, ['revall']);
  // Watchify will watch and recompile our JS, so no need to gulp.watch it
});
