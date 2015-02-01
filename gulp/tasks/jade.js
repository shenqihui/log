var gulp         = require('gulp');
var browserSync  = require('browser-sync');
var jade         = require('gulp-jade');
var sourcemaps   = require('gulp-sourcemaps');
var handleErrors = require('../util/handleErrors');
var config       = require('../config').jade;

gulp.task('jade', function () {
  return gulp.src(config.src)
    .pipe(sourcemaps.init())
    .pipe(jade(config.settings))
    .on('error', handleErrors)
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.dist))
    .pipe(browserSync.reload({stream:true}));
});
