<?php

/**
 * These functions are then localized and then appended with JS in enter-editor.js
 *
 * @since 1.0
 */

/**
 * Add the editor controls to any singular post object
 *
 * @since 1.0
 */
add_action( 'wp_footer', 'lasso_editor_controls' );
function lasso_editor_controls() {

	global $post;

	if ( lasso_user_can('edit_posts') ) {

		$status = get_post_status( get_the_ID() );
		$use_old_ui   = lasso_editor_get_option( 'use_old_ui', 'lasso_editor' );
		$button_color1 = lasso_editor_get_option('button-color1', 'lasso_editor','#0000ff');
		$button_color2 = lasso_editor_get_option('button-color2', 'lasso_editor','#000000');
		$dialog_color = lasso_editor_get_option('dialog-color', 'lasso_editor','#000055');
		$text_color = lasso_editor_get_option('text-color', 'lasso_editor','#ffffff');
		$hover_color1 = lasso_editor_adjustBrightness($button_color1, 50);
		$hover_color2 = lasso_editor_adjustBrightness($button_color2, 50);

		// let users add custom css classes
		$custom_classes = apply_filters( 'lasso_control_classes', '' );

		$post_access_class   = '';
		$post_new_disabled   = lasso_editor_get_option( 'post_adding_disabled', 'lasso_editor' );
		$post_settings_disabled = lasso_editor_get_option( 'post_settings_disabled', 'lasso_editor' );
		$shortcodify_disabled = lasso_editor_get_option( 'shortcodify_disabled', 'lasso_editor' );


		// CSS class if adding new post objects is disabled
		if ( 'on' == $post_new_disabled ) { $post_access_class = 'lasso--post-new-disabled'; }

		// CSS class if adjust settings is disabled
		if ( 'on' == $post_settings_disabled ) { $post_access_class = 'lasso--post-settings-disabled'; }

		// CSS class if adding new post objects AND settings are disabled
		if ( 'on' == $post_new_disabled && 'on' == $post_settings_disabled ) { $post_access_class = 'lasso--post-all-disabled'; }

		// CSS class if shortcodify or (Aesop Shortcode Conversion) is disabled
		$sc_saving_class = 'on' == $shortcodify_disabled ? 'shortcodify-disabled' : 'shortcodify-enabled';

		// user is capable
		$is_capable = is_singular() && lasso_user_can('edit_post');
		$is_mobile = wp_is_mobile();
		
		$mobile_style = $is_mobile ? 'style="bottom:0px;"' : null;
		$can_publish = lasso_user_can('publish_posts') || lasso_user_can('publish_pages');
		?>
		<style>
		#lasso-html--table:before {
			content: "<?php esc_attr_e( 'Table', 'lasso' );?>";
		}
		
		
		<?php

		if (!$use_old_ui) {
		?>
		
		.lasso-editor-controls--wrap, #lasso--post-settings2,#lasso--save,#lasso--post-delete,#lasso--exit,#lasso--publish {
			background-image: -webkit-linear-gradient(top,<?php echo $button_color1;?> 0,<?php echo $button_color2;?> 100%);
			background-image: -o-linear-gradient(top,<?php echo $button_color1;?> 0,<?php echo $button_color2;?> 100%);
			background-image: linear-gradient(to bottom,<?php echo $button_color1;?> 0,<?php echo $button_color2;?> 100%);
			color: <?php echo $text_color;?>;
		}
		
		.lasso--controls__right a:before, #lasso-toolbar--html__footer_desc, ul.lasso-editor-controls li:before,#lasso-side-comp-button.toolbar--side li:before
        {
			color: <?php echo $text_color;?> !important;
		}
		
		
		
		ul.lasso-editor-controls li:hover, #lasso--exit:hover,#lasso--post-settings2:hover,#lasso--post-delete:hover,#lasso--publish:hover,#lasso--save:hover {
			background-image: -webkit-linear-gradient(top,<?php echo $hover_color1;?> 0,<?php echo $hover_color2;?> 100%);
			background-image: -o-linear-gradient(top,<?php echo $hover_color1;?> 0,<?php echo $hover_color2;?> 100%);
			background-image: linear-gradient(to bottom,<?php echo $hover_color1;?> 0,<?php echo $hover_color2;?> 100%);
		}
		
		.lasso--modal__inner,.sweet-alert,#lasso-toolbar--components.toolbar--drop-up ul,#lasso-toolbar--components__list,#lasso-toolbar--html.html--drop-up #lasso-toolbar--html__wrap,
		#lasso-toolbar--link.link--drop-up #lasso-toolbar--link__wrap		{
			background: <?php echo $dialog_color;?>;
			color: <?php echo $text_color;?>;
		}
		.sweet-alert p,.lasso--modal__inner label,.lasso--toolbar__inner label {
			color: <?php echo $text_color;?> !important;
		}
		
		<?php if (!$is_mobile) { ?>
			.lasso-editor-controls--wrap {
				display:table;
			}
			ul.lasso-editor-controls {
				height:42px;
				font-size: 22px;
			}
			.lasso-editor-controls--wrap {
				height:42px;
			}
			#lasso--post-all:before {
				font-size: 22px;
			}

			ul.lasso-editor-controls li {
				height: 42px;
			}
		<?php
            } 
		} else { 
		?> 

            #lasso-toolbar--components__list {
                background:black !important;
            }
            
        <?php
        }
        ?>
        </style>
		<div id="lasso--controls" class="lasso-post-status--<?php echo sanitize_html_class( $status );?> <?php echo sanitize_html_class( $custom_classes );?>" data-post-id="<?php echo get_the_ID();?>" >

			<ul class="lasso--controls__center lasso-editor-controls lasso-editor-controls--wrap <?php echo $post_access_class;?> "  <?php echo $mobile_style ?> >

				<?php do_action( 'lasso_editor_controls_before' );

				if ( $is_capable ) { ?>

					<li id="lasso--edit" title="<?php esc_attr_e( 'Edit Post', 'lasso' );?>"><a href="#" class="lasso--button__primary"></a></li>

					<?php if ( 'off' == $post_settings_disabled || empty( $post_settings_disabled ) ) { ?>
						<li id="lasso--post-settings" title="<?php esc_attr_e( 'Post Settings', 'lasso' );?>"><a href="#" class="lasso--button__primary"></a></li>
					<?php }

				} ?>

				<li id="lasso--post-all" title="<?php esc_attr_e( 'All Posts', 'lasso' );?>"><a href="#" class="lasso--button__primary"></a></li>

				<?php if ( $is_capable && wp_revisions_enabled( $post ) ) { ?>
					<li id="lasso--post-revisions" title="<?php esc_attr_e( 'Revisions', 'lasso' );?>"><a href="#" class="lasso--button__primary"></a></li>
				<?php } ?>

				<?php if ( ( 'off' == $post_new_disabled || empty( $post_new_disabled ) && lasso_user_can('edit_posts') ) ) { ?>
					<li id="lasso--post-new" title="<?php esc_attr_e( 'Add Post', 'lasso' );?>"><a href="#" class="lasso--button__primary"></a></li>
				<?php } ?>

				<?php do_action( 'lasso_editor_controls_after' );?>

			</ul>

			<?php if ( is_singular() && !$is_mobile ) { ?>

				<div class="lasso--controls__right" data-posttype="<?php echo get_post_type( get_the_ID() );?>" data-status="<?php echo $status;?>">
				
					<a href="#" title="<?php esc_attr_e( 'Delete Post', 'lasso' );?>" id="lasso--post-delete" class="lasso-save-post lasso--button <?php echo $sc_saving_class;?>"></a>
					<a href="#" title="<?php esc_attr_e( 'Post Settings', 'lasso' );?>" id="lasso--post-settings2" class="lasso-save-post lasso--button <?php echo $sc_saving_class;?>"></a>


					<a href="#" title="<?php esc_attr_e( 'Save Post', 'lasso' );?>" id="lasso--save" class="lasso-save-post lasso--button <?php echo $sc_saving_class;?>"></a>

					<?php if ( ('draft' == $status ) || ('pending' == $status && $can_publish) ) { ?>
						<a href="#" title="<?php $can_publish ? esc_attr_e( 'Publish Post', 'lasso' ) : esc_attr_e( 'Submit For Review', 'lasso' );?>" id="lasso--publish" class="lasso-publish-post lasso--button <?php echo $sc_saving_class;?>"></a>
					<?php } ?>
					

				</div>

			<?php } ?>

		</div>
		
		
		<?php do_action( 'lasso_editor_controls_after_outside' );?>

	<?php }
}

