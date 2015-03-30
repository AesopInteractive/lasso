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

		var postList = $('.lasso--post-list')

		postList.perfectScrollbar({
			suppressScrollX: true
		});


	})

	// DELETE POST
	$('#lasso--post__delete').live('click',function(e){

		e.preventDefault();

		var $this = $(this);

		var data = {
			action: 		'process_delete_post',
			postid: 		$this.closest('a').data('postid'),
			nonce: 			lasso_editor.deletePost
		}

		$.post( lasso_editor.ajaxurl, data, function(response) {

			if ( true == response.success ) {

				swal({
					title: lasso_editor.strings.deletePost,
					type: "error",
					text: false,
					showCancelButton: true,
					confirmButtonColor: "#d9534f",
					confirmButtonText: lasso_editor.strings.deleteYes,
					closeOnConfirm: true
				},
				function(){

					$this.closest('li').fadeOut().remove()

				});

			}

		});
	})


})( jQuery );