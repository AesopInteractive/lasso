(function( $ ) {

	$(document).ready(function(){

		// method to destroy the modal
		var destroyModal = function(){
			$('body').removeClass('lasso-modal-open' );
			$('.lasso--modal, #lasso--modal__overlay').remove();
		}

		// modal click
		$('#lasso--post-new').live('click',function(e){

			e.preventDefault();

			// add a body class
			$('body').toggleClass('lasso-modal-open');

			// append teh modal markup ( lasso_editor_component_modal() )
			$('body').append(lasso_editor.newPostModal);

			////////////
			// RESIZE THE URL HELPER FIELD
			////////////
			var mask 		= $('.url-helper')
			,	mWidth 		= mask.outerWidth()
			,	field  		= $('input[name="story_title"]')
			,	maxLength   = 342

			field.css({'width':maxLength - mWidth});

		    // if any changes happen then show the footer
		    $('.lasso--modal__trigger-footer').on('keyup',function(){
			  	$('.lasso--postsettings__footer').slideDown()
			});

			modalResizer()

		});

		// destroy modal if clicking close or overlay
		$('#lasso--modal__close, #lasso--modal__overlay, .lasso--postsettings-cancel').live('click',function(e){
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

		$('#lasso--postnew__form').live('submit', function(e) {

			e.preventDefault();

			var $this = $(this);

			$(this).find('input[type="submit"]').val(lasso_editor.strings.adding);

			var data = $this.serialize();

			/////////////
			//	DO TEH SAVE
			/////////////
			$.post( lasso_editor.ajaxurl, data, function(response) {

				if ( true == response.success ) {

					$('input[type="submit"]').addClass('saved');
					$('input[type="submit"]').val(lasso_editor.strings.added);

					window.location.replace(response.data.postlink);

				} else {

					alert('error');

				}


			});

		});

	});

})( jQuery );
