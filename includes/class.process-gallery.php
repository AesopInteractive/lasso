<?php

/**
*
*	Process a user uploading an image for the featured image in a post
*
*/
class aesopEditorProcessGallery {

	function __construct(){

		add_action( 'wp_ajax_process_gallery_functions', 				array($this, 'process_gallery_functions' ));

	}

	function process_gallery_functions(){

		if ( isset( $_POST['action'] ) && $_POST['action'] == 'process_gallery_functions' ) {

			// only run for logged in users and check caps
			if( !is_user_logged_in() || !current_user_can('edit_posts') )
				return;

			// ok security passes so let's process some data
			if ( wp_verify_nonce( $_POST['nonce'], 'aesop_process_gallery' ) ) {

				echo 'success';

			} else {

				echo 'error';
			}
		}

		die();
	}


}
new aesopEditorProcessGallery;



