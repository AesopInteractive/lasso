<?php

/**
 * These functions are then localized and then appended with JS in enter-editor.js
 *  All are protectd under a capability and logged in check using a filterable function lasso_user_can()
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

	if ( lasso_user_can('edit_posts') ) {

		$status = get_post_status( get_the_ID() );

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

		?><div id="lasso--controls" class="lasso-post-status--<?php echo sanitize_html_class( $status );?> <?php echo sanitize_html_class( $custom_classes );?>" data-post-id="<?php echo get_the_ID();?>" >

			<ul class="lasso--controls__center lasso-editor-controls lasso-editor-controls--wrap <?php echo $post_access_class;?> ">

				<?php do_action( 'lasso_editor_controls_before' );

				if ( is_singular() && lasso_user_can() ) { ?>

					<li id="lasso--edit" title="<?php esc_attr_e( 'Edit Post', 'lasso' );?>"><a href="#" class="lasso--button__primary"></a></li>

				<?php }

				if ( is_singular() && lasso_user_can() && ( 'off' == $post_settings_disabled || empty( $post_settings_disabled ) ) ) { ?>
					<li id="lasso--post-settings" title="<?php esc_attr_e( 'Post Settings', 'lasso' );?>"><a href="#" class="lasso--button__primary"></a></li>
				<?php } ?>

				<li id="lasso--post-all" title="<?php esc_attr_e( 'All Posts', 'lasso' );?>"><a href="#" class="lasso--button__primary"></a></li>

				<?php if ( 'off' == $post_new_disabled || empty( $post_new_disabled ) ) { ?>
					<li id="lasso--post-new" title="<?php esc_attr_e( 'Add Post', 'lasso' );?>"><a href="#" class="lasso--button__primary"></a></li>
				<?php } ?>


				<?php do_action( 'lasso_editor_controls_after' );?>

			</ul>

			<?php if ( is_singular() ) { ?>

				<div class="lasso--controls__right">

					<a href="#" title="<?php esc_attr_e( 'Save Post', 'lasso' );?>" id="lasso--save" class="lasso-save-post lasso--button <?php echo $sc_saving_class;?>"></a>

					<?php if ( 'draft' == $status && ( lasso_user_can('publish_posts') || lasso_user_can('publish_pages') )  ) { ?>
						<a href="#" title="<?php esc_attr_e( 'Publish Post', 'lasso' );?>" id="lasso--publish" class="lasso-publish-post lasso--button <?php echo $sc_saving_class;?>"></a>
					<?php } ?>

				</div>

			<?php } ?>

		</div>

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

	if ( !lasso_user_can() )
		return;

	// let users add custom css classes
	$custom_classes = apply_filters( 'lasso_sidebar_classes', '' );
?>
	<div id="lasso--sidebar" class="<?php echo sanitize_html_class( $custom_classes );?>" >
		<div class="lasso--sidebar__inner">
			<div id="lasso--component__settings"></div>
		</div>
	</div>
	<?php
	return ob_get_clean();
}

/**
 * Draw the main toolbar used to edit the text
 *
 * @since 1.0
 */
