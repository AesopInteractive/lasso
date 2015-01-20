<?php


class aesopEditorProcessSaving {

	function __construct(){

		add_action( 'wp_ajax_process_save_content', 				array($this, 'process_save_content' ));
		add_action( 'wp_ajax_process_publish_content', 				array($this, 'process_save_content' ));

	}

	function process_save_content(){

		check_ajax_referer('aesop_editor','nonce'); 

		if ( isset( $_POST['post_id'] ) ) {

			// only run for logged in users and check caps
			if( !aesop_editor_user_can_edit() )
				return;

			// main variables being passed through include the postid and content
			$postid = isset( $_POST['post_id'] ) ? $_POST['post_id'] : null;
			$content = isset( $_POST['content'] ) ? $_POST['content'] : null;

			$save_to_post_disabled = aesop_editor_get_option('post_save_disabled','aesop_editor_advanced');

			if ( isset( $_POST['action'] ) && $_POST['action'] == 'process_save_content' ) {

				if ( 'off' == $save_to_post_disabled || empty( $save_to_post_disabled ) ) {

					$args = array(
						'ID'           => (int) $postid,
			  			'post_content' => $content
					);
					wp_update_post( $args );

				}

				// run save action
				do_action( 'aesop_editor_post_saved', $postid, $content, get_current_user_ID() );

				// send back success
				wp_send_json_success();

			} elseif ( isset( $_POST['action'] ) && $_POST['action'] == 'process_publish_content' ) {

				if ( 'off' == $save_to_post_disabled || empty( $save_to_post_disabled ) ) {

					$args = array(
						'ID'           => (int) $postid,
			  			'post_content' => $content,
			  			'post_status'	=> 'publish'
					);
					wp_update_post( $args );

				}

				do_action( 'aesop_editor_post_published', $postid, $content, get_current_user_ID() );

				// send back success
				wp_send_json_success();

			}

		}
		die();
	}


}
new aesopEditorProcessSaving;



