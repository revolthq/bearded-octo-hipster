module.exports = function(grunt) {
  'use strict';

  var PATH_ASSETS = 'src';
  var PATH_ASSETS_JS = PATH_ASSETS + '/js';
  var PATH_ASSETS_CSS = PATH_ASSETS + '/css';
  var PATH_ASSETS_IMG = PATH_ASSETS + '/img/';
  var PATH_DEPLOY_ASSETS = 'public';

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
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-bower-task');

  grunt.registerTask('default', 'build:dev');

  grunt.registerTask('build:prod', ['clean', 'bower:install', 'jshint:all', 'csslint:all']);

  grunt.registerTask('build:dev', ['clean', 'bower:install', 'jshint:all', 'csslint:all']);
};
