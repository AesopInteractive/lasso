(function( $ ) {
	'use strict';

	$( '#aesop-editor--featImgSave a' ).live('click', function(e) {

		e.preventDefault();

		var $this = $(this);

		var data = {
			action: 'process_featimg_upload',
			postid: aesop_editor.postid,
			image_id: $this.data('featimg-id'),
			nonce: 	aesop_editor.featImgNonce
		}
		$.post( aesop_editor.ajaxurl, data, function(response) {

			if ( 'success' == response ) {
				$('#aesop-editor--featImgSave').css('opacity',0);
			}

		});

	});

	/////////////
	// FILE UPLOAD
	////////////
	var file_frame;
	var className;

	$(document).on('click', '#aesop-editor--featImgUpload > a', function( e ){

	    e.preventDefault();

	    className = e.currentTarget.parentElement.className;

	    // If the media frame already exists, reopen it.
	    if ( file_frame ) {
	      	file_frame.open();
	      	return;
	    }

	    // Create the media frame.
	    file_frame = wp.media.frames.file_frame = wp.media({
	      	title: 'Choose an image',
	      	button: {
	        	text: 'Update Image',
	      	},
	      	multiple: false  // Set to true to allow multiple files to be selected
	    });

	    // When an image is selected, run a callback.
	    file_frame.on( 'select', function() {

	      	var attachment = file_frame.state().get('selection').first().toJSON();

	      	$('#aesop-editor--featImgSave a').attr('data-featimg-id',attachment.id);

	      	$(aesop_editor.featImgClass).css({
	      		'background-image': 'url('+attachment.url+')'
	      	});

	      	$('#aesop-editor--featImgSave a').trigger('click');

	      	$('.no-post-cover-note').fadeOut.remove();

	    });

	    // Finally, open the modal
	    file_frame.open();
	});
})( jQuery );