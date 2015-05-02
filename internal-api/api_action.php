<?php
/**
 * Interface that all classes used as callbacks for internal API must implement.
 *
 * @since     0.9.2
 * @package   lasso
 * @author    Josh Pollock <Josh@JoshPress.net>
 * @license   GPL-2.0+
 */

namespace lasso\internal_api;


interface api_action {

	/**
	 * An array, keyed by action name, of params (IE keys of $_POST) and their sanitization callback to pass back to callback.
	 *
	 * Function should return an array fo arrays in the form of 'POST_var' => 'sanitization_callback'. For example <code>$params[ 'process_save_post' ] = array( 'post_id' => 'absint', 'content' => 'wp_kses_post' );
	 *
	 * @since     0.9.2
	 *
	 * @return array Array of keys to pull from $_POST per action
	 */
	public static function params();

	/**
	 * An array, keyed by action name, of callback functions, in addition to the nonce check, to run.
	 *
	 * Function should return an array of additional callback functions. For example, '<code>$cb[ 'process_save_post' ] = array( 'lasso_user_can' );</code>
	 *
	 * @since     0.9.2
	 *
	 * @return array Array of additional functions to use to authorize action. Or an empty array.
	 */
	public static function auth_callbacks();


}
