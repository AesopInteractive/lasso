<?php
/**
 * Find data & sanatize data for this request.
 *
 * @package   lasso
 * @author    Josh Pollock <Josh@JoshPress.net>
 * @license   GPL-2.0+
 */

namespace lasso\internal_api;


class find_data {


	/**
	 * Sanatized data for this request.
	 *
	 * @since 0.9.2
	 *
	 * @var array
	 */
	public $data;

	/**
	 *
	 * @since 0.9.2
	 *
	 * @param object $callback_instance Callback class.
	 * @param string $action The name of the action we are processing for.
	 */
	public function __construct( $callback_instance, $action ) {
		if ( is_object( $callback_instance ) ) {
			$this->get_data( $callback_instance, $action );
		}

	}


	/**
	 * Get necessary data from $_POST and sanatizes it.
	 *
	 * Sets $this->data;
	 *
	 * @since 0.9.2
	 *
	 * @access protected
	 *
	 * @param object $callback_instance Callback class.
	 * @param string $action The name of the action we are processing for.
	 */
	protected function get_data( $callback_instance, $action ) {
		$data = array();
		if ( is_array( $_POST ) ) {
			$params = $callback_instance::params();

			/**
			 * Add additional parameters to an API action.
			 *
			 * @since 0.9.5
			 *
			 * @param array $params Array of parameters in form of $_POST key => sanitization callback function name. Example 'id' => 'absint'
			 * @param string $action Name of current action.
			 */
			$params = apply_filters( 'lasso_api_params', $params, $action );
			if ( is_array( $params ) && isset( $params[ $action ] ) && is_array( $params[ $action ] ) ) {
				$params = $params[ $action ];
				foreach( $params as $key => $callback ) {
					$_data = null;
					if ( is_array( $callback ) ) {
						foreach( $callback as $cb ) {
							$_data = $this->sanitize( $key, $cb );
						}
					}else{
						$_data = $this->sanitize( $key, $callback );
					}

					$data[ $key ] = $_data;

				}

			}

		}

		$this->data = $data;

	}

	/**
	 * Sanitize a $_POST key
	 *
	 * @since 0.9.2
	 *
	 * @access protected
	 *
	 * @param string $key The key of _$POST to sanitize.
	 * @param string|array $cb The name of callback functions, or an array fo callback functions to do Sanitization.
	 *
	 * @return string|null Sanitized data or null.
	 */
	protected function sanitize( $key, $cb ) {
		$_data = null;
		if ( isset( $_POST[ $key ] ) ) {
			if ( function_exists( $cb ) ) {
				$_data = call_user_func( $cb, $_POST[ $key ] );

				return $_data;

			}

			return $_data;

		}

		return $_data;
	}

}
