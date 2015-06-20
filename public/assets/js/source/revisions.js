(function( $ ) {

    $(document).ready(function(){

        var revisions
        , 	revision_id = 0
        , 	next
        , 	previous
       	, 	total


        /////////////////
        /// MODAL LOGIC
        ///////////////////

        // method to destroy the modal
        var destroyModal = function(){
            $('body').removeClass('lasso-modal-open');
            $('#lasso--post-settings__modal, #lasso--modal__overlay').remove();
        };

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

                if ( true == response.success ) {

                    if ( 'object' == typeof response.data ) {

                        revisions = response.data;

                        $.each( revisions, function( i, post )  {

                            $('#lasso--revision-list').append( '<li><a href="#" data-revision="'+i+'">' + post.modified + '</a></li>' )

                        });

						// init slider
					    $('#lasso--slider').slider({
					      	min: 0,
					      	max: 5,
					      	step: 1,
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

        // destroy modal if clicking close or overlay
        $('#lasso--modal__close, #lasso--modal__overlay, .lasso--postsettings-cancel').live('click',function(e){
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
