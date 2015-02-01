var gulp      = require('gulp');
var config    = require('../config').production;
var minifyCSS = require('gulp-minify-css');
var rename    = require('gulp-rename');
var size      = require('gulp-filesize');

gulp.task('minifyCss', ['less'], function() {
  return gulp.src(config.cssSrc)
    .pipe(minifyCSS({keepBreaks:false}))
    .pipe(rename(function (path) {
        if(path.extname === '.css') {
            path.basename += '.min';
        }
    }))
    .pipe(gulp.dest(config.cssPath))
    .pipe(size());
});
