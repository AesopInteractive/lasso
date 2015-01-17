(function( $ ) {
	'use strict';

	$(document).ready(function(){

		// helper to dstry the sidebar
		var destroySidebar = function(){
			$('body').removeClass('aesop-sidebar-open');
		}

		// helper to set the height of the settings panel
		var settingsHeight = function(){

			var settings = $('#aesop-editor--component__settings');

			settings.height( $(window).height() );

			$(window).resize(function(){
				settings.height( $(window).height() );
				//$('#aesop-editor--component__settings').perfectScrollbar('update');
			});
		}

		var component, data;

		/////////////
		// OPEN COMPONENT SETTINGS
		////////////
		$('#aesop-component--settings__trigger').live('click',function(){

			var settings 	= $('#aesop-editor--component__settings')

			// let's set our globals
			component = $(this).closest('.aesop-component');

			// let's force globalize this until we refactor the js
			window.component = component;

			data = component.data();

			// add a body class
			$('body').toggleClass('aesop-sidebar-open');

			settings.find('input[name="unique"]').val( data['unique'] );

			// set up settings panel
			settingsHeight();
			settings.html( aesop_editor.component_options[data.componentType] );

			// add the type as a value in a hidden field in settings
			settings.find('.component_type').val( data.componentType );

			// fade in save controls
			$('.aesop-buttoninsert-wrap').fadeIn(600);

			// initialize scrolbar
			settings.perfectScrollbar('destroy');
			settings.perfectScrollbar();

			// map the settings from the data attributes on components into appropriate settings in settings panel
			settings.find('.aesop-option').each(function(){

				var option = $(this).data('option');
				var field = $(this).find('.aesop-generator-attr');

				$( field[0] ).val(data[option]);

			});

			/////////////
			// START LIVE EDITING COMPONENTS
			// @todo - this is hella dirty and needs to be cleaned up
			////////////

			// quote component
			settings.find('#aesop-generator-attr-background').live('change',function(){
			  	component.css({'background-color': $(this).val()});
			});
			settings.find('#aesop-generator-attr-text').live('change',function(){
			  	component.css({'color': $(this).val()});
			});
			settings.find('#aesop-generator-attr-quote').on('keyup',function(){
			  	component.find('blockquote span').text( $(this).val() );
			});
			settings.find('#aesop-generator-attr-cite').on('keyup',function(){
			  	component.find('blockquote cite').text( $(this).val() );
			});

			// parallax
			settings.find('.aesop-parallax-caption > #aesop-generator-attr-caption').on('keyup',function(){
				component.find('.aesop-parallax-sc-caption-wrap').text( $(this).val() );
			})

			// image
			settings.find('.aesop-image-caption > #aesop-generator-attr-caption').on('keyup',function(){
				component.find('.aesop-image-component-caption').text( $(this).val() );
			})
			// live image size
			settings.find('.aesop-option.aesop-image-imgwidth > #aesop-generator-attr-imgwidth').on('keyup',function(){
				component.find('.aesop-image-component-image').css('width', $(this).val() );
			})

			// character
			settings.find('.aesop-character-name > #aesop-generator-attr-name').on('keyup',function(){
				component.find('.aesop-character-title').text( $(this).val() );
			})
			settings.find('.aesop-character-caption > #aesop-generator-attr-caption').on('keyup',function(){
				component.find('.aesop-character-cap').text( $(this).val() );
			})

			// chapter
			settings.find('.aesop-option.aesop-chapter-title > #aesop-generator-attr-title').on('keyup',function(){
				component.find('.aesop-cover-title span').text( $(this).val() );
			})
			settings.find('.aesop-option.aesop-chapter-subtitle > #aesop-generator-attr-subtitle').on('keyup',function(){
				component.find('.aesop-cover-title small').text( $(this).val() );
			})

			/////////////
			// END LIVE EDITING OF COMPONENTS
			////////////


			/////////////
			// FILE UPLOAD
			////////////
			var file_frame;
			var className;

			$(document).on('click', '#aesop-upload-img', function( e ){

			    e.preventDefault();

			    className = e.currentTarget.parentElement.className;

			    var unique = $(this).closest('form').data('unique'),	
			    	type   = $('input[name="component_type"]').val()

			    // If the media frame already exists, reopen it.
			    if ( file_frame ) {
			      	file_frame.open();
			      	return;
			    }

			    // Create the media frame.
			    file_frame = wp.media.frames.file_frame = wp.media({
			      	title: 'Select Image',
			      	button: {
			        	text: 'Insert Image',
			      	},
			      	multiple: false  // Set to true to allow multiple files to be selected
			    });

			    // When an image is selected, run a callback.
			    file_frame.on( 'select', function() {

			      	var attachment = file_frame.state().get('selection').first().toJSON();

			      	$('.aesop-generator-attr-media_upload').attr('value',attachment.url);

					/////////////
					// START LIVE IMAGE EDITING COMPONENTS
					// @todo - this was going to be taken care of in above but it seems we have to bind this to the file upload here?
					////////////
			      	if ( 'parallax' == type ) {

					  	component.find('.aesop-parallax-sc-img').attr('src', attachment.url )

			      	} else if ( 'quote' == type ) {

					  	component.css({
					  		'background-image': 'url('+ attachment.url +')'
					  	});

			      	} else if ( 'image' == type ) {

					  	component.find('.aesop-image-component-image > img').attr('src', attachment.url)

			      	} else if ( 'character' == type ) {

					  	component.find('.aesop-character-avatar').attr('src', attachment.url)

			      	} else if ( 'chapter' == type ) {

			      		component.find('.aesop-article-chapter').css({
					  		'background-image': 'url('+ attachment.url +')'
					  	});

			      	}
					/////////////
					// EDN LIVE IMAGE EDITING COMPONENTS
					////////////

			    });

			    // Finally, open the modal
			    file_frame.open();
			});
			/////////////
			// END LIVE EDITING OF COMPONENTS
			////////////

			/////////////
			// GET GALLERY IMAGES
			/////////////
			var $this 		= $(this)
			,	ajaxurl 	= aesop_editor.ajaxurl
			,	form 		= $('#aesop--component-settings-form.gallery')
			,	nonce 		= aesop_editor.getGallImgNonce
			,	gall_id 	= data['unique']

			var data      = {
				action:    	'process_get_images',
				post_id:   	gall_id,
				nonce: 		nonce
			};

			// post ajax response with data
			$.post( ajaxurl, data, function(response) {

				$('#aesop-editor--gallery__images').html( response )

				/////////////
				// CALL SORTABLE ON RECIEVED IMAGES
				/////////////
				var	gallery = $('#ase-gallery-images');

				gallery.ready(function(){

					gallery.sortable({
						containment: 'parent',
						cursor: 'move',
						opacity: 0.8,
						placeholder: 'ase-gallery-drop-zone',
						forcePlaceholderSize:true,
						update: function(){
							var imageArray = $(this).sortable('toArray');
					  		$('#ase_gallery_ids').val( imageArray );
						}
					});
				});
			});

		});

		// destroy panel if clicking close or overlay
		$('#aesop-editor--sidebar__close').live('click',function(e){
			e.preventDefault();
			destroySidebar();
			$('#aesop-editor--component__settings').perfectScrollbar('destroy');
		});

		
});

})( jQuery );