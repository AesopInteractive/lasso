(function( $, Backbone, _, WP_API_Settings, undefined ) {

	var contentTemplate = $('#lasso-tmpl--post' )
	, 	postTemplate 	= _.template( contentTemplate.html() )
	, 	posts 			= new wp.api.collections.Posts()
	,	pages 			= new wp.api.collections.Pages()
	,	postAll         = $('#lasso--post-all')
	,	postList        = '#lasso--post-list'
	,	loadingText     = lasso_editor.strings.loading
	,	loadMoreText    = lasso_editor.strings.loadMore
	,	noPostsText     = lasso_editor.strings.noPostsFound
	,	body 			= $('body')
	,	noPostsMessage  = '<li id="lasso--end-posts">'+noPostsText+'</li>'
	, 	loader			= '<div id="lasso--loading" class="lasso--loading"><div class="lasso--loader"></div></div>'
	,	moreButton      = '<a href="#" id="lasso--load-more">'+loadMoreText+'</a>'
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

	/////////////////
	// INITIALIZE SCROLL
	/////////////////
	function initScroll() {

        $(postList).perfectScrollbar({
			suppressScrollX: true
		});
    }

	//////////////////
	// FETCH POSTS HELPER FUNCTION
	/////////////////
	function fetchPosts( type ){

		if ( 'page' == type ) {

			capable = lasso_editor.edit_others_pages;

        	options = capable ? setOptions( type, page ) : setOptions( type, page, lasso_editor.author );

            collection = new wp.api.collections.Pages( options );

		} else {

            capable = lasso_editor.edit_others_posts;

        	options = capable ? setOptions( type, page ) : setOptions( type, page, lasso_editor.author );

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

                $( '#lasso--load-more' ).attr( 'data-post-type', type ).removeClass('lasso--btn-loading');

                // re-init scroll
                initScroll()

            }else{

                $( postList ).append( noPostsMessage );

                setTimeout(function(){
                	$('#lasso--end-posts').fadeOut('slow')
                }, 1000)
            }

		    // destroy the spinny loader
		    destroyLoader();

		});


	}

    /**
     * Helper function to reset options
     *
     * @param type post type
     * @param page page
     *
     * @returns {{data: {page: *, filter: {post_type: *, post_status: string[]}}}}
     */
    function setOptions( type, page, author ) {

       return options = {
            data: {
                page: page,
                type: type,
                filter: {
                    post_status: ['publish','draft','pending'],
                    posts_per_page: 8,
                    author: author
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

		modalResizer();

	});

    /**
     * Load more click event
     */
    $( body ).on('click', '#lasso--load-more', function(e){
        e.preventDefault();

        type = $( this ).attr( 'data-post-type' );

        $(this).addClass('lasso--btn-loading').text( loadingText );

        page++;

        lastType = type;

        fetchPosts( type );

    }).on('click', '.lasso--show-objects', function(e){

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

	}).on('click', '#lasso--post__delete', function(e){

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

	}).on('keyup','.lasso--search input',function(){ // live search - @since 0.9.5

		if ( $(this).val().length >= 3 ) {

			// do a search
			var data = {
				action: 		'process_search_posts',
				term: 			$(this).val(),
				nonce: 			lasso_editor.searchPosts
			}

			$.post( lasso_editor.ajaxurl, data, function(response) {

				console.log(response)

				if ( true == response.success ) {

					console.log(response)

				}

			});
		}

	})

})( jQuery, Backbone, _, WP_API_Settings );
