(function( $ ) {

	$(document).on('submit', '.lasso--post-form', function(e) {

		e.preventDefault();

		var $this = $(this);

		$(this).find('input[type="submit"]').val(lasso_editor.strings.saving);

		var data = $this.serialize();

		$.post( lasso_editor.ajaxurl, data, function(response) {

			console.log(response)

			if( true == response.success ) {

				console.log(response)

			}

		});

	});


})( jQuery );
