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

	//////////////////
	// DESTROY LOADER
	/////////////////
	var destroyLoader = function(){
		$('#lasso--loading').remove()
	}

	//////////////////
	// FETCH POSTS HELPER FUNCTION
	/////////////////
	var fetchPosts = function( type ) {

		if ( 'posts' == type ) {

			type = posts

			capable = lasso_editor.edit_others_posts

		} else if ( 'pages' == type ) {

			type = pages

			capable = lasso_editor.edit_others_pages
		}

		// get the posts
		type.fetch( { data: { filter: { post_status: ['publish','draft','pending'] } } } ).done( function() {
		    type.each( function( post ) {

		    	// if the current use can edit_others_posts or edit_others_pages
		    	if ( 'true' === capable ) {

		    		destroyLoader()
		       		$(postList).append( postTemplate( { post: post.attributes, settings: WP_API_Settings } ) )

		       	// else only show the current logged in users posts
		    	} else if ( lasso_editor.author == post.attributes.author.id ) {

	    			destroyLoader()
	       			$(postList).append( postTemplate( { post: post.attributes, settings: WP_API_Settings } ) )


		    	}


		    });
		});
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

		fetchPosts( 'posts')

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

	// infinite scroll click
	$('#lasso--load-more').live('click', function(e){

		e.preventDefault()

	});


	// DELETE POST
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