/**
 * Draw the side panel that houses the component settings
 * This is opened when the settings icon is clicked on a single component
 * JS detects the type and will fill in the necessary options for the shortcode based on  lasso_editor_options_blob() at the end of this file
 *
 * @since 1.0
 */
function lasso_editor_component_sidebar() {

	ob_start();


	// let users add custom css classes
	$custom_classes = apply_filters( 'lasso_sidebar_classes', '' );
	?>
	<div id="lasso--sidebar" class="<?php echo sanitize_html_class( $custom_classes );?>" >
		<div class="lasso--sidebar__inner">
			<div id="aesop-generator-settings"><div id="lasso--component__settings"></div></div>
		</div>
	</div>

	<?php return ob_get_clean();
}

/**
 * Draw the main toolbar used to edit the text
 *
 * @since 1.0
 */
function lasso_editor_text_toolbar() {

	ob_start();

	
	$is_mobile = wp_is_mobile();

	// check for lasso story engine and add a class doniting this
	$ase_status = class_exists( 'Aesop_Core' ) || defined( 'LASSO_CUSTOM' ) ? 'ase-active' : 'ase-not-active';

	// let users add custom css classes
	$custom_classes = apply_filters( 'lasso_toolbar_classes', '' );

	// are toolbar headings enabled
	$toolbar_headings      = lasso_editor_get_option( 'toolbar_headings', 'lasso_editor' );
	$toolbar_headings_h4      = lasso_editor_get_option( 'toolbar_headings_h4', 'lasso_editor' );
	$toolbar_list      = lasso_editor_get_option( 'toolbar_list', 'lasso_editor' );

	$toolbar_class  = $toolbar_headings ? 'toolbar-extended' : false;
	
	// mobile styles
    $mobile_class = $is_mobile ? 'lasso-mobile' : false;
	$mobile_style =$is_mobile ? 'style="bottom:0px;"' : null;
	
	//show color
	$show_color = lasso_editor_get_option('toolbar_show_color', 'lasso_editor');
	
	//show alignment
	$show_align = lasso_editor_get_option('toolbar_show_alignment', 'lasso_editor');
	
	$status = get_post_status( get_the_ID() );
	
	$shortcodify_disabled = lasso_editor_get_option( 'shortcodify_disabled', 'lasso_editor' );
	
	$sc_saving_class = ('on' == $shortcodify_disabled || $ase_status == 'ase-not-active')  ? 'shortcodify-disabled' : 'shortcodify-enabled';

    $use_wp_block_image = lasso_editor_get_option('use_wp_block_image', 'lasso_editor','off');

	?>
	<div class="lasso--toolbar_wrap lasso-editor-controls--wrap <?php echo $toolbar_class.' '.$mobile_class.' '.$ase_status.' '.sanitize_html_class( $custom_classes );?>" <?php echo $mobile_style ?>>
		<ul class="lasso--toolbar__inner lasso-editor-controls" <?php if ($is_mobile) {echo 'style="float:left;"';}?>>
			<?php do_action( 'lasso_toolbar_components_before' );?>
		    <li id="lasso-toolbar--bold" title="<?php esc_attr_e( 'Bold', 'lasso' );?>"></li>
		    <li id="lasso-toolbar--underline" title="<?php esc_attr_e( 'Underline', 'lasso' );?>"></li>
		    <li id="lasso-toolbar--italic" title="<?php esc_attr_e( 'Italicize', 'lasso' );?>"></li>
		    <li id="lasso-toolbar--strike" title="<?php esc_attr_e( 'Strikethrough', 'lasso' );?>"></li>
			<li id="lasso-toolbar--components" class="lasso-toolbar--components" title="<?php esc_attr_e( 'Insert Component', 'lasso' );?>" style="color:#ffffa0;">
			    <ul id="lasso-toolbar--components__list" style="display:none;color:white;">
			    	<?php if ( 'ase-active' == $ase_status ): ?>
						<li data-type="image" title="<?php esc_attr_e( 'Image', 'lasso' );?>" class="lasso-toolbar--component__image"></li>
						<li data-type="character" title="<?php esc_attr_e( 'Character', 'lasso' );?>" class="lasso-toolbar--component__character"></li>
						<li data-type="quote" title="<?php esc_attr_e( 'Quote', 'lasso' );?>"  class="lasso-toolbar--component__quote"></li>
						<!--li data-type="content" title="<?php esc_attr_e( 'Content', 'lasso' );?>"  class="lasso-toolbar--component__content"></li-->
						<li data-type="chapter" title="<?php esc_attr_e( 'Chapter', 'lasso' );?>"  class="lasso-toolbar--component__chapter"></li>
						<li data-type="parallax" title="<?php esc_attr_e( 'Parallax', 'lasso' );?>"  class="lasso-toolbar--component__parallax"></li>
						<li data-type="audio" title="<?php esc_attr_e( 'Audio', 'lasso' );?>"  class="lasso-toolbar--component__audio"></li>
						<li data-type="video" title="<?php esc_attr_e( 'Video', 'lasso' );?>"  class="lasso-toolbar--component__video"></li>
						<li data-type="map" title="<?php esc_attr_e( 'Map', 'lasso' );?>"  class="lasso-toolbar--component__map"></li>
						<li data-type="timeline_stop" title="<?php esc_attr_e( 'Timeline', 'lasso' );?>"  class="lasso-toolbar--component__timeline"></li>
						<li data-type="document" title="<?php esc_attr_e( 'Document', 'lasso' );?>"  class="lasso-toolbar--component__document"></li>
						<li data-type="collection" title="<?php esc_attr_e( 'Collection', 'lasso' );?>"  class="lasso-toolbar--component__collection"></li>
						<li data-type="gallery" title="<?php esc_attr_e( 'Gallery', 'lasso' );?>"  class="lasso-toolbar--component__gallery"></li>
						<?php if ( class_exists ('Aesop_GalleryPop') ) { ?>
						     <li data-type="gallery" title="<?php esc_attr_e( 'Gallery Pop', 'lasso' );?>"  class="lasso-toolbar--component__gallerypop"></li>
						<?php }?>
						<?php if ( class_exists ('Aesop_Events') ) { ?>
						     <li data-type="events" title="<?php esc_attr_e( 'Event', 'lasso' );?>"  class="lasso-toolbar--component__event"></li>
						<?php }?>
					<?php else: ?>
                        <?php if ($use_wp_block_image == 'on') { ?>
                            <li data-type="wpimg-block" title="<?php esc_attr_e( 'WordPress Image', 'lasso' );?>" class="image lasso-toolbar--component__image"></li>
                        <?php } else { ?>
						    <li data-type="wpimg" title="<?php esc_attr_e( 'WordPress Image', 'lasso' );?>" class="image lasso-toolbar--component__image"></li>
                        <?php } ?>
						<li data-type="wpquote" title="<?php esc_attr_e( 'WordPress Quote', 'lasso' );?>" class="quote lasso-toolbar--component__quote"></li>
						<!--li data-type="wpvideo" title="<?php esc_attr_e( 'WordPress Video', 'lasso' );?>" class="video lasso-toolbar--component__video"></li-->
					<?php endif; ?>
					<?php do_action( 'lasso_toolbar_components' );?>
			    </ul>
			</li>
		    <?php if ( $toolbar_headings ): ?>
		    <li id="lasso-toolbar--h2" title="<?php esc_attr_e( 'H2 Heading', 'lasso' );?>"></li>
		    <li id="lasso-toolbar--h3" title="<?php esc_attr_e( 'H3 Heading', 'lasso' );?>"></li>
			<?php endif; ?>
			
			
			
			<?php if ( $toolbar_headings_h4 ): ?>
		    <li id="lasso-toolbar--h4" title="<?php esc_attr_e( 'H4 Heading', 'lasso' );?>"></li>
		    <li id="lasso-toolbar--h5" title="<?php esc_attr_e( 'H5 Heading', 'lasso' );?>"></li>
			<li id="lasso-toolbar--h6" title="<?php esc_attr_e( 'H6 Heading', 'lasso' );?>"></li>
			<?php endif; ?>
			
			<?php if ( $show_color ): ?>
		    <li id="lasso-toolbar--color-set" title="<?php esc_attr_e( 'Set Color for Selected Text', 'lasso' );?>"></li>
		    <li id="lasso-toolbar--color-pick" title="<?php esc_attr_e( 'Choose Color', 'lasso' );?>"></li>
			<?php endif; ?>
			
			<?php if ( $toolbar_list ): ?>
		    <li id="lasso-toolbar--ol" title="<?php esc_attr_e( 'Ordered List', 'lasso' );?>"></li>
		    <li id="lasso-toolbar--ul" title="<?php esc_attr_e( 'Unordered List', 'lasso' );?>"></li>
			<?php endif; ?>
					
		    
			<li id="lasso-toolbar--link" title="<?php esc_attr_e( 'Anchor Link', 'lasso' );?>">
		    	<div id="lasso-toolbar--link__wrap" <?php echo $mobile_style ?> >
		    		<div id="lasso-toolbar--link__inner" contenteditable="true" placeholder="<?php esc_attr_e( 'http://url.com', 'lasso' );?>"></div>
		    		<a href="#" title="<?php esc_attr_e( 'Create Link', 'lasso' );?>" class="lasso-toolbar--link__control" id="lasso-toolbar--link__create" ></a>
					<input class="styled-checkbox" type="checkbox" id="aesop-toolbar--link_newtab" checked/>
                    <label for="aesop-toolbar--link_newtab"><?php esc_attr_e( 'Open in a New Tab', 'lasso' );?></label>
		    	</div>
		    </li>
		    <?php do_action( 'lasso_toolbar_components_after' );?>
		    <li id="lasso-toolbar--html" title="<?php esc_attr_e( 'Insert HTML or Code', 'lasso' );?>">
		    	<div id="lasso-toolbar--html__wrap" <?php echo $mobile_style ?>>
		    		<div id="lasso-toolbar--html__inner" contenteditable="true" placeholder="<?php esc_attr_e( 'Enter HTML to insert', 'lasso' );?>"></div>
		    		<div id="lasso-toolbar--html__footer">
					<div id="lasso-toolbar--html__footer_desc" >
					<?php esc_attr_e( 'Enter HTML to insert', 'lasso' );?><br>
					<?php esc_attr_e( 'You can also use Shortcodes', 'lasso' );?><br>
					<?php esc_attr_e( 'You can also enter a URL to embed, such as Youtube, Vimeo and Twitter URLs.', 'lasso' );?>
					</div>
		    			<ul class="lasso-toolbar--html-snips">
						
		    				<?php if ( !$toolbar_headings ): ?>
		    				<li id="lasso-html--h2" title="<?php esc_attr_e( 'H2 Heading', 'lasso' );?>">
		    				<li id="lasso-html--h3" title="<?php esc_attr_e( 'H3 Heading', 'lasso' );?>">
		    				<?php endif; ?>
		    				<li id="lasso-html--ol" title="<?php esc_attr_e( 'Ordered List', 'lasso' );?>">
							<li id="lasso-html--ul" title="<?php esc_attr_e( 'Unordered List', 'lasso' );?>">
							
							<li id="lasso-html--table" title="<?php esc_attr_e( 'Table', 'lasso' );?>">
		    			</ul>
		    			<a class="lasso-toolbar--html__control lasso-toolbar--html__cancel" href="#"><?php _e( 'Cancel', 'lasso' );?></a>
		    			<a href="#" title="<?php esc_attr_e( 'Insert HTML or Code', 'lasso' );?>" class="lasso-toolbar--html__control" id="lasso-toolbar--html__insert" ><?php _e( 'Insert', 'lasso' );?></a>
		    		</div>
		    	</div>
		    </li>
			<?php if ( $show_align ): ?>
		    <li id="lasso-toolbar--left-align" title="<?php esc_attr_e( 'Text Left Align', 'lasso' );?>"></li>
		    <li id="lasso-toolbar--center-align" title="<?php esc_attr_e( 'Text Center Align', 'lasso' );?>"></li>
			<li id="lasso-toolbar--right-align" title="<?php esc_attr_e( 'Text Right Align', 'lasso' );?>"></li>
			<?php endif; ?>
		</ul>
		<?php if ( is_singular() && $is_mobile ) { ?>

				<div class="lasso--controls__right" data-posttype="<?php echo get_post_type( get_the_ID() );?>" data-status="<?php echo $status;?>" style="position:static;bottom:0px;right;0px;left:auto;">

					<a href="#" title="<?php esc_attr_e( 'Delete Post', 'lasso' );?>" id="lasso--post-delete" class="lasso-save-post lasso--button <?php echo $sc_saving_class;?>"></a>
					<a href="#" title="<?php esc_attr_e( 'Post Settings', 'lasso' );?>" id="lasso--post-settings2" class="lasso-save-post lasso--button <?php echo $sc_saving_class;?>"></a>

					<a href="#" title="<?php esc_attr_e( 'Save Post', 'lasso' );?>" id="lasso--save" class="lasso-save-post lasso--button <?php echo $sc_saving_class;?>"></a>

					<?php if ( 'draft' == $status && ( lasso_user_can('publish_posts') || lasso_user_can('publish_pages') )  ) { ?>
						<a href="#" title="<?php esc_attr_e( 'Publish Post', 'lasso' );?>" id="lasso--publish" class="lasso-publish-post lasso--button <?php echo $sc_saving_class;?>"></a>
					<?php } ?>

				</div>

		<?php } ?>
	</div>

	<?php return ob_get_clean();
}

