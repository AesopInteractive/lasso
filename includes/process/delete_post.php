<?php

/**
 * This class is responsible for deleting apost through all-posts menu
 *
 * @since 0.9.3
 */
namespace lasso;

class delete_post {

	/**
	 * The nonce action for this request.
	 *
	 * @since 0.9.3
	 *
	 * @var string
	 */
	public $nonce_action = 'lasso-editor-delete-post';


	/**
	 * Process the post delete
	 *
	 * @since 1.0
	 */
	public function delete( $data ) {

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

	/**
	 * The keys required for the actions of this class.
	 *
	 * @since     0.9.2
	 *
	 * @return array Array of keys to pull from $_POST per action and their sanitization callback
	 */
	public static function params(){
		$params[ 'process_delete_post' ] = array(
			'action'
		);

		return $params;
	}

	/**
	 * Additional auth callbacks to check.
	 *
	 * @since     0.9.2
	 *
	 * @return array Array of additional functions to use to authorize action.
	 */
	public static function auth_callbacks() {
		$params[ 'process_delete_post' ] = array(
			'lasso_user_can'
		);

		return $params;

	}
}