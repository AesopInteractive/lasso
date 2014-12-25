<?php


class aesopEditorComponentSaving {

	function __construct(){

		add_action( 'wp_ajax_process_update_component', 				array($this, 'process_update_component' ));

	}

	function process_update_component(){

		if ( isset( $_POST['action'] ) && $_POST['action'] == 'process_update_component' ) {

			// only run for logged in users
			if( !is_user_logged_in() )
				return;


			if ( !current_user_can('edit_posts') )
				return;

			// ok security passes so let's process some data
			if ( wp_verify_nonce( $_POST['nonce'], 'aesop-generator-settings' ) ) {

				$type = isset( $_POST['component_type'] ) ? $_POST['component_type'] : false;

				echo 'success';

			} else {

				echo 'error';
			}
		}

		die();
	}


}
new aesopEditorComponentSaving;



