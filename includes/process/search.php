<?php

/**
 * This class is responsible for searching through all-posts menu
 *
 * @since 0.9.3
 */
namespace lasso\process;
use lasso\internal_api\api_action;

class search implements api_action {

	/**
	 * The nonce action for this request.
	 *
	 * @since 0.9.3
	 *
	 * @var string
	 */
	public $nonce_action = 'lasso_search_posts';


	/**
	 * Process the search
	 *
	 * @since 1.0
	 */
	public function posts( $data ) {

		$term = isset( $data['term'] ) ? $data['term'] : false;

		// return some results here

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
		$params[ 'process_search_posts' ] = array(
			'term' => 'sanitize_text_field',
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
		$params[ 'process_search_posts' ] = array(
			'lasso_user_can'
		);

		return $params;

	}
}