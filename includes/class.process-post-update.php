<?php


class aesopEditorProcessUpdatePost {

	function __construct(){

		add_action( 'wp_ajax_process_update_post', 				array($this, 'process_update_post' ));

	}

	function process_update_post(){

		if ( isset( $_POST['action'] ) && $_POST['action'] == 'process_update_post' ) {

			// only run for logged in users and check caps
			if( !is_user_logged_in() || !current_user_can('edit_posts') )
				return;

			// ok security passes so let's process some data
			if ( wp_verify_nonce( $_POST['nonce'], 'aesop-update-post-settings' ) ) {

				$postid 	= isset( $_POST['postid'] ) ? $_POST['postid'] : false;
				$slug 	= isset( $_POST['story_slug'] ) ? $_POST['story_slug'] : false;

				$args = array(
					'ID'			=> (int) $postid,
				  	//'post_title'    => wp_strip_all_tags( $title ),
				  	'post_name'		=> sanitize_title( trim( $slug ) )
				);

				wp_update_post( $args );

				echo 'success';

			} else {

				echo 'error';
			}
		}

		die();
	}


}
new aesopEditorProcessUpdatePost;



