<?php
/**
 * Process saving a maps locations
 *
 * @since 1.0
 */
namespace lasso\process;

use lasso\internal_api\api_action;

class map implements api_action {

	/**
	 * The nonce action for this request.
	 *
	 * @since 0.9.2
	 *
	 * @var string
	 */
	public $nonce_action = 'lasso-process-map';

	/**
	 *  Save the map locations and data
	 *
	 * @since 0.9.2
	 *
	 * @param array $data Sanitized data to use for saving.
	 *
	 * @return bool Always returns true.
	 */
	public function save() {

		$postid     	= isset( $data['postid'] ) ? $data['postid'] : false;
		$locations    	= isset( $data['ase-map-component-locations'] ) ? $data['ase-map-component-locations'] : false;
		$start_point    = isset( $data['ase-map-component-start-point'] ) ? $data['ase-map-component-start-point']: false;
		$zoom       	= isset( $data['ase-map-component-zoom'] ) ? $data['ase-map-component-zoom' ] : false;

		delete_post_meta( $postid, 'ase_map_component_locations' );

		// update locations if set
		foreach ( $locations as $location ) {
			$point = json_decode( urldecode( $location ), true );
			add_post_meta( $postid, 'ase_map_component_locations', $point );
		}

		// udpate start point
		update_post_meta( $postid, 'ase_map_component_start_point', $start_point );

		// update zoom
		update_post_meta( $postid, 'ase_map_component_zoom', $zoom );

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
		$params[ 'process_map_save' ] = array(
			'postid' => 'absint',
			'ase-map-component-locations' => 'lasso_sanitize_data',
			'ase-map-component-start-point' => array(
				'json_decode',
				'urldecode'
			),
			'ase-map-component-zoom' => array(
				'json_decode',
				'urldecode'
			)
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
		$params[ 'process_map_save' ] = array(
			'lasso_user_can'
		);

		return $params;

	}
	
}

