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
			var type = $(this).closest('.aesop-component').attr('data-component-type'),
				unique = $(this).closest('.aesop-component').attr('data-unique');

			// add the options to the settings div
			$('#aesop-editor--component__settings').html( aesop_editor.component_options[type] );

			// add the type as a value in ahidden field in settings
			$('#aesop--component-settings-form .component_type').val( type );

			$('#aesop--component-settings-form input[name="unique"]').val( unique );

		});

		// destroy modal if clicking close or overlay
		$('#aesop-editor--sidebar__close').live('click',function(){
			destroySidebar();
		});
	});

})( jQuery );