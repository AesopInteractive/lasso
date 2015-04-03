<?php
/**
 * Check if a request is authorized.
 *
 * @package   lasso
 * @author    Josh Pollock <Josh@JoshPress.net>
 * @license   GPL-2.0+
 */

namespace lasso\internal_api;


class auth {

	/**
	 * Instance of callback class
	 *
	 * @since 0.9.2
	 *
	 * @access protected
	 *
	 * @var object|string
	 */
	protected $callback_instance;

	/**
	 * Status code set based on auth checks.
	 *
	 * @var int
	 */
	public $status_code;

	/**
	 * Constructor for this class
	 *
	 * @since 0.9.2
	 *
	 * @param string $action The AJAX action we are processing.
	 * @param string|object $callback_class The class to use for the callback. Either the name of the class or an instance of that class.
	 * @param string $method The name of the callback method.

	 */
	public function __construct( $action, $callback_class) {
		if ( ! is_object( $callback_class ) ) {
			$this->callback_instance = new $callback_class;
		}else{
			$this->callback_instance = $callback_class;
		}


		if ( is_object( $this->callback_instance ) ) {
				if ( $this->other_auth_checks( $action ) ) {
					$this->status_code = 401;
				}else{
					$this->status_code = 200;
				}
		}else{
			$this->status_code = 401;
		}

	}

	/**
	 * Run other auth checks, besides nonce check as defined by the auth_callbacks() method of callback class
	 *
	 * @since 0.9.2
	 *
	 * @access protected
	 *
	 * @param string $action The AJAX action we are processing.
	 *
	 * @return bool True if auth checks were all postive.
	 */
	protected function other_auth_checks( $action ) {
		$auth_callbacks = $this->callback_instance->auth_callbacks();

		if ( is_array( $auth_callbacks ) && isset( $auth_callbacks[ $action ] ) && is_array( $auth_callbacks[ $action ] ) ) {
			$checks = $auth_callbacks[ $this->action ];
			foreach ( $checks as $check ) {
				if ( is_array( $check ) ) {
					$check = call_user_func( array( $this->callback_instance, $check ) );
				}else{
					$check = call_user_func( $check );
				}

				if ( false === $check ) {
					return false;

				}

			}

		}

		return true;

	}

	/**
	 * Check if callback class implements the lasso\internal_api\api_action interface
	 *
	 * @since 0.9.2
	 *
	 * @access protected
	 *
	 * @return bool
	 */
	protected function if_implements() {
		if ( class_exists( $this->callback_instance[ 'class' ] ) ){
			$implements = class_implements( $this->callback_instance[ 'class' ] );
			if ( is_array( $implements ) && in_array( 'lasso\internal_api\api_action', $implements ) ) {
				return true;

			}

		}

	}

}
