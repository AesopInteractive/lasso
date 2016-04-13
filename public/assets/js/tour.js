(function( $ ) {
						jQuery(document).ready(function($){

							$('body').addClass('lasso-modal-open');

							$('.lasso--loading').remove();
							$('#lasso--tour__slides').hide().fadeIn()

							$('#lasso--tour__slides').unslider({
								dots: true,
								delay:7000
							});

						});
					})( jQuery );