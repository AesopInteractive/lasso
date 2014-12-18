<?php

class aesopEditorAssets {

	function __construct(){

		add_action('wp_enqueue_scripts', array($this,'scripts'));

	}

	function scripts(){

		wp_enqueue_script('jquery-ui-core');
		wp_enqueue_script('aesop-editor-script', AESOP_EDITOR_URL.'/includes/libs/builder/contentbuilder.js', array('jquery'), AESOP_EDITOR_VERSION, true);
		wp_enqueue_style('aesop-editor-style', AESOP_EDITOR_URL.'/includes/libs/builder/contentbuilder.css', AESOP_EDITOR_VERSION, true);

		wp_enqueue_script('aesop-editor', AESOP_EDITOR_URL.'/public/assets/js/aesop-editor.js', array('jquery'), AESOP_EDITOR_VERSION, true);
		wp_localize_script('aesop-editor', 'aesop_editor',array(
			'editor' => '.hentry'
		));

	}


}
new aesopEditorAssets;