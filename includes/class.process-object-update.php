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
	 * Process the post update
	 *
	 * @since 1.0
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
				$terms  = isset( $_POST['story_cats'] ) ? $_POST['story_cats']  : false;

				$args = array(
					'ID'   			=> (int) $postid,
					'post_name'  	=> sanitize_title( trim( $slug ) ),
					'post_status' 	=> $status
				);

				// udpate the post
				wp_update_post( apply_filters( 'lasso_object_status_update_args', $args ) );

				// update any terms
				$this->set_post_terms( $postid, $terms, 'category' );

				// let plugins hook in
				do_action( 'lasso_post_updated', $postid, $slug, $status, get_current_user_ID() );

				// send back success
				wp_send_json_success();

			} else {

				// send back success
				wp_send_json_error();
			}
		}
	}

	/**
	 * Appends the specified taxonomy term to the incoming post object. If
	 * the term doesn't already exist in the database, it will be created. This
	 * function now supports multiple terms.
	 *
	 * @param    WP_Post    $post        The current post with which we're working
	 * @param    string     $value       The term value (or term name)
	 * @param    string     $taxonomy    The name of the taxonomy to which the term belongs.
	 * @access   private
	 * @since    1.0.0
	 */
	private function set_post_terms( $post, $value, $taxonomy ) {

		/* First check to see if there are multiple terms and,
		 * if so, then loop through the values and update each
		 * term.
		 */
		if ( $this->has_multiple_terms( $value ) ) {
			$this->set_multiple_terms( $post, $value, $taxonomy );
		} else {

			$term = term_exists( strtolower( $value ), $taxonomy );

			// If the taxonomy doesn't exist, then we create it
			if ( 0 === $term || null === $term ) {

				$term = wp_insert_term(
					$value,
					$taxonomy,
					array(
						'slug' => strtolower( str_ireplace( ' ', '-', $value ) )
					)
				);

			}

		}

		// Then we can set the taxonomy
		wp_set_post_terms( $post['ID'], $term, $taxonomy, true );

	}

	/**
	 * Determines if the given value has multiple terms by checking to see
	 * if a comma exists in the value.
	 *
	 * @param    string   $value    The value to evaluate for multiple terms.
	 * @return   bool               True if there are multiple terms; otherwise, false.
	 */
	private function has_multiple_terms( $value ) {
		return 0 < strpos( $value, ',' );
	}

	/**
	 * Loops through each of the multiple terms that exist and use the
	 * set_profile_terms function to apply each value to the given post
	 *
	 * @param    WP_Post    $post        The post which we're applying the terms.
	 * @param    string     $values      The delimited list of terms.
	 * @param    string     $taxonomy    The taxonomy to which the terms belong.
	 */
	private function set_multiple_terms( $post, $values, $taxonomy ) {

		$terms = explode( ';', $values );
		foreach( $terms as $term ) {
			$this->set_post_terms( $post, $term, $taxonomy );
		}

	}
}
new lassoProcessUpdatePost;
