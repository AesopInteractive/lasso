<?php

/**
*
*	These functions are then localized and then appended with JS in enter-editor.js
* 	All are protectd under a capability and logged in check using a filterable function aesop_editor_user_can_edit()
*
*	@since 1.0
*/

/**
*
*	Add the editor controls to any singular post object
*
*	@since 1.0
*/
add_action( 'wp_footer', 'aesop_editor_controls');
function aesop_editor_controls() {

	if ( is_singular() && aesop_editor_user_can_edit() ) {

		$status = get_post_status( get_the_ID() );

		// let users add custom css classes
		$custom_classes = apply_filters('aesop_editor_control_classes', '' );

		$post_access_class 		= '';
		$post_new_disabled 		= aesop_editor_get_option('post_adding_disabled','aesop_editor_advanced');
		$post_settings_disabled = aesop_editor_get_option('post_settings_disabled','aesop_editor_advanced');
		$shortcodify_disabled = aesop_editor_get_option('shortcodify_disabled','aesop_editor_advanced');

		// css class based on accessibility
		if ( 'on' == $post_new_disabled ) {

			$post_access_class = 'aesop-editor--post-new-disabled';

		}

		if ( 'on' == $post_settings_disabled ) {

			$post_access_class = 'aesop-editor--post-settings-disabled';

		}

		if ( 'on' == $post_new_disabled && 'on' == $post_settings_disabled ) {

			$post_access_class = 'aesop-editor--post-all-disabled';
		}

		$sc_saving_class = 'on' == $shortcodify_disabled ? 'shortcodify-disabled' : 'shortcodify-enabled';

		?><div id="aesop-editor--controls" class="aesop-post-status--<?php echo sanitize_html_class( $status );?> <?php echo sanitize_html_class( $custom_classes );?>" data-post-id="<?php echo get_the_ID();?>" >

			<ul class="aesop-editor--controls__center aesop-editor-controls aesop-editor-controls--wrap <?php echo $post_access_class;?> ">

				<li id="aesop-editor--edit" title="Edit Post"><a href="#" class="aesop-editor--button__primary"></a></li>

				<?php if ( 'off' == $post_settings_disabled || empty( $post_settings_disabled ) ) { ?>
					<li id="aesop-editor--post-settings" title="Post Settings"><a href="#" class="aesop-editor--button__primary"></a></li>
				<?php }

				if ( 'off' == $post_new_disabled || empty( $post_new_disabled ) ) { ?>
					<li id="aesop-editor--post-new" title="Add Post"><a href="#" class="aesop-editor--button__primary"></a></li>
				<?php } ?>

			</ul>

			<div class="aesop-editor--controls__right">
				<a href="#" title="Save Post" id="aesop-editor--save" class="aesop-save-post aesop-editor--button <?php echo $sc_saving_class;?>"></a>
				<?php if ( 'draft' == $status ) { ?>
					<a href="#" title="Publish Post" id="aesop-editor--publish" class="aesop-publish-post aesop-editor--button <?php echo $sc_saving_class;?>"></a>
				<?php } ?>
			</div>

		</div>

	<?php }
}

/**
*
*	Draw the side panel that houses the component settings
*	This is opened when the settings icon is clicked on a single component
*	JS detects the type and will fill in the necessary options for the shortcode based on  aesop_editor_options_blob() at the end of this file
*
*	@since 1.0
*/
function aesop_editor_component_sidebar(){

	ob_start();

	if ( !aesop_editor_user_can_edit() )
		return;

	// let users add custom css classes
	$custom_classes = apply_filters('aesop_editor_sidebar_classes', '' );
	?>
	<div id="aesop-editor--sidebar" class="<?php echo sanitize_html_class( $custom_classes );?>" >
		<div class="aesop-editor--sidebar__inner">
			<div id="aesop-editor--component__settings"></div>
		</div>
	</div>
	<?php
	return ob_get_clean();
}

