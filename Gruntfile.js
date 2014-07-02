module.exports = function(grunt) {
  'use strict';

  var PATH_ASSETS = 'src';
  var PATH_ASSETS_JS = PATH_ASSETS + '/js/';
  var PATH_ASSETS_CSS = PATH_ASSETS + '/css';
  var PATH_ASSETS_IMG = PATH_ASSETS + '/img/';
  var PATH_DEPLOY_ASSETS = 'public';
  var PATH_TEMP_ASSETS = 'tmp';

  // ==========================================================================
  // Project configuration
  // ==========================================================================
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: [PATH_DEPLOY_ASSETS, PATH_TEMP_ASSETS],

    bower: {
      install: {
        options: {
           copy: false,
           layout: 'byComponent',
           install: true
         }
      }
    },

    copy: {
      main: {
        expand: true,
        cwd: PATH_ASSETS,
        src: ['*.html', 'img/**', 'fonts/**', 'vendor/modernizr/modernizr.js'],
        dest: PATH_DEPLOY_ASSETS
      }
    },

    // js linting options
    jshint: {
      all: ['Gruntfile.js', PATH_ASSETS_JS + '/**/*.js',
        '!' + PATH_ASSETS_JS + '/vendor/**/*.js',
        '!' + PATH_ASSETS_JS + '/app/templates.js']
    },

    csslint: {
      options: {
        csslintrc: '.csslintrc'
      },
      all: {
        src: [PATH_ASSETS_CSS + '/*.css']
      }
    },

    validation: {
      files: {
          src: ['src/*.html']
      }
    },

    concat: {
      css: {
        src: ['src/vendor/normalize-css/normalize.css',
              'src/vendor/semantic/build/packaged/css/semantic.css',
              PATH_ASSETS_CSS + '/*.css'],
        dest: PATH_TEMP_ASSETS +
          '/css/<%= pkg.name %>-<%= pkg.version %>.css'
      },
      js: {
        src: [PATH_ASSETS_JS + '/*.js'],
        dest: PATH_TEMP_ASSETS +
          '/js/<%= pkg.name %>-<%= pkg.version %>.js'
      }
    },

    cssmin: {
      options: {
        keepSpecialComments: 0
      },
      minify: {
        expand: true,
        cwd: PATH_TEMP_ASSETS + '/css/',
        src: ['<%= pkg.name %>-<%= pkg.version %>.css'],
        dest: PATH_DEPLOY_ASSETS + '/css/',
        ext: '.min.css',
        extDot: 'last'
      }
    },

    uglify: {
      options: {
        mangle: true
      },
      all: {
        files: [{
          expand: true,
          cwd: PATH_TEMP_ASSETS + '/js/',
          src: '**/*.js',
          dest: PATH_DEPLOY_ASSETS + '/js',
          ext: '.min.js',
          extDot: 'last'
        }]
      }
    },

    imagemin: {
      all: {
        files: [{
          optimizationLevel: 7,
          expand: true,
          cwd: PATH_ASSETS_IMG,
          src: ['**/*.{png,jpg,gif}'],
          dest: PATH_ASSETS_IMG
        }]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-html-validation');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', 'build:dev');

  grunt.registerTask('build:prod', ['clean', 'bower:install', 'jshint:all', 'csslint:all', 'validation', 'imagemin:all', 'concat', 'cssmin', 'uglify:all', 'copy']);

  grunt.registerTask('build:dev', ['clean', 'bower:install', 'jshint:all', 'csslint:all', 'imagemin:all', 'concat', 'cssmin', 'uglify:all', 'copy']);
};
