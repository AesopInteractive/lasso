(function( $ ) {
	'use strict';

	$( '#aesop--component-settings-form' ).live('submit', function(e) {

		e.preventDefault();

		var $this = $(this),
			values = $(this).find('.aesop-generator-attr').serialize();

		// set values as serialized array
		$('#aesop-generator-result').val( values );

		var data = {
			postid: $('#aesop-generator-postid').val(),
			fields: $('#aesop-generator-result').val(),
			action: 'process_update_component',
			nonce: $('#aesop-generator-nonce').val()
		}

		$.post( aesop_editor.ajaxurl, data, function(response) {

			console.log(response);

			if( response == 'success' ) {

				alert('success');

			} else if( 'error' == response ) {

				alert('error');

			}


		});

	});

})( jQuery );