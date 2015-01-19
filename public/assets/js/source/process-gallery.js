(function( $ ) {
	'use strict';

	/////////////
	// NEW GALLERY CREATE
	////////////
	$('#aesop-editor--gallery__create').live('click',function(e){

		e.preventDefault();

		$('#aesop-editor--gallery__upload').fadeIn();

		$('#ase-gallery-add-image, #aesop-editor--gallery__create, #ase-gallery-images li').remove();

		$('#aesop-editor--gallery__edit label').text('Add New Gallery');
		$('#aesop-editor--gallery__edit .aesop-option-desc').text('Select new images to create a gallery with.');

		$('#aesop-editor--gallery__images').css('min-height','1px');

	});

	/////////////
	// NEW GALLERY UPLOAD
	////////////

	var file_frame;
	var	gallery = $('#ase-gallery-images');

	$(document).on('click', '#aesop-editor--gallery__selectImages', function( e ){

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

	      	var attachments = file_frame.state().get('selection');

		    if (!attachments) {
		        return;
		    }

		    // loop through and insert the new items
		    attachments.each( function( attachment ) {
		    	var id = attachment.id;
		    	var url = attachment.attributes.sizes.thumbnail.url;
		    	ase_insert_gallery_item(id, url);
		    });

		    // insert the new ids from new gallery
		    var ids = attachments.map( function( attachment ) {

		    	var attachment = attachment.toJSON();
		    	return attachment.id;

		    }).join(',');

		    // populate gallery input with ids
		    $('#ase_gallery_ids').val( ids );

		    // show the save button
	      	$('.has-galleries > #aesop-editor--gallery__save').fadeIn();

	      	// remove the select images button
	      	$('#aesop-editor--gallery__selectImages').remove();

	    });

	    // Finally, open the modal
	    file_frame.open();
	});

	//////////
	// NEW GALLERY SWAP
	//////////
	$('.aesop-gallery-id #aesop-generator-attr-id').live('change',function(){

		var data = {
			action: 		'process_swap_gallery',
			gallery_id: 	$(this).val(),
			nonce: 			aesop_editor.swapGallNonce
		}

		$.post( aesop_editor.ajaxurl, data, function(response) {

			console.log(response);

			if( response ) {

				$('.aesop-gallery-component').html( response );

			}

		});
	});

	//////////
	// MNEW GALLERY SAVE
	// this likely has to be moved to process-ave-component.js so we has access to cdata and form fields
	///////////
	$(document).on('click','#aesop-editor--gallery__save',function(e){

		// run ajax to save gallery
		e.preventDefault();

		var data = {
			action: 		'process_create_gallery',
			unique: 		$('input[name="unique"]').val(),
			gallery_ids: 	$('#ase_gallery_ids').val(),
			curr_title:     $(this).data('post-title'),
			nonce: 			aesop_editor.createGallNonce
		}

		/////////////
		//	DO TEH SAVE
		/////////////
		$.post( aesop_editor.ajaxurl, data, function(response) {

			console.log(response);

			if( response == 'success' ) {

				console.log(response);

			} else if( 'error' == response ) {

				alert('error');

			}


		});

	});

	///////////
	// EDIT GALLERY
	// the sortsble instat is in settingspanel.js
	///////////

	// deleting gallery items
	$(document).on('click', '.ase-gallery-image > i.dashicons-no-alt', function(){
		$(this).parent().remove();
		gallery.sortable('refresh');
		ase_encode_gallery_items();
	});

	function ase_string_encode(gData){
		return encodeURIComponent(JSON.stringify(gData));
	}

	function ase_string_decode(gData){
		return JSON.parse(decodeURIComponent(gData));
	}

	function ase_encode_gallery_items(){
		var imageArray = gallery.sortable('toArray');
	  	$('#ase_gallery_ids').val( imageArray );
	}

	// inserting gallery items
	function ase_insert_gallery_item(id, url){

		var item_html = "<li id='" + id + "' class='ase-gallery-image'><i class='dashicons dashicons-no-alt'></i><i title='Edit Image Caption' class='dashicons dashicons-edit'></i><img src='" + url + "'></li>";
		$('#ase-gallery-images').append( item_html );
		gallery.sortable('refresh');
		ase_encode_gallery_items();
	}

	// adding additiona images to existing gallery

	var clicked_button = false;

	$(document).on('click', '#ase-gallery-add-image', function (event) {
    	event.preventDefault();
    	var selected_img;
    	clicked_button = $(this);

    	if(wp.media.frames.ase_frame) {
			wp.media.frames.ase_frame.open();
			return;
		}

    	wp.media.frames.ase_frame = wp.media({
			title: 'Select Aesop Gallery Image',
			multiple: true,
			library: {
			    type: 'image'
			},
			button: {
			    text: 'Use Selected Images'
			}
		});

    	var ase_media_set_image = function() {
			var selection = wp.media.frames.ase_frame.state().get('selection');

			if (!selection) {
				return;
			}

			selection.each(function(attachment) {
				var id = attachment.id;
				var url = attachment.attributes.sizes.thumbnail.url;
				ase_insert_gallery_item(id, url);
			});
		};

    	wp.media.frames.ase_frame.on('select', ase_media_set_image);
		wp.media.frames.ase_frame.open();
	});


	// editing a single image
	function ase_edit_gallery_item(id, url, editable){
		var item_html = "<li id='" + id + "' class='ase-gallery-image'><i class='dashicons dashicons-no-alt'></i><i title='Edit Image Caption' class='dashicons dashicons-edit'></i><img src='" + url + "'></li>";
		$(editable).replaceWith( item_html );
		gallery.sortable('refresh');
		ase_encode_gallery_items();
	}

	// edit single image
	var ase_media_edit_init = function()  {

	    var clicked_button;

	    $(document).on('click', '.ase-gallery-image > i.dashicons-edit', function(event){
			event.preventDefault();
			var selected_img;
			clicked_button = $(this);

			if(wp.media.frames.ase_edit_frame) {
				wp.media.frames.ase_edit_frame.open();
				return;
			}

			wp.media.frames.ase_edit_frame = wp.media({
				title: 'Edit Image',
				multiple: false,
				library: {
				  	type: 'image'
				},
				button: {
				  	text: 'Update Selected Image'
				}
			});

			var ase_media_edit_image = function() {
			    var selection = wp.media.frames.ase_edit_frame.state().get('selection');

			    if (!selection) {
		        	return;
			    }

			    // iterate through selected elements
			    selection.each(function(attachment) {
			    	var id = attachment.id;
			    	var url = attachment.attributes.sizes.thumbnail.url;
			    	ase_edit_gallery_item(id, url, clicked_button.parent());
			    });
			};

			// image selection event
			wp.media.frames.ase_edit_frame.on('select', ase_media_edit_image);
			wp.media.frames.ase_edit_frame.on('open',function(){
				 var selection = wp.media.frames.ase_edit_frame.state().get('selection');
				var attachment = wp.media.attachment( clicked_button.parent().attr('id') );
				attachment.fetch();
				selection.add( attachment ? [ attachment ] : [] );
			});
			wp.media.frames.ase_edit_frame.open();
	    });

	};

	//ase_media_init('#ase-gallery-add-image', 'i');
	ase_media_edit_init();
	ase_encode_gallery_items();

})( jQuery );