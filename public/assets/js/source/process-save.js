jQuery(document).ready(function($){

	var ajaxurl =  aesop_editor.ajaxurl,
		save    =  $('#aesop-editor--save'),
		editor 	=  aesop_editor.editor;

	$(save).live('click',function(e) {
		e.preventDefault();

		var $this = $(this);

		var html = $(editor).html();

		$(this).addClass('being-saved');

		var data      = {
			action:    'process_save_content',
			author:  	aesop_editor.author,
			content: 	html,
			post_id:   	$this.data('post-id'),
			nonce:     	aesop_editor.nonce
		};

		$.post( ajaxurl, data, function(response) {

			if ( 'success' == response ) {
				console.log(response);
				$(save).removeClass('being-saved').addClass('aesop-editor--saved');
			} else {
				console.log(response);

			}

		});

	});
});