function lasso_editor_text_toolbar() {

	ob_start();

	if ( !lasso_user_can() )
		return;

	// check for lasso story engine and add a class doniting this
	$ase_status = class_exists( 'Aesop_Core' ) || defined( 'LASSO_CUSTOM' ) ? 'ase-active' : 'ase-not-active';

	// let users add custom css classes
	$custom_classes = apply_filters( 'lasso_toolbar_classes', '' );

	// are toolbar headings enabled
	$toolbar_headings      = lasso_editor_get_option( 'toolbar_headings', 'lasso_editor' );

	$toolbar_class  = $toolbar_headings ? 'toolbar-extended' : false;

?>
	<div class="lasso--toolbar_wrap lasso-editor-controls--wrap <?php echo $toolbar_class.' '.$ase_status.' '.sanitize_html_class( $custom_classes );?>">
		<ul class="lasso--toolbar__inner lasso-editor-controls">
			<?php do_action( 'lasso_toolbar_components_before' );?>
		    <li id="lasso-toolbar--bold" title="<?php esc_attr_e( 'Bold', 'lasso' );?>"></li>
		    <li id="lasso-toolbar--underline" title="<?php esc_attr_e( 'Underline', 'lasso' );?>"></li>
		    <li id="lasso-toolbar--italic" title="<?php esc_attr_e( 'Italicize', 'lasso' );?>"></li>
		    <li id="lasso-toolbar--strike" title="<?php esc_attr_e( 'Strikethrough', 'lasso' );?>"></li>
		    <?php if ( $toolbar_headings ): ?>
		    <li id="lasso-toolbar--h2" title="<?php esc_attr_e( 'H2 Heading', 'lasso' );?>"></li>
		    <li id="lasso-toolbar--h3" title="<?php esc_attr_e( 'H3 Heading', 'lasso' );?>"></li>
			<?php endif; ?>
		    <li id="lasso-toolbar--link" title="<?php esc_attr_e( 'Anchor Link', 'lasso' );?>">
		    	<div id="lasso-toolbar--link__wrap">
		    		<div id="lasso-toolbar--link__inner" contenteditable="true" placeholder="<?php esc_attr_e( 'http://url.com', 'lasso' );?>"></div>
		    		<a href="#" title="<?php esc_attr_e( 'Create Link', 'lasso' );?>" class="lasso-toolbar--link__control" id="lasso-toolbar--link__create" ></a>
		    	</div>
		    </li>
		    <?php do_action( 'lasso_toolbar_components_after' );?>
		    <li id="lasso-toolbar--html" title="<?php esc_attr_e( 'Insert HTML', 'lasso' );?>">
		    	<div id="lasso-toolbar--html__wrap">
		    		<div id="lasso-toolbar--html__inner" contenteditable="true" placeholder="<?php esc_attr_e( 'Enter HTML to insert', 'lasso' );?>"></div>
		    		<div id="lasso-toolbar--html__footer">
		    			<ul class="lasso-toolbar--html-snips">
		    				<?php if ( !$toolbar_headings ): ?>
		    				<li id="lasso-html--h2" title="<?php esc_attr_e( 'H2 Heading', 'lasso' );?>">
		    				<li id="lasso-html--h3" title="<?php esc_attr_e( 'H3 Heading', 'lasso' );?>">
		    				<?php endif; ?>
		    				<li id="lasso-html--ul" title="<?php esc_attr_e( 'Unordered List', 'lasso' );?>">
		    				<li id="lasso-html--ol" title="<?php esc_attr_e( 'Ordered List', 'lasso' );?>">
		    			</ul>
		    			<a class="lasso-toolbar--html__control lasso-toolbar--html__cancel" href="#"><?php _e( 'Cancel', 'lasso' );?></a>
		    			<a href="#" title="<?php esc_attr_e( 'Insert HTML', 'lasso' );?>" class="lasso-toolbar--html__control" id="lasso-toolbar--html__insert" ><?php _e( 'Insert', 'lasso' );?></a>
		    		</div>
		    	</div>
		    </li>
		    <li id="lasso-toolbar--components" title="<?php esc_attr_e( 'Insert Component', 'lasso' );?>">
			    <ul id="lasso-toolbar--components__list">
			    	<?php if ( 'ase-active' == $ase_status ): ?>
						<li data-type="image" title="<?php esc_attr_e( 'Image', 'lasso' );?>" class="lasso-toolbar--component__image"></li>
						<li data-type="character" title="<?php esc_attr_e( 'Character', 'lasso' );?>" class="lasso-toolbar--component__character"></li>
						<li data-type="quote" title="<?php esc_attr_e( 'Quote', 'lasso' );?>"  class="lasso-toolbar--component__quote"></li>
						<li data-type="content" title="<?php esc_attr_e( 'Content', 'lasso' );?>"  class="lasso-toolbar--component__content"></li>
						<li data-type="chapter" title="<?php esc_attr_e( 'Chapter', 'lasso' );?>"  class="lasso-toolbar--component__chapter"></li>
						<li data-type="parallax" title="<?php esc_attr_e( 'Parallax', 'lasso' );?>"  class="lasso-toolbar--component__parallax"></li>
						<li data-type="audio" title="<?php esc_attr_e( 'Audio', 'lasso' );?>"  class="lasso-toolbar--component__audio"></li>
						<li data-type="video" title="<?php esc_attr_e( 'Video', 'lasso' );?>"  class="lasso-toolbar--component__video"></li>
						<li data-type="map" title="<?php esc_attr_e( 'Map', 'lasso' );?>"  class="lasso-toolbar--component__map"></li>
						<li data-type="timeline_stop" title="<?php esc_attr_e( 'Timeline', 'lasso' );?>"  class="lasso-toolbar--component__timeline"></li>
						<li data-type="document" title="<?php esc_attr_e( 'Document', 'lasso' );?>"  class="lasso-toolbar--component__document"></li>
						<li data-type="collection" title="<?php esc_attr_e( 'Collection', 'lasso' );?>"  class="lasso-toolbar--component__collection"></li>
						<li data-type="gallery" title="<?php esc_attr_e( 'Gallery', 'lasso' );?>"  class="lasso-toolbar--component__gallery"></li>
					<?php else: ?>
						<li data-type="wpimg" title="<?php esc_attr_e( 'WordPress Image', 'lasso' );?>" class="image lasso-toolbar--component__image"></li>
						<li data-type="wpquote" title="<?php esc_attr_e( 'WordPress Quote', 'lasso' );?>" class="quote lasso-toolbar--component__quote"></li>
					<?php endif; ?>
					<?php do_action( 'lasso_toolbar_components' );?>
			    </ul>
			</li>
		</ul>
	</div>
	<?php return ob_get_clean();
}

