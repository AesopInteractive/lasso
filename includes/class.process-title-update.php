<?php

/**
*
*	Class responsible for processing the post title change
*
*	@since 1.0
*/
class lassoProcessTitleUpdate {

	function __construct(){

		add_action( 'wp_ajax_process_update_title', 				array($this, 'process_update_title' ));

	}

	function process_update_title(){

		if ( isset( $_POST['action'] ) && $_POST['action'] == 'process_update_title' ) {

			// only run for logged in users and check caps
			if( !lasso_editor_user_can_edit() )
				return;

			// ok security passes so let's process some data
			if ( wp_verify_nonce( $_POST['nonce'], 'lasso_update_title' ) ) {

				$postid = isset( $_POST['postid'] ) ? $_POST['postid'] : false;
				$title 	= isset( $_POST['title'] ) ? $_POST['title'] : false;

				$args = array(
					'ID'			=> (int) $postid,
				  	'post_title'    => wp_strip_all_tags( $title )
				);

				wp_update_post( $args );

				do_action( 'lasso_title_updated', $postid, $title, get_current_user_ID() );

				wp_send_json_success();

			} else {

				wp_send_json_error();
			}
		}

		die();
	}


}
new lassoProcessTitleUpdate;



