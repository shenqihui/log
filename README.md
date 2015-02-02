log
===

This is a project demo build with django and gulp.


How to run this
===

First, clone this repo.  
Second, start a django project. Cd in. Start a django app name apps. Leter then manage all you app here.  
Third, copy `.bowerrc`, `.jshintrc`, `concat.json`, `gulpfile.js`, `src`, build project like this architecture.  
Fourth, setting project settings link  
```python
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
PROJECT_DIR = os.path.dirname(BASE_DIR)

STATIC_URL = '/static/'

STATICFILES_DIRS = (
    os.path.join(PROJECT_DIR, 'static'),
)

TEMPLATE_DIRS = (
    os.path.join(PROJECT_DIR, 'templates'),
)

INSTALLED_APPS = (
    # django app
    'django.contrib.admin',
    #...

    # third app

    # user app
    'project_name',
    'apps',
)
```  
Fifth, if develop, use `gulp default`, if production, use `gulp production`.  
Sixth, never add/commit dist or temp or bower file by using `.gitignore`.  

JSON file explain
===


#### concat.json
This file is to config the js file to be concat.  
Like this
```javascript
{
  "dist": "lib.js",
  "src": [
    "bower_components/jquery/dist/jquery.min.js",
    "bower_components/components-bootstrap/js/bootstrap.min.js"
  ]
}
```
`dist` is the name to concat.   
`src` is the gulp format src file.


#### concat_css.json

Like concat.json , but this is to concat css file. And I don't recommend. You can just build it in a `less` file by using `@import (inline) '*.css'`  


#### jshintrc.json
Config jshint option. [Here](http://jshint.com/docs/options/) is the jshint doc, I think you just need to do is adding the globals and set it into `true`.


Ps
===

Release branch is matser branch.

Develop branch is dev branch.

And now this is in building.

Waiting for it.

:)

Now the difficulties
===

Think about how to build all the task into default or production.

------

Todo list
===

- [ ] Base gulp build config
  - [ ] develop
  - [ ] production
- [ ] Base gulp task
  - [x] browserSync
  - [x] clean
  - [ ] clean:p
  - [x] concat
  - [ ] concat:p
  - [ ] copy
  - [ ] copy:p
  - [ ] default
  - [x] images
  - [ ] images:p
  - [x] jade
  - [ ] jade:p
  - [x] less
  - [ ] less:p
  - [ ] production
  - [x] revall
  - [ ] watch
- [ ] Base gulp task automatic
  - [ ] browserSync
  - [ ] clean
  - [ ] clean:p
  - [ ] concat
  - [ ] concat:p
  - [ ] copy
  - [ ] copy:p
  - [ ] default
  - [ ] images
  - [ ] images:p
  - [ ] jade
  - [ ] jade:p
  - [ ] less
  - [ ] less:p
  - [ ] production
  - [ ] revall
  - [ ] watch

------



Change Log
===
|version|desc|
|-------|----|
|v0.2.0 |django+gulp+develop mode done|

------


