(function( $ ) {

	$(document).ready(function(){

		// method to destroy the modal
		var destroyModal = function(){
			$('body').removeClass('aesop-modal-open');
			$('#aesop-editor--post-settings__modal, #aesop-editor--modal__overlay').remove();
		}

		// modal click
		$('#aesop-editor--post-settings').live('click',function(e){

			e.preventDefault();

			// add a body class
			$('body').toggleClass('aesop-modal-open');

			// append teh modal markup ( aesop_editor_component_modal() )
			$('body').append(aesop_editor.component_modal);

		});

		// destroy modal if clicking close or overlay
		$('#aesop-editor--modal__close, #aesop-editor--modal__overlay').live('click',function(){
			destroyModal();
		});

	});

})( jQuery );