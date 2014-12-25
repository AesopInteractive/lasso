<?php


class aesopEditorComponentSaving {

	function __construct(){

		add_action( 'wp_ajax_process_update_component', 				array($this, 'process_update_component' ));

	}

	// @todo - account for multiple instances
	function process_update_component(){

		if ( isset( $_POST['action'] ) && $_POST['action'] == 'process_update_component' ) {

			// only run for logged in users and check caps
			if( !is_user_logged_in() || !current_user_can('edit_posts') )
				return;

			// ok security passes so let's process some data
			if ( wp_verify_nonce( $_POST['nonce'], 'aesop-generator-settings' ) ) {

				$type = isset( $_POST['type'] ) ? $_POST['type'] : false;
				$postid = isset( $_POST['postid'] ) ? $_POST['postid'] : false;
				$options = isset( $_POST['fields'] ) ? $_POST['fields'] : false;

				update_post_meta( $postid, '_aesop_sc_options_'.sanitize_text_field( trim( $type ) ).' ', $options );
				echo 'success';

			} else {

				echo 'error';
			}
		}

		die();
	}


}
new aesopEditorComponentSaving;



