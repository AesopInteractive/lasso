<?php
/**
 * Process saving a maps locations
 *
 * @since 1.0
 */
namespace lasso;

class process_map {

	public function __construct() {

		add_action( 'wp_ajax_process_map_save',     array( $this, 'process_map_save' ) );

	}

	/**
	 *  Save the map locations and data
	 *
	 * @since 0.1
	 */
	public function process_map_save() {

		if ( isset( $_POST['action'] ) && $_POST['action'] == 'process_map_save' ) {

			// only run for logged in users and check caps
			if ( !lasso_user_can() )
				return;

			// ok security passes so let's process some data
			if ( wp_verify_nonce( $_POST['nonce'], 'lasso-process-map' ) ) {

				$postid     	= isset( $_POST['postid'] ) ? $_POST['postid'] : false;
				$locations    	= isset( $_POST['ase-map-component-locations'] ) ? $_POST['ase-map-component-locations'] : false;
				$start_point    = isset( $_POST['ase-map-component-start-point'] ) ? json_decode( urldecode( $_POST['ase-map-component-start-point'] ), true ) : false;
				$zoom       	= isset( $_POST['ase-map-component-zoom'] ) ? json_decode( urldecode( $_POST['ase-map-component-zoom'] ), true ) : false;

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

				// send back success
				wp_send_json_success();

			} else {

				// send back error
				wp_send_json_error();

			}
		}
	}
}
new lassoProcessMap;
