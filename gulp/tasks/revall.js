var revall       = require('gulp-rev-all');
var uglify       = require('gulp-uglify');
var gulp         = require('gulp');
var browserSync  = require('browser-sync');
var jade         = require('gulp-jade');
var handleErrors = require('../util/handleErrors');
var config       = require('../config').revall;
var gulpif       = require('gulp-if');
var gulpmatch    = require('gulp-match');
var clean        = require('gulp-clean');


gulp.task('revall', ['clean'], function() {
  gulp.src(config.cleanSrc, {read: false})
    .pipe(clean());
  return gulp.src(config.src)
    .pipe(gulpif(function(path) {
      // return false;
      return gulpmatch(path, '**.{js,css,md}');
    }, uglify()))
    .pipe(gulp.dest(config.distTemp))
    .pipe(revall())
    .pipe(gulp.dest(config.dist))
    .pipe(revall.manifest({ fileName: config.name }))
    .pipe(gulp.dest(config.dist));
});