(function( $ ) {
	'use strict';

	/////////////
	// GALLERY UPLOAD
	////////////
	/*
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
*/

	///////////
	// SAVE GALLERY
	///////////

})( jQuery );

(function( $ ) {
	'use strict';

	var	gallery = $('#ase-gallery-images');

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

	function ase_insert_gallery_item(id, url){

		var item_html = "<li id='" + id + "' class='ase-gallery-image'><i class='dashicons dashicons-no-alt'></i><i title='Edit Image Caption' class='dashicons dashicons-edit'></i><img src='" + url + "'></li>";
		$('#ase-gallery-images').append( item_html );
		gallery.sortable('refresh');
		ase_encode_gallery_items();
	}

	var ase_media_init = function(selector, button_selector)  {
	    var clicked_button = false;

	    $(selector).each(function (i, input) {
        var button = $(input).children(button_selector);
        button.click(function (event) {
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
	   });
	};

	function ase_edit_gallery_item(id, url, editable){
		var item_html = "<li id='" + id + "' class='ase-gallery-image'><i class='dashicons dashicons-no-alt'></i><i title='Edit Image Caption' class='dashicons dashicons-edit'></i><img src='" + url + "'></li>";
		$(editable).replaceWith( item_html );
		gallery.sortable('refresh');
		ase_encode_gallery_items();
	}

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
				attachment = wp.media.attachment( clicked_button.parent().attr('id') );
				attachment.fetch();
				selection.add( attachment ? [ attachment ] : [] );
			});
			wp.media.frames.ase_edit_frame.open();
	    });

	};

	ase_media_init('#ase-gallery-add-image', 'i');
	ase_media_edit_init();
	ase_encode_gallery_items();

})( jQuery );