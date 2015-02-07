<?php

/**
*
*	Adds a new post object
*
*	@since 1.0
*/
class lassoProcessNewObject {

	function __construct(){

		add_action( 'wp_ajax_process_new_object', 				array($this, 'process_new_object' ));

	}

	/**
	*
	*	Process the post object
	*
	*	@since 1.0
	*/
	function process_new_object() {

		if ( isset( $_POST['action'] ) && $_POST['action'] == 'process_new_object' ) {

			// only run for logged in users and check caps
			if( !lasso_user_can() )
				return;

			// ok security passes so let's process some data
			if ( wp_verify_nonce( $_POST['nonce'], 'lasso-editor-new-post' ) ) {

				$title 	= isset( $_POST['story_title'] ) ? $_POST['story_title'] : false;
				$object = isset( $_POST['object'] ) ? $_POST['object'] : false;

				// insert a new post
				$args = array(
				  	'post_title'    => wp_strip_all_tags( trim( $title ) ),
				  	'post_status'   => 'draft',
				  	'post_type'	  	=> trim( $object ),
				  	'post_content'  => apply_filters('lasso_new_object_content',__('People are made of stories...'))
				);

				$postid = wp_insert_post( apply_filters('lasso_insert_object_args', $args ) );

				do_action( 'lasso_new_object', $postid, $object, $title, get_current_user_ID() );

				wp_send_json_success( array( 'postlink' => get_permalink($postid) ) );

			} else {

				wp_send_json_error();
			}
		}
	}
}
new lassoProcessNewObject;



