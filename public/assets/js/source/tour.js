(function( $ ) {

	$(document).ready(function(){

		destroyModal = function(){
			$('body').removeClass('lasso-modal-open');
			$('#lasso--tour__modal,#lasso--tour__modal ~ #lasso--modal__overlay').remove();
		}

		//$('#lasso--tour__modal input[type="submit"]').live('click', function(e) {
		jQuery(document).on('click', '#lasso--tour__modal input[type="submit"]', function(e){

			e.preventDefault();

			var target = $(this);

			if ( !$('#hide_tour').is(':checked') ) {

				destroyModal()

			} else {

				var data = {
					action: 		'process_tour_hide',
					nonce: 			$(this).data('nonce')
				}

				$.post( lasso_editor.ajaxurl, data, function(response) {

					if ( true == response.success ) {

						destroyModal();

					}

				});
			}

		});

	});

})( jQuery );
