<?php

/**
*
*	Process various gallery fucntions like fetching and saving images
*
*/
class aesopEditorProcessGallery {

	function __construct(){

		add_action( 'wp_ajax_process_get_images', 				array($this, 'process_get_images' ));

	}

	function process_get_images(){

		if ( isset( $_POST['action'] ) && $_POST['action'] == 'process_get_images' ) {

			// only run for logged in users and check caps
			if( !is_user_logged_in() || !current_user_can('edit_posts') )
				return;

			var_dump($_POST);

			// bail if no id specified like on new galleries
			if ( empty( $_POST['post_id'] ) )
				return;

			// ok security passes so let's process some data
			if ( wp_verify_nonce( $_POST['nonce'], 'aesop_get_gallery_images' ) ) {

				$postid 	= isset( $_POST['post_id'] ) ? $_POST['post_id'] : false;

				$image_ids 	= get_post_meta($postid,'_ase_gallery_images', true);
				$image_ids	= array_map('intval', explode(',', $image_ids));

				var_dump($image_ids);

			} else {

				echo 'error';
			}
		}

		die();
	}


}
new aesopEditorProcessGallery;



