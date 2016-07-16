(function( $ ) {
	'use strict';

	//$( '#lasso--featImgSave a' ).live('click', function(e) {
	jQuery(document).on('click', '#lasso--featImgSave a', function(e){
		e.preventDefault();

		var $this 		= $(this)
		,	saveStatus = $('#lasso--save-status')

		var data = {
			action: 'process_upload-image_upload',
			postid: lasso_editor.postid,
			image_id: $this.data('featimg-id'),
			nonce: 	lasso_editor.featImgNonce
		}

		saveStatus.removeClass('not-visible').addClass('visible lasso--animate__spin');

		$.post( lasso_editor.ajaxurl, data, function(response) {

			if ( response ) {
				console.log('response')
				$('#lasso--featImgSave').css('opacity',0);

				saveStatus.removeClass('lasso--animate__spin lasso-icon-spinner6').addClass('lasso-icon-check');

				setTimeout(function(){
					saveStatus.removeClass('lasso--animate__spin lasso-icon-check').addClass('lasso-icon-spinner6 not-visible')
				},500);
			}

		}).fail(function(xhr, err) { 
			var responseTitle= $(xhr.responseText).filter('title').get(0);
			alert($(responseTitle).text() + "\n" + EditusFormatAJAXErrorMessage(xhr, err) );
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

	  	var save  = $('#lasso--featImgSave a')

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

	      	$(lasso_editor.featImgClass).css({
	      		'background-image': 'url('+attachment.url+')'
	      	});

	      	save.attr('data-featimg-id',attachment.id).trigger('click');

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
			title: lasso_editor.strings.removeFeatImg,
			type: "warning",
			text: false,
			showCancelButton: true,
			confirmButtonColor: "#d9534f",
			confirmButtonText: lasso_editor.strings.deleteYes,
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

	////////////
	// FEAT IMAGE FROM SETTINGS - @since 0.9.4
	////////////
	var featimg_frame;
	$(document).on('click', '#lasso--post-thumb__add', function( e ){

	    e.preventDefault();

	    var $this = $(this)
	    ,	save  = $('#lasso--featImgSave a')

	    // If the media frame already exists, reopen it.
	    if ( featimg_frame ) {
	      	featimg_frame.open();
	      	return;
	    }

	    // Create the media frame.
	    featimg_frame = wp.media.frames.featimg_frame = wp.media({
	      	title: lasso_editor.strings.chooseImage,
	      	button: {
	        	text: lasso_editor.strings.updateImage,
	      	},
	      	multiple: false  // Set to true to allow multiple files to be selected
	    });

	    // When an image is selected, run a callback.
	    featimg_frame.on( 'select', function() {
	      	var attachment = featimg_frame.state().get('selection').first().toJSON();
			
			var pic = $this.closest('.lasso--post-thumb').find('img');
			pic.attr('src', attachment.url );
			
	      	save.attr('data-featimg-id',attachment.id).trigger('click');
	      	$('#lasso--postsettings__form').removeClass('no-thumbnail').addClass('has-thumbnail');
			pic.removeAttr("srcset");
			noWarningReload = true;
	    });

	    // Finally, open the modal
	    featimg_frame.open();


	}).on('click', '#lasso--post-thumb__delete', function( e ){

		e.preventDefault();

		var $this = $(this);

		var data = {
			action: 'process_upload-image_delete',
			postid: lasso_editor.postid,
			nonce: 	lasso_editor.featImgNonce
		}

		swal({
			title: lasso_editor.strings.removeFeatImg,
			type: "warning",
			text: false,
			showCancelButton: true,
			confirmButtonColor: "#d9534f",
			confirmButtonText: lasso_editor.strings.deleteYes,
			closeOnConfirm: true
		},
		function(){

			$.post( lasso_editor.ajaxurl, data, function(response) {

				if ( true == response.success ) {
					var defaultImg = $this.closest('.lasso--post-thumb').data('default-thumb');
			      	$this.closest('.lasso--postsettings__left').find('img').attr('src', defaultImg );
					$this.closest('.lasso--postsettings__left').find('img').removeAttr("srcset");

			      	$('#lasso--postsettings__form').removeClass('has-thumbnail').addClass('no-thumbnail')
					noWarningReload = true;

				}

			});

		});

	});

})( jQuery );
