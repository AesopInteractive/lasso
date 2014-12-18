<?php

class aesopEditorAssets {

	function __construct(){

		add_action('wp_enqueue_scripts', array($this,'scripts'));
		add_action('wp_head',array($this,'save_button'));

	}

	function scripts(){

		wp_enqueue_script('jquery-ui-core');
		wp_enqueue_script('aesop-editor-script', AESOP_EDITOR_URL.'/includes/libs/builder/contentbuilder.js', array('jquery'), AESOP_EDITOR_VERSION, true);
		wp_enqueue_style('aesop-editor-style', AESOP_EDITOR_URL.'/includes/libs/builder/contentbuilder.css', AESOP_EDITOR_VERSION, true);

		wp_enqueue_script('aesop-editor', AESOP_EDITOR_URL.'/public/assets/js/aesop-editor.js', array('jquery'), AESOP_EDITOR_VERSION, true);
		wp_localize_script('aesop-editor', 'aesop_editor',array(
			'ajaxurl' 		=> admin_url( 'admin-ajax.php' ),
			'editor' 		=> '#aesop-editor--content',
			'author'		=> is_user_logged_in() ? get_current_user_ID() : false,
			'nonce'			=> wp_create_nonce('aesop_editor'),
		));

	}

	function save_button(){
		echo '<a data-post-id="'.get_the_ID().'" style="z-index:999;position:fixed;bottom:20px;
		right:20px;" id="aesop-editor--save" href="#" class="btn btn-primary">save</a>';
	}


}
new aesopEditorAssets;