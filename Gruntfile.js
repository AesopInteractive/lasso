'use strict';
module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({

        // watch our project for changes
        watch: {
        	uglify: {
        		files: ['public/assets/js/source/*'],
        		tasks:['uglify:publicscripts']
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
                    	'public/assets/js/source/undo.js',
                    	'public/assets/js/source/rangy-core.js',
                    	'public/assets/js/source/rangy-classapplier.js',
                    	'public/assets/js/source/content-editable.js',
                     	'public/assets/js/source/enter-editor.js',
                     	'public/assets/js/source/process-save.js'
                    ]
                }
            }
        },
    });

    // register task
    grunt.registerTask('default', ['watch']);

};