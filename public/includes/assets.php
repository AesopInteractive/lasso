<?php
/**
*	Load the assets used for Editus
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

	
		global $post;
		if ( lasso_user_can('edit_posts') && 
		     !( function_exists( 'is_gutenberg_page' ) && has_blocks( $post->post_content) )) {// bail if the post has Gutenberg bloc
			
			/**    Returns the time offset from UTC
			*/
			function get_UTC_offset() {
				$timezone_string = get_option( 'timezone_string' );
				if (empty( $timezone_string ) ) {
					return get_option('gmt_offset')*3600;
				}
				
				$origin_dtz = new \DateTimeZone($timezone_string);				
				$origin_dt = new \DateTime("now", $origin_dtz);
				$offset = $origin_dtz->getOffset($origin_dt);
				return $offset;
			}

			wp_enqueue_style('lasso-style', LASSO_URL.'/public/assets/css/lasso.css', LASSO_VERSION, true);

            //don't load autocomplete if it's a stockholm theme
			$themename  	= wp_get_theme()->get('Name');
			if ($themename !='Stockholm' ) {
				wp_enqueue_script('jquery-ui-autocomplete');
			}
			wp_enqueue_script('jquery-ui-draggable');
			wp_enqueue_script('jquery-ui-sortable');
			wp_enqueue_script('jquery-ui-slider');
			
			// media uploader
			wp_enqueue_media();

			// url for json api
			$home_url = function_exists('json_get_url_prefix') ? json_get_url_prefix() : false;

			$article_object 	= lasso_editor_get_option('article_class','lasso_editor');

			$article_object 	= empty( $article_object ) && lasso_get_supported_theme_class() ? lasso_get_supported_theme_class() : $article_object;

			$featImgClass 		= lasso_editor_get_option('featimg_class','lasso_editor');
			if (empty( $featImgClass )) {
				$featImgClass = lasso_get_supported_theme_featured_image_class();
			}
			$titleClass 		= lasso_editor_get_option('title_class','lasso_editor');
			if (empty( $titleClass )) {
				$titleClass = lasso_get_supported_theme_title_class();
			}
			$toolbar_headings  	= lasso_editor_get_option('toolbar_headings', 'lasso_editor');
			$toolbar_headings_h4  	= lasso_editor_get_option('toolbar_headings_h4', 'lasso_editor');
			$objectsNoSave  	= lasso_editor_get_option('dont_save', 'lasso_editor');
			$objectsNonEditable  	= lasso_editor_get_option('non_editable', 'lasso_editor');
			$disableRESTSave = lasso_editor_get_option('save_using_rest_disabled', 'lasso_editor');
			$save_to_post_disabled  = lasso_editor_get_option( 'post_save_disabled', 'lasso_editor' );
			$edit_post_disabled  = lasso_editor_get_option( 'post_edit_disabled', 'lasso_editor' );
			
			$bold_tag = lasso_editor_get_option('bold_tag', 'lasso_editor','b');
			$i_tag = lasso_editor_get_option('i_tag', 'lasso_editor','i');

			
			//text alignement
			$show_align = lasso_editor_get_option('toolbar_show_alignment', 'lasso_editor');
			
			//make links editable under the editing mode
			$links_editable = lasso_editor_get_option('links_editable', 'lasso_editor');
			
			//color 
			$show_color = lasso_editor_get_option('toolbar_show_color', 'lasso_editor');
			
			// allow change date for post
			$allow_change_date = lasso_editor_get_option('allow_change_date', 'lasso_editor');
			
			if ($show_color) {
				//color picker
				wp_enqueue_style( 'wp-color-picker' );
				wp_enqueue_script( 'iris', admin_url( 'js/iris.min.js' ), array( 'jquery-ui-draggable', 'jquery-ui-slider', 'jquery-touch-punch' ), false, 1 );
			}
			
			// click to insert components, not drag and drop
			$insert_comp_ui = lasso_editor_get_option('insert_comp_ui', 'lasso_editor');
			
			// do we support pending status
			$no_pending_status = lasso_editor_get_option('no_pending_status', 'lasso_editor');
			
			
			// custom fields
			
			$custom_fields = apply_filters( 'editus_custom_fields', null ); //array('testFieldName' => '#field1');



			// post id reference
			$postid 			= get_the_ID();
			$tz_offset = get_UTC_offset();
			$post_date = get_the_time('U', $postid);
			$time = (time()+$tz_offset);
            $delta = $time - $post_date;

			$strings = array(
				'save' 				=> __('Save','lasso'),
				'selectText'	  	=> __('Please Select Text First.','lasso'),
				'cancel' 			=> __('Cancel','lasso'),
				'exiteditor' 		=> __('Exit Editor','lasso'),
				'saving' 			=> __('Saving...','lasso'),
				'saved'				=> __('Saved!','lasso'),
				'adding' 			=> __('Adding...','lasso'),
				'added'				=> __('Added!','lasso'),
				'loading' 			=> __('Loading...','lasso'),
				'loadMore'			=> __('Load More','lasso'),
				'close'			=> __('Close','lasso'),
				'noPostsFound'		=> __('No more posts found','lasso'),
				'fetchFail'	    	=> __('Fetching failed.','lasso'),
				'galleryCreated' 	=> __('Gallery Created!','lasso'),
				'galleryUpdated' 	=> __('Gallery Updated!','lasso'),
				'justWrite'			=> __('Just write...','lasso'),
				'chooseImage'		=> __('Choose an image','lasso'),
				'updateImage'		=> __('Update Image','lasso'),
				'insertImage'		=> __('Insert Image','lasso'),
				'selectImage'		=> __('Select Image','lasso'),
				'removeFeatImg'     => __('Remove featured image?','lasso'),
				'updateSelectedImg' => __('Update Selected Image','lasso'),
				'chooseImages'		=> __('Choose images','lasso'),
				'editImage'			=> __('Edit Image','lasso'),
				'addImages'			=> __('Add Images','lasso'),
				'addNewGallery'		=> __('Add New Gallery','lasso'),
				'selectGallery'		=> __('Select Editus Gallery Image','lasso'),
				'useSelectedImages' => __('Use Selected Images','lasso'),
				'publishPost'		=> __('Publish Post?','lasso'),
				'publishYes'		=> __('Yes, publish it!','lasso'),
				'deletePost'		=> __('Trash Post?','lasso'),
				'deleteYes'			=> __('Yes, trash it!','lasso'),
				'warning'			=> __('Oh snap!','laso'),
				'cancelText'		=> __('O.K. got it!','lasso'),
				'missingClass'		=> __('It looks like we are either missing the Article CSS class, or it is configured incorrectly. Editus will not function correctly without this CSS class.','lasso'),
				'missingConfirm'	=> __('Update Settings', 'lasso'),
				'helperText'		=> __('one more letter','lasso'),
				'editingBackup'  	=> __('You are currently editing a backup copy of this post.'),
				
				'catsPlaceholder'     => __('add categories...'),
				'tagsPlaceholder'     => __('add tags...'),
				
				
			);

			$api_url = trailingslashit( home_url() ) . 'lasso-internal-api';

			$gallery_class = new gallery();
			$gallery_nonce_action = $gallery_class->nonce_action;
			$gallery_nonce = wp_create_nonce( $gallery_nonce_action );
			
			
            if ($allow_change_date) {
			    $permalink = get_site_url().'/?p='.$postid;
            } else {
                $permalink = get_permalink($postid);
            }
			
			// rest api
			$rest_nonce = '';
			$rest_root = site_url().'/?rest_route=/'; 
			  
			if (function_exists('rest_url')) {
				//$rest_root = esc_url_raw( rest_url());
				$rest_nonce = wp_create_nonce( 'wp_rest' );
				$settings = array( 'root' => $rest_root, 'nonce' => $rest_nonce );
				wp_enqueue_script( 'wp-api', '', array( 'jquery', 'underscore', 'backbone' ), LASSO_VERSION, true );
				wp_localize_script( 'wp-api', 'wpApiSettings', $settings );
				wp_localize_script( 'wp-api', 'WP_API_Settings', $settings );
				
				if ( class_exists( 'WP_REST_Controller' )) {
					// we are using REST API V2
					$using_restapiv2 = true;
				}
			}

			// localized objects
			$objects = array(
				'ajaxurl' 			=> esc_url( $api_url ),
				'ajaxurl2' 			=> esc_url( admin_url( 'admin-ajax.php' )),
				'siteUrl'           => site_url(),
				'rest_root'         => $rest_root,
				'rest_nonce'        => $rest_nonce,
				'editor' 			=> 'lasso--content', // ID of editable content (without #) DONT CHANGE
				'article_object'	=> $article_object,
				'featImgClass'		=> $featImgClass,
				'titleClass'		=> $titleClass,
				'strings'			=> $strings,
				'settingsLink'		=> function_exists('is_multisite') && is_multisite() ? network_admin_url( 'settings.php?page=lasso-editor' ) : admin_url( 'admin.php?page=lasso-editor-settings' ),
				'post_status'		=> get_post_status( $postid ),
				'postid'			=> $postid,
				'permalink'			=> $permalink,
				'edit_others_pages'	=> current_user_can('edit_others_pages') ? true : false,
				'edit_others_posts'	=> current_user_can('edit_others_posts') ? true : false,
				'userCanEdit'		=> current_user_can('edit_post', $postid ),
				'can_publish'		=> is_page() ? current_user_can('publish_pages') : current_user_can('publish_posts'),
				//'can_publish_posts'	=> current_user_can('publish_posts'),
				//'can_publish_pages'	=> current_user_can('publish_pages'),
				'author'			=> is_user_logged_in() ? get_current_user_ID() : false,
				'nonce'				=> wp_create_nonce('lasso_editor'),
				'handle'			=> lasso_editor_settings_toolbar(),
				'toolbar'			=> lasso_editor_text_toolbar(),
				'toolbarHeadings'   => $toolbar_headings,
				'toolbarHeadingsH4'   => $toolbar_headings_h4,
				'component_modal'	=> lasso_editor_component_modal(),
				'component_sidebar'	=> lasso_editor_component_sidebar(),
				'components'		=> lasso_editor_components(),
				'wpImgEdit'			=> lasso_editor_wpimg_edit(),
				'wpVideoEdit'		=> lasso_editor_wpvideo_edit(),
				'featImgControls'   => lasso_editor_image_controls(),
				'featImgNonce'		=> $gallery_nonce,
				'getGallImgNonce'	=> $gallery_nonce,
				'createGallNonce'	=> $gallery_nonce,
				'swapGallNonce'		=> $gallery_nonce,
				'titleNonce'		=> wp_create_nonce('lasso_update_title'),
				'wpImgNonce'		=> wp_create_nonce('lasso_update_wpimg'),
				'deletePost'		=> wp_create_nonce('lasso_delete_post'),
				'searchPosts'		=> wp_create_nonce('lasso_search_posts'),
				'component_options' => lasso_editor_options_blob(),
				'newPostModal'		=> lasso_editor_newpost_modal(),
				'allPostModal'		=> lasso_editor_allpost_modal(),
				'mapFormFooter'		=> lasso_map_form_footer(),
				'refreshRequired'	=> lasso_editor_refresh_message(),
				'objectsNoSave'		=> $objectsNoSave,
				'objectsNonEditable' => $objectsNonEditable,
				'supportedNoSave'	=> lasso_supported_no_save(),
				'postCategories'    => lasso_get_objects('category'),
				'postTags'    		=> lasso_get_objects('tag'),
				'noResultsDiv'		=> lasso_editor_empty_results(),
				'noRevisionsDiv'	=> lasso_editor_empty_results('revision'),
				'mapTileProvider'   => function_exists('aesop_map_tile_provider') ? aesop_map_tile_provider( $postid ) : false,
				'mapLocations'		=> get_post_meta( $postid, 'ase_map_component_locations' ),
				'mapStart'			=> get_post_meta( $postid, 'ase_map_component_start_point', true ),
				'mapZoom'			=> get_post_meta( $postid, 'ase_map_component_zoom', true ),
				'revisionModal' 	=> lasso_editor_revision_modal(),
				'isMobile'          => wp_is_mobile(),
				'enableAutoSave'    => lasso_editor_get_option( 'enable_autosave', 'lasso_editor' ),
				'showColor'         => $show_color,
				'showAlignment'     => $show_align,
				'showIgnoredItems'  => lasso_editor_get_option('show_ignored_items', 'lasso_editor'),
				'restapi2'          => $using_restapiv2,
				'saveusingrest'     => $using_restapiv2 && !$disableRESTSave,
				'newObjectContent'  => '<p>'.apply_filters( 'lasso_new_object_content', __( 'Once upon a time...','lasso') ).'</p>',
				'disableSavePost'   => $save_to_post_disabled,
				'disableEditPost'   => $edit_post_disabled,
				'boldTag'           => $bold_tag,
				'iTag'           	=> $i_tag,
				'customFields'      => $custom_fields,
				'clickToInsert'     => ($insert_comp_ui =='click'),
				'buttonOnEmptyP'     => ($insert_comp_ui =='mediumcom'),      // auto show a button to insert components on an empty paragraph      
                'rtl'               => is_rtl(),				
				'skipToEdit'        =>( $delta < 10 && $delta >=0 ), // if it's a new post, skip to edit mode
				'linksEditable'    => $links_editable,
				'supportPendingStatus' => !$no_pending_status,
				'tableCode' => apply_filters( 'lasso_table_html_code','<table><tr><th>Cell 1</th><th>Cell 2</th></tr><tr><td>Cell 3</td><td>Cell 4</td></tr></table>'),
			);


			// wp api 
			
			
			if (!$using_restapiv2) {
               // enqueue REST API V1
			   wp_enqueue_script( 'wp-api-js', LASSO_URL.'/public/assets/js/source/util--wp-api.js', array( 'jquery', 'underscore', 'backbone' ), LASSO_VERSION, true );
			   $settings = array( 'root' => home_url( $home_url ), 'nonce' => wp_create_nonce( 'wp_json' ) );
			   wp_localize_script( 'wp-api-js', 'WP_API_Settings', $settings );
			}
			
			if ($allow_change_date) {
				wp_enqueue_script('jquery-ui-datepicker');
				wp_register_style('jquery-ui', '//ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/base/jquery-ui.css');
				wp_enqueue_style('jquery-ui');
			}

			$postfix = ( defined( 'SCRIPT_DEBUG' ) && true === SCRIPT_DEBUG ) ? '' : '.min';
			if ($show_color) {
				wp_enqueue_script('lasso', LASSO_URL. "/public/assets/js/lasso{$postfix}.js", array('jquery', 'wp-api','iris'), LASSO_VERSION, true);
			} else {
			    wp_enqueue_script('lasso', LASSO_URL. "/public/assets/js/lasso{$postfix}.js", array('jquery', 'wp-api'), LASSO_VERSION, true);
			}
			wp_localize_script('lasso', 'lasso_editor', apply_filters('lasso_localized_objects', $objects ) );


		}

	}

}

