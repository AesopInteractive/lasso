<?php


class aesopEditorProcessSaving {

	function __construct(){

		add_action( 'wp_ajax_process_save_content', 				array($this, 'process_save_content' ));

	}

	function process_save_content(){


		check_ajax_referer('aesop_editor','nonce'); 

		if ( isset( $_POST['post_id'] ) ) {

			if ( !current_user_can('edit_posts') )
				return;

			$postid = isset( $_POST['post_id'] ) ? $_POST['post_id'] : null;
			$content = isset( $_POST['content'] ) ? $_POST['content'] : null;


			$args = array(
				'ID'           => $postid,
      			'post_content' => $content
			);
			wp_update_post( $args );

			echo 'success';

		}
		die();
	}


}
new aesopEditorProcessSaving;



