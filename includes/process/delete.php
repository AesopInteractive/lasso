<?php

/**
 * This class is responsible for deleting apost through all-posts menu
 *
 * @since 0.9.3
 */
namespace lasso\process;
use lasso\internal_api\api_action;

class delete implements api_action {

	/**
	 * The nonce action for this request.
	 *
	 * @since 0.9.3
	 *
	 * @var string
	 */
	public $nonce_action = 'lasso_delete_post';


	/**
	 * Process the post delete
	 *
	 * @since 1.0
	 */
	public function post( $data ) {

		$postid = isset( $data['postid'] ) ? $data['postid'] : false;

		// bail out if teh current user can't publish posts
		if ( !lasso_user_can( 'delete_post', $postid ) )
			return;

		$args = array(
			'ID'   			=> (int) $postid,
			'post_status' 	=> 'trash'
		);

		wp_update_post( apply_filters( 'lasso_object_deleted_args', $args ) );

		do_action( 'lasso_object_deleted', $postid, get_current_user_ID() );

		return true;
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
			'postid' => 'absint',
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