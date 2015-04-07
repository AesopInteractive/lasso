(function( $ ) {
	'use strict';

	$( '#lasso--featImgSave a' ).live('click', function(e) {

		e.preventDefault();

		var $this = $(this);

		var data = {
			action: 'process_image-upload_upload',
			postid: lasso_editor.postid,
			image_id: $this.data('featimg-id'),
			nonce: 	lasso_editor.featImgNonce
		}
		$.post( lasso_editor.ajaxurl, data, function(response) {

			if ( true == response.success ) {
				$('#lasso--featImgSave').css('opacity',0);
			}

		});

	});

	/////////////
	// FILE UPLOAD
	////////////
	var file_frame;
	var className;

	$(document).on('click', '#lasso--featImgUpload > a', function( e ){

	    e.preventDefault();

	    className = e.currentTarget.parentElement.className;

	    // If the media frame already exists, reopen it.
	    if ( file_frame ) {
	      	file_frame.open();
	      	return;
	    }

	    // Create the media frame.
	    file_frame = wp.media.frames.file_frame = wp.media({
	      	title: lasso_editor.strings.chooseImage,
	      	button: {
	        	text: lasso_editor.strings.updateImage,
	      	},
	      	multiple: false  // Set to true to allow multiple files to be selected
	    });

	    // When an image is selected, run a callback.
	    file_frame.on( 'select', function() {

	      	var attachment = file_frame.state().get('selection').first().toJSON();

	      	$('body').addClass('lasso--post-thumb-applied');

	      	$('article').removeClass('no-post-thumbnail').addClass('has-post-thumbnail');

	      	$('#lasso--featImgSave a').attr('data-featimg-id',attachment.id);

	      	$(lasso_editor.featImgClass).css({
	      		'background-image': 'url('+attachment.url+')'
	      	});

	      	$('#lasso--featImgSave a').trigger('click');

	      	$('.no-post-cover-note').remove();

	    });

	    // Finally, open the modal
	    file_frame.open();
	});

	////////////
	// FEAT IMAGE DELETE
	////////////
	$(document).on('click', '#lasso--featImgDelete > a', function( e ){

		e.preventDefault();

		var $this = $(this);

		var data = {
			action: 'process_upload-image_delete',
			postid: lasso_editor.postid,
			nonce: 	lasso_editor.featImgNonce
		}

		swal({
			title: "Delete image?",
			type: "warning",
			text: false,
			showCancelButton: true,
			confirmButtonColor: "#d9534f",
			confirmButtonText: "Yes, delete it!",
			closeOnConfirm: true
		},
		function(){

			$.post( lasso_editor.ajaxurl, data, function(response) {

				if ( true == response.success ) {

					// add a body class so we can do whatever with
					$('body').addClass('lasso--post-thumb-removed');

					$('article').removeClass('has-post-thumbnail').addClass('no-post-thumbnail');

					// add the hidden class to control shell to allow for delete button
					$('#lasso--featImgDelete').addClass('lasso--featImg--controlHidden');
					$this.closest('ul').removeClass('lasso--featImg--has-thumb');

					// remove teh attr src - just a real-time update
			      	$(lasso_editor.featImgClass).css({
			      		'background-image': 'url()'
			      	});


				}

			});

		});



	});


})( jQuery );
