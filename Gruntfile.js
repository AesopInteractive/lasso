'use strict';
module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({

        // watch our project for changes
        watch: {
            css: {
                files: ['public/assets/sass/**/*.scss'],
                tasks: ['compass']
            },
            livereload: {
                options: { livereload: true },
                files: ['public/assets/**/*', '**/*.html', '**/*.php', 'public/assets/img/**/*.{png,jpg,jpeg,gif,webp,svg}']
            }
        },
        compass: {
     		dist: {
                options: {
                    config: 'config.rb',
                    force: true
                }
            }
        }
    });

    // register task
    grunt.registerTask('default', ['watch']);

};