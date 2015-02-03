var argv        = require('minimist')(process.argv.slice(2));
var release     = './static';
var templates   = './templates';
var bowerPath   = './bower_components';
var dist        = './_static';
var releaseTemp = './_templates';
var clean       = [release, templates, dist, releaseTemp];
var hashMap     = {};
var debug       = true;
if(argv._ && argv._.length > 0) {
  if(argv._[0] === 'production' || /^.*:p$/.test(argv._[0])){
    debug = false;
  }
}
// console.log(argv, debug);

// global variable
// package file name
var packageJson          = 'package.json';
// hashmap file name
var revAllJson           = 'manifest.json';
// concat js config file name
var concatJson           = 'concat.json';
// concat js config file name
var concatCssJson        = 'concat_css.json';
// opt of jshint file name
var jshintrcJson         = 'jshintrc.json';

var pkgInfo              = require('./'+packageJson);
var concatInfo           = require('./'+concatJson);
var concatCssInfo        = require('./'+concatCssJson);
var jshintrcInfo         = require('./'+jshintrcJson);
var LessPluginCleanCSS   = require('less-plugin-clean-css');
var cleancss             = new LessPluginCleanCSS({advanced: true});
var LessPluginAutoPrefix = require('less-plugin-autoprefix');
var autoprefix           = new LessPluginAutoPrefix({browsers: ['last 2 versions']});

// global config for gulp src and dist
var config;


/**
 * @name getHashMap
 * @desc 获取进行了 hash 计算并且重命名的 hash 记录。
 * @depend []
 * @return { object } hashmap.
 **/

var getHashMap = function() {
  var hashMap = {};
  try {
    hashMap = require(release+'/'+revAllJson);
  } catch (e) {}
  return hashMap;
};

/**
 * @name getConfig
 * @desc 获取各种配置信息。
 * @depend []
 * @param { string } debug 选择开发模式还是产品模式？ false 模式为 production ， true 为 develop。 production 模式将不进行 sourcemap/file hash/js+css min/image min 动作。
 * @return { object } config for u.
 **/