/**
 * Draw the controls used for the component settings within each component
 *
 * @since 1.0
 */
function lasso_editor_settings_toolbar() {

	$delete_nonce = wp_create_nonce( 'lasso-delete-nonce' );

	ob_start();


	// let users add custom css classes
	$custom_classes = apply_filters( 'lasso_component_classes', '' );

	?>
	<ul class="lasso-component--controls editus-center <?php echo sanitize_html_class( $custom_classes );?>" contenteditable="false">
		<li class="lasso-drag" title="<?php esc_attr_e( 'Move', 'lasso' );?>"></li>
		<li class="lasso-component--settings__trigger  lasso-settings" title="<?php esc_attr_e( 'Settings', 'lasso' );?>"></li>
		<li class="lasso-clone" title="<?php esc_attr_e( 'Clone', 'lasso' );?>"></li>
		<li class="lasso-delete" data-postid="<?php echo get_the_ID();?>" data-nonce="<?php echo $delete_nonce;?>" title="<?php esc_attr_e( 'Delete', 'lasso' );?>"></li>
	</ul>

	<?php return ob_get_clean();
}

/**
 * Draws the controls used for changing the featured image
 *   These controls are appended based on the class set in the define
 *
 * @since 1.0
 */
function lasso_editor_image_controls() {

	ob_start();


	// has post thumbnail
	$has_thumbnail = has_post_thumbnail( get_the_ID() ) ? 'class="lasso--featImg--has-thumb"' : false;

	?>
	<ul id="lasso--featImgControls" <?php echo $has_thumbnail;?>>
		<li id="lasso--featImgUpload"><a title="<?php esc_attr_e( 'Replace Image', 'lasso' );?>" href="#"><i class="lasso-icon-image"></i></a></li>
		<li id="lasso--featImgDelete"><a title="<?php esc_attr_e( 'Delete Image', 'lasso' );?>" href="#"><i class="lasso-icon-bin2"></i></a></li>
		<li id="lasso--featImgSave"><a href="#"><?php esc_attr_e( 'save', 'lasso' );?></a></li>
	</ul>

	<?php return ob_get_clean();
}


