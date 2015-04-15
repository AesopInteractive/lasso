<?php
/**
 * Class responsible for processing the post title change
 *
 * @since 1.0
 */
namespace lasso\process;

use lasso\internal_api\api_action;

class title_update implements api_action {

	/**
	 * The nonce action for this request.
	 *
	 * @since 0.9.2
	 *
	 * @var string
	 */
	public $nonce_action = 'lasso_update_title';

	/**
	 * Process title update
	 *
	 * @since 0.9.2
	 *
	 * @param array $data Sanitized data to use for saving.
	 *
	 * @return bool Always returns true.
	 */
	public function post( $data ) {

		$postid = isset( $data['postid'] ) ? $data['postid'] : false;
		$title  = isset( $data['title'] ) ? $data['title'] : false;

		$args = array(
			'ID'   => (int) $postid,
			'post_title'    => wp_strip_all_tags( $title )
		);

		wp_update_post( apply_filters( 'lasso_title_updated_args', $args ) );

		do_action( 'lasso_title_updated', $postid, $title, get_current_user_ID() );

		return true;

	}

	/**
	 * The keys required for the actions of this class.
	 *
	 * @since     0.9.2
	 *
	 * @return array Array of keys to pull from $data per action and their sanitization callback
	 */
	public static function params(){
		$params[ 'process_title_update_post' ] = array(
			'postid' => 'absint',
			'title' => 'strip_tags'
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
		$params[ 'process_title_update_post' ] = array(
			'lasso_user_can'
		);

		return $params;

	}

}

