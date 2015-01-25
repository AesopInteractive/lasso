<?php

/**
*
*	This class is responsible for updating the post settings such as the post slug or post status
*	and is toggle from the post settings modal
*
*	@since 1.0
*/
class lassoProcessUpdatePost {

	function __construct(){

		add_action( 'wp_ajax_process_update_post', 				array($this, 'process_update_post' ));

	}

	/**
	*
	*	Process the post update
	*
	*	@since 1.0
	*/
	function process_update_post(){

		if ( isset( $_POST['action'] ) && $_POST['action'] == 'process_update_post' ) {

			// only run for logged in users and check caps
			if( !lasso_user_can() )
				return;

			// ok security passes so let's process some data
			if ( wp_verify_nonce( $_POST['nonce'], 'lasso-update-post-settings' ) ) {

				$status = isset( $_POST['status'] ) ? $_POST['status'] : false;
				$postid = isset( $_POST['postid'] ) ? $_POST['postid'] : false;
				$slug 	= isset( $_POST['story_slug'] ) ? $_POST['story_slug'] : false;

				$args = array(
					'ID'			=> (int) $postid,
				  	'post_name'		=> sanitize_title( trim( $slug ) ),
				  	'post_status'	=> $status
				);

				wp_update_post( apply_filters('lasso_object_status_update_args', $args ) );

				do_action( 'lasso_post_updated', $postid, $slug, $status, get_current_user_ID() );

				// send back success
				wp_send_json_success();

			} else {

				// send back success
				wp_send_json_error();
			}
		}
	}
}
new lassoProcessUpdatePost;



