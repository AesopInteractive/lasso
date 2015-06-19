<?php

namespace lasso\process;


use lasso\internal_api\api_action;

class revision implements api_action {

	/**
	 * Array of revisions for a post
	 *
	 * @access protected
	 *
	 * @since 0.9.5
	 *
	 * @var array
	 */
	protected static $revisions = array();

	/**
	 * Get revisions for a post
	 *
	 * @since 0.9.5
	 *
	 * @param array $data
	 *
	 * @return array
	 */
	public static function get( $data ) {
		if ( isset( $data[ 'limit' ] ) ) {
			$args[ 'post_per_page' ] = $data[ 'limit' ];
		}else{
			$args[ 'post_per_page' ] = 10;
		}

		$revisions = wp_get_post_revisions( $data[ 'postid' ], $args  );
		if ( is_array( $revisions )  && ! empty( $revisions )  ) {
			self::set_revisions( $data[ 'postid' ] );
		}

		return self::$revisions;
	}

	/**
	 * Set the revisions property
	 *
	 * @access protected
	 *
	 * @since 0.9.5
	 *
	 * @param int $id The post ID to get the revisions for
	 */
	protected static function set_revisions( $id ) {
		$_revisions = wp_get_post_revisions( $id  );
		if ( is_array( $_revisions )  && ! empty( $_revisions )  ) {
			array_walk( $_revisions, function ( $post, $i ) {
				self::$revisions[] = array(
					'post_content' => $post->post_content,
					'post_title' => $post->post_title,
					'modified' => $post->post_modified
				);
			} );

		}
	}

	/**
	 * The keys required for the actions of this class.
	 *
	 * @since     0.9.5
	 *
	 * @return array Array of keys to pull from $_POST per action and their sanitization callback
	 */
	public static function params(){
		$params[ 'process_revision_get' ] = array(
			'postid'    => 'absint',
			'limit'     => 'absint'
		);

		return $params;
	}

	/**
	 * Additional auth callbacks to check.
	 *
	 * @since     0.9.5
	 *
	 * @return array Array of additional functions to use to authorize action.
	 */
	public static function auth_callbacks() {
		$params[ 'process_revision_get' ] = array(
			'lasso_user_can'
		);

		return $params;

	}

}