/**
 * Used to house post settings like scheduling, slugs and draft status
 * Note: the "add new" will use the same object as the currently shown. For example, if the user
 * is currently on a post, and clicks add new, then it'll add a new post. If the user is on a
 * post type like "dog", then it will create a new post type called "dog"
 *
 * @since 1.0
 */
function lasso_editor_component_modal() {

	ob_start();


	global $post;

	$postid = get_the_ID();

	$status = get_post_status( $postid );
	$nonce = wp_create_nonce( 'lasso-update-post-settings' );

	// let users add custom css classes
	$custom_classes = apply_filters( 'lasso_modal_settings_classes', '' );

	// objects categories
	$categories 		= lasso_get_post_objects( $postid, 'category' );
	$tags 				= lasso_get_post_objects( $postid, 'tag' );
	
	// modal tabs
	$tabs  				= lasso_modal_addons('tab');
	$content 			= lasso_modal_addons('content');
	
	//editor options
	$allow_change_date = lasso_editor_get_option('allow_change_date', 'lasso_editor');
    $allow_edit_excerpt = lasso_editor_get_option('allow_edit_excerpt', 'lasso_editor');
	$no_url_setting = lasso_editor_get_option('no_url_setting', 'lasso_editor');
	$support_custom_taxonomy   = lasso_editor_get_option( 'support_custom_taxonomy', 'lasso_editor' );
	
	//get custom taxonomy
	if ($support_custom_taxonomy) {
		$custom_taxonomies         = array_diff(get_object_taxonomies( get_post_type( $postid ), 'names' ), ['category','post_tag','post_format']);
	} else {
		$custom_taxonomies = [];
	}

	// are we singular
	$is_singular 		= is_singular();
	$is_singular_class 	= $is_singular ? 'lasso--postsettings__2col' : 'lasso--postsettings__1col';
	$has_thumb_class    = has_post_thumbnail() ? 'has-thumbnail' : 'no-thumbnail';
	$theme_supports     = current_theme_supports('post-thumbnails');
	$default_image 		= LASSO_URL.'/admin/assets/img/empty-img.png';
	
	// do we support pending status
	$no_pending_status = lasso_editor_get_option('no_pending_status', 'lasso_editor');
    
    $excerpt = $post->post_excerpt;

?>
	<div id="lasso--post-settings__modal" class="lasso--modal lassoShowAnimate <?php echo sanitize_html_class( $custom_classes );?>">
		<div class="lasso--modal__inner">

			<?php if( $tabs ) { echo $tabs; } ?>

			<div class="lasso--modal__content modal__content--core visible" data-addon-content="core">
				<form id="lasso--postsettings__form" enctype="multipart/form-data" class="lasso--post-form <?php echo $is_singular_class.' '.$has_thumb_class;?>" >

					<?php if ( $is_singular && $theme_supports ) : ?>
					<div class="lasso--postsettings__left">
						<label><?php _e( 'Featured Image', 'lasso' );?><span class="lasso-util--help lasso-util--help-top" data-tooltip="<?php esc_attr_e( 'Change the featured image for this post.', 'lasso' );?>"><i class="lasso-icon-help"></i></span></label>
						<div class="lasso--post-thumb" data-default-thumb="<?php echo esc_url( $default_image );?>">

							<div id="lasso--post-thumb__controls" class="lasso--post-thumb__controls">
								<i id="lasso--post-thumb__add" title="<?php _e('Change Featured Image','lasso');?>" class="dashicons dashicons-edit"></i>
								<i id="lasso--post-thumb__delete" title="<?php _e('Delete Featured Image','lasso');?>" class="dashicons dashicons-no-alt"></i>
								<i id="lasso--save-status" class="lasso-icon lasso-icon-spinner6 not-visible"></i>
							</div>

							<?php echo has_post_thumbnail() ? get_the_post_thumbnail( $post->ID, 'medium' ) : '<img src="'.$default_image.'">'; ?>

						</div>
						<div id="lasso--featImgSave"><a href="#" class="not-visible">Save</a></div>

					</div>
					<?php endif; ?>

					<div class="lasso--postsettings__right">

						<?php if( lasso_user_can('publish_posts') || lasso_user_can('publish_pages') ): ?>
						<div class="lasso--postsettings__option story-status-option">
							<label><?php _e( 'Status', 'lasso' );?><span class="lasso-util--help lasso-util--help-top" data-tooltip="<?php esc_attr_e( 'Change the status of the post to draft or publish.', 'lasso' );?>"><i class="lasso-icon-help"></i></span></label>
							<ul class="story-status story-status-<?php echo sanitize_html_class( $status );?>">
								<li id="lasso--status-draft"><?php _e( 'Draft', 'lasso' );?></li>
								<?php if( !$no_pending_status ): ?>								
								<li id="lasso--status-pending"><?php _e( 'Pending', 'lasso' );?></li>
								<?php endif; ?>
								<li id="lasso--status-publish"><?php _e( 'Publish', 'lasso' );?></li>
							</ul>
							<div class="lasso--slider_wrap">
								<div id="lasso--slider"></div>
							</div>
						</div>
						<?php endif; ?>

						<?php if ( 'publish' == $status  && !$no_url_setting): ?>
						<div class="lasso--postsettings__option story-slug-option">
							<label><?php _e( 'Post URL', 'lasso' );?><span class="lasso-util--help lasso-util--help-top" data-tooltip="<?php esc_attr_e( 'Change the URL (slug) of this post.', 'lasso' );?>"><i class="lasso-icon-help"></i></span></label>
							<input class="lasso--modal__trigger-footer" type="text" name="story_slug" value="<?php echo isset( $post ) ? esc_attr( $post->post_name ) : false;?>">
						</div>
						<?php endif; ?>

					</div>

					<div class="lasso--postsettings__middle">

						<div class="lasso--postsettings__option story-categories-option">
							<label style="width:120px;"><?php _e( 'Categories', 'lasso' );?><span class="lasso-util--help lasso-util--help-top" data-tooltip="<?php esc_attr_e( 'Type a category name and press enter.', 'lasso' );?>"><i class="lasso-icon-help"></i></span></label>
							<input id="lasso--cat-select" class="lasso--modal__trigger-footer" type="hidden" name="story_cats" value="<?php echo $categories;?>">
						</div>

						<div class="lasso--postsettings__option story-tags-option">
							<label><?php _e( 'Tags', 'lasso' );?><span class="lasso-util--help lasso-util--help-top" data-tooltip="<?php esc_attr_e( 'Type a tag name and press enter.', 'lasso' );?>"><i class="lasso-icon-help"></i></span></label>
							<input id="lasso--tag-select" class="lasso--modal__trigger-footer" type="hidden" name="story_tags" value="<?php echo $tags;?>">
						</div>
						
						<?php
						if (!empty($custom_taxonomies)) {
						?>
						<div class="lasso--postsettings__option story-custom-taxonomy-option">
							<label><?php _e( 'Custom Taxonomy', 'lasso' );?><span class="lasso-util--help lasso-util--help-top" data-tooltip="<?php esc_attr_e( 'Choose custom taxonomy.', 'lasso' );?>"><i class="lasso-icon-help"></i></span></label>
							<select id="lasso--custom-taxo-select" class="lasso--modal__trigger-footer" name="custom_taxo">
							<?php foreach ($custom_taxonomies as $taxonomy) {?>
							<option value="<?php echo $taxonomy?>"><?php echo $taxonomy?></option>
							<?php }?>
							</select>
							<input id="lasso--custom-taxo-input" class="lasso--modal__trigger-footer" type="hidden" name="custom_taxo_input" value="Uncategorized">
							<input id="lasso--custom-taxo-store" class="lasso--modal__trigger-footer" type="hidden" name="story_custom_taxonomies" value="">
						</div>
					    <?php
						}
						?>
						
                        <?php 
						if ($allow_edit_excerpt) { 
						?>
                        <div class="lasso--postsettings__option story-excerpt-option">
							<label><?php _e( 'Excerpt', 'lasso' );?><span class="lasso-util--help lasso-util--help-top" data-tooltip="<?php esc_attr_e( 'Edit excerpt', 'lasso' );?>"><i class="lasso-icon-help"></i></span></label>
							<input id="lasso--excerpt" class="lasso--modal__trigger-footer" type="text" name="excerpt" value="<?php echo $excerpt;?>" style="width:100%">
						</div>
                        <?php
						}?>
						<?php 
						if ($allow_change_date) { 
						    $dateformat = get_option( 'date_format' ); 
						?>
						    <label><?php _e( 'Post Date', 'lasso' ); ?></label>
							<input type="text" class="editus_custom_date" name="post_date" value="<?php echo get_the_time($dateformat, $postid);?>"/>
							<a href="#" id="lasso--postsettings-setnow"><?php _e( 'Set to Now', 'lasso' ); ?></a>
						<?php
						}?>

					</div>
					<!-- alternate way to display categories disabled now -->
					<!--div style="max-height:300px;overflow-y: scroll;"-->
                    <?php
							/*$allcats = explode(",",lasso_get_objects('category'));
							$currcats = explode(",",$categories);
							foreach ( $allcats  as $category ) {
								if (empty($category)) continue;
							   $checked ="";
							   if (  in_array( $category, $currcats ) ) {
									$checked = 'checked="checked"';
									
							   }
							   echo '<label><input type="checkbox" '.$checked.' name="categories" id="'.$category.'" >'.$category.'</label>';
							}*/
					?>
					<!--/div-->

					<?php do_action( 'lasso_modal_post_form' ); // action ?>

					<div class="lasso--postsettings__footer" >
						<a href="#" class="lasso--postsettings-cancel"><?php _e( 'Cancel', 'lasso' );?></a>
						<input type="hidden" name="status" value="">
						<input type="hidden" name="categories" value="">
						<input type="hidden" name="postid" value="<?php echo get_the_ID();?>">
						<input type="hidden" name="action" value="process_update-object_post">
						<input type="hidden" name="nonce" value="<?php echo $nonce;?>">
						<?php do_action( 'lasso_modal_post_form_footer' ); // action ?>
						<input type="submit" id="lasso--postsettings-submit" value="<?php esc_attr_e( 'Save', 'lasso' );?>">
					</div>

				</form>
			</div>

			<?php if( $tabs ) { echo $content; } ?>

		</div>

	</div>
	<div id="lasso--modal__overlay"></div>

	<?php return ob_get_clean();
}

