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
	 * @since 0.9.2
	 *
	 * @var int
	 */
	public $status_code;


	/**
	 * An error message.
	 *
	 * @since 0.9.2
	 *
	 * @var string
	 */
	public $error_message;

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

		if ( $this->check_nonce() ) {
			if ( is_object( $this->callback_instance ) && $this->if_implements() ) {
				if ( $this->other_auth_checks( $action ) ) {
					$this->status_code = 200;
				} else {
					$this->error_message = __( 'Unauthorized action', 'lasso' );
					$this->status_code   = 401;
				}
			} else {
				$this->error_message = __( 'All callback classes used for processing the Lasso Internal API must implement the lasso\internal_api\api_action interface.', 'lasso' );
				$this->status_code   = 401;
			}
		} else {
			$this->status_code   = 401;
			$this->error_message = __( 'Nonce invalid', 'lasso' );
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
			$checks = $auth_callbacks[ $action ];
			if ( is_array( $checks ) ) {
				foreach ( $checks as $check ) {
					if ( is_array( $check ) ) {
						$check = call_user_func( array( $check[0], $check[1] ) );
					} else {
						$check = call_user_func( $check );
					}

					if ( false === $check ) {
						return false;

					}

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

		$implements = class_implements( $this->callback_instance );
		if ( is_array( $implements ) && in_array( 'lasso\internal_api\api_action', $implements ) ) {
			return true;

		}



	}

	/**
	 * Verify that the nonce is valid
	 *
	 * @since 0.0.1
	 *
	 * @access protected
	 *
	 * @return bool
	 */
	protected function check_nonce() {
		if ( isset( $this->callback_instance->nonce_action ) ) {
			$nonce = $this->callback_instance->nonce_action;
		}else{
			$nonce = 'lasso_editor';
		}

		return wp_verify_nonce( $_POST[ 'nonce' ], $nonce );

	}

}
