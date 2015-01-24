(function( $ ) {

	$(document).ready(function(){

		// method to destroy the modal
		var destroyModal = function(){
			$('body').removeClass('aesop-modal-open');
			$('.aesop-editor--modal, #aesop-editor--modal__overlay').remove();
		}

		// modal click
		$('#aesop-editor--post-new').live('click',function(e){

			e.preventDefault();

			// add a body class
			$('body').toggleClass('aesop-modal-open');

			// append teh modal markup ( aesop_editor_component_modal() )
			$('body').append(aesop_editor.newPostModal);

			////////////
			// RESIZE THE URL HELPER FIELD
			////////////
			var mask 		= $('.url-helper')
			,	mWidth 		= mask.outerWidth()
			,	field  		= $('input[name="story_title"]')
			,	maxLength   = 342

			field.css({'width':maxLength - mWidth});

		});

		// destroy modal if clicking close or overlay
		$('#aesop-editor--modal__close, #aesop-editor--modal__overlay, .aesop-editor--postsettings-cancel').live('click',function(e){
			e.preventDefault();
			destroyModal();
		});

		/////////////////
		/// EXIT SETTINGS
		///////////////////
		$(document).keyup(function(e) {

			if ( 27 == e.keyCode ) {

				destroyModal();
			}

		});

		/////////////
		// MAKE NEW POST OBJECT
		//////////////
		var form;

		$('#aesop-editor--postnew__form').live('submit', function(e) {

			e.preventDefault();

			var $this = $(this);

			$(this).find('input[type="submit"]').val('Adding...');

			var data = $this.serialize();

			/////////////
			//	DO TEH SAVE
			/////////////
			$.post( aesop_editor.ajaxurl, data, function(response) {

				if ( response ) {

					$('input[type="submit"]').addClass('saved');
					$('input[type="submit"]').val('Added!');

					window.location.replace(response);

				} else {

					alert('error');

				}


			});

		});

	});

})( jQuery );