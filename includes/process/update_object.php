<?php
/**
 * This class is responsible for updating the post settings such as the post slug or post status
 * and is toggle from the post settings modal
 *
 * @since 1.0
 */
namespace lasso\process;

use lasso\internal_api\api_action;

class update_object implements api_action{

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


		// update categories
		$cats  = isset( $data['story_cats'] ) ? $data['story_cats'] : false;
		self::set_post_terms( $postid, $cats, 'category' );


		// update tags
		$tags = isset( $data['story_tags'] ) ? $data['story_tags'] : false;
		self::set_post_terms( $postid, $tags, 'post_tag' );


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
			),
			'story_cats' => array(
				'trim',
				'strip_tags',
			),
			'story_tags' => array(
				'trim',
				'strip_tags',
			),

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


	/**
	 *  Update terms for post.
	 *
	 *  @since    0.9.3
	 *
	 *  @param    int    	$postid       	The current postid
     *  @param    string|bool     $value    The term slug, or a comma separated list of slugs. Or false to remove all terms set for post.
	 *  @param    string     $taxonomy    	The name of the taxonomy to which the term belongs.
	 *
	 *  @return bool True if update was successful, false if not.
	 */
	public function set_post_terms( $postid, $value, $taxonomy ) {
		if( $value ) {
			// first check if multiple, make array if so.
			if ( self::has_multiple_objects( $value ) ) {
				$value = explode( ',', $value );
			}


			$result = wp_set_object_terms( $postid, $value, $taxonomy );
		}
		else  {
			//remove all terms from post
			$result = wp_set_object_terms( $postid, null, $taxonomy );

		}

		if ( ! is_wp_error( $result ) ) {
			return true;
		}else{
			return false;
		}


	}

	/**
	 *  Determines if the given value has multiple terms by checking to see
	 *  if a comma exists in the value.
	 *
	 *  @param    string   $value    The value to evaluate for multiple terms.
	 *  @return   bool               True if there are multiple terms; otherwise, false.
	 *	@since   0.9.3
	 */
	public function has_multiple_objects( $value ) {

		return 0 < strpos( $value, ',' );

	}


}

