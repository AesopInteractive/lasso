(function( $ ) {

	$(document).ready(function(){

		// helper to dstry the sidebar
		var destroySidebar = function(){
			$('body').removeClass('lasso-sidebar-open');
		}

		// close the sidebar when clicking outside of it
		$('body').on('click', '#'+lasso_editor.editor, function(){

			destroySidebar()
		});

		// helper to set the height of the settings panel
		var settingsHeight = function(){

			var settings = $('#lasso--component__settings');

			settings.height( $(window).height() );

			$(window).resize(function(){
				settings.height( $(window).height() );
				//$('#lasso--component__settings').perfectScrollbar('update');
			});
		}

		var component, data;

		/////////////
		// OPEN COMPONENT SETTINGS
		////////////
		$('#lasso-component--settings__trigger').live('click',function(){

			var settings 	= $('#lasso--component__settings')

			// let's set our globals
			component = $(this).closest('.aesop-component');

			// let's force globalize this until we refactor the js
			window.component = component;

			data = component.data();

			// add a body class
			$('body').toggleClass('lasso-sidebar-open');

			settings.find('input[name="unique"]').val( data['unique'] );

			// set up settings panel
			settingsHeight();
			settings.html( lasso_editor.component_options[data.componentType] );

			// add the type as a value in a hidden field in settings
			settings.find('.component_type').val( data.componentType );

			// fade in save controls
			$('.lasso-buttoninsert-wrap').fadeIn(600);

			// initialize scrolbar
			settings.perfectScrollbar('destroy');
			settings.perfectScrollbar();

			// map the settings from the data attributes on components into appropriate settings in settings panel
			settings.find('.lasso-option').each(function(){

				var option = $(this).data('option');
				var field = $(this).find('.lasso-generator-attr');

				// if it's a gallery data attribute map the cehcekd attribute to the right place
				// @todo - account for map stuff
				if ( 'gallery-type' == option ) {

					$(field).each(function(){

						if ( $(this).val() == data.galleryType ) {

							$(this).parent().addClass('selected')
							$(this).attr('checked',true);

						}

					});

				} else {

					$( field[0] ).val(data[option]);

				}

			});

			/// live editing moved to settings-live-editing.js

			/////////////
			// FILE UPLOAD
			////////////
			var file_frame;
			var className;

			$(document).on('click', '#lasso-upload-img', function( e ){

			    e.preventDefault();

			    className = e.currentTarget.parentElement.className;

			    var type   = $('input[name="component_type"]').val()

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

			      	$('.lasso-generator-attr-media_upload').attr('value',attachment.url);

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
			// GET GALLERY IMAGES
			/////////////
			var $this 		= $(this)
			,	ajaxurl 	= lasso_editor.ajaxurl
			,	form 		= $('#lasso--component-settings-form.gallery')
			,	nonce 		= lasso_editor.getGallImgNonce
			,	gall_id 	= data['id']

			var data      = {
				action:    	'process_get_images',
				post_id:   	gall_id,
				nonce: 		nonce
			};

			// post ajax response with data
			$.post( ajaxurl, data, function(response) {

				$('#lasso--gallery__images').html( response )

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
						},
						create: function(){
							var imageArray = $(this).sortable('toArray');
					  		$('#ase_gallery_ids').val( imageArray );
						}
					});
				});
			});

		});

		// destroy panel if clicking close or overlay
		$('#lasso--sidebar__close').live('click',function(e){
			e.preventDefault();
			destroySidebar();
			$('#lasso--component__settings').perfectScrollbar('destroy');
		});

		
});

})( jQuery );