<?php
/**
 * Class responsible for adding a settings submenu
 *
 */
namespace lasso_admin\menus;

class settings {

	function __construct() {

		add_action( 'admin_menu',     array( $this, 'menu' ) );
		add_action( 'network_admin_menu',   array( $this, 'menu' ) );
		add_action( 'wp_ajax_lasso-editor-settings', array( $this, 'process_settings' ) );

	}

	/**
	 * Add a submenu page to the "Settings" tab if network activated, otherwise add to our menu page
	 *
	 * @since 1.0
	 */
	function menu() {

		// CHANGED Removed condition.
		add_submenu_page( 'lasso-editor', __( 'Settings', 'lasso' ), __( 'Settings', 'lasso' ), 'manage_options', 'lasso-editor-settings', array( $this, 'settings' ) );

	}

	/**
	 * Submenu page callback
	 *
	 * @since 1.0
	 */
	function settings() {

		echo self::lasso_editor_settings_form();
	}

	/**
	 * Save settings via ajax
	 *
	 * @since 1.0
	 */
	function process_settings() {

		// bail out if current user isn't and administrator and they are not logged in
		if ( !current_user_can( 'manage_options' ) || !is_user_logged_in() )
			return;

		if ( isset( $_POST['action'] ) && 'lasso-editor-settings' == $_POST['action'] && check_admin_referer( 'nonce', 'lasso_editor_settings' ) ) {

			$options = isset( $_POST['lasso_editor'] ) ? $_POST['lasso_editor'] : false;
			
			$arr = $options['allowed_post_types'];
			$options = array_map( 'sanitize_text_field', $options );
			$options['allowed_post_types'] = array_keys( $arr);

			

			if ( function_exists( 'is_multisite' ) && is_multisite() ) {

				update_site_option( 'lasso_editor', $options );

			} else {

				update_option( 'lasso_editor', $options );
			}

			wp_send_json_success();

		} else {

			wp_send_json_error();

		}

		die();

	}

