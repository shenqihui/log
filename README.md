log
===

This is a project demo build with django and gulp.


How to run this
===
0. install base package
  1. [node](http://nodejs.org/)  
  2. [npm](https://www.npmjs.com/)  
  3. [bower](http://bower.io/)  
  4. python
  5. [django](https://www.djangoproject.com/)  
1. clone this repo
```
git clone git@github.com:shenqihui/log.git
cd log
git checkout master
```
2. migration and start django project
```
python manage.py syncdb
python manage.py makemigrations
python manage.py migrate
./start.py
```
3. run with develop mode  
```
npm install
gulp
```
4. open browser
```
http://your ip address:8888/
``` 
5. once you are finish developing, build production 
```
gulp production
```

------


How to run you own django project with this architecture
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


------


File architecture
===
├── log                   // project path
│   ├── __init__.py
│   ├── settings              // project settings floder
│   │  ├── __init__.py
│   │  └── settings.py        // project settings  
│   ├── urls.py
│   └── wsgi.py  
├── apps                  // all django app to build inside here
│   ├── __init__.py
│   └── search
│       ├── __init__.py
│       ├── admin.py
│       ├── models.py
│       ├── tests.py
│       ├── urls.py
│       └── views.py
├── src                   // building front end static file floder
│   ├── ico                   // ico file floder
│   ├── images                // image file floder
│   ├── js                    // js floder
│   ├── less                  // less floder
│   └── jade                  // page that build jade format
│       ├── components            // jade to be mixin
│       ├── pages                 // page to layout
│       └── partial               // jade to be mixin
│
├── README.md             // README
├── bower.json            // bower config
├── manage.py
├── .bowerrc              // config of bower
├── .gitignore
├── cancat.json           // concat js file config
├── concat_css.json       //concat css file config
├── gulpfile.js           // gulp task file
├── jshintrc.json         // gulp jshint options config file
├── migrations.py  
├── package.json          // config the package to dev or depand
└── start.py              // entrance to start this project


------


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


------


Contribute
===

Release branch is matser branch.  

Develop branch is dev branch.  

If you want more gulp task, just open and issue.  

Also you can just read the source code and due with the task you want and make a pull request. And I will due with it once I catch the notifications. :)  

Just having fun.


------


Todo list
===

- [x] Base gulp build config
  - [x] develop
  - [x] production
- [x] Base gulp task
  - [x] bower  
  - [x] browserSync  
  - [x] clean  
  - [x] clean:p  
  - [x] concat  
  - [x] concat:p  
  - [x] concatCss
  - [x] concatCss:p
  - [x] copy  
  - [x] copy:p  
  - [x] default  
  - [x] images  
  - [x] images:p  
  - [x] jade  
  - [x] jade:p  
  - [x] less  
  - [x] less:p  
  - [x] production  
  - [x] revall:p  
  - [x] watch  


------


Change Log
===
|version|desc|
|-------|----|
|v0.3.0 |django+gulp+product mode done|
|v0.2.0 |django+gulp+develop mode done|

------


