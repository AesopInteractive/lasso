jQuery(document).ready(function($){

  	$(aesop_editor.editor).redactor({
        focus: true
    });

	$('#aesop-editor--save').on('click',function(e) {
		//e.preventDefault();

		alert("click");

		/*
		var $this = $(this);

		var data      = {
			action:    'process_save_content',
			user_id:   $this.data('user-id'),
			post_id:   $this.data('post-id'),
			nonce:     aesop_editor.nonce
		};

		$.post( ajaxurl, data, function(response) {

			alert(response);

		});
*/

	});
});