var getConfig = function(debug) {
  // config for all
  debug = debug === true ? true : false;
  // path config
  
  // where is debug mod, build file into django path, if product mode, build into temp path, and copy + revAll into django path.
  if(debug === true) {
    dist = release;
    releaseTemp = release;
  }

  var distJs = dist + '/js';
  var distCss = dist + '/css';
  var src = './src';
  // var srcJs = src + '/js';

  // url config
  var staticRoot = '/static';
  
  return {
    bower: {
      dist: bowerPath
    },
    browserSync: {
      port: 3000
    },
    clean: {
      productSsrc: [templates, release],
      // developSrc: [dist],
      src: [dist, templates, release, releaseTemp]
    },
    concat: {
      dist: distJs,
      js: concatInfo,
      watch: [src+'/js/**']
    },
    concatCss: {
      dist: distCss,
      css: concatCssInfo
    },
    copy: {
      productSrc: [bowerPath+'/**', dist+'/**'],
      dist: release,
      src: [bowerPath+'/**'],
      watch: [src+'/**']
    },
    // debug: true,
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
      watch: [src + '/images/**', src + '/ico/**'],
      dist: dist + '/images'
    },
    jade: {
      src: src + '/jade/pages/*.jade',
      watch: src + '/jade/**/*.jade',
      dist: templates,
      productSettings: {
        pretty: false,
        data: {
          pkgInfo: pkgInfo,
          makeHash: (function(file) {
            return function(file) {
              file = file.replace(/^\/*/,'');
              var path;
              var hash = hashMap[file];

              path = typeof hash === 'undefined' ? file : hash;
              return staticRoot+path;
            };
          })(),
          updateTime: (new Date()).toUTCString(),
          debugMode: debug
        }
      },
      settings: {
        pretty: true,
        data: {
          pkgInfo: pkgInfo,
          makeHash: function(file) {
            return staticRoot+file;
          },
          updateTime: (new Date()).toUTCString(),
          debug: debug
        }
      }
    },
    jshint: {
      opt: jshintrcInfo
    },
    less: {
      src: src + '/less/*.less',
      watch: [src + '/less/**', src + '/css/**'],
      dist: distCss,
      settings: {
        sourceComments: 'map',
        // Used by the image-url helper
        imagePath: staticRoot+'/images',
        plugins: [autoprefix, cleancss]
      }
    },
    revAll: {
      name: revAllJson,
      src: release + '/**',
      dist: release + '/',
      ignore: ['-gulp-rev-all.*', revAllJson],
      subfix: '-gulp-rev-all',
      // bak with ignore
      ignoreBak: [
        '.html',
        '.json',
        '.md',
        '.eot',
        '.ttf',
        '.woff',
        '.svg',
        '.otf',
        'txt'
      ]
    }
  };
};


///////////////////////////////////
// Stuff you may not want to edit
///////////////////////////////////


// default config as develop, you can reload this by running config = getConfig(true)
config = getConfig(debug);

// gulp plugin
var browserSync    = require('browser-sync');
var gulp           = require('gulp');
var gulpBower      = require('gulp-bower');
var gulpChanged    = require('gulp-changed');
var gulpClean      = require('gulp-clean');
var gulpConcat     = require('gulp-concat');
var gulpConcatCss  = require('gulp-concat-css');
var gulpFilesize   = require('gulp-filesize');
// var gulpFlatten = require('gulp-flatten');
var gulpFooter     = require('gulp-footer');
// var gulpIf      = require('gulp-if');
var gulpHeader     = require('gulp-header');
// var gulpIgnore  = require('gulp-ignore');
var gulpImagemin   = require('gulp-imagemin');
var gulpJshint     = require('gulp-jshint');
var gulpJade       = require('gulp-jade');
var gulpLess       = require('gulp-less');
var gulpMinifyCSS  = require('gulp-minify-css');
var gulpNotify     = require('gulp-notify');
var gulpRevAll     = require('gulp-rev-all');
var gulpSourcemaps = require('gulp-sourcemaps');
var gulpUglify     = require('gulp-uglify');
var path           = require('path');


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

gulp.task('bower', function () {
  return gulpBower()
    .pipe(gulp.dest(config.bower.dist));
});
gulp.task('browserSync', function() {
  return browserSync(config.browserSync);
});
gulp.task('clean', function () {
  return gulp.src(clean, {read: false})
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
gulp.task('concat:p', ['bower'], function() {
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
gulp.task('concatCss', function() {
  return config.concatCss.css.forEach(function(elem, i) {
    gulp.src(elem.src)
      .pipe(gulpSourcemaps.init())
      .pipe(gulpConcatCss(elem.dist))
      .on('error', handleErrors)
      .pipe(gulp.dest(config.concatCss.dist))
      .pipe(gulpSourcemaps.write('./'))
      .pipe(browserSync.reload({stream:true}));
  });
});
gulp.task('concatCss:p', ['bower', 'less:p'], function() {
  return config.concatCss.css.forEach(function(elem, i) {
    gulp.src(elem.src)
      .pipe(gulpConcatCss(elem.dist))
      .on('error', handleErrors)
      .pipe(gulpMinifyCSS({keepBreaks:false}))
      .on('error', handleErrors)
      .pipe(gulp.dest(config.concatCss.dist));
  });
});
gulp.task('copy', function() {
  return gulp.src(config.copy.src)
    .on('error', handleErrors)
    .pipe(gulp.dest(config.copy.dist));
});
gulp.task('copy:p', ['images:p', 'less:p', 'concat:p', 'concatCss:p'], function() {
  return gulp.src(config.copy.productSrc)
    .on('error', handleErrors)
    .pipe(gulp.dest(config.copy.dist));
});
gulp.task('default', ['browserSync', 'images', 'less', 'concat', 'concatCss', 'copy', 'jade', 'watch'], function() {
  return true;
});
gulp.task('images', function() {
  return gulp.src(config.images.src)
    // Ignore unchanged files
    .pipe(gulpChanged(config.images.dist))
    // Optimize
    // .pipe(gulpImagemin())
    .pipe(gulp.dest(config.images.dist))
    .pipe(browserSync.reload({stream:true}));
});
gulp.task('images:p', ['bower'], function() {
  return gulp.src(config.images.src)
    // Ignore unchanged files
    .pipe(gulpChanged(config.images.dist))
    // Optimize
    .pipe(gulpImagemin())
    .pipe(gulp.dest(config.images.dist));
});
gulp.task('jade', function () {
  return gulp.src(config.jade.src)
    .pipe(gulpJade(config.jade.settings))
    .on('error', handleErrors)
    .pipe(gulp.dest(config.jade.dist))
    .pipe(browserSync.reload({stream:true}));
});
gulp.task('jade:p', ['revAll:p'], function () {
  hashMap = getHashMap();
  return gulp.src(config.jade.src)
    .pipe(gulpJade(config.jade.productSettings))
    .on('error', handleErrors)
    .pipe(gulp.dest(config.jade.dist));
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
gulp.task('less:p', ['bower'], function () {
  return gulp.src(config.less.src)
    .pipe(gulpLess(config.less.settings))
    .on('error', handleErrors)
    .pipe(gulpMinifyCSS({keepBreaks:false}))
    .on('error', handleErrors)
    .pipe(gulp.dest(config.less.dist))
    .pipe(gulpFilesize());
});
gulp.task('production', ['images:p', 'less:p', 'concat:p', 'concatCss:p', 'copy:p', 'revAll:p', 'jade:p'], function() {
  return true;
});
gulp.task('revAll:p', ['copy:p'], function() {
  return gulp.src(config.revAll.src)
    // .pipe(gulpIgnore.exclude(bowerPath+'/**'))
    // .pipe(gulp.dest(config.revAll.distTemp))
    .pipe(gulpRevAll({
      transformFilename: function (file, hash) {
        var ext = path.extname(file.path);
        return path.basename(file.path, ext) + '.' + hash.substr(0, 8) + config.revAll.subfix + ext; //filename.3410c8a3-rev-all.ext
      },
      quiet: true,
      ignore: config.revAll.ignore
    }))
    .pipe(gulp.dest(config.revAll.dist))
    .pipe(gulpRevAll.manifest({ fileName: config.revAll.name }))
    .pipe(gulp.dest(config.revAll.dist));
});
gulp.task('watch', function() {
  console.log('Ensure that bower installed.');
  gulp.watch(config.less.watch,   ['less']);
  gulp.watch(config.concat.watch, ['concat']);
  gulp.watch(config.images.watch, ['images']);
  gulp.watch(config.jade.watch,   ['jade']);
  gulp.watch(config.copy.watch,   ['copy']);
  return true;
});