/**
*
*	Draw the main toolbar used to edit the text
*
*	@since 1.0
*/
function aesop_editor_text_toolbar(){

	ob_start();

	if ( !aesop_editor_user_can_edit() )
		return;

	// check for aesop story engine and add a class doniting this
	$ase_status = class_exists('Aesop_Core') || defined('AESOP_EDITOR_CUSTOM') ? 'ase-active' : 'ase-not-active';

	// let users add custom css classes
	$custom_classes = apply_filters('aesop_editor_toolbar_classes', '' );

	?>
	<div class="aesop-editor--toolbar_wrap aesop-editor-controls--wrap <?php echo $ase_status.' '.sanitize_html_class( $custom_classes );?>">
		<ul class="aesop-editor--toolbar__inner aesop-editor-controls">
		    <li id="aesop-toolbar--bold" title="Bold"></li>
		    <li id="aesop-toolbar--underline" title="Underline"></li>
		    <li id="aesop-toolbar--italic" title="Italicize"></li>
		    <li id="aesop-toolbar--strike" title="Strikethrough"></li>
		    <li id="aesop-toolbar--html" title="Insert HTML">
		    	<div id="aesop-toolbar--html__wrap">
		    		<div id="aesop-toolbar--html__inner" contenteditable="true" placeholder="Enter HTML to insert"></div>
		    		<div id="aesop-toolbar--html__footer">
		    			<a class="aesop-toolbar--html__control aesop-toolbar--html__cancel" href="#">Cancel</a>
		    			<a href="#" title="Insert HTML" class="aesop-toolbar--html__control" id="aesop-toolbar--html__insert" >Insert</a>
		    		</div>
		    	</div>
		    </li>
		    <?php if ( 'ase-active' == $ase_status || defined('AESOP_EDITOR_CUSTOM') ): ?>
		    <li id="aesop-toolbar--components" title="Insert Component">
			    <ul id="aesop-toolbar--components__list">
			    	<?php if ( !defined('AESOP_EDITOR_CUSTOM') ) : ?>
					<li data-type="image" title="Image" class="image"></li>
					<li data-type="character" title="Character" class="character"></li>
					<li data-type="quote" title="Quote"  class="quote"></li>
					<li data-type="content" title="Content"  class="content"></li>
					<li data-type="chapter" title="Chapter"  class="chapter"></li>
					<li data-type="parallax" title="Parallax"  class="parallax"></li>
					<li data-type="audio" title="Audio"  class="audio"></li>
					<li data-type="video" title="Video"  class="video"></li>
					<li data-type="map" title="Map"  class="map"></li>
					<li data-type="timeline" title="Timeline"  class="timeline"></li>
					<li data-type="document" title="Document"  class="document"></li>
					<li data-type="collection" title="Collection"  class="collection"></li>
					<li data-type="gallery" title="Gallery"  class="gallery"></li>
					<?php endif;
					do_action('aesop_editor_toolbar_components');?>
			    </ul>
			</li>
			<?php endif; ?>
		</ul>
	</div>
	<?php return ob_get_clean();
}

/**
*
*	Draw the controls used for teh component settings within each component
*
*	@since 1.0
*/
function aesop_editor_settings_toolbar(){

	$delete_nonce = wp_create_nonce('aesop-delete-nonce');

	ob_start();

	if ( !aesop_editor_user_can_edit() )
		return;

	// let users add custom css classes
	$custom_classes = apply_filters('aesop_editor_component_classes', '' );

	?><ul class="aesop-component--controls <?php echo sanitize_html_class( $custom_classes );?>" contenteditable="false">
		<li class="aesop-drag" title="Move"></li>
		<li id="aesop-component--settings__trigger" class="aesop-settings" title="Settings"></li>
		<li class="aesop-clone" title="Clone"></li>
		<li class="aesop-delete" data-postid="<?php echo get_the_ID();?>" data-nonce="<?php echo $delete_nonce;?>" title="Delete"></li>
	</ul>

	<?php return ob_get_clean();
}

/**
*
*	Draws the controls used for changing the featured image
*   These controls are appended based on the class set in the define
*
*	@since 1.0
*/
function aesop_editor_image_controls(){

	ob_start();

	if ( !aesop_editor_user_can_edit() )
		return;

	?>
	<ul id="aesop-editor--featImgControls">
		<li id="aesop-editor--featImgUpload"><a title="Replace Image" href="#"><i class="aesop-icon-image"></i></a></li>
		<li id="aesop-editor--featImgSave"><a href="#">save</a></li>
	</ul>
	<?php return ob_get_clean();
}