/**
 * Used to house the form for creating a new post within amodal
 *
 * @since 1.0
 */
function lasso_editor_newpost_modal() {

	global $post;

	ob_start();


	$status = get_post_status( get_the_ID() );

	$nonce = wp_create_nonce( 'lasso-editor-new-post' );

	// let users add custom css classes
	$custom_classes = apply_filters( 'lasso_modal_post_classes', '' );

	// return the post type
	$type = get_post_type( get_the_ID() );

	$mobile_style = "";
	if (wp_is_mobile()) {
		//$mobile_style = 'style="top:140px !important;"';
	}
	?>
	<div id="lasso--post-new__modal" class="lasso--modal lasso--modal__med lassoShowAnimate <?php echo sanitize_html_class( $custom_classes );?>" <?php echo $mobile_style;?>">
		<div class="lasso--modal__inner lasso--hasnewform">

			<form id="lasso--postnew__form" enctype="multipart/form-data" class="lasso--post-form">

				<div class="lasso--postsettings__option story-slug-option lasso--last-option">
					<label><?php esc_attr_e( 'New <span>post</span> title', 'lasso' );?><span class="lasso-util--help lasso-util--help-top" data-tooltip="<?php esc_attr_e( 'Specify title for new post, then save to edit.', 'lasso' );?>"><i class="lasso-icon-help"></i></span></label>
					<input class="lasso--modal__trigger-footer" type="text" required name="story_title" value="" placeholder="<?php esc_attr_e( 'Type Your Title Here', 'lasso' );?>">
						<div class="lasso--select-wrap" style="width:90px">
						<select id="lasso--select-type" name="story_type">

							<?php
								$types = lasso_post_types_names();
								if ( !empty( $types ) ) {
									foreach( $types as $name => $label ) 
                                    {   	
                                        $type = $name;									
										//$type = preg_replace( '/s\b/','', $name );
										if ($type == 'page' && !current_user_can('edit_pages')) {
											continue;
										}
										printf( '<option value="%s">%s</option>', lcfirst( esc_attr( $type ) ) , ucfirst( esc_attr( $label ) ) );
									}

								}
							?>

						</select>
					</div>
				</div>

				<div class="lasso--postsettings__footer">
					<a href="#" class="lasso--postsettings-cancel"><?php _e( 'Cancel', 'lasso' );?></a>
					<input type="hidden" name="action" value="process_new-object_post">
					<?php
						if ( !empty( $types ) ) {
							// get the first element
							$keys = array_keys($types);
						    $type =$keys[0];						
							$type = preg_replace( '/s\b/','', $type );
							printf( '<input type="hidden" name="object" value="%s">', lcfirst( esc_attr( $type ) ) );		
						}
					?>
					<input type="hidden" name="nonce" value="<?php echo $nonce;?>">
					<input type="submit" value="<?php esc_attr_e( 'Create', 'lasso' );?>">
				</div>

			</form>

		</div>
	</div>
	<div id="lasso--modal__overlay"></div>

	<?php return ob_get_clean();
}

