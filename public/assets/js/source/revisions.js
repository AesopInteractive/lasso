(function( $ ) {

    $(document).ready(function(){

        var revisions;
        var revision_id = 0;
        var next;
        var previous;
        var total;

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
                setNext();
                setPrevious();
            }else{
                console.log( revision_id );
                alert( 'fail!' );
            }
        };

        //update the next var && update nav link for it
        var setNext = function() {
            _next = revision_id + 1;
            if ( _next > total ) {
                next = false;
                $( '#lasso--revision-next' ).attr( 'data-lasso-revision', next ).show();
            }else{
                next = _next;
                $( '#lasso--revision-next' ).attr( 'data-lasso-revision', next ).show();
            }


        };

        //update the previous var && update nav link for it
        var setPrevious = function() {
            _previous = revision_id - 1;
            if ( 0 > _previous ) {
                previous = false;
                $( '#lasso--revision-back' ).attr( 'data-lasso-revision', previous ).hide();
            }else{
                previous = _previous;
                $( '#lasso--revision-back' ).attr( 'data-lasso-revision', previous ).show();
            }


        };

        // modal click
        $('#lasso--post-revisions').on('click',function(e){

            e.preventDefault();

            $( '#lasso--post-revisions' ).hide();

            $('body').toggleClass('lasso-modal-open');
            $('body').append(lasso_editor.revisionModal);


            data = {
                action : 'process_revision_get',
                postid : 46,
                nonce : lasso_editor.nonce
            };

            $.post( lasso_editor.ajaxurl, data, function(response) {

                if ( true == response.success ) {
                    revisions_list = document.getElementById( 'lasso-revisions-list' );

                    if ( 'object' == typeof response.data ) {
                        revisions = response.data;
                        total = Object.keys( revisions ).length;
                        $.each( response.data, function( i, post )  {
                            html = '<li><a href="#" data-lasso-revision="' + i +'" class="lasso-revision-restore">' + post.modified + '</a></li>';
                            $( revisions_list ).append( html )
                        });

                        //@todo make p and r into icons for arrows or something
                        $( '.lasso--controls__left' ).prepend( '<a href="#" id="lasso--revision-back" class="lasso--revision-nav"  data-lasso-revision-nav="back" data-lasso-revision="false">P</li>');
                        $( '.lasso--controls__right').prepend(  '<a href="#" id="lasso--revision-next" class="lasso--revision-nav"  data-lasso-revision-nav="next" data-lasso-revision="false">N</li>' );
                        setNext();
                        setPrevious();

                        $( '.lasso-revision-restore' ).on( 'click', function(e) {
                            e.preventDefault();
                            revision_id =  $( this ).attr( 'data-lasso-revision' );
                            restoreRevision( revision_id );
                            setNext();
                            setPrevious();
                        });

                        $( '.lasso--revision-nav' ).on( 'click', function(e) {
                            e.preventDefault();
                            restoreRevision( $( this ).attr( 'data-lasso-revision' ) );
                        });
                        

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
            $( '#lasso--post-revisions' ).show();
        });

        /////////////////
        /// EXIT SETTINGS
        ///////////////////
        $(document).keyup(function(e) {

            if ( 27 == e.keyCode ) {

                destroyModal();
            }

        });

        /////////////
        // SAVE SETTINGS
        //////////////
        var form;

        $('#lasso--postsettings__form').live('submit', function(e) {

            e.preventDefault();






        });



    });

})( jQuery );
