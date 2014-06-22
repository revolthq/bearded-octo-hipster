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

    clean: [PATH_DEPLOY_ASSETS],

    bower: {
      install: {
        options: {
           copy: false,
           layout: 'byComponent',
           install: true
         }
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

    concat: {
      css: {
        src: [PATH_ASSETS_CSS + '/*.css'],
        dest: PATH_TEMP_ASSETS +
          '/css/<%= pkg.name %>-<%= pkg.version %>.concat.css'
      },
      js: {
        src: [PATH_ASSETS_JS + '/*.js'],
        dest: PATH_TEMP_ASSETS +
          '/js/<%= pkg.name %>-<%= pkg.version %>.concat.js'
      }
    },

    cssmin: {
      minify: {
        expand: true,
        cwd: PATH_TEMP_ASSETS + '/css/',
        src: ['<%= pkg.name %>-<%= pkg.version %>.concat.css'],
        dest: PATH_DEPLOY_ASSETS + '/css/',
        ext: '.min.css'
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
          ext: '.min.js'
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
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', 'build:dev');

  grunt.registerTask('build:prod', ['clean', 'bower:install', 'jshint:all', 'csslint:all', 'imagemin:all', 'concat', 'cssmin', 'uglify:all']);

  grunt.registerTask('build:dev', ['clean', 'bower:install', 'jshint:all', 'csslint:all', 'imagemin:all', 'concat', 'cssmin', 'uglify:all']);
};
