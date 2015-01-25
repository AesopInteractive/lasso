<?php

/**
*
*	Process a user uploading an image for the featured image in a post
*
*/
class lassoUploadFeatImage {

	function __construct(){

		add_action( 'wp_ajax_process_featimg_upload', 				array($this, 'process_featimg_upload' ));

	}

	function process_featimg_upload(){

		if ( isset( $_POST['action'] ) && $_POST['action'] == 'process_featimg_upload' ) {

			// only run for logged in users and check caps
			if( !lasso_editor_user_can_edit() )
				return;

			// ok security passes so let's process some data
			if ( wp_verify_nonce( $_POST['nonce'], 'lasso_editor_image' ) ) {

				$postid 	= isset( $_POST['postid'] ) ? $_POST['postid'] : false;
				$image_id 	= isset( $_POST['image_id'] ) ? absint( $_POST['image_id'] ) : false;

				set_post_thumbnail( $postid, $image_id );

				do_action( 'lasso_featured_image_set', $postid, $image_id, get_current_user_ID() );

				// send back success
				wp_send_json_success();

			} else {

				// send back error
				wp_send_json_error();

			}
		}

		die();
	}


}
new lassoUploadFeatImage;



