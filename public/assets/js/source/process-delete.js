jQuery(document).ready(function($){

	var ajaxurl =  aesop_editor.ajaxurl;

	$('.aesop-delete').live('click',function(e) {

		// sore reference to this
		var $this = $(this);

		e.preventDefault();

		var data = {
			action: 'process_delete_component',
			nonce: $this.data('nonce')
		}

		$.post( ajaxurl, data, function(response) {

			console.log(response);

			if( response == 'success' ) {

				console.log('success');

				$(this).parent().parent().remove();

			} else if( 'error' == response ) {

				alert('error');
				console.log('error');

			}


		});


	});
});