<?php


class aesopEditorProcessSaving {

	function __construct(){

		add_action( 'wp_ajax_process_save_content', 				array($this, 'process_save_content' ));

	}

	function process_save_content(){

		check_ajax_referer('aesop_editor','nonce');

		if ( isset( $_POST['post_id'] ) ) {

			echo 'success';

		}
		die();
	}


}
new aesopEditorProcessSaving;



