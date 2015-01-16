'use strict';
module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({

        // watch our project for changes
        watch: {
        	concat: {
        		files: ['public/assets/js/source/*'],
        		tasks:['concat:dist']
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
   		concat: {
            dist: {
                src: [
                        'public/assets/js/source/util--undo.js',
                        'public/assets/js/source/util--rangy-core.js',
                        'public/assets/js/source/util--rangy-classapplier.js',
                        'public/assets/js/source/util--content-editable.js',
                        'public/assets/js/source/util--scrollbar.js',
                        'public/assets/js/source/util--sweet-alert.js',
                        'public/assets/js/source/util--geo-complete.js',
                        'public/assets/js/source/enter-editor.js',
                        'public/assets/js/source/post-settings.js',
                        'public/assets/js/source/settings-panel.js',
                        'public/assets/js/source/toolbar.js',
                        'public/assets/js/source/process-save.js',
                        'public/assets/js/source/process-gallery.js',
                        'public/assets/js/source/process-map.js',
                        'public/assets/js/source/process-image-upload.js',
                        'public/assets/js/source/process-save-component.js',
                        'public/assets/js/source/process-new-post.js',
                        'public/assets/js/source/process-save-title.js',
                        'public/assets/js/source/process-wpimg.js'
                    ],
                dest: 'public/assets/js/aesop-editor.js'
            }
        },
    });

    // register task
    grunt.registerTask('default', ['watch']);

};