/**
 * Draw the controls used for teh component settings within each component
 *
 * @since 1.0
 */
function lasso_editor_settings_toolbar() {

	$delete_nonce = wp_create_nonce( 'lasso-delete-nonce' );

	ob_start();

	if ( !lasso_user_can() )
		return;

	// let users add custom css classes
	$custom_classes = apply_filters( 'lasso_component_classes', '' );

	?><ul class="lasso-component--controls <?php echo sanitize_html_class( $custom_classes );?>" contenteditable="false">
		<li class="lasso-drag" title="<?php esc_attr_e( 'Move', 'lasso' );?>"></li>
		<li id="lasso-component--settings__trigger" class="lasso-settings" title="<?php esc_attr_e( 'Settings', 'lasso' );?>"></li>
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

	if ( !lasso_user_can() )
		return;

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

	if ( !lasso_user_can() )
		return;

	global $post;

	$status = get_post_status( get_the_ID() );
	$nonce = wp_create_nonce( 'lasso-update-post-settings' );

	// let users add custom css classes
	$custom_classes = apply_filters( 'lasso_modal_settings_classes', '' );

?>
	<div id="lasso--post-settings__modal" class="lasso--modal lassoShowAnimate <?php echo sanitize_html_class( $custom_classes );?>">
		<div class="lasso--modal__inner">
			<form id="lasso--postsettings__form" enctype="multipart/form-data" >

				<div class="lasso--postsettings__option story-status-option">
					<label><?php _e( 'Status', 'lasso' );?><span class="lasso-util--help lasso-util--help-top" data-tooltip="<?php esc_attr_e( 'Change the status of the post to draft or publish.', 'lasso' );?>"><i class="lasso-icon-help"></i></span></label>
					<ul class="story-status story-status-<?php echo sanitize_html_class( $status );?>">
						<li id="lasso--status-draft"><?php _e( 'Draft', 'lasso' );?></li>
						<li id="lasso--status-publish"><?php _e( 'Publish', 'lasso' );?></li>
					</ul>
					<div class="lasso--slider_wrap">
						<div id="lasso--slider"></div>
					</div>
				</div>

				<?php if ( 'publish' == $status ): ?>
				<div class="lasso--postsettings__option story-slug-option">
					<label><?php _e( 'Post URL', 'lasso' );?><span class="lasso-util--help lasso-util--help-top" data-tooltip="<?php esc_attr_e( 'Change the URL (slug) of this post.', 'lasso' );?>"><i class="lasso-icon-help"></i></span></label>
					<input class="lasso--modal__trigger-footer" type="text" name="story_slug" value="<?php echo isset( $post ) ? esc_attr( $post->post_name ) : false;?>">
				</div>
				<?php endif; ?>

				<?php do_action( 'lasso_modal_post_form' ); // action ?>

				<div class="lasso--postsettings__footer" style="display:none;">
					<a href="#" class="lasso--postsettings-cancel"><?php _e( 'Cancel', 'lasso' );?></a>
					<input type="hidden" name="status" value="">
					<input type="hidden" name="postid" value="<?php echo get_the_ID();?>">
					<input type="hidden" name="action" value="process_update-object_post">
					<input type="hidden" name="nonce" value="<?php echo $nonce;?>">
					<?php do_action( 'lasso_modal_post_form_footer' ); // action ?>
					<input type="submit" value="<?php esc_attr_e( 'Save', 'lasso' );?>">
				</div>

			</form>

		</div>
	</div>
	<div id="lasso--modal__overlay"></div>
	<?php

	return ob_get_clean();
}

