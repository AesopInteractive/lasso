<?php

/**
 * This class is responsible for updating the post settings such as the post slug or post status
 * and is toggle from the post settings modal
 *
 * @since 1.0
 */
class lassoProcessUpdatePost {

	public function __construct() {

		add_action( 'wp_ajax_process_update_post',     array( $this, 'process_update_post' ) );

	}

	/**
	 *  Process the post update
	 *
	 *  @since 1.0
	 */
	public function process_update_post() {

		if ( isset( $_POST['action'] ) && $_POST['action'] == 'process_update_post' ) {

			// only run for logged in users and check caps
			if ( !lasso_user_can() )
				return;

			// ok security passes so let's process some data
			if ( wp_verify_nonce( $_POST['nonce'], 'lasso-update-post-settings' ) ) {

				$status = isset( $_POST['status'] ) ? $_POST['status'] : false;
				$postid = isset( $_POST['postid'] ) ? $_POST['postid'] : false;
				$slug   = isset( $_POST['story_slug'] ) ? $_POST['story_slug'] : false;
				$cats  = isset( $_POST['story_cats'] ) ? $_POST['story_cats'] : false;
				$tags  = isset( $_POST['story_tags'] ) ? $_POST['story_tags'] : false;


				$args = array(
					'ID'   			=> (int) $postid,
					'post_name'  	=> sanitize_title( trim( $slug ) ),
					'post_status' 	=> $status
				);

				// udpate the post
				wp_update_post( apply_filters( 'lasso_object_status_update_args', $args ) );

				// update categories
				//self::set_post_objects( $postid, $cats, 'category' );

				// update tags
				self::set_post_objects( $postid, $tags, 'post_tag' );

				die(); // <--temp die

				// let plugins hook in
				do_action( 'lasso_post_updated', $postid, $slug, $status, get_current_user_ID() );

				// send back success
				//wp_send_json_success();

			} else {

				// send back success
				//wp_send_json_error();
			}
		}
	}

	/**
	 *  Appends the specified term or category to the incoming postid object. If term doesn't exist, we create it
	 *
	 *  @param    int    	$postid       	The current postid
	 *  @param    string     $value       	The term value (or term name)
	 *  @param    string     $taxonomy    	The name of the taxonomy to which the term belongs.
	 *	@uses    codex      WordPress       https://codex.wordpress.org/Function_Reference/wp_set_object_terms
	 *  @since    0.9.1
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
	 *	@since   0.9.1
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
	 */
	public function set_multiple_objects( $postid, $values, $taxonomy ) {

		$terms = explode( ',', $values );

		foreach( $terms as $term ) {

			self::set_post_objects( $postid, trim( $term ), $taxonomy );
		}

	}
}
new lassoProcessUpdatePost;