/**
*
*	Used to house post settings like scheduling, slugs and draft status
*
*	@since 1.0
*/
function aesop_editor_component_modal(){

	ob_start();

	if ( !aesop_editor_user_can_edit() )
		return;

	global $post;

	$status = get_post_status( get_the_ID() );
	$nonce = wp_create_nonce('aesop-update-post-settings');

	// let users add custom css classes
	$custom_classes = apply_filters('aesop_editor_modal_settings_classes', '' );

	?>
	<div id="aesop-editor--post-settings__modal" class="aesop-editor--modal <?php echo sanitize_html_class( $custom_classes );?>">
		<div class="aesop-editor--modal__inner">
			<form id="aesop-editor--postsettings__form" enctype="multipart/form-data" >

				<div class="aesop-editor--postsettings__option story-status-option">
					<label>Status</label>
					<ul class="story-status story-status-<?php echo sanitize_html_class( $status );?>">
						<li id="aesop-editor--status-draft">Draft</li>
						<li id="aesop-editor--status-publish">Publish</li>
					</ul>
					<div class="aesop-editor--slider_wrap">
						<div id="aesop-editor--slider"></div>
					</div>
				</div>

				<?php if ( 'publish' == $status ): ?>
				<div class="aesop-editor--postsettings__option story-slug-option aesop-editor--last-option">
					<label>URL</label>
					<div class="url-helper"><?php echo esc_url( get_bloginfo('url') );?></div>
					<input type="text" name="story_slug" value="<?php echo isset( $post ) ? esc_attr( $post->post_name ) : false;?>">
				</div>
				<?php endif; ?>

				<div class="aesop-editor--postsettings__footer" style="display:none;">
					<a href="#" class="aesop-editor--postsettings-cancel">Cancel</a>
					<input type="hidden" name="status" value="">
					<input type="hidden" name="postid" value="<?php echo get_the_ID();?>">
					<input type="hidden" name="action" value="process_update_post">
					<input type="hidden" name="nonce" value="<?php echo $nonce;?>">
					<input type="submit" value="Save">
				</div>

			</form>

		</div>
	</div>
	<div id="aesop-editor--modal__overlay"></div>
	<?php

	return ob_get_clean();
}

/**
*
*	Used to house the form for creating a new post within amodal
*	@since 1.0
*/
function aesop_editor_newpost_modal(){

	global $post;

	ob_start();

	if ( !aesop_editor_user_can_edit() )
		return;

	$status = get_post_status( get_the_ID() );

	$nonce = wp_create_nonce('aesop-editor-new-post');

	// let users add custom css classes
	$custom_classes = apply_filters('aesop_editor_modal_post_classes', '' );

	?>
	<div id="aesop-editor--post-new__modal" class="aesop-editor--modal <?php echo sanitize_html_class( $custom_classes );?>">
		<div class="aesop-editor--modal__inner">

			<form id="aesop-editor--postnew__form" enctype="multipart/form-data" >

				<div class="aesop-editor--postsettings__option story-slug-option aesop-editor--last-option">
					<label>New Post Title</label>
					<div class="url-helper"><?php echo esc_url( get_bloginfo('url') );?></div><input type="text" required name="story_title" value="">
				</div>

				<div class="aesop-editor--postsettings__footer">
					<a href="#" class="aesop-editor--postsettings-cancel">Cancel</a>
					<input type="hidden" name="action" value="process_new_post">
					<input type="hidden" name="nonce" value="<?php echo $nonce;?>">
					<input type="submit" value="Create">
				</div>

			</form>

		</div>
	</div>
	<div id="aesop-editor--modal__overlay"></div>
	<?php

	return ob_get_clean();
}

function aesop_editor_wpimg_edit(){

	ob_start();

	if ( !aesop_editor_user_can_edit() )
		return;

	// let users add custom css classes
	$custom_classes = apply_filters('aesop_editor_wpimg_classes', '' );

	?><ul class="aesop-component--controls <?php echo sanitize_html_class( $custom_classes );?>" contenteditable="false">
		<li class="aesop-drag" title="Move"></li>
		<li id="aesop-editor--wpimg-edit" class="aesop-settings" title="Settings"></li>
		<li class="aesop-clone" title="Clone"></li>
		<li class="aesop-delete" title="Delete"></li>
	</ul>

	<?php return ob_get_clean();
}

