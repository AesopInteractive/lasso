(function( $ ) {

	// dyanmically center modals vertically based on size of modal
	jQuery(document).ready(function($){

		modalResizer = function(){

			var modal = $('.lasso--modal')
			,   mHeight = modal.height()
			,	wHeight  = $(window).height()

			modal.css({
				'top' : (wHeight - mHeight) / 2
			})

		}

		modalResizer();

		jQuery(window).resize(function(){ modalResizer(); });

	});

})( jQuery );