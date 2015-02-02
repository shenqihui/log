// path config
var dist = './_build';
var templates = './templates';
var bowerPath = './bower_components';
var release = './static';
var releaseTemp = './_static';

var distJs = dist + '/js';
var distCss = dist + '/css';
var src = './src';
var srcJs = src + '/js';

// url config
var staticRoot = '/static';

// global variable
var packageJson = 'package.json';
var revallJson = 'manifest.json';
var pkgInfo =  require('./'+packageJson);
var productionOrDevelop = false;

/**
 * @name getConfig
 * @desc 获取各种配置信息。
 * @depend []
 * @memberof browserStorage
 * @param { string } productionOrDevelop 选择开发模式还是产品模式？值 in ['production', 'develop']
 * @return { object } config for u.
 **/

var getHashMap = function() {
  var hashMap = {};
  try {
    hashMap = require(release+'/'+revallJson);
  } catch (e) {}
  return hashMap;
};

/**
 * @name getConfig
 * @desc 获取各种配置信息。
 * @depend []
 * @memberof browserStorage
 * @param { string } productionOrDevelop 选择开发模式还是产品模式？值 in ['production', 'develop']
 * @return { object } config for u.
 **/

var getConfig = function(productionOrDevelop) {
  // config for all
  productionOrDevelop = productionOrDevelop === 'production'? productionOrDevelop : 'develop';
  return {
    browserSync: {
      port: 3000
    },
    clean: {
      src: [dist, templates, release, releaseTemp]
    },
    cleanProduct: {
      src: [release, releaseTemp]
    },
    concat: {
      src: [srcJs+'/**', bowerPath+'/**'],
      dist: distJs,
      js: [{
        dist: 'lib.js',
        src: [bowerPath+'/jquery/dist/jquery.min.js', bowerPath+'/bootstrap/dist/js/bootstrap.min.js']
      },{
        dist: 'index.js',
        src: [srcJs+'/index.js']
      }]
    },
    default: {
      // default task define here
      task: ['less', 'concat', 'images', 'jade', 'revall', 'watch']
    },
    directory: {
      path: bowerPath
    },
    hashMap: getHashMap(),
    images: {
      src: [src + '/images/**', src + '/ico/**'],
      dist: dist + '/images'
    },
    jade: {
      src: src + '/jade/pages/*.jade',
      dist: templates,
      settings: {
        pretty: true,
        data: {
          pkgInfo: pkgInfo,
          makeHash: (function(file) {
            var hashMap = getHashMap();
            return function(file) {
              var path;
              var hash = hashMap[file];

              path = typeof hash === 'undefined' ? file : hash;
              return staticRoot+path;
            };
          })(),
          updateTime: (new Date()).toUTCString()
        }
      }
    },
    less: {
      src: src + '/less/*.less',
      dist: distCss,
      settings: {
        sourceComments: 'map',
        // Used by the image-url helper
        imagePath: '/images'
      }
    },
    production: {
      cssSrc: distCss+'/*.css',
      jsSrc: distJs+'/*.js',
      cssPath: distCss,
      jsPath: distJs,
      dist: dist,
      // production task define here
      task: []
    },
    revall: {
      textType: '{css,js,md}',
      name: revallJson,
      src: [dist + '/**', bowerPath + '/**'],
      dist: release + '/',
      distTemp: releaseTemp + '/',
      cleanSrc: [release, releaseTemp]
    }
  };
};
var config = getConfig(productionOrDevelop);

// gulp plugin
var browserSync = require('browser-sync');
var changed    = require('gulp-changed');
var clean        = require('gulp-clean');
var concat       = require('gulp-concat');
var config     = getConfig();
var gulp        = require('gulp');
var gulpif       = require('gulp-if');
// var gulpmatch    = require('gulp-match');
var imagemin   = require('gulp-imagemin');
var jade         = require('gulp-jade');
var less         = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var notify = require('gulp-notify');
var rename    = require('gulp-rename');
var revall       = require('gulp-rev-all');
var size      = require('gulp-filesize');
var sourcemaps   = require('gulp-sourcemaps');
var uglify       = require('gulp-uglify');
var useref = require('gulp-useref');

