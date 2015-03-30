<?php

/**
 * This class is responsible for updating the post settings such as the post slug or post status
 * and is toggle from the post settings modal
 *
 * @since 1.0
 */
class lassoProcessDeletePost {

	public function __construct() {

		add_action( 'wp_ajax_process_delete_post',     array( $this, 'process_delete_post' ) );

	}

	/**
	 * Process the post delete
	 *
	 * @since 1.0
	 */
	public function process_delete_post() {

		if ( isset( $_POST['action'] ) && $_POST['action'] == 'process_delete_post' ) {

			// only run for logged in users and check caps
			if ( !is_user_logged_in() && !current_user_can('delete_posts') )
				return;

			// ok security passes so let's process some data
			if ( wp_verify_nonce( $_POST['nonce'], 'lasso_delete_post' ) ) {

				$postid = isset( $_POST['postid'] ) ? $_POST['postid'] : false;

				$args = array(
					'ID'   			=> (int) $postid,
					'post_status' 	=> 'trash'
				);

				wp_update_post( apply_filters( 'lasso_object_deleted_args', $args ) );

				do_action( 'lasso_object_deleted', $postid, get_current_user_ID() );

				// send back success
				wp_send_json_success();

			} else {

				// send back success
				wp_send_json_error();
			}
		}
	}
}
new lassoProcessDeletePost;