	/**
	 * Draw the settings form
	 *
	 * @since 1.0
	 */
	function lasso_editor_settings_form() {

		if ( !is_user_logged_in() )
			return;

		$article_object   = lasso_editor_get_option( 'article_class', 'lasso_editor' );
		$featImgClass    = lasso_editor_get_option( 'featimg_class', 'lasso_editor' );
		$titleClass    = lasso_editor_get_option( 'title_class', 'lasso_editor' );

		$post_new_disabled   = lasso_editor_get_option( 'post_adding_disabled', 'lasso_editor' );
		$save_to_post_disabled  = lasso_editor_get_option( 'post_save_disabled', 'lasso_editor' );
		$post_settings_disabled = lasso_editor_get_option( 'post_settings_disabled', 'lasso_editor' );
		$shortcodify_disabled  = lasso_editor_get_option( 'shortcodify_disabled', 'lasso_editor' );
		$enable_autosave  = lasso_editor_get_option( 'enable_autosave', 'lasso_editor' );

		$toolbar_headings      = lasso_editor_get_option( 'toolbar_headings', 'lasso_editor' );
		$toolbar_headings_h4      = lasso_editor_get_option( 'toolbar_headings_h4', 'lasso_editor' );
		$toolbar_show_color      = lasso_editor_get_option( 'toolbar_show_color', 'lasso_editor' );
		$toolbar_show_alignment  = lasso_editor_get_option( 'toolbar_show_alignment', 'lasso_editor' );
		
		$objectsNoSave  	= lasso_editor_get_option('dont_save', 'lasso_editor');
		$objectsNonEditable  	= lasso_editor_get_option('non_editable', 'lasso_editor');
		$disable_tour = lasso_editor_get_option('disable_tour', 'lasso_editor');
		$show_ignored_items = lasso_editor_get_option('show_ignored_items', 'lasso_editor');
		$save_using_rest_disabled = lasso_editor_get_option('save_using_rest_disabled', 'lasso_editor');
		
		$default_post_types = apply_filters( 'lasso_allowed_post_types', array( 'post', 'page'));
		$allowed_post_types = lasso_editor_get_option( 'allowed_post_types', 'lasso_editor',  $default_post_types);

?>
		<div class="wrap">

	    	<h2><?php _e( 'Editus Settings', 'lasso' );?></h2>

			<form id="lasso-editor-settings-form" class="lasso--form-settings" method="post" enctype="multipart/form-data">

				<?php do_action('lasso_settings_before');?>
				
				
				
				<div class="lasso-editor-settings--option-wrap">
					<div class="lasso-editor-settings--option-inner">
						<label><?php _e( 'Enable for:', 'lasso' );?></label>
						<span class="lasso--setting-description"><?php _e( 'Enable Editus for the following post types.', 'lasso' );?></span>
						<?php
						$args = array(
							'public'   => true
						);
						 
						$allowed_post_types = apply_filters( 'lasso_allowed_post_types', $allowed_post_types );
						$post_types = get_post_types( $args, 'objects' );
						 
						foreach ( $post_types  as $post_type ) {
						   if ($post_type->name == 'attachment') continue;
						   $checked ="";
						   if (  in_array( $post_type->name, $allowed_post_types )  ) {
								$checked = 'checked="checked"';
						   }
						   echo '<label><input type="checkbox" '.$checked.' name="lasso_editor[allowed_post_types]['.$post_type->name.']" id="lasso_editor[allowed_post_types]['.$post_type->name.']" >'.$post_type->name.'</label>';
						}
						?>
					</div>
				</div>
				

				<div class="lasso-editor-settings--option-wrap">
					<div class="lasso-editor-settings--option-inner">
						<label><?php _e( 'Article Class', 'lasso' );?></label>
						<span class="lasso--setting-description"><?php _e( 'Provide the CSS class (including the preceding dot) of container that holds the post. This should be the first parent container class that holds the_content.', 'lasso' );?></span>
						<input type="text" name="lasso_editor[article_class]" id="lasso_editor[article_class]" value="<?php echo esc_attr( $article_object );?>" placeholder=".entry-content">
					</div>
				</div>

				<div class="lasso-editor-settings--option-wrap">
					<div class="lasso-editor-settings--option-inner">
						<label><?php _e( 'Featured Image Class', 'lasso' );?></label>
						<span class="lasso--setting-description"><?php _e( 'Provide the CSS class that uses a featured image as a background image. This currently only supports themes that have the featured image set as background image.', 'lasso' );?></span>
						<input type="text" name="lasso_editor[featimg_class]" id="lasso_editor[featimg_class]" value="<?php echo esc_attr( $featImgClass );?>" placeholder=".entry-content">
					</div>
				</div>

				<div class="lasso-editor-settings--option-wrap">
					<div class="lasso-editor-settings--option-inner">
						<label><?php _e( 'Article Title Class', 'lasso' );?></label>
						<span class="lasso--setting-description"><?php _e( 'Provide the CSS class for the post title. This will enable you to update the title of the post by clicking and typing.', 'lasso' );?></span>
						<input type="text" name="lasso_editor[title_class]" id="lasso_editor[title_class]" value="<?php echo esc_attr( $titleClass );?>" placeholder=".entry-content">
					</div>
				</div>

				<!-- Advanced -->
				<div class="lasso-editor-settings--option-wrap">
					<div class="lasso-editor-settings--option-inner">
						<label><?php _e( 'Ignored Items to Save', 'lasso' );?></label>
						<span class="lasso--setting-description"><?php _e( 'If your post container holds additional markup, list the css class names (comma separated, including the dot) of those items. When you enter the editor, Editus will remove (NOT delete) these items so that it does not save them as HTML.', 'lasso' );?></span>
						<textarea name="lasso_editor[dont_save]" id="lasso_editor[dont_save]" placeholder=".classname, .another-class"><?php echo esc_attr( $objectsNoSave );?></textarea>
					</div>
				</div>
				
				<div class="lasso-editor-settings--option-wrap">
					<div class="lasso-editor-settings--option-inner">
						<label><?php _e( 'Read Only Items', 'lasso' );?></label>
						<span class="lasso--setting-description"><?php _e( 'If your post has items that should not be editable, list the css class names (comma separated, including the dot) of those items.', 'lasso' );?></span>
						<textarea name="lasso_editor[non_editable]" id="lasso_editor[non_editable]" placeholder=".classname, .another-class"><?php echo esc_attr( $objectsNonEditable );?></textarea>
					</div>
				</div>
				
				<div class="lasso-editor-settings--option-wrap">
					<div class="lasso-editor-settings--option-inner">
						<input type="checkbox" class="checkbox" name="lasso_editor[show_ignored_items]" id="lasso_editor[show_ignored_items]" <?php echo checked( $show_ignored_items, 'on' );?> >
						<label for="lasso_editor[show_ignored_items]"> <?php _e( 'Show Ignored Items', 'lasso' );?></label>
						<span class="lasso--setting-description"><?php _e( 'By default the ignored items are hidden. Check this to show ignored items while keeping them uneditable.', 'lasso' );?></span>
					</div>
				</div>

				<div class="lasso-editor-settings--option-wrap">
					<div class="lasso-editor-settings--option-inner" style="border:none;">
						<input type="checkbox" class="checkbox" name="lasso_editor[toolbar_headings]" id="lasso_editor[toolbar_headings]" <?php echo checked( $toolbar_headings, 'on' );?> >
						<label for="lasso_editor[toolbar_headings]"><?php _e( 'Enable H2 and H3 Buttons', 'lasso' );?></label>
						<span class="lasso--setting-description"><?php _e( 'Show the buttons to set H2 and H3 settings.', 'lasso' );?></span>

					</div>
					<div class="lasso-editor-settings--option-inner" style="border:none;">
						<input type="checkbox" class="checkbox" name="lasso_editor[toolbar_headings_h4]" id="lasso_editor[toolbar_headings_h4]" <?php echo checked( $toolbar_headings_h4, 'on' );?> >
						<label for="lasso_editor[toolbar_headings_h4]"><?php _e( 'Enable H4/H5/H6 Buttons', 'lasso' );?></label>
						<span class="lasso--setting-description"><?php _e( 'Show the buttons to set H4/H5/H6 settings.', 'lasso' );?></span>

					</div>
					<div class="lasso-editor-settings--option-inner" style="border:none;">
						<input type="checkbox" class="checkbox" name="lasso_editor[toolbar_show_color]" id="lasso_editor[toolbar_show_color]" <?php echo checked( $toolbar_show_color, 'on' );?> >
						<label for="lasso_editor[toolbar_show_color]"><?php _e( 'Enable Text Color Buttons', 'lasso' );?></label>
						<span class="lasso--setting-description"><?php _e( 'Show the buttons to set text colors.', 'lasso' );?></span>

					</div>
					<div class="lasso-editor-settings--option-inner">
						<input type="checkbox" class="checkbox" name="lasso_editor[toolbar_show_alignment]" id="lasso_editor[toolbar_show_alignment]" <?php echo checked( $toolbar_show_alignment, 'on' );?> >
						<label for="lasso_editor[toolbar_show_alignment]"><?php _e( 'Enable Text Align Buttons', 'lasso' );?></label>
						<span class="lasso--setting-description"><?php _e( 'Show the buttons to set text alignment.', 'lasso' );?></span>

					</div>
				</div>
				
				<div class="lasso-editor-settings--option-wrap">
					
				</div>
				
				<div class="lasso-editor-settings--option-wrap">
					
				</div>

				<div class="lasso-editor-settings--option-wrap">
					<div class="lasso-editor-settings--option-inner">
						<input type="checkbox" class="checkbox" name="lasso_editor[post_settings_disabled]" id="lasso_editor[post_settings_disabled]" <?php echo checked( $post_settings_disabled, 'on' );?> >
						<label for="lasso_editor[post_settings_disabled]"> <?php _e( 'Disable Post Settings', 'lasso' );?></label>
						<span class="lasso--setting-description"><?php _e( 'Check this to disable users from being able to edit post settings from the front-end.', 'lasso' );?></span>
					</div>
				</div>

				<div class="lasso-editor-settings--option-wrap">
					<div class="lasso-editor-settings--option-inner">
						<input type="checkbox" class="checkbox" name="lasso_editor[post_adding_disabled]" id="lasso_editor[post_adding_disabled]" <?php echo checked( $post_new_disabled, 'on' );?> >
						<label for="lasso_editor[post_adding_disabled]"><?php _e( 'Disable Post Adding', 'lasso' );?></label>
						<span class="lasso--setting-description"><?php _e( 'Check this box to disable users from being able to add new posts from the front-end.', 'lasso' );?></span>
					</div>
				</div>

				<div class="lasso-editor-settings--option-wrap">
					<div class="lasso-editor-settings--option-inner">
						<input type="checkbox" class="checkbox" name="lasso_editor[shortcodify_disabled]" id="lasso_editor[shortcodify_disabled]" <?php echo checked( $shortcodify_disabled, 'on' );?> >
						<label for="lasso_editor[shortcodify_disabled]"><?php _e( 'Disable Aesop Component Conversion', 'lasso' );?></label>
						<span class="lasso--setting-description"><?php _e( 'Check this box to disable the conversion process used on Aesop Story Engine components.', 'lasso' );?></span>
					</div>
				</div>
				
				<div class="lasso-editor-settings--option-wrap">
					<div class="lasso-editor-settings--option-inner">
						<input type="checkbox" class="checkbox" name="lasso_editor[enable_autosave]" id="lasso_editor[enable_autosave]" <?php echo checked( $enable_autosave, 'on' );?> >
						<label for="lasso_editor[enable_autosave]"><?php _e( 'Enable Auto Save', 'lasso' );?></label>
						<span class="lasso--setting-description"><?php _e( 'Check this box to enable auto save.', 'lasso' );?></span>
					</div>
				</div>
				
				<div class="lasso-editor-settings--option-wrap">
					<div class="lasso-editor-settings--option-inner">
						<input type="checkbox" class="checkbox" name="lasso_editor[post_save_disabled]" id="lasso_editor[post_save_disabled]" <?php echo checked( $save_to_post_disabled, 'on' );?> >
						<label for="lasso_editor[post_save_disabled]"><?php _e( 'Disable Post Saving', 'lasso' );?></label>
						<span class="lasso--setting-description"><?php _e( 'By default the editor will update the database with the post or page it is being used on. Check this box to disable this. If you check this box, it is assumed that you will be using the provided filters to save your own content.', 'lasso' );?></span>

					</div>
				</div>
				
				<div class="lasso-editor-settings--option-wrap">
					<div class="lasso-editor-settings--option-inner">
						<input type="checkbox" class="checkbox" name="lasso_editor[save_using_rest_disabled]" id="lasso_editor[save_using_rest_disabled]" <?php echo checked( $save_using_rest_disabled, 'on' );?> >
						<label for="lasso_editor[save_using_rest_disabled]"><?php _e( "Don't Use REST API to Save", 'lasso' );?></label>
						<span class="lasso--setting-description"><?php _e( 'By default the editor will use REST API to save posts. Check this box to use custom AJAX calls instead.', 'lasso' );?></span>

					</div>
				</div>
				
				<div class="lasso-editor-settings--option-wrap last">
					<div class="lasso-editor-settings--option-inner">
						<input type="checkbox" class="checkbox" name="lasso_editor[disable_tour]" id="lasso_editor[disable_tour]" <?php echo checked( $disable_tour, 'on' );?> >
						<label for="lasso_editor[disable_tour]"> <?php _e( 'Do Not Show Tour Dialog', 'lasso' );?></label>
						<span class="lasso--setting-description"><?php _e( 'Check this box to disable the tour dialog box for all users.', 'lasso' );?></span>
					</div>
				</div>


				<div class="lasso-editor-settings--submit">
				    <input type="hidden" name="action" value="lasso-editor-settings" />
				    <input type="submit" class="button-primary" value="<?php esc_attr_e( 'Save Settings', 'lasso' );?>" />
					<?php wp_nonce_field( 'nonce', 'lasso_editor_settings' ); ?>
				</div>
				
				<?php do_action('lasso_settings_after');?>
			</form>

		</div><?php

	}
}

