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

		/////////////
		// OPEN COMPONENT SETTINGS
		////////////
		$('#aesop-component--settings__trigger').live('click',function(){

			// add a body class
			$('body').toggleClass('aesop-sidebar-open');

			// get the component type
			var type = $(this).closest('.aesop-component').attr('data-component-type'),
				unique = $(this).closest('.aesop-component').attr('data-unique');

			// set the height on settings div
			settingsHeight();

			// add the options to the settings div
			$('#aesop-editor--component__settings').html( aesop_editor.component_options[type] );

			// fade in save controls
			$('.aesop-buttoninsert-wrap').fadeIn(600);

			// add the type as a value in ahidden field in settings
			$('#aesop--component-settings-form .component_type').val( type );

			// and also add the type and unique as data atts to the form field
			$('#aesop--component-settings-form').attr({
				'data-type': type,
				'data-unique': unique
			}).addClass(type);

			// add the unique as a value
			$('#aesop--component-settings-form input[name="unique"]').val( unique );

			// initialize scrolbar
			$('#aesop-editor--component__settings').perfectScrollbar('destroy');
			$('#aesop-editor--component__settings').perfectScrollbar();

			/////////////
			//	UPDATE COMPONENT SETTINGS DATA ATTS
			// 	- this is run when the user saves teh component which then let's us use these to map back to the original shortcode on post save
			/////////////

			$('#aesop--component-settings-form.'+type+'[data-unique="'+unique+'"] .aesop-generator-attr').each(function(){

				var $this = 	$(this),
					optionName = $(this).closest('.aesop-option').data('option');

				if ( '' !== $this.val() ) {
					$('#aesop-'+type+'-component-'+unique+' ').attr('data-'+optionName+'', $this.val() );
				}

			});


			/////////////
			// LIVE EDITING OF COMPONENTS
			// @todo - due to the way shortcodes options are handled this is all manual for now and not dynamic
			// @todo - this is hella dirty and needs to be cleaned up
			////////////

			// - quote component -
			$('#aesop--component-settings-form.quote[data-unique="'+unique+'"] #aesop-generator-attr-background').live('change',function(){
			  	$('#aesop-quote-component-'+unique+'').css({'background-color': $(this).val()});
			});
			$('#aesop--component-settings-form.quote[data-unique="'+unique+'"] #aesop-generator-attr-text').live('change',function(){
			  	$('#aesop-quote-component-'+unique+'').css({'color': $(this).val()});
			});
			$('#aesop--component-settings-form.quote[data-unique="'+unique+'"] #aesop-generator-attr-quote').on('keyup',function(){
			  	$('#aesop-quote-component-'+unique+' blockquote span').text( $(this).val() );
			});
			$('#aesop--component-settings-form.quote[data-unique="'+unique+'"] #aesop-generator-attr-cite').on('keyup',function(){
			  	$('#aesop-quote-component-'+unique+' blockquote cite').text( $(this).val() );
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
			,	gall_id 	= $('#aesop--component-settings-form.gallery').data('unique')

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

	/////////////
	// FILE UPLOAD
	////////////
	var file_frame;
	var className;

	$(document).on('click', '#aesop-upload-img', function( e ){

	    e.preventDefault();

	    className = e.currentTarget.parentElement.className;

	    var unique = $(this).closest('form').data('unique'),	
	    	type   = $(this).closest('form').data('type');

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
			// LIVE EDITING OF COMPONENTS
			// @todo - this was going to be taken care of in above but it seems we have to bind this to the file upload here?
			////////////
	      	if ( 'parallax' == type ) {

			  	$('#aesop-parallax-component-'+unique+' .aesop-parallax-sc-img').css({
			  		'background-image': 'url('+ attachment.url +')'
			  	});
	      	} else if ( 'quote' == type ) {

			  	$('#aesop-quote-component-'+unique+' ').css({
			  		'background-image': 'url('+ attachment.url +')'
			  	});

	      	}
			/////////////
			// END LIVE EDITING OF COMPONENTS
			////////////

	    });

	    // Finally, open the modal
	    file_frame.open();
	});

})( jQuery );