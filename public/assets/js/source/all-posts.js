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
	,	noResultsDiv  	= lasso_editor.noResultsDiv
	, 	loader			= '<div id="lasso--loading" class="lasso--loading"><div class="lasso--loader"></div></div>'
	,	moreButton      = '<a href="#" id="lasso--load-more">'+loadMoreText+'</a>'
	,	page 			= 1
    ,   lastType        = 'post'
    ,   collection      = false
    ,   initial         = true
    ,   totalPages      = null
    ,	api             = WP_API_Settings.root
    ,	timer

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

                // show search filtering
                $('.lasso--post-filtering').removeClass('not-visible').addClass('visible')

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
                    posts_per_page: 7,
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

	}).on('keyup','.lasso--search input',function( e ){ // live search - @since 0.9.5

		// clear the previous timer
		clearTimeout(timer)

		var that        = this
		,	val 		= $(this).val()
		,	url 		= api+'/posts?filter[s]='+val
		,	results     = $('#lasso--results-found')

		// 800ms delay so we dont exectute excessively
		timer = setTimeout(function() {

			// if we have more than 3 characters and if value is teh same
			if ( val.length >= 3 && val == $(that).val() ) {

				// append loading indicator
				$(postList).prepend( loader );

				// make the api request
				$.getJSON( url, function( response ) {

					// remove current list of posts
					$(postList).children().remove()

					// show results
					results.parent().css('opacity',1)

					// count results and show
					if ( response.length == 0 ) {

						// results are empty int
						results.text('0')

						// results are empty placeholder
						if ( !$('#lasso--empty-results').length ) {
							$(postList).prepend( noResultsDiv )
						}

					} else {

						// show how many results we have
						results.text( response.length )

						// loop through each object
		                $.each( response, function ( i ) {

		                    $(postList).prepend( postTemplate( { post: response[i], settings: WP_API_Settings } ) );

		                } );
		            }

				});

			}

		}, 800);

		// if there's no value then reset
		if ( val == '' ) {

			// remove teh children
			$(postList).children().remove()

			// fetch initial posts
			fetchPosts('post')

			// hide searh results
			results.parent().css('opacity',0)

		}

	}).on('click','#lasso--search__toggle', function( e ) {

		e.preventDefault()

		var $this = $(this)
		,	elem  = 'lasso--search__visible'

		$this.closest('.lasso--search').toggleClass( elem )
	})

})( jQuery, Backbone, _, WP_API_Settings );
