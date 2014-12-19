jQuery(document).ready(function($){

	var ajaxurl =  aesop_editor.ajaxurl,
		editor 	=  aesop_editor.editor;


	$('#aesop-editor--edit').click(function(e){
		e.preventDefault();
	    var $div=$('div'), isEditable=$div.is('.editable');
	    $div.prop('contenteditable',!isEditable).toggleClass('editable')
	});


	$('#aesop-editor--save').live('click',function(e) {
		e.preventDefault();

		var $this = $(this);

		var data      = {
			action:    'process_save_content',
			author:  	aesop_editor.author,
			content: 	$(editor).html(),
			post_id:   	$this.data('post-id'),
			nonce:     	aesop_editor.nonce
		};

		$.post( ajaxurl, data, function(response) {

			if ( 'success' == response )
				alert('success');
			else
				alert('error');

		});

	});
});