/**
 * Used to house the all posts pop-up
 *
 * @since 0.9.3
 */
function lasso_editor_allpost_modal() {

	global $post;
	
	global $wp_post_types;
    $labels = &$wp_post_types['post']->labels;
    $labels->name = 'Articles';

	ob_start();

	// post status
	$status = get_post_status( get_the_ID() );

	// let users add custom css classes
	$custom_classes = apply_filters( 'lasso_modal_all_post_classes', '' );

	?>
	<div id="lasso--all-posts__modal" class="lasso--modal lasso--modal__full lassoShowAnimate <?php echo sanitize_html_class( $custom_classes );?>" style="max-height:100%">
		<div class="lasso--modal__inner">

			<div class="lasso--post-filtering not-visible">
				<div class="lasso--search__results">
					<span id="lasso--results-found"></span><?php _e('results found','lasso');?>
				</div>
				<div class="lasso--search">
					<i id="lasso--search__toggle" class="dashicons dashicons-search"></i>
					<input id="lasso--search-field" type="text" placeholder="search...">
				</div>
			</div>

			<ul class="lasso--post-object-list">
				<?php

				$post_types = lasso_post_types_names();
				$rest_bases = lasso_post_types_rest_base();

				if ( ! empty( $post_types ) ) {
					$first = 'active';
					foreach( $post_types as $name => $label ) {
						if (array_key_exists($name, $rest_bases)) {
							printf( '<li class="%1s lasso--show-objects" data-post-type="%2s">%3s</li>', esc_attr( $first), esc_attr( $rest_bases[$name] ), esc_attr( $label ) );
						}
						$first = '';
					}

				}

				do_action('lasso_modal_post_objects');?>

			</ul>
			<div id="lasso--loading" class="lasso--loading"><div class="lasso--loader"></div></div>

			<ul id="lasso--post-list" class="lasso--post-list"></ul>

		</div>
	</div>
	<div id="lasso--modal__overlay"></div>

	<?php return ob_get_clean();
}

function lasso_editor_wpimg_edit() {

	ob_start();


    $use_old_wpimg = lasso_editor_get_option('use_old_wpimg', 'lasso_editor','off');
    
	// let users add custom css classes
	$custom_classes = apply_filters( 'lasso_wpimg_classes', '' );

	?>
	<ul class="lasso-component--controls editus-center <?php echo sanitize_html_class( $custom_classes );?>" contenteditable="false">
		<li class="lasso-drag" title="<?php esc_attr_e( 'Move', 'lasso' );?>"></li>
        <?php if ($use_old_wpimg=='on') {?>
            <li  class="lasso--wpimg-edit lasso-settings" title="<?php esc_attr_e( 'Settings', 'lasso' );?>"></li>
        <?php } else {?>
            <li  class="lasso-component--settings__trigger lasso-settings" title="<?php esc_attr_e( 'Settings', 'lasso' );?>"></li>
        <?php } ?>
		<li class="lasso-clone" title="<?php esc_attr_e( 'Clone', 'lasso' );?>"></li>
		<li class="lasso-delete" title="<?php esc_attr_e( 'Delete', 'lasso' );?>"></li>
	</ul>

	<?php return ob_get_clean();
}

function lasso_editor_wpimg_block_edit() {
	ob_start();

	?>
	<ul class="lasso-component--controls editus-center" contenteditable="false">
		<li class="lasso-drag" title="<?php esc_attr_e( 'Move', 'lasso' );?>"></li>
            <li  class="lasso-component--settings__trigger lasso-settings" title="<?php esc_attr_e( 'Settings', 'lasso' );?>"></li>
		<li class="lasso-clone" title="<?php esc_attr_e( 'Clone', 'lasso' );?>"></li>
		<li class="lasso-delete" title="<?php esc_attr_e( 'Delete', 'lasso' );?>"></li>
	</ul>

	<?php return ob_get_clean();
}

function lasso_editor_wpvideo_edit() {

	ob_start();


	// let users add custom css classes
	$custom_classes = apply_filters( 'lasso_wpimg_classes', '' );

	?>
	<ul class="lasso-component--controls editus-center <?php echo sanitize_html_class( $custom_classes );?>" contenteditable="false">
		<li class="lasso-drag" title="<?php esc_attr_e( 'Move', 'lasso' );?>"></li>
		<li id="lasso--wpvideo-edit" class="lasso-settings" title="<?php esc_attr_e( 'Settings', 'lasso' );?>"></li>
		<li class="lasso-clone" title="<?php esc_attr_e( 'Clone', 'lasso' );?>"></li>
		<li class="lasso-delete" title="<?php esc_attr_e( 'Delete', 'lasso' );?>"></li>
	</ul>

	<?php return ob_get_clean();
}

/**
 * Used to house the hidden input fields for actions and process saving for the map component
 *
 * @since 1.0
 */
function lasso_map_form_footer() {

	$nonce = wp_create_nonce( 'lasso-process-map' );

	ob_start();

	?>
	<div class="lasso--map-form__footer">
		<input type="hidden" name="postid" value="<?php echo get_the_ID();?>">
		<input type="hidden" name="nonce" value="<?php echo $nonce;?>">
		<input type="hidden" name="action" value="process_map_save">
		<input type="submit" class="lasso--map-form__submit" value="<?php esc_attr_e( 'Save Locations', 'lasso' );?>">
	</div>

	<?php return ob_get_clean();

}

