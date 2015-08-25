<?php
/**
 * Main class responsible for saving the post object
 *
 * @since 1.0
 */
namespace lasso\process;

use lasso\internal_api\api_action;

class save implements api_action {
	
	/**
	 * Process the post save
	 *
	 * @since 0.9.2
	 *
	 * @param array $data Sanitized data to use for saving.
	 *
	 * @return bool Always returns true.
	 */
	public function content( $data ) {

		$save_to_post_disabled = $this->save_to_post_disables();

		$postid = (int) $data[ 'post_id' ];
		$content = $this->replace_rendered_shortcodes( $data[ 'content' ] );

		if ( 'off' == $save_to_post_disabled || empty( $save_to_post_disabled ) ) {

			$args = array(
				'ID'           => (int) $postid,
				'post_content' => $content
			);

			wp_update_post( apply_filters( 'lasso_object_save_args', $args ) );

		}

		// run save action
		do_action( 'lasso_post_saved', $postid, $content, get_current_user_ID() );

		return true;

	}

	/**
	 * Process the post save
	 *
	 * @since 0.9.2
	 *
	 * @param array $data Sanitized data to use for saving.
	 *
	 * @return bool Always returns true.
	 */
	public function publish_content( $data ) {
		$save_to_post_disabled = $this->save_to_post_disables();

		$postid = (int) $data[ 'post_id' ];
		$content = $this->replace_rendered_shortcodes( $data[ 'content' ] );

		if ( 'off' == $save_to_post_disabled || empty( $save_to_post_disabled ) ) {

			$args = array (
				'ID'           	=> $postid,
				'post_content' 	=> $content,
				'post_status' 	=> 'publish'
			);
			wp_update_post( apply_filters( 'lasso_object_publish_args', $args ) );

		}

		do_action( 'lasso_post_published', $postid, $content, get_current_user_ID() );

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
		$params[ 'process_save_content' ] = array(
			'post_id' => 'absint',
			'content' => 'wp_kses_post'
		);

		$params[ 'process_save_publish_content' ] = array(
			'post_id' => 'absint',
			'content' => 'wp_kses_post'
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
		$params[ 'process_save_content' ] = array(
			'lasso_user_can'
		);

		$params[ 'process_save_publish_content' ] = array();

		return $params;

	}

	/**
	 * Check if saving post is disabled.
	 *
	 * @since 0.9.2
	 *
	 * @access protected
	 *
	 * @return bool
	 */
	protected function save_to_post_disables() {
		$save_to_post_disabled = lasso_editor_get_option( 'post_save_disabled', 'lasso_editor' );

		return $save_to_post_disabled;

	}

	/**
	 * Replace shortcodes from other plugins with shortcode tags.
	 *
	 * @since 0.9.9
	 *
	 * @access protected
	 *
	 * @param string $content
	 *
	 * @return string
	 */
	protected function replace_rendered_shortcodes( $content ) {
		if ( false === strpos( $content, '<!--EDITUS_OTHER_SHORTCODE_START|' ) ) {
			return $content;
		}

		$content = preg_replace(
			'/<!--EDITUS_OTHER_SHORTCODE_START\|\[(.*?)\]-->(.*?)<!--EDITUS_OTHER_SHORTCODE_END-->/s',
			'$1',
			$content
		);

		return $content;
	}

}
