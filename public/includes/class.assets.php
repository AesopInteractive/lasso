<?php

class aesopEditorAssets {

	function __construct(){

		add_action('wp_enqueue_scripts', array($this,'scripts'));
	}

	function scripts(){

		// only run on posts and pages if user is logged in and has teh right capabilities (edit_posts)
		if ( is_singular() && aesop_editor_user_can_edit() ) {

			wp_enqueue_style('aesop-editor-style', AESOP_EDITOR_URL.'/public/assets/css/aesop-editor.css', AESOP_EDITOR_VERSION, true);

			wp_enqueue_script('jquery-ui-draggable');
			wp_enqueue_script('jquery-ui-sortable');
			wp_enqueue_script('jquery-ui-slider');

			// media uploader
			wp_enqueue_media();

			$article_object = aesop_editor_get_option('article_class','aesop_editor');
			$featImgClass = aesop_editor_get_option('featimg_class','aesop_editor');
			$titleClass = aesop_editor_get_option('title_class','aesop_editor');

			wp_enqueue_script('aesop-editor', AESOP_EDITOR_URL.'/public/assets/js/aesop-editor.js', array('jquery'), AESOP_EDITOR_VERSION, true);
			wp_localize_script('aesop-editor', 'aesop_editor',array(
				'ajaxurl' 			=> admin_url( 'admin-ajax.php' ),
				'editor' 			=> 'aesop-editor--content', // ID of editable content (without #) DONT CHANGE
				'article_object'	=> $article_object,
				'featImgClass'		=> $featImgClass,
				'titleClass'		=> $titleClass,
				'post_status'		=> get_post_status( get_the_ID() ),
				'postid'			=> get_the_ID(),
				'permalink'			=> get_permalink(),
				'author'			=> is_user_logged_in() ? get_current_user_ID() : false,
				'nonce'				=> wp_create_nonce('aesop_editor'),
				'handle'			=> aesop_editor_settings_toolbar(),
				'toolbar'			=> aesop_editor_text_toolbar(),
				'component_modal'	=> aesop_editor_component_modal(),
				'component_sidebar'	=> aesop_editor_component_sidebar(),
				'components'		=> aesop_editor_components(),
				'wpImgEdit'			=> aesop_editor_wpimg_edit(),
				'featImgControls'   => aesop_editor_image_controls(),
				'featImgNonce'		=> wp_create_nonce('aesop_editor_image'),
				'getGallImgNonce'	=> wp_create_nonce('aesop_get_gallery_images'),
				'createGallNonce'	=> wp_create_nonce('aesop_create_gallery'),
				'swapGallNonce'		=> wp_create_nonce('aesop_swap_gallery'),
				'titleNonce'		=> wp_create_nonce('aesop_update_title'),
				'wpImgNonce'		=> wp_create_nonce('aesop_update_wpimg'),
				'component_options' => aesop_editor_options_blob(),
				'userCanEdit'		=> current_user_can('edit_posts'),
				'newPostModal'		=> aesop_editor_newpost_modal()
			));
		}

	}

}
new aesopEditorAssets;