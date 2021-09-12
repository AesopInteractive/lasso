<?php
/**
 * Adds a new post object
 *
 * @since 1.0
 */

namespace lasso\process;

use lasso\internal_api\api_action;

class new_object implements api_action {

	/**
	 * The nonce action for this request.
	 *
	 * @since 0.9.2
	 *
	 * @var string
	 */
	public $nonce_action = 'lasso-editor-new-post';


	/**
	 * Process the post object
	 *
	 * @params array $data Sanitized data to use for saving.
	 *
	 * @since 1.0
	 */
	public function post( $data ) {

		$title  = $data[ 'story_title' ];

		$object = is_null( $data[ 'object'] ) ? false : $data[ 'object' ];
        
        $new_post_text    = lasso_editor_get_option( 'new_post_text', 'lasso_editor' );        
        $new_post_text  = !empty($new_post_text) ? $new_post_text : wp_strip_all_tags(apply_filters( 'lasso_new_object_content', __( 'Once upon a time...','lasso')));

		// insert a new post
		$args = array(
			'post_title'    => $title,
			'post_status'   => 'draft',
			'post_type'    	=> $object,
			'post_content'  =>'<p class="editus-firstp" placeholder="'. $new_post_text. '"></p>' 
		);

		$postid = wp_insert_post( apply_filters( 'lasso_insert_object_args', $args ) );

		do_action( 'lasso_new_object', $postid, $object, $title, get_current_user_ID() );

		return array(
			'postlink' => get_permalink( $postid )
		);

	}

	/**
	 * The keys required for the actions of this class.
	 *
	 * @since     0.9.2
	 *
	 * @return array Array of keys to pull from $_POST per action and their sanitization callback
	 */
	public static function params() {
		$params[ 'process_new_object_post' ] = array(
			'story_title' => array( 'wp_strip_all_tags', 'trim' ),
			'object' => 'trim'
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
		$params[ 'process_new_object_post' ] = array();

		return $params;

	}
}

