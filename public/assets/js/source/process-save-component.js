(function( $ ) {
	'use strict';

	$( '#aesop--component-settings-form' ).live('submit', function(e) {

		e.preventDefault();

		var $this = $(this);

		/* getting all attributes on save
		$('#aesop-generator-settings .aesop-generator-attr').each(function() {
			if ( $(this).val() !== '' ) {
				$('#aesop-generator-result').val( $('#aesop-generator-result').val() + ' ' + $(this).attr('name') + '="' + $(this).val() + '"' );
			}
		});
		*/

		var data = $(this).serialize();

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