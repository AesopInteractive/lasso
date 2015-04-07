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
	 * An array, keyed by action name, of params (IE keys of $_POST) to pass back to callback.
	 *
	 *
	 * @since     0.9.2
	 *
	 * @return array Array of keys to pull from $_POST per action
	 */
	public static function params();

	/**
	 * An array, keyed by action name, of callback functions, in addition to the nonce check, to run.
	 *
	 * @since     0.9.2
	 *
	 * @return array Array of additional functions to use to authorize action.
	 */
	public static function auth_callbacks();


}