/**
 * Some things aren't real-time updatable so we need to append a message in certain areas on certain actions
 *
 * @since 1.0
 */
function lasso_editor_refresh_message() {

	ob_start();

	?>
	<div id="lasso--pagerefresh" class="visible">
		<?php _e( 'Save this post and refesh the page to see these changes.', 'lasso' );?>
	</div>

	<?php return ob_get_clean();
}

/**
 * Draw out the settings field based on the shortcodes array with options foudn in Aesop Story Engine
 *  This was mostly backported from aesop story engine and modified to allow for non aesop shortcodes and components
 *
 * @since 1.0
 */
function lasso_editor_options_blob() {

	$codes   = function_exists( 'aesop_shortcodes' ) ? aesop_shortcodes() : array();
    $codes   = add_wpimg_options( $codes );
	$codes   = add_wpimg_block_options( $codes );
    $codes   = apply_filters( 'lasso_custom_options', $codes );
	$galleries  = function_exists( 'lasso_editor_galleries_exist' ) && lasso_editor_galleries_exist() ? 'has-galleries' : 'creating-gallery';

	$nonce = wp_create_nonce( 'lasso_gallery' );

	$blob = array();

	if ( empty( $codes ) )
		return;

	foreach ( $codes as $slug => $shortcode ) {
		$return = '';
		// Shortcode has atts

		if ( count( $shortcode['atts'] ) && $shortcode['atts'] ) {

			foreach ( $shortcode['atts'] as $attr_name => $attr_info ) {


				$prefix = isset( $attr_info['prefix'] ) ? sprintf( '<span class="lasso-option-prefix">%s</span>', $attr_info['prefix'] ) : null;

				$return .= '<form id="aesop-generator-settings" class="lasso--component-settings-form" class="'.$galleries.'" method="post">';
				$return .= '<p data-option="'.$attr_name.'" class="lasso-option aesop-'.$slug.'-'.$attr_name.'">';
				$return .= '<label for="aesop-generator-attr-' . $attr_name . '">' . $attr_info['desc'] . '</label>';
				$return .= '<small class="lasso-option-desc">'.$attr_info['tip'].'</small>';
				// Select

				if ( isset( $attr_info['values'] ) ) {

					$return .= '<select name="' . $attr_name . '" id="aesop-generator-attr-' . $attr_name . '" class="lasso-generator-attr">';

					$i=0;

					foreach ( $attr_info['values'] as $attr_value ) {
						$attr_value_selected = $attr_info['default'] == $attr_value ? ' selected="selected"' : '';

						$return .= '<option value="'.$attr_info['values'][$i]['value'].'" ' . $attr_value_selected . '>'.$attr_info['values'][$i]['name'].'</option>';

						$i++;
					}

					$return .= '</select>';

				} else {

					$attr_field_type = isset( $attr_info['type'] ) ? $attr_info['type'] : 'text';

					// image upload
					if ( 'media_upload' == $attr_info['type'] ) {

						$return .= '<input type="' . $attr_field_type . '" name="' . $attr_name . '" value="'.$attr_info['default'].'" id="aesop-generator-attr-' . $attr_name . '" class="lasso-generator-attr aesop-generator-attr-'.$attr_field_type.'" />';
						$return .= '<a href="#" id="lasso-upload-img" class="lasso-option-button" /></a>';

					} elseif ( 'color' == $attr_info['type'] ) {

						$return .= '<input type="color" name="' . $attr_name . '" value="'.$attr_info['default'].'" id="aesop-generator-attr-' . $attr_name . '" class="lasso-generator-attr aesop-generator-attr-'.$attr_field_type.'" />';

					} elseif ( 'text_area' == $attr_info['type'] ) {

						$return .= '<textarea name="' . $attr_name . '" id="aesop-generator-attr-' . $attr_name . '" class="lasso-generator-attr aesop-generator-attr-'.$attr_field_type.'" placeholder="'.$attr_info['default'].'" /></textarea>'.$prefix.'';

					} else {
						$return .= '<input type="' . $attr_field_type . '" name="' . $attr_name . '" value="'.$attr_info['default'].'" id="aesop-generator-attr-' . $attr_name . '" class="lasso-generator-attr aesop-generator-attr-'.$attr_field_type.'" />'.$prefix.'';
					}
				}
				$return .= '</p>';

			}
		}

		///////////////////////////
		// START GALLERY AND MAP FRONT END STUFFS
		///////////////////////////
		if ( isset( $shortcode['front'] ) && true == $shortcode['front'] ) {

			if ( 'gallery' == $shortcode['front_type'] ) {

				$return .= lasso_gallery_editor_module();

			}
		}
		///////////////////////////
		// END GALLERY AND MAP FRONT END STUFFS
		///////////////////////////

		// Single shortcode (not closed)
		if ( 'single' == $shortcode['type'] ) {

			$return .= '<input type="hidden" name="lasso-generator-content" id="lasso-generator-content" value="false" />';

		} else {

			$return .= '<p data-option="content" class="lasso-option lasso-c-comp-text"><label>' . __( 'Content', 'lasso' ) . '</label><textarea type="text" name="lasso-generator-content" id="lasso-generator-content" value="' . $shortcode['content'] . '" /></textarea></p>';
		}

		$return .= '<p class="lasso-buttoninsert-wrap"><a href="#" class="lasso-generator-cancel" id="lasso--sidebar__close">Cancel</a><input type="submit" id="lasso-generator-insert" value="Save Settings"></p>';
		$return .= '<input class="component_type" type="hidden" name="component_type" value="">';
		$return .= '<input type="hidden" name="unique" value="">';
		$return .= '<input type="hidden" name="nonce" id="lasso-generator-nonce" value="'.$nonce.'" />';
		$return .= '</form>';

		// extra JS codes
        if (isset($shortcode['codes'])) {
		    $return .= $shortcode['codes'];
        }
		$blob[$slug] = $return;
	}

	return $blob;
}


