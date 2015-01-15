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

			$postid = isset( $_POST['post_id'] ) ? $_POST['post_id'] : null;
			$content = isset( $_POST['content'] ) ? $_POST['content'] : null;

			if ( isset( $_POST['action'] ) && $_POST['action'] == 'process_save_content' ) {

				$args = array(
					'ID'           => (int) $postid,
	      			'post_content' => $content
				);
				wp_update_post( $args );

				do_action( 'aesop_editor_post_saved', $postid, $content, get_current_user_ID() );

				echo 'success';


			} elseif ( isset( $_POST['action'] ) && $_POST['action'] == 'process_publish_content' ) {

				$args = array(
					'ID'           => (int) $postid,
	      			'post_content' => $content,
	      			'post_status'	=> 'publish'
				);
				wp_update_post( $args );

				do_action( 'aesop_editor_post_published', $postid, $content, get_current_user_ID() );

				echo 'success';


			}

		}
		die();
	}


}
new aesopEditorProcessSaving;



