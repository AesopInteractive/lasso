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
		$this->$callback_instance = $callback_instance;
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
			//@todo replace this!
			$post_data = pods_sanitize( $_POST );

			foreach( $callback_instance->params[ $action ] as $key ) {
				if ( isset( $post_data[ $key ] ) ) {
					$data[ $key ] = $post_data[ $key ];
				}

			}

		}

		$this->data = $data;

	}

}
