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
		$('#aesop-editor--modal__close, #aesop-editor--modal__overlay, .aesop-editor--postsettings-cancel').live('click',function(e){
			e.preventDefault();
			destroyModal();
		});

		/////////////
		// SAVE SETTINGS
		//////////////
		var form;

		$('#aesop-editor--postsettings__form').live('submit', function(e) {

			e.preventDefault();

			var $this = $(this);

			$(this).find('input[type="submit"]').val('Saving...');

			var data = $this.serialize();

			/////////////
			//	DO TEH SAVE
			/////////////
			$.post( aesop_editor.ajaxurl, data, function(response) {

				console.log(response);

				if( response == 'success' ) {

					$('input[type="submit"]').addClass('saved');
					$('input[type="submit"]').val('Saved!');
					location.reload();

				} else if( 'error' == response ) {

					alert('error');

				}


			});

		});

	});

})( jQuery );