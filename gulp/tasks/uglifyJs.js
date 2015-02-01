var gulp       = require('gulp');
var config     = require('../config').production;
var size       = require('gulp-filesize');
var gulpUglify = require('gulp-uglify');
var rename     = require('gulp-rename');

gulp.task('uglifyJs', ['concat'], function() {
  return gulp.src(config.jsSrc)
    .pipe(gulpUglify())
    .pipe(rename(function (path) {
        if(path.extname === '.js') {
            path.basename += '.min';
        }
    }))
    .pipe(gulp.dest(config.jsPath))
    // .pipe(gulp.dest('./_build/js-min'))
    .pipe(size());
});
