(function( $ ) {
	'use strict';

	$(document).ready(function(){

		var destroyModal = function(){
			$('body').removeClass('aesop-modal-open');
			$('#aesop-editor--modal, #aesop-editor--modal__overlay').remove();
		}

		// modal click
		$('#aesop-toolbar--modal').live('click',function(){

			// add a body class
			$('body').toggleClass('aesop-modal-open');

			// append teh modal markup ( aesop_editor_component_modal() )
			$('body').append(aesop_editor.component_modal);

		});

		$('#aesop-editor--modal__close, #aesop-editor--modal__overlay').live('click',function(){
			destroyModal();
		});

	});

})( jQuery );