/**
 * Used to house the form for creating a new post within amodal
 *
 * @since 1.0
 */
function lasso_editor_newpost_modal() {

	global $post;

	ob_start();

	if ( !lasso_user_can('edit_posts') )
		return;

	$status = get_post_status( get_the_ID() );

	$nonce = wp_create_nonce( 'lasso-editor-new-post' );

	// let users add custom css classes
	$custom_classes = apply_filters( 'lasso_modal_post_classes', '' );

	// return the post type
	$type = get_post_type( get_the_ID() );

?>
	<div id="lasso--post-new__modal" class="lasso--modal lassoShowAnimate <?php echo sanitize_html_class( $custom_classes );?>">
		<div class="lasso--modal__inner">

			<form id="lasso--postnew__form" enctype="multipart/form-data" >

				<div class="lasso--postsettings__option story-slug-option lasso--last-option">
					<label><?php esc_attr_e( 'New '.ucfirst( $type ).' Title', 'lasso' );?><span class="lasso-util--help lasso-util--help-top" data-tooltip="<?php esc_attr_e( 'Specify title for new post, then save to edit.', 'lasso' );?>"><i class="lasso-icon-help"></i></span></label>
					<input class="lasso--modal__trigger-footer" type="text" required name="story_title" value="" placeholder="<?php esc_attr_e( 'Grump Wizards Make Toxic Brew', 'lasso' );?>">
				</div>

				<div class="lasso--postsettings__footer" style="display:none;">
					<a href="#" class="lasso--postsettings-cancel"><?php _e( 'Cancel', 'lasso' );?></a>
					<input type="hidden" name="action" value="process_new-object_post">
					<input type="hidden" name="object" value="<?php echo $type;?>">
					<input type="hidden" name="nonce" value="<?php echo $nonce;?>">
					<input type="submit" value="<?php esc_attr_e( 'Create', 'lasso' );?>">
				</div>

			</form>

		</div>
	</div>
	<div id="lasso--modal__overlay"></div>
	<?php

	return ob_get_clean();
}

/**
 * Used to house the all posts pop-up
 *
 * @since 0.9.3
 */
