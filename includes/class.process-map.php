<?php

/**
*
*	Process a user uploading an image for the featured image in a post
*
*	@since 1.0
*/
class lassoProcessMap {

	function __construct(){

		add_action( 'wp_ajax_process_map_save', 				array($this, 'process_map_save' ));

	}

	function process_map_save(){

		if ( isset( $_POST['action'] ) && $_POST['action'] == 'process_map_save' ) {

			// only run for logged in users and check caps
			if( !lasso_user_can() )
				return;

			// ok security passes so let's process some data
			if ( wp_verify_nonce( $_POST['nonce'], 'process_map_save' ) ) {

				// do shit here
				
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