function add_wpimg_options( $shortcodes ) {
    $custom = array(
        'wpimg'    => array(
            'name'     => __( 'Image', 'lasso' ),
            'type'     => 'single',
            'atts'     => array(
                'img'    => array(
                    'type'  => 'media_upload',
                    'default'  => '',
                    'desc'   => __( 'Image URL', 'lasso' ),
                    'tip'  => __( 'URL for the image. Click <em>Select Media</em> to open the WordPress Media Library.', 'aesop-core' )
                ),
                'align'    => array(
                    'type'  => 'select',
                    'values'  => array(						
                        array(
                            'value' => 'center',
                            'name' => __( 'Center', 'aesop-core' )
                        ),
                        array(
                            'value' => 'left',
                            'name' => __( 'Left', 'aesop-core' )
                        ),
                        array(
                            'value' => 'right',
                            'name' => __( 'Right', 'aesop-core' )
                        ),
                    ),
                    'default'  => 'center',
                    'desc'   => __( 'Alignment', 'lasso' ),
                    'tip'=>''
                ),			
                
                'imgwidth'    => array(
                    'type'  => 'text_small',
                    'default'  => '300px',
                    'desc'   => __( 'Image Width', 'lasso' ),
                    'tip'  => __( 'Width of the image. You can enter the size in pixels or percentage such as <code>40%</code> or <code>500px</code>.', 'aesop-core' )
                ),
                'imgheight'    => array(
                    'type'  => 'text_small',
                    'default'  => '',
                    'desc'   => __( 'Image Height', 'lasso' ),
                    'tip'  => __( 'Used only for the Panorama mode. Can be set using pixel values such as <code>500px</code>. If unspecified, the original height would be used. ', 'aesop-core' )
                ),	
                'linkoption'    => array(
                    'type'  => 'select',
                    'values'  => array(						
                        array(
                            'value' => 'none',
                            'name' => __( 'None', 'aesop-core' )
                        ),
                        array(
                            'value' => 'img',
                            'name' => __( 'Image', 'aesop-core' )
                        ),
                        array(
                            'value' => 'url',
                            'name' => __( 'URL', 'aesop-core' )
                        ),
                    ),
                    'default'  => 'none',
                    'desc'   => __( 'Link', 'lasso' ),
                    'tip'  => __( 'Click leads to:', 'lasso' )
                ),				
                
                'link'    => array(
                    'type'  => 'text',
                    'default'  => '',
                    'desc'   => __( 'URL Link', 'lasso' ),
                    'tip'  => __( 'URL link', 'lasso' )
                ),
                'alt'    => array(
                    'type'  => 'text',
                    'default'  => '',
                    'desc'   => __( 'Image ALT', 'lasso' ),
                    'tip'  => __( 'ALT tag used for the image. Primarily used for SEO purposes.', 'lasso' )
                ),
                
                'caption'    => array(
                    'type'  => 'text_area',
                    'default'  => '',
                    'desc'   => __( 'Caption', 'lasso' ),
                    'tip'  => __( 'Optional caption for the image.', 'lasso' )
                ),
                

            ),
            'desc'     => __( 'An image.', 'aesop-core' ),
            'codes'    => '<script>	            
						jQuery(document).ready(function($){
                            function linkSetting(l){								
							    if ( l=="url") {
									jQuery(".aesop-wpimg-link").slideDown();						
								}
								else  {
									jQuery(".aesop-wpimg-link").slideUp();
								}
							}
							
							setTimeout( function() { 
                                linkSetting(jQuery("#aesop-generator-attr-linkoption" ).val()); 
								}, 500);
								
							jQuery( "#aesop-generator-attr-linkoption" ).change(function() {
								linkSetting( this.value);
							})
						});
			           </script>'
        )
    );

    return array_merge( $shortcodes, $custom );
}

function add_wpimg_block_options( $shortcodes ) {
    $custom = array(
        'wpimg-block'    => array(
            'name'     => __( 'Image', 'lasso' ),
            'type'     => 'single',
            'atts'     => array(
                'img'    => array(
                    'type'  => 'media_upload',
                    'default'  => '',
                    'desc'   => __( 'Image URL', 'lasso' ),
                    'tip'  => __( 'URL for the image. Click <em>Select Media</em> to open the WordPress Media Library.', 'aesop-core' )
                ),
                'align'    => array(
                    'type'  => 'select',
                    'values'  => array(						
                        array(
                            'value' => 'center',
                            'name' => __( 'Center', 'aesop-core' )
                        ),
                        array(
                            'value' => 'left',
                            'name' => __( 'Left', 'aesop-core' )
                        ),
                        array(
                            'value' => 'right',
                            'name' => __( 'Right', 'aesop-core' )
                        ),
                    ),
                    'default'  => 'center',
                    'desc'   => __( 'Alignment', 'lasso' ),
                    'tip'=>''
                ),		
                'alt'    => array(
                    'type'  => 'text',
                    'default'  => '',
                    'desc'   => __( 'Image ALT', 'lasso' ),
                    'tip'  => __( 'ALT tag used for the image. Primarily used for SEO purposes.', 'lasso' )
                ),
                'caption'    => array(
                    'type'  => 'text',
                    'default'  => '',
                    'desc'   => __( 'Caption', 'lasso' ),
                    'tip'  => __( 'Optional caption for the image.', 'lasso' )
                ),
                'link'    => array(
                    'type'  => 'text',
                    'default'  => '',
                    'desc'   => __( 'Link URL', 'lasso' ),
                    'tip'  => __( 'Optional URL to link.', 'lasso' )
                ),
               

            ),
            'desc'     => __( 'A WP Image Block.', 'aesop-core' ),
            'codes'    => '<script>	            
						jQuery(document).ready(function($){
                            
						});
			           </script>'
        )
    );

    return array_merge( $shortcodes, $custom );
}

/**
 * Revisions modal
 *
 * @since 0.9.8
 *
 * @return string
 */
function lasso_editor_revision_modal() {

	ob_start();
	?>
		<div id="lasso--revision__modal" class="lasso--modal lassoShowAnimate ">

			<div class="lasso--modal__inner">
				<div id="lasso--loading" class="lasso--loading"><div class="lasso--loader"></div></div>
				<div id="lasso--hide" style="display:none;" class="lasso--post-form">
					<i class="lasso-icon lasso-icon-move"></i>
					<label><?php _e( 'Revisions', 'lasso' );?><span class="lasso-util--help lasso-util--help-top" data-tooltip="<?php esc_attr_e( 'Use the slider to view the revision live on the page.', 'lasso' );?>"><i class="lasso-icon-help"></i></span></label>
					<div class="lasso--slider_wrap">
						<div id="lasso--slider"></div>
					</div>
					<ul id="lasso--revision-list"></ul>
					<div class="lasso--btn-group lasso--btn-group-small">
						<a href="#" class="lasso--btn-secondary" id="lasso--close-modal"><?php _e( 'Cancel', 'lasso' );?></a>
						<a href="#" class="lasso--btn-primary" id="lasso--select-revision"><?php _e( 'Select', 'lasso' );?></a>
					</div>
				</div>

			</div>
		</div>
	<?php
	return ob_get_clean();
}

/**
 * 
 * Takes a color code and returns an adjusted value
 * @since 1.0.0
 * Steps should be between -255 and 255. Negative = darker, positive = lighter
 * @return string
 */
function lasso_editor_adjustBrightness($hex, $steps) { 
    $steps = max(-255, min(255, $steps));

    // Normalize into a six character long hex string
    $hex = str_replace('#', '', $hex);
    if (strlen($hex) == 3) {
        $hex = str_repeat(substr($hex,0,1), 2).str_repeat(substr($hex,1,1), 2).str_repeat(substr($hex,2,1), 2);
    }

    // Split into three parts: R, G and B
    $color_parts = str_split($hex, 2);
    $return = '#';

    foreach ($color_parts as $color) {
        $color   = hexdec($color); // Convert to decimal
        $color   = max(0,min(255,$color + $steps)); // Adjust color
        $return .= str_pad(dechex($color), 2, '0', STR_PAD_LEFT); // Make two char hex code
    }

    return $return;
}