function lasso_editor_allpost_modal() {

	global $post;

	ob_start();

	// post status
	$status = get_post_status( get_the_ID() );

	// let users add custom css classes
	$custom_classes = apply_filters( 'lasso_modal_all_post_classes', '' );

?>
	<div id="lasso--all-posts__modal" class="lasso--modal lasso--modal__full lassoShowAnimate <?php echo sanitize_html_class( $custom_classes );?>">
		<div class="lasso--modal__inner">

			<ul class="lasso--post-object-list">

				<li class="active lasso--show-objects" data-post-type="<?php esc_attr_e('posts','lasso');?>"><?php _e('Posts','lasso');?></li>
				<li class="lasso--show-objects" data-post-type="<?php esc_attr_e('pages','lasso');?>"><?php _e('Pages','lasso');?></li>
				<?php do_action('lasso_modal_post_objects');?>

			</ul>
			<div id="lasso--loading" class="lasso--loading"><div class="lasso--loader"></div></div>

			<ul id="lasso--post-list" class="lasso--post-list"></ul>

		</div>
	</div>
	<div id="lasso--modal__overlay"></div>
	<?php

	return ob_get_clean();
}

function lasso_editor_wpimg_edit() {

	ob_start();

	if ( !lasso_user_can() )
		return;

	// let users add custom css classes
	$custom_classes = apply_filters( 'lasso_wpimg_classes', '' );

	?><ul class="lasso-component--controls <?php echo sanitize_html_class( $custom_classes );?>" contenteditable="false">
		<li class="lasso-drag" title="<?php esc_attr_e( 'Move', 'lasso' );?>"></li>
		<li id="lasso--wpimg-edit" class="lasso-settings" title="<?php esc_attr_e( 'Settings', 'lasso' );?>"></li>
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
		<?php

	return ob_get_clean();

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
	<?php

	return ob_get_clean();
}

/**
 * Draw out the settings field based on the shortcodes array with options foudn in Lasso Story Engine
 *  This was mostly backported from lasso story engine and modified to allow for non lasso shortcodes and components
 *
 * @since 1.0
 */
function lasso_editor_options_blob() {

	$codes   = function_exists( 'aesop_shortcodes' ) ? aesop_shortcodes() : apply_filters( 'lasso_custom_options', '' );
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

				$return .= '<form id="lasso--component-settings-form" class="'.$galleries.'" method="post">';
				$return .= '<p data-option="'.$attr_name.'" class="lasso-option lasso-'.$slug.'-'.$attr_name.'">';
				$return .= '<label for="lasso-generator-attr-' . $attr_name . '">' . $attr_info['desc'] . '</label>';
				$return .= '<small class="lasso-option-desc">'.$attr_info['tip'].'</small>';
				// Select

				if ( isset( $attr_info['values'] ) ) {

					$return .= '<select name="' . $attr_name . '" id="lasso-generator-attr-' . $attr_name . '" class="lasso-generator-attr">';

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

						$return .= '<input type="' . $attr_field_type . '" name="' . $attr_name . '" value="'.$attr_info['default'].'" id="lasso-generator-attr-' . $attr_name . '" class="lasso-generator-attr lasso-generator-attr-'.$attr_field_type.'" />';
						$return .= '<a href="#" id="lasso-upload-img" class="lasso-option-button" /></a>';

					} elseif ( 'color' == $attr_info['type'] ) {

						$return .= '<input type="color" name="' . $attr_name . '" value="'.$attr_info['default'].'" id="lasso-generator-attr-' . $attr_name . '" class="lasso-generator-attr lasso-generator-attr-'.$attr_field_type.'" />';

					} elseif ( 'text_area' == $attr_info['type'] ) {

						$return .= '<textarea name="' . $attr_name . '" id="lasso-generator-attr-' . $attr_name . '" class="lasso-generator-attr lasso-generator-attr-'.$attr_field_type.'" placeholder="'.$attr_info['default'].'" /></textarea>'.$prefix.'';

					} else {
						$return .= '<input type="' . $attr_field_type . '" name="' . $attr_name . '" value="'.$attr_info['default'].'" id="lasso-generator-attr-' . $attr_name . '" class="lasso-generator-attr lasso-generator-attr-'.$attr_field_type.'" />'.$prefix.'';
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

		$blob[$slug] = $return;
	}

	return $blob;
}
