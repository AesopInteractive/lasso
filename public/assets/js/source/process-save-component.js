(function( $ ) {
	'use strict';

	$( '#aesop--component-settings-form' ).live('submit', function(e) {

		e.preventDefault();


		function getValues() {
		    var values = {};
		    $('.aesop-generator-attr').each(function() {
		        values[this.name] = this.value;
		    });
		    return(values);
		}

		// set values as serialized array
		$('#aesop-generator-result').val( getValues() );

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