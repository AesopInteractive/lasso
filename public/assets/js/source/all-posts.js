(function( $ ) {


		// method to destroy the modal
		var destroyModal = function(){
			$('body').removeClass('lasso-modal-open');
			$('#lasso--all-posts__modal, #lasso--modal__overlay').remove();
		}

		// modal click
		$('#lasso--post-all').live('click',function(e){

			e.preventDefault();

			// add a body class
			$('body').toggleClass('lasso-modal-open');

			// append teh modal markup ( lasso_editor_component_modal() )
			$('body').append(lasso_editor.allPostModal);

		})


})( jQuery );