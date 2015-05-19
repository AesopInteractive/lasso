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
    ,   lastType        = 'post'
    ,   collection      = false
    ,   initial         = true
    ,   totalPages      = null

	// infinite load options
	var options = {
		data: {
			page: page,
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

        //set up collections;
        options = setOptions( type, page );
		if ( 'page' == type ) {
			capable = lasso_editor.edit_others_pages;
            collection = new wp.api.collections.Pages( options );
		} else {
            capable = lasso_editor.edit_others_posts;
            collection = new wp.api.collections.Posts( options );
        }

		// get the posts
		collection.fetch( options ).done( function() {

            //remove more button
            $( '#lasso--load-more' ).remove();

			// if we have more posts then load them
			if ( collection.length > 0 ) {
                var pageAttr = collection.state.currentPage;
                pageAttr -= 1;
                var setContainer = $( '<div data-page-num="' + collection.state.currentPage + '" class="lasso--object-batch" id="lasso--object-batch-' + pageAttr + '"></div>' );

                collection.each( function ( model ) {
                    setContainer.append( postTemplate( { post: model.attributes, settings: WP_API_Settings } ) );
                } );

                // append to the post container
                $(postList).append( setContainer );

                //put back more button
                $(postList).append( moreButton );

                $( '#lasso--load-more' ).attr( 'data-post-type', type );

            }else{
                $( postList ).append( noPostsMessage );
            }

		    // destroy the spinny loader
		    destroyLoader();

		});


	}

    /**
     * Load more click event
     */
    $( body ).on('click', '#lasso--load-more', function(e){
        e.preventDefault();

        type = $( this ).attr( 'data-post-type' );

        page++;

        lastType = type;

        fetchPosts( type );

    });

    /**
     * Helper function to reset options
     *
     * @param type post type
     * @param page page
     *
     * @returns {{data: {page: *, filter: {post_type: *, post_status: string[]}}}}
     */
    function setOptions( type, page ) {

       return options = {
            data: {
                page: page,
                type: type,
                filter: {
                    post_status: ['publish','draft','pending']
                }
            }
        }
    }


	//////////////////
	// OPEN INITIAL POSTS
	/////////////////
	$( postAll ).on('click',function(e){

		e.preventDefault();

		// add a body class
		body.toggleClass('lasso-modal-open');

		// append teh modal markup ( lasso_editor_component_modal() )
		body.append( lasso_editor.allPostModal );

		// get the intial posts
		fetchPosts('post');

		$(postList).perfectScrollbar({
			suppressScrollX: true
		});

	});

	//////////////////
	// SHOW POST/PAGES
	/////////////////
	$( body ).on('click', '.lasso--show-objects', function(e){

		e.preventDefault();

		$('.lasso--show-objects').removeClass('active');
		$(this).addClass('active');

		$('#lasso--post-list').empty();
        type = $(this).data('post-type');
        page = 1;
        totalPages = null;
        $( '#lasso--load-more' ).attr( 'data-post-type', type);

		$(postList).prepend( loader );

		fetchPosts( type );


	});

	//////////////////
	// DELETE POST
	/////////////////
	$( body ).on('click', '#lasso--post__delete', function(e){

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
