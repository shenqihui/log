var release = './static';
var templates = './templates';
var bowerPath = './bower_components';

// global variable
var packageJson = 'package.json';
var revallJson = 'manifest.json';
var concatJson = 'concat.json';
var jshintrcJson = '.jshintrc';
var pkgInfo =  require('./'+packageJson);
var concatInfo =  require('./'+concatJson);
var jshintrcInfo =  require('./'+jshintrcJson);

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
 * @param { string } productionOrDevelop 选择开发模式还是产品模式？true 模式为 production ， false 为 develop
 * @return { object } config for u.
 **/

var getConfig = function(productionOrDevelop) {
  // config for all
  productionOrDevelop = productionOrDevelop === true ? true : false;
  // path config
  var dist = './_build';
  var releaseTemp = './_static';
  // where is debug mod, build file into django path, if product mode, build into temp path, and copy + revall into django path.
  if(productionOrDevelop === false) {
    dist = release;
    releaseTemp = release;
  }

  var distJs = dist + '/js';
  var distCss = dist + '/css';
  var src = './src';
  var srcJs = src + '/js';

  // url config
  var staticRoot = '/static';
  
  return {
    browserSync: {
      port: 3000
    },
    clean: {
      src: [dist, templates, release, releaseTemp],
      productSsrc: [templates, release, releaseTemp],
      developSrc: [dist]
    },
    concat: {
      src: [srcJs+'/**', bowerPath+'/**'],
      dist: distJs,
      js: concatInfo
    },
    copy: {
      src: [bowerPath+'/**'],
      productSrc: [bowerPath+'/**', dist+'/**'],
      dist: release
    },
    default: {
      // default task define here
      task: ['copy', 'less', 'concat', 'images', 'jade', 'watch']
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
          makeHash: function(file) {
            return staticRoot+file;
          },
          updateTime: (new Date()).toUTCString()
        }
      },
      ProductSettings: {
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
    jshint: {
      opt: jshintrcInfo
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
      task: ['less:p', 'concat:p', 'images:p', 'copy:p'],
      taskLast: [
        'revall', 'jade'
      ],
      productionFlag: productionOrDevelop
    },
    revall: {
      textType: '{css,js,md}',
      name: revallJson,
      src: [dist + '/**'],
      dist: release + '/',
      distTemp: releaseTemp + '/',
      cleanSrc: [release, releaseTemp],
      ignore: [
        '.html',
        '.json',
        '.md',
        '.eot',
        '.ttf',
        '.woff',
        '.svg',
        '.otf'
      ]
    }
  };
};
// default config as develop, you can reload this by running config = getConfig(true)
var config = getConfig(false);

// gulp plugin
var browserSync = require('browser-sync');
var changed    = require('gulp-changed');
var clean        = require('gulp-clean');
var concat       = require('gulp-concat');
var config     = getConfig();
var footer = require('gulp-footer');
var gulp        = require('gulp');
// var gulpif       = require('gulp-if');
var gulpIgnore = require('gulp-ignore');
var gulpJshint = require('gulp-jshint');
var header = require('gulp-header');
var imagemin   = require('gulp-imagemin');
var jade         = require('gulp-jade');
var less         = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var notify = require('gulp-notify');
var revall       = require('gulp-rev-all');
var size      = require('gulp-filesize');
var sourcemaps   = require('gulp-sourcemaps');
var uglify       = require('gulp-uglify');

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
gulp.task('clean:p', function () {
  return gulp.src(config.clean.productSsrc, {read: false})
    .pipe(clean());
});
gulp.task('concat', function() {
  return config.concat.js.forEach(function(elem, i) {
    gulp.src(elem.src)
      .pipe(gulpJshint(config.jshint.opt))
      .pipe(sourcemaps.init())
      .pipe(concat(elem.dist))
      .pipe(header('(function () {\n//with concat\n\n'))
      .pipe(footer('\n\n//with concat end\n})();'))
      .on('error', handleErrors)
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(config.concat.dist))
      .pipe(browserSync.reload({stream:true}));
  });
});
gulp.task('concat:p', function() {
  return config.concat.js.forEach(function(elem, i) {
    gulp.src(elem.src)
      .pipe(gulpJshint(config.jshint.opt))
      .pipe(concat(elem.dist))
      .pipe(header('(function () {\n//with concat\n\n'))
      .pipe(footer('\n\n//with concat end\n})();'))
      .on('error', handleErrors)
      .pipe(uglify())
      .on('error', handleErrors)
      .pipe(gulp.dest(config.concat.dist))
      .pipe(size());
  });
});
gulp.task('copy', function() {
  gulp.src(config.copy.src)
    .on('error', handleErrors)
    .pipe(gulp.dest(config.copy.dist));
});
gulp.task('copy:p', function() {
  gulp.src(config.copy.productSrc)
    .on('error', handleErrors)
    .pipe(gulp.dest(config.copy.dist));
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
gulp.task('images:p', function() {
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
gulp.task('jade:p', function () {
  return gulp.src(config.jade.src)
    .pipe(sourcemaps.init())
    .pipe(jade(config.jade.ProductSettings))
    .on('error', handleErrors)
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.jade.dist))
    .pipe(browserSync.reload({stream:true}));
});
gulp.task('less', function () {
  return gulp.src(config.less.src)
    .pipe(sourcemaps.init())
    .pipe(less(config.less.settings))
    .on('error', handleErrors)
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.less.dist))
    .pipe(browserSync.reload({stream:true}));
});
gulp.task('less:p', function () {
  return gulp.src(config.less.src)
    .pipe(less(config.less.settings))
    .on('error', handleErrors)
    .pipe(minifyCSS({keepBreaks:false}))
    .on('error', handleErrors)
    .pipe(gulp.dest(config.production.cssPath))
    .pipe(size());
});

gulp.task('production', function() {
  config = getConfig(true);
  gulp.start(config.production.task);
});

gulp.task('revall', ['copy'], function() {
  return gulp.src(config.revall.src)
    .pipe(gulpIgnore.exclude(bowerPath+'/**'))
    .pipe(gulp.dest(config.revall.distTemp))
    .pipe(revall({ignore: config.revall.ignore}))
    .pipe(gulp.dest(config.revall.dist))
    .pipe(revall.manifest({ fileName: config.revall.name }))
    .pipe(gulp.dest(config.revall.dist));
});
gulp.task('watch', ['browserSync'], function(cb) {
  gulp.watch(config.less.src,   ['less']);
  gulp.watch(config.concat.src,   ['concat']);
  gulp.watch(config.images.src, ['images']);
  // gulp.watch(config.jade.src, ['jade']);
  // gulp.watch(config.copy.src, ['copy']);
});