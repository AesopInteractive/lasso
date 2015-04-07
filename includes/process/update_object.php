<?php
/**
 * This class is responsible for updating the post settings such as the post slug or post status
 * and is toggle from the post settings modal
 *
 * @since 1.0
 */
namespace lasso\process;

class update_object {

	/**
	 * The nonce action for this request.
	 *
	 * @since 0.9.2
	 *
	 * @var string
	 */
	public $nonce_action = 'lasso-update-post-settings';
	
	/**
	 * Process the post update
	 *
	 * @since 0.9.2
	 *
	 * @param array $data Sanitized data to use for saving.
	 *
	 * @return bool Always returns true.
	 */
	public function post( $data ) {

		$status = isset( $data['status'] ) ? $data['status'] : false;
		$postid = isset( $data['postid'] ) ? $data['postid'] : false;
		$slug   = isset( $data['story_slug'] ) ? $data['story_slug'] : false;

		$args = array(
			'ID'   			=> (int) $postid,
			'post_name'  	=> $slug,
			'post_status' 	=> $status
		);

		wp_update_post( apply_filters( 'lasso_object_status_update_args', $args ) );

		do_action( 'lasso_post_updated', $postid, $slug, $status, get_current_user_ID() );

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
		$params[ 'process_update_object_post' ] = array(
			'postid' => 'absint',
			'status' => 'strip_tags',
			'story_slug' => array(
				'trim',
				'sanitize_title'
			)
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
		$params[ 'process_update_object_post' ] = array(
			'lasso_user_can'
		);



		return $params;

	}

}

