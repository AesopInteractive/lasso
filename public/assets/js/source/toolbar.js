(function( $ ) {
	'use strict';

	$(document).ready(function(){

		// modal click
		$('#aesop-toolbar--components').live('click',function(){

			$(this).toggleClass('toolbar--drop-up');

		});
	});

})( jQuery );