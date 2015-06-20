(function( $ ) {

    $(document).ready(function(){

        var revisions
        , 	revision_id = 0
        , 	next
        , 	previous
       	, 	total

        // method to destroy the modal
        var destroyModal = function(){
            $('body').removeClass('lasso-modal-open');
            $('#lasso--revision__modal').remove();
        };

        // destroy loader
		function destroyLoader(){
			$('#lasso--loading').remove()
		}

        //Update title/post content for a revision
        var restoreRevision = function( revision_id ) {

            if( revision_id in revisions ){
                revision = revisions[ revision_id ];
                $( lasso_editor.titleClass ).html( revision.post_title );
                $( lasso_editor.article_object ).html( revision.post_content );

                console.log('restored '+revision_id )
            }else{
                console.log( 'failed '+revision_id );
            }
        };

        // modal click
        $('#lasso--post-revisions').on('click',function(e){

            e.preventDefault();

            // append revision modal
            $('body').append(lasso_editor.revisionModal);

            data = {
                action : 'process_revision_get',
                postid : lasso_editor.postid,
                nonce : lasso_editor.nonce
            };

            $.post( lasso_editor.ajaxurl, data, function(response) {

            	// do we have a response
                if ( true == response.success ) {

                	// desroy the loader
                	destroyLoader()

                	// show the button and slider
                	$('#lasso--hide').show()

                	// if we have revisions
                    if ( 'object' == typeof response.data ) {

                        revisions = response.data;

                        $.each( revisions, function( i, post )  {

                            $('#lasso--revision-list').append( '<li>' + post.modified + '</li>' )

                        });

						// init slider
					    $('#lasso--slider').slider({
					      	min: 0,
					      	max: 5,
					      	animate:'fast',
					      	value: 0,
						    slide: function( event, ui ) {
						        restoreRevision( ui.value )
						    }

					    });

                        modalResizer();

                    }else{
                        //none found message??
                    }

                } else {

                    alert('error');

                }


            });

            modalResizer();

        });


		// select a revision and start editing
		$(document).on('click', '#lasso--select-revision', function(e){

			e.preventDefault();

			destroyModal();

			$('#lasso--edit').trigger('click');

		}).on('click','#lasso--close-modal',function(e){

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

    });

})( jQuery );
