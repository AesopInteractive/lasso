(function( $ ) {
	'use strict';

	$(document).ready(function(){

		var destroySidebar = function(){
			$('body').removeClass('aesop-sidebar-open');
		}

		$('#aesop-component--settings__trigger').live('click',function(){

			// add a body class
			$('body').toggleClass('aesop-sidebar-open');

			// get the component type
			var type = $(this).closest('.aesop-component').attr('data-component-type');

			console.log(aesop_editor.component_options[type]);

			$('#aesop-editor--component__settings').html( aesop_editor.component_options[type] );

		});

		// destroy modal if clicking close or overlay
		$('#aesop-editor--sidebar__close').live('click',function(){
			destroySidebar();
		});
	});

})( jQuery );