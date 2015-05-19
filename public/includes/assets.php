<?php
/**
*	Load the assets used for Lasso
*
*	@since 1.0
*/
namespace lasso_public_facing;

use lasso\process\gallery;

class assets {

	public function __construct(){

		add_action('wp_enqueue_scripts', array($this,'scripts'));
	}

	public function scripts(){

		if ( lasso_user_can('edit_posts') ) {

			wp_enqueue_style('lasso-style', LASSO_URL.'/public/assets/css/lasso.css', LASSO_VERSION, true);

			wp_enqueue_script('jquery-ui-draggable');
			wp_enqueue_script('jquery-ui-sortable');
			wp_enqueue_script('jquery-ui-slider');

			// media uploader
			wp_enqueue_media();

			// url for json api
			$home_url = function_exists('json_get_url_prefix') ? json_get_url_prefix() : false;

			$article_object 	= lasso_editor_get_option('article_class','lasso_editor');
			$featImgClass 		= lasso_editor_get_option('featimg_class','lasso_editor');
			$titleClass 		= lasso_editor_get_option('title_class','lasso_editor');
			$toolbar_headings  	= lasso_editor_get_option('toolbar_headings', 'lasso_editor');
			$objectsNoSave  	= lasso_editor_get_option('dont_save', 'lasso_editor');

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
				'publishYes'		=> __('Yes, publish it!','lasso'),
				'deletePost'		=> __('Trash Post?','lasso'),
				'deleteYes'			=> __('Yes, trash it!','lasso'),
				'warning'			=> __('Oh snap!','laso'),
				'cancelText'		=> __('O.K. got it!','lasso'),
				'missingClass'		=> __('It looks like we are missing the Article CSS class. Lasso will not function correctly without this CSS class.','lasso'),
				'missingConfirm'	=> __('Update Settings', 'lasso')
			);

			$api_url = trailingslashit( home_url() ) . 'lasso-internal-api';

			$gallery_class = new gallery();
			$gallery_nonce_action = $gallery_class->nonce_action;
			$gallery_nonce = wp_create_nonce( $gallery_nonce_action );

			// localized objects
			$objects = array(
				'ajaxurl' 			=> esc_url( $api_url ),
				'editor' 			=> 'lasso--content', // ID of editable content (without #) DONT CHANGE
				'article_object'	=> $article_object,
				'featImgClass'		=> $featImgClass,
				'titleClass'		=> $titleClass,
				'strings'			=> $strings,
				'settingsLink'		=> function_exists('is_multisite') && is_multisite() ? network_admin_url( 'settings.php?page=lasso-editor' ) : admin_url( 'admin.php?page=lasso-editor-settings' ),
				'post_status'		=> get_post_status( $postid ),
				'postid'			=> $postid,
				'permalink'			=> get_permalink(),
				'edit_others_pages'	=> current_user_can('edit_others_pages') ? 'true' : 'false',
				'edit_others_posts'	=> current_user_can('edit_others_posts') ? 'true' : 'false',
				'userCanEdit'		=> current_user_can('edit_post', $postid ),
				'can_publish_posts'	=> current_user_can('publish_posts'),
				'can_publish_pages'	=> current_user_can('publish_pages'),
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
				'featImgNonce'		=> $gallery_nonce,
				'getGallImgNonce'	=> $gallery_nonce,
				'createGallNonce'	=> $gallery_nonce,
				'swapGallNonce'		=> $gallery_nonce,
				'titleNonce'		=> wp_create_nonce('lasso_update_title'),
				'wpImgNonce'		=> wp_create_nonce('lasso_update_wpimg'),
				'deletePost'		=> wp_create_nonce('lasso_delete_post'),
				'component_options' => lasso_editor_options_blob(),
				'newPostModal'		=> lasso_editor_newpost_modal(),
				'allPostModal'		=> lasso_editor_allpost_modal(),
				'mapFormFooter'		=> lasso_map_form_footer(),
				'refreshRequired'	=> lasso_editor_refresh_message(),
				'objectsNoSave'		=> $objectsNoSave,
				'supportedNoSave'	=> lasso_supported_no_save(),
				'mapTileProvider'   => function_exists('aesop_map_tile_provider') ? aesop_map_tile_provider( $postid ) : false,
				'mapLocations'		=> get_post_meta( $postid, 'ase_map_component_locations' ),
				'mapStart'			=> get_post_meta( $postid, 'ase_map_component_start_point', true ),
				'mapZoom'			=> get_post_meta( $postid, 'ase_map_component_zoom', true )
			);

			// wp api client
			wp_enqueue_script( 'wp-api-js', LASSO_URL.'/public/assets/js/source/util--wp-api.js', array( 'jquery', 'underscore', 'backbone' ), LASSO_VERSION, true );
				$settings = array( 'root' => home_url( $home_url ), 'nonce' => wp_create_nonce( 'wp_json' ) );
				wp_localize_script( 'wp-api-js', 'WP_API_Settings', $settings );

			wp_enqueue_script('lasso', LASSO_URL.'/public/assets/js/lasso.min.js', array('jquery'), LASSO_VERSION, true);
			wp_localize_script('lasso', 'lasso_editor', apply_filters('lasso_localized_objects', $objects ) );


		}

	}

}

