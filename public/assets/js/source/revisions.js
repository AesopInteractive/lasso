(function( $ ) {

    $(document).ready(function(){

        var revisions
        , 	revision_id = 0
        , 	next
        , 	previous
       	, 	total

       	revisionList = $('#lasso--revision-list')

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

            }
        };

        // modal click
        $('#lasso--post-revisions').on('click',function(e){

            e.preventDefault();

            // preent double clicking and opening
            $(this).remove();

            // append revision modal
            $('body').append(lasso_editor.revisionModal);

            $('#lasso--revision__modal .lasso--modal__inner').draggable({ cursor:'move', opacity:0.8 });

            data = {
                action : 'process_revision_get',
                postid : lasso_editor.postid,
                nonce : lasso_editor.nonce
            };

            $.post( lasso_editor.ajaxurl, data, function(response) {

            	// do we have a response
                if ( true == response.success ) {

                	revisionList = $('#lasso--revision-list')
                	slider       = $('#lasso--slider')

                	// remove any count classes
                	$('body').removeClass (function (index, css) {
					    return (css.match (/(^|\s)lasso--revision-count-\S+/g) || []).join(' ');
					});

                	// desroy the loader
                	destroyLoader()

                	// show the button and slider
                	$('#lasso--hide').show()

                	// if we have revisions
                    if ( 'object' == typeof response.data && response.data.length ) {

                        revisions = response.data;

                        var total = revisions.length == 1 ? 1 : revisions.length -1;

                        if ( revisions.length !== 1 ) {

	                        $.each( revisions, function( i, post )  {

	                            revisionList.append( '<li class="lasso--jump-revision" data-revision="'+i+'"><span class="lasso-util--help lasso-util--help-top" data-tooltip="'+post.modified_date+'">' + post.modified_time + '</span></li>' )

	                        });

							// init slider and restore on slide
						    slider.slider({
						      	min: 0,
						      	max: total,
						      	animate:'fast',
						      	value: 0,
						      	zindex:999,
							    slide: function( event, ui ) {
							        restoreRevision( ui.value )
							    }

						    });

						    // restore revision and sync slider on click
						    $('.lasso--jump-revision').on('click',function(e){

						    	e.preventDefault();

						    	var val = $(this).data('revision');

						    	slider.slider( 'value', val );

						    	restoreRevision( val );
						    })

						    revisionList.attr('data-count', total + 1 ) // because we start at 0

						} else {

                        	$('#lasso--hide').hide()
                        	$('#lasso--revision__modal .lasso--modal__inner').append( lasso_editor.noResultsDiv )
						}

					    $('body').addClass('lasso--revision-count-'+revisions.length )

                        modalResizer();

                    }else{
                    	$('#lasso--hide').hide()
                       	$('#lasso--revision__modal .lasso--modal__inner').append( lasso_editor.noResultsDiv )
                       	modalResizer();
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
