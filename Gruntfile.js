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

    copy: {
      main: {
        expand: true,
        cwd: PATH_ASSETS,
        src: '**',
        dest: PATH_DEPLOY_ASSETS
      }
    },

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

    concat: {
      css: {
        src: [PATH_ASSETS_CSS + '/*.css'],
        dest: PATH_DEPLOY_ASSETS +
          '/css/<%= pkg.name %>-<%= pkg.version %>.concat.css'
      },
      js: {
        src: [PATH_ASSETS_JS + '/*.js'],
        dest: PATH_DEPLOY_ASSETS +
          '/js/<%= pkg.name %>-<%= pkg.version %>.concat.js'
      }
    },

    imageEmbed: {
      dist: {
        src: [ PATH_DEPLOY_ASSETS +
          '/css/<%= pkg.name %>-<%= pkg.version %>.concat.css' ],
        dest: PATH_DEPLOY_ASSETS +
          '/css/<%= pkg.name %>-<%= pkg.version %>.concat.embed.css',
        options: {
          deleteAfterEncoding : false,
          maxImageSize: 0
        }
      }
    },

    cssmin: {
      my_target: {
        src: PATH_DEPLOY_ASSETS +
          '/css/<%= pkg.name %>-<%= pkg.version %>.concat.embed.css',
        dest: PATH_DEPLOY_ASSETS +
          '/css/<%= pkg.name %>.min-<%= pkg.version %>.css'
      }
    },

    csslint: {
      lax: {
        rules: {
          'box-sizing': false,
          'adjoining-classes': false
        },
        src: [PATH_ASSETS_CSS + '/*.css']
      }
    },

    imagemin: {
      dynamic: {
        files: [{
          optimizationLevel: 7,
          expand: true,
          cwd: PATH_ASSETS_IMG,
          src: ['**/*.{png,jpg,gif}'],
          dest: PATH_ASSETS_IMG
        }]
      }
    },
    divshot: {
      server: {
        options: {
          keepAlive: true,
          port: 3474,
          hostname: 'localhost',
          root: './public',
          clean_urls: false,
          routes: {
            '**': 'index.html'
          },
          cache_control: {}
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-css');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-divshot');
  grunt.loadNpmTasks('grunt-image-embed');

  grunt.registerTask('default', 'build:dev');

  grunt.registerTask('build:prod', ['clean', 'bower', 'jshint:all', 'csslint:lax', 'copy', 'concat',
    'imageEmbed', 'cssmin', 'imagemin']);

  grunt.registerTask('build:dev', ['clean', 'bower', 'jshint:all', 'csslint:lax', 'copy',
    'concat', 'imageEmbed', 'cssmin','imagemin']);
};
