'use strict';
module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({

        // watch our project for changes
        watch: {
        	uglify: {
        		tasks:['publicscripts']
        	},
            less: {
				files: ['public/assets/less/**/*','admin/assets/less/**/*'],
                tasks: ['less:coreLess']
            },
            livereload: {
                options: { livereload: true },
                files: ['public/assets/**/*', '**/*.html', '**/*.php', 'public/assets/img/**/*.{png,jpg,jpeg,gif,webp,svg}']
            }
        },
        less: {
		  	coreLess: {
		  		options: {
		      		paths: ['public/assets/less/*'],
		      		cleancss:true
		    	},
		    	files: {
		      		'public/assets/css/aesop-editor.css': 'public/assets/less/style.less'
		    	}
		  	}
        },
   		uglify: {
            publicscripts: {
               	files: {
                    'public/assets/js/aesop-editor.js': [
                    	'public/assets/js/undo.js',
                    	'public/assets/js/rangy-core.js',
                    	'public/assets/js/rangy-classapplier.js',
                    	'public/assets/js/content-editable.js',
                     	'public/assets/js/enter-editor.js',
                     	'public/assets/js/process-save.js'
                    ]
                }
            }
        },
    });

    // register task
    grunt.registerTask('default', ['watch']);

};