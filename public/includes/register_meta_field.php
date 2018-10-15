<?php
/**
 * Helper class for registering meta fields to work with Editus Options API
 */

namespace lasso_public_facing;


class register_meta_field {

	/**
	 * Constructor for class.
	 *
	 * Pass an array of field_name => sanatization_callback
	 *
	 * @param array $fields
	 */
	public function __construct( $fields ) {
		$this->fields = $fields;
		add_filter( 'lasso_api_params', function( $params ) {
			foreach( $this->fields as $field => $cbs ) {
				$field = lasso_clean_string( $field );
				$params[ 'process_meta_update' ][ $field ] = $cbs;
			}

			return $params;

		});

		add_filter( 'lasso_meta_fields', function( $allowed ) {

			foreach( array_keys( $this->fields ) as $field  ) {
				$field = lasso_clean_string( $field );
				$allowed[] = $field;

			}
			return $allowed;
		});

	}

}
