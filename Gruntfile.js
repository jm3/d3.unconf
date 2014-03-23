var _      = require('lodash');
var config = require('./build-options');

config.paths = {
    src  : './source'
  , dist : './build'
  , srv  : './.tmp-serve'
  , tmp  : './.tmp-build'
};

module.exports = function (grunt) {
    'use strict';

    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        // web server config
        connect: {
            options: {
                port: 4567
              , hostname: '0.0.0.0'
            }
          , development: {
              options: {
                  middleware: function (connect) {
                      return [
                          require('connect-livereload')()
                        , connect.static(require('path').resolve(config.paths.srv))
                        , connect.static(require('path').resolve(config.paths.src))
                      ];
                  }
              }
          }
          , test: {
              options: {
                  middleware: function (connect) {
                      return [
                          connect.static(require('path').resolve(config.paths.dist))
                        , connect.static(require('path').resolve('test'))
                      ];
                  }
              }
          }
          , build: { // serve the built bundle, mimicks live loading behavior with a real webserver
              options: {
                  middleware: function (connect) {
                      return [
                          connect.static(require('path').resolve(config.paths.dist))
                      ];
                  }
                , keepalive : true
              }
          }
        }

      // aws, s3, and cloudfront do not currently auto-negotiate requests to gzip'd files
      // so uploading the compressed files currently does nothing.
      // , compress : { options : { mode : 'gzip' } , production : { files : [{ expand : true , cwd    : config.paths.dist , src    : ['**/*', '!**/*.{gif,jpg,jpeg,png}'] , dest   : config.paths.dist }] } }

        // deploy to s3
      , aws_s3: {
          options: {
              // make sure to set AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY in your shell
              access      : 'public-read'
            , region      : 'us-east-1'
            , uploadConcurrency : 5
          }

        , canary : {
            options: {
                bucket : config.deploy.buckets.canary
            }
          , files : [{
              expand : true
              , cwd    : config.paths.dist
              , src    : '**/*'
              , dest   : '' // inserting a '/' here causes double slashes in the S3 path, which breaks s3
          }]
        }

        , production_index: {
            options: {
                bucket : config.deploy.buckets.production
              , params : {
                  "CacheControl" : "max-age=60,public" // 1 minute
                , "Expires"      : new Date(Date.now() + 60000).toISOString()
              }
            }
          , src  : config.paths.dist + '/index.html'
          , dest : 'index.html'
        }
        , production: {
            options: {
                bucket : config.deploy.buckets.production
              , headers : {
                  "CacheControl" : "max-age=31536000,public" // 1 year
                , "Expires"      : new Date(Date.now() + 31536000000).toISOString()
              }
            }
          , files : [{
              expand : true
            , cwd    : config.paths.dist
            , src    : [
                '**/*'
              , '!index.html'
              , '!**/*.gz'
            ]
            , dest   : ''
          }]
        }
        , production_index_compressed: {
            options: {
                bucket : config.deploy.buckets.production
              , params : {
                  "CacheControl"    : "max-age=60,public" // 1 minute
                , "Expires"         : new Date(Date.now() + 60000).toISOString()
                , "ContentEncoding" : "gzip"
              }
            }
          , src  : config.paths.dist + '/index.html.gz'
          , dest : 'index.html.gz'
        }
        , production_compressed: {
            options: {
                bucket : config.deploy.buckets.production
              , params : {
                  "CacheControl"    : "max-age=31536000,public" // 1 year
                , "Expires"         : new Date(Date.now() + 31536000000).toISOString()
                , "ContentEncoding" : "gzip"
              }
            }
          , files : [{
              expand : true
            , cwd    : config.paths.dist
            , src    : [
                '**/*.gz'
              , '!index.html.gz'
            ]
            , dest   : ''
          }]
        }
      }

      , watch: {
          options : {
              livereload : true
            , dot : false
          }

        , scripts: {
          files: ['**/*.js'],
        }

        , less: {
            files: [config.paths.src + '/**/*.less']
          , tasks: ['less:watch']
        }

        , jade: {
            files: [config.paths.src + '/**/*.jade']
          , tasks: [
              'jade:watch'
          ]
        }



      }

      , clean: {
          build: {
              files: [{
                  dot: true
                , src: [
                      config.paths.tmp
                    , config.paths.dist
                  ]
              }]
          }
        , watch : config.paths.srv
      }

      , jshint: {
          options: {
              laxcomma : true
          },
          all: [
              config.paths.src + '/javascripts/**/*.js'
          ]
      }

        // Compile .jade -> .html
        // https://gist.github.com/kevva/5201657
      , jade: {
          options: {
              pretty: true
          }
        , watch : {
            options : {
                data : {
                    environment : 'dev'
                }
            }
          , files: [{
                expand: true
              , cwd  : config.paths.src
              , dest : config.paths.srv
              , src  : ['views/**/*.jade','index.jade']
              , ext  : '.html'
            },{
                expand: true
              , cwd  : config.paths.src + '/javascripts/directives/templates'
              , dest : config.paths.srv + '/templates'
              , src  : '**/*.jade'
              , ext  : '.html'
            }]
          }
        , build : {
            options : {
                data : {
                    environment : 'build'
                }
            }
          , files: [{
              expand: true
            , cwd  : config.paths.src
            , dest : config.paths.tmp
            , src  : ['views/**/*.jade','index.jade']
            , ext  : '.html'
          },{
              expand: true
            , cwd  : config.paths.src + '/javascripts/directives/templates'
            , dest : config.paths.tmp + '/templates'
            , src  : '**/*.jade'
            , ext  : '.html'
          }]
        }
      }

      , copy: {
          build:{
              files : [{
                  expand : true
                , cwd    : config.paths.src
                , src    : 'vendor/**/*.css'
                , dest   : config.paths.tmp
              },{
                  expand : true
                , cwd    : config.paths.src
                , src    : 'stylesheets/**/*'
                , dest   : config.paths.tmp
              },{
                  expand : true
                , cwd    : config.paths.src
                , src    : '**/*.{png,jpg,jpeg}'
                , dest   : config.paths.tmp
              },{
                  expand : true
                , dot    : true
                , cwd    : config.paths.src
                , src    : [
                    '.htaccess'
                  , '**/*.{gif,webp,ico,json,woff,ttf,eot,svg,swf}'
                  , '!stylesheets/**/*'
                  , '!vendor/bootstrap/fonts/**/*'
                ]
                , dest : config.paths.dist
              },{ // this copies boostrap fonts to /fonts, where they're expected ('stylesheets/../fonts/*')
                  expand : true
                , cwd    : config.paths.src + '/vendor/bootstrap/fonts'
                , src    : '**/*.{woff,ttf,eot,svg}'
                , dest   : config.paths.dist + '/fonts'
              },{
                  expand : true
                , cwd    : config.paths.tmp
                , src    : '*.html'
                , dest   : config.paths.dist
              }]
          }
      }

        // Compile LESS -> CSS, minify for production
        // https://github.com/gruntjs/grunt-contrib-less
      , less: {
          // compile .less files to .tmp
          options : {
              ieCompat : false
          }
        , watch : {
              files: [{
                  expand : true
                , cwd    : config.paths.src
                , src    : '**/*.less'
                , dest   : config.paths.srv
                , ext    : '.css'
              }]
          }
        , build : {
              files: [{
                  expand : true
                , cwd    : config.paths.src
                , src    : '**/*.less'
                , dest   : config.paths.tmp
                , ext    : '.css'
              }]
        }
      }

        // crunch images into dist
      , imagemin: {
          build: {
              files: [{
                  expand : true
                , cwd    : config.paths.tmp
                , src    : '**/*.{png,jpg,jpeg}'
                , dest   : config.paths.dist
              }]
          }
      }

      , useminPrepare: {
          html: config.paths.tmp + '/index.html'
        , options : {
            dest   : config.paths.dist
          , uglify : 'uglify2'
        }
      }

      , rev: {
          build: {
              options : {
                  length : 32
              }
            , src:[
                config.paths.dist + '/**/*.{png,jpg,jpeg,gif,webp,svg,js,css,woff,ttf,eot,swf}'
              , '!' + config.paths.dist + '/vendor/**/coverflow.swf' // hack - usemin doesn't process js so this keeps coverflow from breaking
              , '!' + config.paths.tmp
            ]
          }
      }

      , usemin: {
          html: config.paths.dist + '/**/*.html'
        , css: config.paths.dist + '/**/*.css'
        , options: {
            dirs: [config.paths.dist]
        }
      },

      uglify: {
        options: {
          report: 'min',
          banner: '/*! packaged <%= grunt.template.today("yyyy-mm-dd") %> */\n'
        }
        , app_js: {
          files: {
            'build/javascripts/app.min.js': 'build/javascripts/app.min.js'
          }
        }
      }

    });

    grunt.registerTask('disable_force',function(){
        grunt.option('force',false);
    });

    grunt.registerTask('enable_force',function(){
        grunt.option('force',true);
    });

    grunt.registerTask('lint', ['jshint']);

    grunt.registerTask('deploy'            , ['deploy:production']);
    grunt.registerTask('deploy:canary'     , [
        'build'
      , 'aws_s3:canary'
    ]);
    grunt.registerTask('deploy:production' , [
        'build:production'
      //, 'compress:production' // see comment on compress task, above
      , 'aws_s3:production_index'
      , 'aws_s3:production'
      , 'aws_s3:production_index_compressed'
      , 'aws_s3:production_compressed'
    ]);

    grunt.registerTask('server', [
        'clean:watch'
      , 'enable_force'
      , 'jade:watch'
      , 'less:watch'
      , 'connect:development'
      , 'watch'
    ]);

    grunt.registerTask('server:build', [
        'connect:build'
    ]);

    grunt.registerTask('test', [
        'test:unit',
        'test:e2e'
    ]);

    grunt.registerTask('test:unit', [
        'connect:test'
    ]);


    grunt.registerTask('test:e2e', [
        'connect:test'
    ]);

    grunt.registerTask('build', [
        'disable_force'
      , 'clean:build'
      , 'jshint'
      , 'jade:build'              // compile jade -> html
      , 'copy:build'              // copy any other build-required resources over
      , 'imagemin'                // minify images into dist
      , 'less:build'              // compile LESS -> CSS
      , 'useminPrepare'           // look for build blocks in HTML and configure css/js concat and min jobs
      , 'concat:build/stylesheets/app.min.css' // concat css into dist (auto-configured by useminPrepare)
      , 'concat:build/javascripts/app.min.js'  // concat js into dist (auto-configured by useminPrepare)
      , 'uglify'                  // explicitly run uglify (after concat) to compress JS; usemin claims to do this, but doesn't
      , 'cssmin'                  // minify concatenated css (auto-configured by useminPrepare)
      , 'rev'                     // revision stamp everything for far-future clientside caching
      , 'usemin'                  // rewrite html to use minified assets
      // , 'compress:production'  // see comment on compress task, above
    ]);

    grunt.registerTask('default', ['server']);

};
