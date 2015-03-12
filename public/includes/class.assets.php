<?php

/**
*
*	Load the assets used for Lasso
*
*	@since 1.0
*/
class lassoAssets {

	function __construct(){

		add_action('wp_enqueue_scripts', array($this,'scripts'));
	}

	function scripts(){

		// only run on posts and pages if user is logged in and has teh right capabilities (edit_posts) by default
		if ( apply_filters('lasso_runs_on', is_singular() ) && lasso_user_can() ) {

			wp_enqueue_style('lasso-style', LASSO_URL.'/public/assets/css/lasso.css', LASSO_VERSION, true);

			wp_enqueue_script('jquery-ui-draggable');
			wp_enqueue_script('jquery-ui-sortable');
			wp_enqueue_script('jquery-ui-slider');

			// media uploader
			wp_enqueue_media();

			$article_object 	= lasso_editor_get_option('article_class','lasso_editor');
			$featImgClass 		= lasso_editor_get_option('featimg_class','lasso_editor');
			$titleClass 		= lasso_editor_get_option('title_class','lasso_editor');
			$toolbar_headings  	= lasso_editor_get_option('toolbar_headings', 'lasso_editor');

			// post id reference
			$postid 			= get_the_ID();

			$strings = array(
				'saving' 			=> __('Saving...','lasso'),
				'saved'				=> __('Saved!','lasso'),
				'adding' 			=> __('Adding...','lasso'),
				'added'				=> __('Added!','lasso'),
				'galleryCreated' 	=> __('Gallery Created!','lasso'),
				'galleryUpdated' 	=> __('Gallery Updated!','lasso'),
				'justWrite'			=> __('Just write...','lasso'),
				'chooseImage'		=> __('Choose an image','lasso'),
				'updateImage'		=> __('Update Image','lasso'),
				'insertImage'		=> __('Insert Image','lasso'),
				'selectImage'		=> __('Select Image','lasso'),
				'updateSelectedImg' => __('Update Selected Image','lasso'),
				'chooseImages'		=> __('Choose images','lasso'),
				'editImage'			=> __('Edit Image','lasso'),
				'addImages'			=> __('Add Images','lasso'),
				'addNewGallery'		=> __('Add New Gallery','lasso'),
				'selectGallery'		=> __('Select Lasso Gallery Image','lasso'),
				'useSelectedImages' => __('Use Selected Images','lasso'),
				'publishPost'		=> __('Publish Post?','lasso'),
				'publishYes'		=> __('Yes, publish it!','lasso')
			);

			// localized objects
			$objects = array(
				'ajaxurl' 			=> admin_url( 'admin-ajax.php' ),
				'editor' 			=> 'lasso--content', // ID of editable content (without #) DONT CHANGE
				'article_object'	=> $article_object,
				'featImgClass'		=> $featImgClass,
				'titleClass'		=> $titleClass,
				'strings'			=> $strings,
				'post_status'		=> get_post_status( $postid ),
				'postid'			=> $postid,
				'permalink'			=> get_permalink(),
				'author'			=> is_user_logged_in() ? get_current_user_ID() : false,
				'nonce'				=> wp_create_nonce('lasso_editor'),
				'handle'			=> lasso_editor_settings_toolbar(),
				'toolbar'			=> lasso_editor_text_toolbar(),
				'toolbarHeadings'   => $toolbar_headings,
				'component_modal'	=> lasso_editor_component_modal(),
				'component_sidebar'	=> lasso_editor_component_sidebar(),
				'components'		=> lasso_editor_components(),
				'wpImgEdit'			=> lasso_editor_wpimg_edit(),
				'featImgControls'   => lasso_editor_image_controls(),
				'featImgNonce'		=> wp_create_nonce('lasso_editor_image'),
				'getGallImgNonce'	=> wp_create_nonce('lasso_get_gallery_images'),
				'createGallNonce'	=> wp_create_nonce('lasso_create_gallery'),
				'swapGallNonce'		=> wp_create_nonce('lasso_swap_gallery'),
				'titleNonce'		=> wp_create_nonce('lasso_update_title'),
				'wpImgNonce'		=> wp_create_nonce('lasso_update_wpimg'),
				'component_options' => lasso_editor_options_blob(),
				'userCanEdit'		=> current_user_can('edit_post', $postid ),
				'newPostModal'		=> lasso_editor_newpost_modal(),
				'mapFormFooter'		=> lasso_map_form_footer(),
				'refreshRequired'	=> lasso_editor_refresh_message(),
				'mapTileProvider'   => function_exists('aesop_map_tile_provider') ? aesop_map_tile_provider( $postid ) : false,
				'mapLocations'		=> get_post_meta( $postid, 'ase_map_component_locations' ),
				'mapStart'			=> get_post_meta( $postid, 'ase_map_component_start_point', true ),
				'mapZoom'			=> get_post_meta( $postid, 'ase_map_component_zoom', true )
			);

			wp_enqueue_script('lasso', LASSO_URL.'/public/assets/js/lasso.min.js', array('jquery'), LASSO_VERSION, true);
				wp_localize_script('lasso', 'lasso_editor', apply_filters('lasso_localized_objects', $objects ) );
		}

	}

}
new lassoAssets;