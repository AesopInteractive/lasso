(function( $ ) {
	'use strict';

	$( '#aesop-editor--featImgSave' ).live('click', function(e) {

		e.preventDefault();

		var $this = $(this);

		var data = {
			action: 'process_featimg_upload',
			postid: aesop_editor.postid,
			image:  $this.data('featimg-background'),
			nonce: 	aesop_editor.featImgNonce
		}

		console.log($this.data('featimg-background'));

		$.post( aesop_editor.ajaxurl, data, function(response) {

			if ( 'success' == response ) {
				console.log(response);
			}

			console.log(response);

		});

	});

	/////////////
	// FILE UPLOAD
	////////////
	var file_frame;
	var className;

	$(document).on('click', '#aesop-editor--featImgUpload', function( e ){

	    e.preventDefault();

	    className = e.currentTarget.parentElement.className;

	    // If the media frame already exists, reopen it.
	    if ( file_frame ) {
	      	file_frame.open();
	      	return;
	    }

	    // Create the media frame.
	    file_frame = wp.media.frames.file_frame = wp.media({
	      	title: $( this ).data( 'uploader_title' ),
	      	button: {
	        	text: $( this ).data( 'uploader_button_text' ),
	      	},
	      	multiple: false  // Set to true to allow multiple files to be selected
	    });

	    // When an image is selected, run a callback.
	    file_frame.on( 'select', function() {

	      	var attachment = file_frame.state().get('selection').first().toJSON();

	      	$('#aesop-editor--featImgSave').attr('data-featimg-background',attachment.url);

	      	$(aesop_editor.featImgClass).css({
	      		'background-image': 'url('+attachment.url+')'
	      	});

	    });

	    // Finally, open the modal
	    file_frame.open();
	});
})( jQuery );