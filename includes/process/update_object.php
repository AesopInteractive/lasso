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

		$cats  = isset( $data['story_cats'] ) ? $data['story_cats'] : false;
		$tags  = isset( $data['story_tags'] ) ? $data['story_tags'] : false;

		$args = array(
			'ID'   			=> (int) $postid,
			'post_name'  	=> $slug,
			'post_status' 	=> $status
		);

		wp_update_post( apply_filters( 'lasso_object_status_update_args', $args ) );

		// update categories
		//self::set_post_objects( $postid, $cats, 'category' );

		// update tags
		//self::set_post_objects( $postid, $tags, 'post_tag' );

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


	/**
	 *  Appends the specified term or category to the incoming postid object. If term doesn't exist, we create it
	 *
	 *  @param    int    	$postid       	The current postid
	 *  @param    string     $value       	The term value (or term name)
	 *  @param    string     $taxonomy    	The name of the taxonomy to which the term belongs.
	 *	@uses    codex      WordPress       https://codex.wordpress.org/Function_Reference/wp_set_object_terms
	 *  @since    0.9.3
	 *	@todo 	update existing with id's instead of array
	 */
	public function set_post_objects( $postid, $value, $taxonomy ) {

		// first check if multiple
		if ( self::has_multiple_objects( $value ) ) {

			self::set_multiple_objects( $postid, $value, $taxonomy );

		} else {

			// check if term exists

			if ( ! term_exists( strtolower( $value ), $taxonomy ) ) {

				$args = array(
					$value,
					$taxonomy,
					array( 'slug' => strtolower( str_ireplace( ' ', '-', $value ) ) )
				);

				$value = wp_insert_term( $args );

			}
		}

		// set the tax
		wp_set_object_terms( $postid, $value, $taxonomy, true );

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

	/**
	 *  Loops through each of the multiple terms that exist and use the
	 *  set_post_cats function to apply each value to the given postid
	 *
	 *  @param    int 		$postid      current post id
	 *  @param    string     $values      delimited list of terms or ids
	 *  @param    string     $taxonomy    category or tag
	 *	@since 	0.9.3
	 */
	public function set_multiple_objects( $postid, $values, $taxonomy ) {

		$terms = explode( ',', $values );

		foreach( $terms as $term ) {

			self::set_post_objects( $postid, trim( $term ), $taxonomy );
		}

	}

}

