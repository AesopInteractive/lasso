(function( $, Backbone, _, WP_API_Settings, undefined ) {

	var contentTemplate = $('#lasso-tmpl--post' )
	, 	postTemplate 	= _.template( contentTemplate.html() )
	, 	posts 			= new wp.api.collections.Posts()
	,	pages 			= new wp.api.collections.Pages()
	,	postAll         = $('#lasso--post-all')
	,	postList        = '#lasso--post-list'
	,	body 			= $('body')
	,	noPostsMessage  = '<li>No posts found</li>'
	, 	loader			= '<div id="lasso--loading" class="lasso--loading"><div class="lasso--loader"></div></div>'
	,	moreButton      = '<a href="#" id="lasso--load-more">Load More</a>'
	,	page 			= 1

	// infinite load options
	var options = {
		data: {
			page: WP_API_Settings.page || 2,
			filter: {
				post_status: ['publish','draft','pending'] 
			}
		}
	}

	//////////////////
	// DESTROY LOADER
	/////////////////
	function destroyLoader(){
		$('#lasso--loading').remove()
	}

	//////////////////
	// FETCH POSTS HELPER FUNCTION
	/////////////////
	function fetchPosts( type ){

		if ( 'posts' == type ) {

			type 	= posts
			capable = lasso_editor.edit_others_posts

		} else if ( 'pages' == type ) {

			type 	= pages
			capable = lasso_editor.edit_others_pages

		}

		// get the posts
		type.fetch( options ).done( function() {

			// if we hvae more posts then load them
			if ( type.length > 0 ) {

		    	$(postList).append( moreButton );

		    	loadPosts( type )

		    	// trigger a click on the load more to load teh first set?
		    	$('#lasso--load-more').trigger('click')
		    }

		    // destroy the spinny loader
		    destroyLoader()

		});
	}

	//////////////////
	// LOAD MORE CLICK EVENT
	/////////////////
	function loadPosts( type ){

		$(postList).on('click','#lasso--load-more', function(e){

			e.preventDefault()

			$('#lasso--load-more').hide();

			var setContainer = $( '<div data-page-num="' + type.state.currentPage + '" class="lasso--object-batch"></div>' )

			type.each( function( model ) {

				setContainer.append( postTemplate( { post: model.attributes, settings: WP_API_Settings } ) )

			})

			// append to the post container
			$(postList).append( setContainer );

			// if there are more posts then load them
			if ( type.hasMore() ) {

				type.more().done( function() {

					// destroy the loader
					destroyLoader()

					// append the more button then show
					$(moreButton).appendTo( $(postList) ).show()

				})

			}

		})

	}


	//////////////////
	// OPEN INITIAL POSTS
	/////////////////
	postAll.live('click',function(e){

		e.preventDefault();

		// add a body class
		body.toggleClass('lasso-modal-open');

		// append teh modal markup ( lasso_editor_component_modal() )
		body.append( lasso_editor.allPostModal );

		// get the intial posts
		fetchPosts('posts')

		$(postList).perfectScrollbar({
			suppressScrollX: true
		});

	})

	//////////////////
	// SHOW POST/PAGES
	/////////////////
	$('.lasso--show-objects').live('click',function(e){

		e.preventDefault();

		$('.lasso--show-objects').removeClass('active')
		$(this).addClass('active');

		$('#lasso--post-list > li').remove();

		$(postList).prepend( loader )

		fetchPosts( $(this).data('post-type') )

	});

	//////////////////
	// DELETE POST
	/////////////////
	$('#lasso--post__delete').live('click',function(e){

		e.preventDefault();

		var $this = $(this);

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

			var data = {
				action: 		'process_delete_post',
				postid: 		$this.closest('a').data('postid'),
				nonce: 			lasso_editor.deletePost
			}

			$.post( lasso_editor.ajaxurl, data, function(response) {

				if ( true == response.success ) {

					$this.closest('li').fadeOut().remove()

				}

			});

		});

	})

})( jQuery, Backbone, _, WP_API_Settings );