(function( $ ) {

	// dyanmically center modals vertically based on size of modal
	jQuery(document).ready(function($){

		modalResizer = function(){

			var modal = $('.lasso--modal')
			,   mHeight = modal.height()
			,	wHeight  = $(window).height()
			,	eHeight  = $('.lasso--modal').hasClass('lasso--tour__modal') ? 0 : 30 // this is the height of the submit button that is hidden utnil the user changes a setting

			modal.css({
				'top' : (wHeight - mHeight - eHeight) / 2
			})

		}

		modalResizer();

		jQuery(window).resize(function(){ modalResizer(); });

	});

})( jQuery );