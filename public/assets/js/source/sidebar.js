(function( $ ) {
	'use strict';

	$(document).ready(function(){

		var destroySidebar = function(){
			$('body').removeClass('aesop-sidebar-open');
		}

		var settingsHeight = function(){
			$('#aesop-editor--component__settings').height( $(window).height() );
		}


		settingsHeight();
		$(window).resize(function(){
			settingsHeight();
			$('#aesop-editor--component__settings').perfectScrollbar('update');
		});

		$('#aesop-component--settings__trigger').live('click',function(){

			// add a body class
			$('body').toggleClass('aesop-sidebar-open');

			// get the component type
			var type = $(this).closest('.aesop-component').attr('data-component-type'),
				unique = $(this).closest('.aesop-component').attr('data-unique');


			// add the options to the settings div
			$('#aesop-editor--component__settings').html( aesop_editor.component_options[type] );

			$('#aesop-editor--component__settings').height( $(window).height() );

			// fade in save controls
			$('.aesop-buttoninsert-wrap').fadeIn(800);

			// add the type as a value in ahidden field in settings
			$('#aesop--component-settings-form .component_type').val( type );

			$('#aesop--component-settings-form input[name="unique"]').val( unique );

			$('#aesop-editor--component__settings').perfectScrollbar('destroy');
			$('#aesop-editor--component__settings').perfectScrollbar();
		});

		// destroy modal if clicking close or overlay
		$('#aesop-editor--sidebar__close').live('click',function(){
			destroySidebar();
			$('#aesop-editor--component__settings').perfectScrollbar('destroy');
		});
	});

})( jQuery );