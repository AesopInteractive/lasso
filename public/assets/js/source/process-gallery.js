(function( $ ) {
	'use strict';

	var $this 		= $(this)
	,	ajaxurl 	= aesop_editor.ajaxurl
	,	form 		= $('#aesop--component-settings-form.gallery')
	,	gall_id   	= $(form).attr('unique')
	,	nonce 		= aesop_editor.getGallImgNonce

	/////////////
	// GET GALLERY IMAGES
	/////////////
	$(document).on('click', '.aesop-gallery-component #aesop-component--settings__trigger',function(){

		var data      = {
			action:    	'process_get_images',
			post_id:   	gall_id,
			nonce: 		nonce
		};

		// post ajax response with data
		$.post( ajaxurl, data, function(response) {

			if ( 'success' == response ) {

				console.log(response);

			} else {

				// testing
				console.log(response);

			}

		});

	});


	/////////////
	// GALLERY UPLOAD
	////////////
	var file_frame;

	$(document).on('click', '#aesop-editor--gallery__upload', function( e ){

	    e.preventDefault();

	    // If the media frame already exists, reopen it.
	    if ( file_frame ) {
	      	file_frame.open();
	      	return;
	    }

	    // Create the media frame.
	    file_frame = wp.media.frames.file_frame = wp.media({
	      	title: 'Choose images',
	      	button: {
	        	text: 'Add Images',
	      	},
	      	multiple: true  // Set to true to allow multiple files to be selected
	    });

	    // When an image is selected, run a callback.
	    file_frame.on( 'select', function() {

	      	var attachments = file_frame.state().get('selection').toJSON();

	      	console.log(attachments);

	    });

	    // Finally, open the modal
	    file_frame.open();
	});

	///////////
	// SAVE GALLERY
	///////////

})( jQuery );