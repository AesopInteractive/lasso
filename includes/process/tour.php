<?php
/**
 * Class responsible for creating the welcome walkthrough on the editor
 *
 * @since 0.6
 */

namespace lasso\process;
use lasso\internal_api\api_action;

class tour implements api_action {

	/**
	 * The nonce action for this request.
	 *
	 * @since 0.9.2
	 *
	 * @var string
	 */
	public $nonce_action = 'lasso-editor-tour';

	/**
	 * When the user decides to not have this show again save user meta to make it so.
	 *
	 * @param array $data Sanitized data to use for saving.
	 *
	 * @returns bool Always returns true
	 */
	public function hide( $data ) {

		$user_id = get_current_user_ID();

		update_user_meta( $user_id, 'lasso_hide_tour', true );

		do_action( 'lasso_tour_hidden', $user_id );

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
		$params[ 'process_tour_hide' ] = array(
			'action'
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
		$params[ 'process_tour_hide' ] = array(
			'lasso_user_can'
		);

		return $params;

	}
}

