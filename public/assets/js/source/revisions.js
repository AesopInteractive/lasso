(function( $ ) {

    $(document).ready(function(){

        var revisions;

        /////////////////
        /// MODAL LOGIC
        ///////////////////

        // method to destroy the modal
        var destroyModal = function(){
            $('body').removeClass('lasso-modal-open');
            $('#lasso--post-settings__modal, #lasso--modal__overlay').remove();
        }

        // modal click
        $('#lasso--post-revisions').on('click',function(e){

            e.preventDefault();

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
                        $.each( response.data, function( i, post )  {
                            html = '<li><a href="#" data-lasso-revision="' + i +'" class="lasso-revision-restore">' + post.modified + '</a></li>';
                            $( revisions_list ).append( html )
                        });

                        $( '.lasso-revision-restore' ).on( 'click', function(e) {
                            e.preventDefault();
                            revision_id =  $( this ).attr( 'data-lasso-revision' );
                            revision = revisions[ revision_id ];
                            $( lasso_editor.titleClass ).html( revision.post_title );
                            $( lasso_editor.article_object ).html( revision.post_content );

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
