jQuery(document).ready(function($){

	var ajaxurl =  aesop_editor.ajaxurl,
		save    =  $('#aesop-editor--save'),
		editor 	=  aesop_editor.editor;

	$(save).live('click',function(e) {
		e.preventDefault();

		// sore reference to this
		var $this = $(this);

		// get the html from our div
		var html = $('#'+editor).html();

		// remove controls

	    $('.aesop-component--controls').remove();

		// let user know someting is happening on click
		$(this).addClass('being-saved');

		var data      = {
			action:    'process_save_content',
			author:  	aesop_editor.author,
			content: 	html,
			post_id:   	$this.data('post-id'),
			nonce:     	aesop_editor.nonce
		};

		// post ajax response with data
		$.post( ajaxurl, data, function(response) {

			if ( 'success' == response ) {
				console.log(response);
				$(save).removeClass('being-saved').addClass('aesop-editor--saved');
			} else {
				console.log(response);
				$(save).removeClass('being-saved').addClass('aesop-editor--error');
			}

		});

	});
});