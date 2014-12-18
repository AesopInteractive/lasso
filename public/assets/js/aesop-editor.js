jQuery(document).ready(function($){

	var ajaxurl =  aesop_editor.ajaxurl,
		form    = $('#aesop-editor--form'),
		editor 	=  aesop_editor.editor;

  	$(editor).redactor({
        focus: true
    });

	$('#aesop-editor--save').on('click',function(e) {
		e.preventDefault();

		var $this = $(this);

		var data      = {
			action:    'process_save_content',
			author:  	aesop_editor.author,
			content: 	$(editor).redactor('code.get'),
			post_id:   	$this.data('post-id'),
			nonce:     	aesop_editor.nonce
		};

		$.post( ajaxurl, data, function(response) {

			if ( response )
				location.reload();

		});

	});
});