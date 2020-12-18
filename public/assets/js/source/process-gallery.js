(function( $ ) {
	'use strict';

	/////////////
	// NEW GALLERY CREATE
	////////////
	//$('#lasso--gallery__create').live('click',function(e){
	jQuery(document).on('click','#lasso--gallery__create',function(e){

		e.preventDefault();

		$(this).closest('form').addClass('creating-gallery');

		$('.ase-gallery-opts--create-gallery2').fadeIn();
		$('.ase-gallery-opts--edit-gallery').fadeOut(1);

		$('#ase-gallery-images li').remove();
		$('#lasso--gallery__create').remove();

		$('.ase-gallery-opts--edit-gallery').text(lasso_editor.strings.addNewGallery);
		$('.ase-gallery-opts--edit-gallery .lasso-option-desc').text('Select new images to create a gallery with.');


	});

	/////////////
	// NEW GALLERY UPLOAD
	////////////

	var file_frame;
	var	gallery = $('#ase-gallery-images');

	//$(document).on('click', '#lasso--gallery__selectImages', function( e ){
	jQuery(document).on('click','#lasso--gallery__selectImages',function( e ){

	    e.preventDefault();

	    // If the media frame already exists, reopen it.
	    if ( file_frame ) {
	      	file_frame.open();
	      	return;
	    }

	    // Create the media frame.
	    file_frame = wp.media.frames.file_frame = wp.media({
	      	title: lasso_editor.strings.chooseImages,
	      	button: {
	        	text: lasso_editor.strings.addImages,
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
	      	$('.has-galleries > #lasso--gallery__save').fadeIn();

	      	// remove the select images button
	      	$('#lasso--gallery__selectImages').remove();

	    });

	    // Finally, open the modal
	    file_frame.open();
	});

	//////////
	// NEW GALLERY SWAP
	//////////
	//$('.lasso-gallery-id #aesop-generator-attr-id').live('change',function(){
	jQuery(document).on('change','.aesop-gallery-id #aesop-generator-attr-id',function(){

		editus_gallery_swap($(this).val());
		
		var data2      = {
			action:    	'process_gallery_get-images',
			post_id:   	$(this).val(),
			nonce: 		lasso_editor.getGallImgNonce
		};

		// post ajax response with data
		$.post( lasso_editor.ajaxurl, data2, function(response) {
			$('#lasso--gallery__images').html( response.data.html );

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
                window.component.find('#lasso-component--settings__trigger').trigger('click');
			});
		}).fail(function(xhr, err) { 
			var responseTitle= $(xhr.responseText).filter('title').get(0);
			alert($(responseTitle).text() + "\n" + EditusFormatAJAXErrorMessage(xhr, err) );
		});
	});
	
	function editus_gallery_swap(galleryID){
		var data      = {
			componentType: 'gallery',
			id:   	galleryID
		};
		window.get_aesop_component_ajax(data);
	}

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
		gallery = $('#lasso--gallery__images #ase-gallery-images');
		if (gallery.length) {
		   var imageArray = gallery.sortable('toArray');
	  	   $('#ase_gallery_ids').val( imageArray );
		}
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
			title: lasso_editor.strings.selectGallery,
			multiple: true,
			library: {
			    type: 'image'
			},
			button: {
			    text: lasso_editor.strings.useSelectedImages
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

            wp.revisions

			wp.media.frames.ase_edit_frame = wp.media({
				title: lasso_editor.strings.editImage,
				multiple: false,
				library: {
				  	type: 'image'
				},
				button: {
				  	text: lasso_editor.strings.updateSelectedImg
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
