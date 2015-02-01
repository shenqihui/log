var gulp        = require('gulp');
var browserSync  = require('browser-sync');
var concat       = require('gulp-concat');
var sourcemaps   = require('gulp-sourcemaps');
var handleErrors = require('../util/handleErrors');
var config       = require('../config').concat;

gulp.task('concat', function() {
  return config.js.forEach(function(elem, i) {
    gulp.src(elem.src)
      // .pipe(sourcemaps.init())
      .pipe(concat(elem.dist))
      .on('error', handleErrors)
      // .pipe(sourcemaps.write())
      .pipe(gulp.dest(config.dist))
      .pipe(browserSync.reload({stream:true}));
  });
});