/**
*
*	Draw out the settings field based on the shortcodes array with options foudn in Aesop Story Engine
* 	This was mostly backported from aesop story engine and modified to allow for non aesop shortcodes and components
*
*	@since 1.0
*/
function aesop_editor_options_blob() {

	$codes 		= function_exists('aesop_shortcodes') ? aesop_shortcodes() : apply_filters('aesop_editor_custom_options', '' );
	$galleries 	= function_exists('aesop_editor_galleries_exist') && aesop_editor_galleries_exist() ? 'has-galleries' : 'creating-gallery';

	$nonce = wp_create_nonce('aesop-generator-settings');

	$blob = array();

	if ( empty( $codes ) )
		return;

	foreach( $codes as $slug => $shortcode ) {
		$return = '';
		// Shortcode has atts

		if ( count( $shortcode['atts'] ) && $shortcode['atts'] ) {

			foreach ( $shortcode['atts'] as $attr_name => $attr_info ) {


				$prefix = isset($attr_info['prefix']) ? sprintf('<span class="aesop-option-prefix">%s</span>',$attr_info['prefix']) : null;

				$return .= '<form id="aesop--component-settings-form" class="'.$galleries.'" method="post">';
				$return .= '<p data-option="'.$attr_name.'" class="aesop-option aesop-'.$slug.'-'.$attr_name.'">';
				$return .= '<label for="aesop-generator-attr-' . $attr_name . '">' . $attr_info['desc'] . '</label>';
				$return .= '<small class="aesop-option-desc">'.$attr_info['tip'].'</small>';
				// Select

				if ( isset($attr_info['values']) ) {

					$return .= '<select name="' . $attr_name . '" id="aesop-generator-attr-' . $attr_name . '" class="aesop-generator-attr">';

					$i=0;

					foreach ( $attr_info['values'] as $attr_value ) {
						$attr_value_selected = ( $attr_info['default'] == $attr_value ) ? ' selected="selected"' : '';

						$return .= '<option value="'.$attr_info['values'][$i]['value'].'" ' . $attr_value_selected . '>'.$attr_info['values'][$i]['name'].'</option>';

						$i++;
					}

					$return .= '</select>';

				} else {

					$attr_field_type = isset($attr_info['type']) ? $attr_info['type'] : 'text';

					// image upload
					if('media_upload' == $attr_info['type']) {

						$return .= '<input type="' . $attr_field_type . '" name="' . $attr_name . '" value="'.$attr_info['default'].'" id="aesop-generator-attr-' . $attr_name . '" class="aesop-generator-attr aesop-generator-attr-'.$attr_field_type.'" />';
						$return .= '<a href="#" id="aesop-upload-img" class="aesop-option-button" /></a>';

					} elseif ('color' == $attr_info['type']) {

						$return .= '<input type="color" name="' . $attr_name . '" value="'.$attr_info['default'].'" id="aesop-generator-attr-' . $attr_name . '" class="aesop-generator-attr aesop-generator-attr-'.$attr_field_type.'" />';

					} elseif ('text_area' == $attr_info['type']) {

						$return .= '<textarea name="' . $attr_name . '" id="aesop-generator-attr-' . $attr_name . '" class="aesop-generator-attr aesop-generator-attr-'.$attr_field_type.'" placeholder="'.$attr_info['default'].'" /></textarea>'.$prefix.'';

					} else {
						$return .= '<input type="' . $attr_field_type . '" name="' . $attr_name . '" value="'.$attr_info['default'].'" id="aesop-generator-attr-' . $attr_name . '" class="aesop-generator-attr aesop-generator-attr-'.$attr_field_type.'" />'.$prefix.'';
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

				$return .= aesop_gallery_editor_module();

			} elseif ( 'map' == $shortcode['front_type'] ) {

				$return .= aesop_map_editor_module();
			}
		}
		///////////////////////////
		// END GALLERY AND MAP FRONT END STUFFS
		///////////////////////////

		// Single shortcode (not closed)
		if ('single' == $shortcode['type']) {

			$return .= '<input type="hidden" name="aesop-generator-content" id="aesop-generator-content" value="false" />';

		} else {

			$return .= '<p><label>' . __( 'Content', 'aesop-core' ) . '</label><textarea type="text" name="aesop-generator-content" id="aesop-generator-content" value="' . $shortcode['content'] . '" /></textarea></p>';
		}

		$return .= '<p class="aesop-buttoninsert-wrap"><a href="#" class="aesop-generator-cancel" id="aesop-editor--sidebar__close">Cancel</a><input type="submit" id="aesop-generator-insert" value="Save Settings"></p>';
		$return .= '<input class="component_type" type="hidden" name="component_type" value="">';
		$return .= '<input type="hidden" name="unique" value="">';
		$return .= '<input type="hidden" name="nonce" id="aesop-generator-nonce" value="'.$nonce.'" />';
		$return .= '</form>';

		$blob[$slug] = $return;
	}

	return $blob;
}

