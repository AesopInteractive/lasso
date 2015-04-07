<?php
/**
 * Process a user uploading an image for the featured image in a post
 *
 * @since 1.0
 */
namespace lasso\process;

use lasso\internal_api\api_action;

class image_upload implements api_action {

	/**
	 *  Set the post thumbnail when the user sets it on the front end
	 *
	 * @since 0.1
	 *
	 * @param array $data Sanitized data to use for saving.
	 *
	 * @return bool Always returns true.
	 */
	public function upload() {

		$postid  	= isset( $data['postid'] ) ? $data['postid'] : false;
		$image_id  	= isset( $data['image_id'] ) ? absint( $data['image_id'] ) : false;

		set_post_thumbnail( $postid, $image_id );

		do_action( 'lasso_featured_image_set', $postid, $image_id, get_current_user_ID() );

		return true;

	}

	/**
	 *  Delete the post thumbnail when deleted from front end
	 *
	 * @since 0.1
	 *
	 * @param array $data Sanitized data to use for saving.
	 *
	 * @return bool Always returns true.
	 */
	public function delete( $data ) {

		$postid  = isset( $data['postid'] ) ? $data['postid'] : false;

		delete_post_thumbnail( $postid );

		do_action( 'lasso_featured_image_deleted', $postid, get_current_user_ID() );

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
		$params[ 'upload' ] = array(
			'post_id' => 'absint',
			'image_id' => 'absint'
		);

		$params[ 'delete' ] = array(
			'post_id' => 'absint',
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
		$params[ 'delete' ][ 'upload' ] = array(
			'lasso_user_can'
		);

		return $params;

	}
	
}
