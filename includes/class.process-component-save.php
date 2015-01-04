<?php


class aesopEditorComponentSaving {

	function __construct(){

		add_action( 'wp_ajax_process_update_component', 				array($this, 'process_update_component' ));

	}

	function process_update_component(){

		if ( isset( $_POST['action'] ) && $_POST['action'] == 'process_update_component' ) {

			// only run for logged in users and check caps
			if( !is_user_logged_in() || !current_user_can('edit_posts') )
				return;

			// ok security passes so let's process some data
			if ( wp_verify_nonce( $_POST['nonce'], 'aesop-generator-settings' ) ) {

				$type 		= isset( $_POST['type'] ) ? sanitize_text_field( trim( $_POST['type'] ) ) : false;
				$postid 	= isset( $_POST['postid'] ) ? $_POST['postid'] : false;
				$unique 	= isset( $_POST['unique'] ) ? sanitize_text_field( trim( $_POST['unique'] ) ) : false;
				$options 	= isset( $_POST['fields'] ) ? $_POST['fields'] : false;

				$gallery_ids = isset( $_POST['gallery_ids']) ? $_POST['gallery_ids'] : false;

				if ( $gallery_ids ) {

					// if gallery images present update them
					update_post_meta( $unique, '_ase_gallery_images', $gallery_ids );

				} else {

					// else update the meta for this component
					update_post_meta( $postid, '_aesop_options_'.$type.'-'.$unique.'', $options );

				}


				echo 'success';

			} else {

				echo 'error';
			}
		}

		die();
	}


}
new aesopEditorComponentSaving;



