<?php

/**
*
*	Adds a new post
*
*/
class aesopEditorProcessNewObject {

	function __construct(){

		add_action( 'wp_ajax_process_new_object', 				array($this, 'process_new_object' ));

	}

	/**
	*
	*
	*	@todo - replace the echo with wp_send_json_success
	*/
	function process_new_object() {

		if ( isset( $_POST['action'] ) && $_POST['action'] == 'process_new_object' ) {

			// only run for logged in users and check caps
			if( !aesop_editor_user_can_edit() )
				return;

			// ok security passes so let's process some data
			if ( wp_verify_nonce( $_POST['nonce'], 'aesop-editor-new-post' ) ) {

				$title 	= isset( $_POST['story_title'] ) ? $_POST['story_title'] : false;
				$object = isset( $_POST['object'] ) ? $_POST['object'] : false;

				// insert a new post
				$post_args = array(
				  	'post_title'    => wp_strip_all_tags( trim( $title ) ),
				  	'post_status'   => 'draft',
				  	'post_type'	  	=> trim( $object ),
				  	'post_content'  => apply_filters('aesop_editor_new_object_content','People are made of stories...')
				);

				$postid = wp_insert_post( apply_filters('aesop_editor_new_object_args', $post_args ) );

				do_action( 'aesop_editor_new_object', $postid, $object, $title, get_current_user_ID() );

				wp_send_json_success(array('postlink' => get_permalink($postid)));

			} else {

				echo 'error';
			}
		}

		die();
	}


}
new aesopEditorProcessNewObject;



