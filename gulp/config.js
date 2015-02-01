// path config
var dist = './_build';
var distJs = dist + '/js';
var distCss = dist + '/css';
var templates = './templates';
var src = './src';
var srcJs = src + '/js';
var bowerPath = './bower_components';
var release = './static';
var releaseTemp = './_static';

// url config
var staticRoot = '/static';

// global variable
var packageJson = 'package.json';
var revallJson = 'manifest.json';
var pkgInfo =  require('../'+packageJson);
var hashMap = {};
try {
  hashMap = require('../'+release+'/'+revallJson);
} catch (e) {}

// module export
module.exports = {
  browserSync: {
    port: 3000
  },
  clean: {
    src: [dist, templates, release, releaseTemp]
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
        hashMap: hashMap,
        makeHash: function(file) {
          return staticRoot + file;
        },
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
