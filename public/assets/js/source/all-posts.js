(function( $ ) {


	// method to destroy the modal
	var destroyModal = function(){
		$('body').removeClass('lasso-modal-open');
		$('#lasso--all-posts__modal, #lasso--modal__overlay').remove();
	}

	// single list post markup
	var singlePost = function( post ){

		return '<li>\
				<a class="lasso--post-list__item" href="" data-postid="'+post.ID+'">\
				'+post.title+'\
					<div class="lasso--post-list__controls">\
						<span title="Edit Post" id="lasso--post__edit"></span>\
						<span title="Delete Post" id="lasso--post__delete"></span>\
					</div>\
				</a>\
				</li>';

	}

	// get the posts
	var getPosts = function(){

		var posts = new wp.api.collections.Posts();

		posts.fetch( { data: { filter: { posts_per_page: 10 } } } ).done( function() {
		    posts.each( function( post ) {

		        $('#lasso--post-list').append( singlePost( post.attributes ) )

		    });
		});
	}

	// modal click
	$('#lasso--post-all').live('click',function(e){

		e.preventDefault();

		// add a body class
		$('body').toggleClass('lasso-modal-open');

		// append teh modal markup ( lasso_editor_component_modal() )
		$('body').append( lasso_editor.allPostModal );


		setTimeout(function(){
			$('#lasso--loading').remove()
		}, 500)

		// populate the posts
		getPosts()

		var postList = $('#lasso--post-list')

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