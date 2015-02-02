var release              = './static';
var templates            = './templates';
var bowerPath            = './bower_components';

// global variable
var packageJson          = 'package.json';
var revallJson           = 'manifest.json';
var concatJson           = 'concat.json';
var jshintrcJson         = 'jshintrc.json';
var pkgInfo              = require('./'+packageJson);
var concatInfo           = require('./'+concatJson);
var jshintrcInfo         = require('./'+jshintrcJson);
var LessPluginCleanCSS   = require('less-plugin-clean-css');
var cleancss             = new LessPluginCleanCSS({advanced: true});
var LessPluginAutoPrefix = require('less-plugin-autoprefix');
var autoprefix           = new LessPluginAutoPrefix({browsers: ['last 2 versions']});


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
  // where is debug mod, build file into django path, if product mode, build into temp path, and copy + revAll into django path.
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
    flatten: {
      src: [{
        dist: dist+'/js',
        src: bowerPath+'/**/**.min.map'
      }, {
        dist: dist+'/css',
        src: bowerPath+'/**/**.css.map'
      }, {
        dist: dist+'/fonts',
        src: bowerPath+'/**/fonts/**'
      }]
    },
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
        imagePath: '/images',
        plugins: [autoprefix, cleancss]
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
        'revAll', 'jade'
      ],
      productionFlag: productionOrDevelop
    },
    revAll: {
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


///////////////////////////////////
// Stuff you may not want to edit
///////////////////////////////////


// default config as develop, you can reload this by running config = getConfig(true)
var config = getConfig(false);

// gulp plugin
var browserSync        = require('browser-sync');
var gulp               = require('gulp');
var gulpChanged        = require('gulp-changed');
var gulpClean          = require('gulp-clean');
var gulpConcat         = require('gulp-concat');
var gulpFilesize       = require('gulp-filesize');
var gulpFlatten        = require('gulp-flatten');
var gulpFooter         = require('gulp-footer');
var gulpHeader         = require('gulp-header');
var gulpIgnore         = require('gulp-ignore');
var gulpImagemin       = require('gulp-imagemin');
var gulpJshint         = require('gulp-jshint');
var gulpJade           = require('gulp-jade');
var gulpLess           = require('gulp-less');
var gulpMinifyCSS      = require('gulp-minify-css');
var gulpNotify         = require('gulp-notify');
var gulpRevAll         = require('gulp-rev-all');
var gulpSourcemaps     = require('gulp-sourcemaps');
var gulpUglify         = require('gulp-uglify');




// gulp util
var handleErrors = function() {
  var args = Array.prototype.slice.call(arguments);
  // Send error to notification center with gulp-notify
  gulpNotify.onError({
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
    .pipe(gulpClean());
});
gulp.task('clean:p', function () {
  return gulp.src(config.clean.productSsrc, {read: false})
    .pipe(gulpClean());
});
gulp.task('concat', function() {
  return config.concat.js.forEach(function(elem, i) {
    gulp.src(elem.src)
      .pipe(gulpJshint(config.jshint.opt))
      .pipe(gulpSourcemaps.init())
      .pipe(gulpConcat(elem.dist))
      .pipe(gulpHeader('(function () {\n//with concat\n\n'))
      .pipe(gulpFooter('\n\n//with concat end\n})();'))
      .on('error', handleErrors)
      .pipe(gulpSourcemaps.write('./'))
      .pipe(gulp.dest(config.concat.dist))
      .pipe(browserSync.reload({stream:true}));
  });
});
gulp.task('concat:p', function() {
  return config.concat.js.forEach(function(elem, i) {
    gulp.src(elem.src)
      .pipe(gulpJshint(config.jshint.opt))
      .pipe(gulpConcat(elem.dist))
      .pipe(gulpHeader('(function () {\n//with concat\n\n'))
      .pipe(gulpFooter('\n\n//with concat end\n})();'))
      .on('error', handleErrors)
      .pipe(gulpUglify())
      .on('error', handleErrors)
      .pipe(gulp.dest(config.concat.dist))
      .pipe(gulpFilesize());
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
gulp.task('defaultConfig', function() {

});
gulp.task('flatten', function() {
  config.flatten.src.forEach(function(elem) {
    (function(elem) {
      gulp.src(elem.src)
        .pipe(gulpFlatten())
        .pipe(gulp.dest(elem.dist));
    })(elem);
  });
});
gulp.task('images', function() {
  return gulp.src(config.images.src)
    // Ignore unchanged files
    .pipe(gulpChanged(config.images.dist))
    // Optimize
    .pipe(gulpImagemin())
    .pipe(gulp.dest(config.images.dist))
    .pipe(browserSync.reload({stream:true}));
});
gulp.task('images:p', function() {
  return gulp.src(config.images.src)
    // Ignore unchanged files
    .pipe(gulpChanged(config.images.dist))
    // Optimize
    .pipe(gulpImagemin())
    .pipe(gulp.dest(config.images.dist))
    .pipe(browserSync.reload({stream:true}));
});
gulp.task('jade', function () {
  return gulp.src(config.jade.src)
    .pipe(gulpJade(config.jade.settings))
    .on('error', handleErrors)
    .pipe(gulp.dest(config.jade.dist))
    .pipe(browserSync.reload({stream:true}));
});
gulp.task('jade:p', function () {
  return gulp.src(config.jade.src)
    .pipe(gulpJade(config.jade.ProductSettings))
    .on('error', handleErrors)
    .pipe(gulp.dest(config.jade.dist))
    .pipe(browserSync.reload({stream:true}));
});
gulp.task('less', function () {
  return gulp.src(config.less.src)
    .pipe(gulpSourcemaps.init())
    .pipe(gulpLess(config.less.settings))
    .on('error', handleErrors)
    .pipe(gulpSourcemaps.write('./'))
    .pipe(gulp.dest(config.less.dist))
    .pipe(browserSync.reload({stream:true}));
});
gulp.task('less:p', function () {
  return gulp.src(config.less.src)
    .pipe(gulpLess(config.less.settings))
    .on('error', handleErrors)
    .pipe(gulpMinifyCSS({keepBreaks:false}))
    .on('error', handleErrors)
    .pipe(gulp.dest(config.production.cssPath))
    .pipe(gulpFilesize());
});

gulp.task('production', function() {
  config = getConfig(true);
  gulp.start(config.production.task);
});

gulp.task('revAll', function() {
  return gulp.src(config.revAll.src)
    .pipe(gulpIgnore.exclude(bowerPath+'/**'))
    .pipe(gulp.dest(config.revAll.distTemp))
    .pipe(gulpRevAll({ignore: config.revAll.ignore}))
    .pipe(gulp.dest(config.revAll.dist))
    .pipe(gulpRevAll.manifest({ fileName: config.revAll.name }))
    .pipe(gulp.dest(config.revAll.dist));
});
gulp.task('watch', function(cb) {
  gulp.watch(config.less.src,   ['less']);
  gulp.watch(config.concat.src, ['concat']);
  gulp.watch(config.images.src, ['images']);
  // gulp.watch(config.jade.src, ['jade']);
  // gulp.watch(config.copy.src, ['copy']);
});