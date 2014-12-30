(function( $ ) {
	'use strict';

	/////////////
	// GET GALLERY IMAGES
	/////////////

	/////////////
	// GALLERY UPLOAD
	////////////
	var file_frame;

	$(document).on('click', '#aesop-editor--gallery-upload', function( e ){

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