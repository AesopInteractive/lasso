<?php

/**
*
*	Process a user uploading an image for the featured image in a post
*
*/
class aesopEditorUploadFeatImage {

	function __construct(){

		add_action( 'wp_ajax_process_featimg_upload', 				array($this, 'process_featimg_upload' ));

	}

	function process_featimg_upload(){

		if ( isset( $_POST['action'] ) && $_POST['action'] == 'process_featimg_upload' ) {

			// only run for logged in users and check caps
			if( !is_user_logged_in() || !current_user_can('edit_posts') )
				return;

			// ok security passes so let's process some data
			if ( wp_verify_nonce( $_POST['nonce'], 'aesop_editor_image' ) ) {

				$postid 	= isset( $_POST['postid'] ) ? $_POST['postid'] : false;
				$image_id 	= isset( $_POST['image_id'] ) ? absint( $_POST['image_id'] ) : false;

				set_post_thumbnail( $postid, $image_id );

				echo 'success';

			} else {

				echo 'error';
			}
		}

		die();
	}


}
new aesopEditorUploadFeatImage;



