<?php


class aesopEditorComponentDelete {

	function __construct(){

		add_action( 'wp_ajax_process_delete_component', 				array($this, 'process_delete_component' ));

	}

	function process_delete_component(){

		if ( isset( $_POST['action'] ) && $_POST['action'] == 'process_delete_component' ) {

			// only run for logged in users and check caps
			if( !is_user_logged_in() || !current_user_can('edit_posts') )
				return;

			// ok security passes so let's process some data
			if ( wp_verify_nonce( $_POST['nonce'], 'aesop-delete-nonce' ) ) {

				// @todo - delete this instances optios in meta

				$type 		= isset( $_POST['type'] ) ? sanitize_text_field( trim( $_POST['type'] ) ) : false;
				$postid 	= isset( $_POST['postid'] ) ? $_POST['postid'] : false;
				$unique 	= isset( $_POST['unique'] ) ? sanitize_text_field( trim( $_POST['unique'] ) ) : false;

				delete_post_meta( $postid, '_aesop_options_'.$type.'-'.$unique.' ' );

				echo 'success';

			} else {

				echo 'error';
			}
		}

		die();
	}


}
new aesopEditorComponentDelete;


