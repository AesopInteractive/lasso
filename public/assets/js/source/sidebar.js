(function( $ ) {
	'use strict';

	$(document).ready(function(){

		var destroySidebar = function(){
			$('body').removeClass('aesop-sidebar-open');
		}

		$('#aesop-component--settings__trigger').live('click',function(){

			// add a body class
			$('body').toggleClass('aesop-sidebar-open');

		});

		// destroy modal if clicking close or overlay
		$('#aesop-editor--sidebar__close').live('click',function(){
			destroySidebar();
		});
	});

})( jQuery );