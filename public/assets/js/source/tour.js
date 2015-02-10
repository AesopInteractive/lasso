(function( $ ) {

	$(document).ready(function(){

		$('#lasso--tour__modal input[type="submit"]').live('click', function(e) {

			e.preventDefault();

			var target = $(this);

			var data = {
				action: 		'process_hide_tour',
				nonce: 			$(this).data('nonce')
			}


			$.post( lasso_editor.ajaxurl, data, function(response) {

				console.log(response)

				if ( true == response.success ) {

					$(this).closest('.lasso--tour__modal').remove()

				}

			});

		});

	});

})( jQuery );