// gulp util
var handleErrors = function() {
  var args = Array.prototype.slice.call(arguments);
  // Send error to notification center with gulp-notify
  notify.onError({
    title: 'Compile Error',
    message: '<%= error %>'
  }).apply(this, args);
  // Keep gulp from hanging on this task
  this.emit('end');
};

gulp.task('browserSync', function() {
  browserSync(config.browserSync);
});
gulp.task('clean', function () {
  return gulp.src(config.clean.src, {read: false})
    .pipe(clean());
});
gulp.task('cleanProduct', function () {
  return gulp.src(config.cleanProduct.src, {read: false})
    .pipe(clean());
});
gulp.task('concat', function() {
  return config.concat.js.forEach(function(elem, i) {
    gulp.src(elem.src)
      // .pipe(sourcemaps.init())
      .pipe(concat(elem.dist))
      .on('error', handleErrors)
      // .pipe(sourcemaps.write())
      .pipe(gulp.dest(config.concat.dist))
      .pipe(browserSync.reload({stream:true}));
  });
});
gulp.task('default', config.default.task);
gulp.task('images', function() {
  return gulp.src(config.images.src)
    // Ignore unchanged files
    .pipe(changed(config.images.dist))
    // Optimize
    .pipe(imagemin())
    .pipe(gulp.dest(config.images.dist))
    .pipe(browserSync.reload({stream:true}));
});
gulp.task('jade', function () {
  return gulp.src(config.jade.src)
    .pipe(sourcemaps.init())
    .pipe(jade(config.jade.settings))
    .on('error', handleErrors)
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.jade.dist))
    .pipe(browserSync.reload({stream:true}));
});
gulp.task('less', function () {
  return gulp.src(config.less.src)
    // .pipe(sourcemaps.init())
    .pipe(less(config.less.settings))
    .on('error', handleErrors)
    // .pipe(sourcemaps.write())
    // .pipe(autoprefixer({ browsers: ['last 2 version'] }))
    .pipe(gulp.dest(config.less.dist))
    .pipe(browserSync.reload({stream:true}));
});
gulp.task('minifyCss', function() {
  return gulp.src(config.production.cssSrc)
    .pipe(minifyCSS({keepBreaks:false}))
    .pipe(rename(function (path) {
      if(path.extname === '.css') {
        path.basename += '.min';
      }
    }))
    .pipe(gulp.dest(config.production.cssPath))
    .pipe(size());
});
gulp.task('production', ['default']);

gulp.task('revall', function() {
  return gulp.src(config.revall.src)
    .pipe(gulpif(function(path) {
      return false;
      // return gulpmatch(path, '**.{js,css,md}');
    }, uglify()))
    .pipe(gulp.dest(config.revall.distTemp))
    .pipe(revall())
    .pipe(gulp.dest(config.revall.dist))
    .pipe(revall.manifest({ fileName: config.revall.name }))
    .pipe(gulp.dest(config.revall.dist));
});
gulp.task('uglifyJs', function() {
  return gulp.src(config.production.jsSrc)
    .pipe(uglify())
    .pipe(rename(function (path) {
      if(path.extname === '.js') {
        path.basename += '.min';
      }
    }))
    .pipe(gulp.dest(config.production.jsPath))
    .pipe(size());
});
gulp.task('useref', function () {
  var assets = useref.assets();
  return gulp.src('app/*.html')
    .pipe(assets)
    .pipe(assets.restore())
    .pipe(useref())
    .pipe(gulp.dest('dist'));
});
gulp.task('watch', ['browserSync'], function(callback) {
  gulp.watch(config.less.src,   ['less']);
  gulp.watch(config.concat.src,   ['concat']);
  gulp.watch(config.images.src, ['images']);
  gulp.watch(config.jade.src, ['jade']);
  gulp.watch(config.revall.src, ['revall']);
});