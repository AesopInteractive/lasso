(function( $ ) {

    $(document).ready(function(){

        var vars 		= lasso_editor
        ,	revisions
        , 	revision_id = 0
        , 	next
        , 	previous
       	, 	total

       	revisionList = $('#lasso--revision-list');

        // method to destroy the modal
        var destroyModal = function(){
            $('body').removeClass('lasso-modal-open');
            $('#lasso--revision__modal').remove();
            $('#lasso--post-revisions').show();
        };

        // destroy loader
		function destroyLoader(){
			$('#lasso--loading').remove();
		}

        //Update title/post content for a revision
        var restoreRevision = function( revision_id ) {

            if( revision_id in revisions ){
                revision = revisions[ revision_id ];
                $( vars.titleClass ).html( revision.post_title );
                $( vars.article_object ).html( revision.post_content );
                $('body').attr('data-revision', revision_id );

            }
        };
		
		// if we are running on a mobile device, move the editor controls to the top
		if (lasso_editor.isMobile) {
			$('.lasso-editor-controls').css("top", "50px");
		}

        // modal click
        $('#lasso--post-revisions').on('click',function(e){

            e.preventDefault();

            // preent double clicking and opening
            $(this).hide();

            // append revision modal
            $('body').append(vars.revisionModal);

            innerModal = $('#lasso--revision__modal .lasso--modal__inner');

            // make the modal draggable
            innerModal.draggable({ cursor:'move', opacity:0.8 });

            data = {
                action : 'process_revision_get',
                postid : vars.postid,
                nonce : vars.nonce
            };

            $.post( vars.ajaxurl, data, function(response) {

            	// do we have a response
                if ( true == response.success ) {

                	revisionList = $('#lasso--revision-list');
                	slider       = $('#lasso--slider');
                	lassoHide    = $('#lasso--hide');

                	// remove any count classes
                	removeRevisionCount();

                	// desroy the loader
                	destroyLoader();

                	// show the button and slider
                	lassoHide.show();

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

                        	lassoHide.hide();
                        	innerModal.append( vars.noRevisionsDiv );
						}

					    $('body').addClass('lasso--revision-count-'+revisions.length );

					    maybeRestoreCurrent();

                        modalResizer();

                    }else{
                    	$('#lasso--hide').hide()
                       	innerModal.append( vars.noRevisionsDiv );
                       	modalResizer();
                    }

                } else {

                    alert('error');

                }


            }).fail(function(xhr, err) { 
				var responseTitle= $(xhr.responseText).filter('title').get(0);
				alert($(responseTitle).text() + "\n" + EditusFormatAJAXErrorMessage(xhr, err) );
			});

            modalResizer();

        });

		// select a revision and start editing
		$(document).on('click', '#lasso--select-revision', function(e){

			e.preventDefault();

			destroyModal();

			$('#lasso--edit').trigger('click');

			addBackupNotice();

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

        // restore teh current revision but only if a user is editing one
        function maybeRestoreCurrent(){

        	if( $('body').data('revision') ) {

        		slider.slider('value', $('body').data('revision') )

        	}
        }

        // add a backup notice if we're editing a backukp
        function addBackupNotice(){

        	if ( !$('#lasso--notice').length ) {

				$(vars.article_object).before('<div id="lasso--notice" class="lasso--notice lasso--notice-warning">'+vars.strings.editingBackup+'</div>');
			}
        }

        // remove/reset revisino count
        function removeRevisionCount(){

	        $('body').removeClass (function (index, css) {
			    return (css.match (/(^|\s)lasso--revision-count-\S+/g) || []).join(' ');
			});
        }

    });

})( jQuery );
