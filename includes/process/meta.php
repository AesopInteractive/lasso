<?php
/**
 * Class responsible for processing optoins from lasso post meta api
 *
 * @since 1.0
 */
namespace lasso\process;

use lasso\internal_api\api_action;

class meta implements api_action {

	/**
	 * The nonce action for this request.
	 *
	 * @since 0.9.2
	 *
	 * @var string
	 */
	public $nonce_action = 'lasso-process-post-meta';

	/**
	 * Process storing meta
	 *
	 * @since 0.9.5
	 *
	 * @param array $data Sanitized data to use for saving.
	 *
	 * @return bool Always returns true.
	 */
	public function update( $data ) {

		//var_dump($data);

		return true;

	}

	/**
	 * The keys required for the actions of this class.
	 *
	 * @since     0.9.5
	 *
	 * @return array Array of keys to pull from $data per action and their sanitization callback
	 */
	public static function params(){
		$params[ 'process_meta_update' ] = array(
			'action'
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
		$params[ 'process_meta_update' ] = array(
			'lasso_user_can'
		);

		return $params;

	}

}

