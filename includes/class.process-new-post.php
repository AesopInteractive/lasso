<?php

/**
*
*	Adds a new post
*
*/
class aesopEditorProcessNewPost {

	function __construct(){

		add_action( 'wp_ajax_process_new_post', 				array($this, 'process_new_post' ));

	}

	function process_new_post(){

		if ( isset( $_POST['action'] ) && $_POST['action'] == 'process_new_post' ) {

			// only run for logged in users and check caps
			if( !aesop_editor_user_can_edit() )
				return;

			// ok security passes so let's process some data
			if ( wp_verify_nonce( $_POST['nonce'], 'aesop-editor-new-post' ) ) {

				$title 	= isset( $_POST['story_title'] ) ? $_POST['story_title'] : false;

				// insert a new post
				$post_args = array(
				  	'post_title'    => wp_strip_all_tags( trim( $title ) ),
				  	'post_status'   => 'draft',
				  	'post_type'	  	=> 'post',
				  	'post_content'  => 'People are made of stories...'
				);

				$postid = wp_insert_post( $post_args );

				do_action( 'aesop_editor_new_post', $postid, $title, get_current_user_ID() );

				echo get_permalink($postid);


			} else {

				echo 'error';
			}
		}

		die();
	}


}
new aesopEditorProcessNewPost;



