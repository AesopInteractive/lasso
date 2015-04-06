<?php
/**
 * Route the requests
 *
 * @package   lasso
 * @author    Josh Pollock <Josh@JoshPress.net>
 * @license   GPL-2.0+
 */

namespace lasso\internal_api;


class route {

	/**
	 * Run API if possible
	 *
	 * @since 0.9.2
	 *
	 * @uses "template_redirect" action
	 */
	public static function do_api() {

		global $wp_query;

		//get action, and if set, possibly act
		$action = $wp_query->get( 'action' );
		if ( $action && strpos( $_SERVER['REQUEST_URI'], 'lasso-internal-api' ) ) {

			$response = __( 'Lasso API Error.', 'lasso' );
			$code = 400;
			if ( wp_verify_nonce(  $_POST[ 'nonce' ], 'lasso_editor' ) ) {

				$callback = self::find_callback();
				$callback_instance = new $callback[ 'class' ];
				$auth = self::auth( $action, $callback_instance, $callback[ 'method' ] );
				if ( 200 == $auth->status_code && is_array( $callback ) ) {
					$code = 200;
					$data = new find_data( $callback_instance, $action );
					if ( is_array( $data->data ) && ! empty( $data->data ) ) {
						$response = self::route( $action, $callback_instance, $callback['method'], $data->data );
					} else {
						$code = 500;
					}

					}else{
						$code = $auth->status_code;
					}

			}else{
				$code = 401;
				$response = __( 'Nonce invalid', 'lasso' );
			}

			self::respond( $response, $code );

		}

	}

	/**
	 * Run the auth checks besides nonce
	 *
	 * @since 0.9.2
	 *
	 * @access protected
	 *
	 * @param string $action The AJAX action we are processing.
	 * @param string|object $callback The class to use for the callback. Either the name of the class or an instance of that class.

	 *
	 * @return \lasso\internal_api\auth
	 */
	protected static function auth( $action, $callback ) {
		new auth( $action, $callback );
	}

	/**
	 * Find callback class and method
	 *
	 * @since 0.9.2
	 *
	 * @access protected
	 *
	 * @return array
	 */
	protected static function find_callback( $action ) {
		return array(
			'class' => 'foo',
			'method' => 'bar'
		);
	}

	/**
	 * Route the data to the right callback.
	 *
	 * @since 0.9.2
	 *
	 * @access protected
	 *
	 * @param string $action The AJAX action we are processing.
	 * @param string|object $callback The class to use for the callback. Either the name of the class or an instance of that class.
	 * @param string $method The name of the callback method.
	 * @param array $data The sanatized data for processing the request.
	 *
	 * @return mixed
	 */
	protected static function route( $action, $callback, $method, $data ) {
		if ( class_exists( $class ) && method_exists( $class, $method ) ) {
			$response = call_user_func( $class, $method, $data  );

			return $response;
		}
	}

	/**
	 * Respond to request.
	 *
	 * @since 0.9.2
	 *
	 * @access protected
	 *
	 * @param array|string $response The response message to send.
	 * @param bool|int $code Response code or bool. If is bool, response code will be 200 or 401
	 */
	protected static function respond( $response, $code ) {
		if ( true === $code ) {
			$code = 200;
		}

		if ( false == $code ) {
			$code = 401;
		}

		if ( is_string( $response ) ) {
			$data[] = $response;
		}elseif( is_array( $response ) ) {
			$data = $response;
		}else{
			$data[] = $code;
		}

		status_header( $code );
		nocache_headers();
		if ( 200 == $code ) {
			wp_send_json_success( $data );
		}else{
			wp_send_json_error( $data );
		}

	}

	/**
	 * Holds the instance of this class.
	 *
	 * @access private
	 * @var    object
	 */
	private static $instance;

	/**
	 * Returns an instance of this class.
	 *
	 * @access public
	 *
	 * @return route|object
	 */
	public static function init() {

		if ( ! self::$instance ) {
			self::$instance = new self;
		}

		return self::$instance;

	}

}
