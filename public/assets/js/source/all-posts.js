(function( $, Backbone, _, lasso_editor__wpapi, undefined ) {

	var contentTemplate = $('#lasso-tmpl--post' )
	, 	postTemplate = _.template( contentTemplate.html() )
	, 	posts = new wp.api.collections.Posts()
	,	pages = new wp.api.collections.Pages()

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
		$('body').append( lasso_editor.allPostModal );

		// remove the loader
		setTimeout(function(){

			$('#lasso--loading').remove()

		}, 600)

		// populate the posts
		posts.fetch( { data: { filter: { posts_per_page: 10 } } } ).done( function() {
		    posts.each( function( post ) {

		        $('#lasso--post-list').append( postTemplate( { post: post.attributes, settings: lasso_editor__wpapi } ) )

		    });
		});

		var postList = $('#lasso--post-list')

		postList.perfectScrollbar({
			suppressScrollX: true
		});

	})

	$('#lasso--show-pages').live('click',function(e){

		e.preventDefault();

		$('#lasso--post-list > li').remove();

		// populate the posts
		pages.fetch( { data: { filter: { posts_per_page: 10 } } } ).done( function() {
		    pages.each( function( post ) {

		        $('#lasso--post-list').append( postTemplate( { post: post.attributes, settings: lasso_editor__wpapi } ) )

		    });
		});

	});

	$('#lasso--show-posts').live('click',function(e){

		e.preventDefault();

		$('#lasso--post-list > li').remove();

		// populate the posts
		// populate the posts
		posts.fetch( { data: { filter: { posts_per_page: 10 } } } ).done( function() {
		    posts.each( function( post ) {

		        $('#lasso--post-list').append( postTemplate( { post: post.attributes, settings: lasso_editor__wpapi } ) )

		    });
		});

	});

	// infinite scroll click
	$('#lasso--load-more').live('click', function(e){

		e.preventDefault()

	});


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

})( jQuery, Backbone, _, lasso_editor__wpapi );