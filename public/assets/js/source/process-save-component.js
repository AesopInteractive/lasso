(function( $ ) {
	'use strict';

	$( '#aesop--component-settings-form' ).live('submit', function(e) {

		e.preventDefault();

		var values = $('.aesop-generator-attr').map(function(){
			var $this = $(this);
			return {name: $this.attr('name'), value: $this.val()};
		}).get();

		// set values as serialized array
		$('#aesop-generator-result').val( $.param(values)  );

		var data = {
			action: 'process_update_component',
			postid: $('#aesop-generator-postid').val(),
			fields: $('#aesop-generator-result').val(),
			type: 	$('input[name="component_type"]').val(),
			nonce: 	$('#aesop-generator-nonce').val()
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