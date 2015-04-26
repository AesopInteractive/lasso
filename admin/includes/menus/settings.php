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

		if ( function_exists( 'is_multisite' ) && is_multisite() ) {

			add_submenu_page( 'settings.php', __( 'Lasso', 'lasso' ), __( 'Lasso', 'lasso' ), 'manage_network', 'lasso-editor', array( $this, 'settings' ) );

		} else {

			add_submenu_page( 'lasso-editor', __( 'Settings', 'lasso' ), __( 'Settings', 'lasso' ), 'manage_options', 'lasso-editor-settings', array( $this, 'settings' ) );

		}
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

			$options = array_map( 'sanitize_text_field', $options );

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

		$toolbar_headings      = lasso_editor_get_option( 'toolbar_headings', 'lasso_editor' );
		$objectsNoSave  	= lasso_editor_get_option('dont_save', 'lasso_editor');

?>
		<div class="wrap">

	    	<h2><?php _e( 'Lasso Settings', 'lasso' );?></h2>

			<form id="lasso-editor-settings-form" class="lasso--form-settings" method="post" enctype="multipart/form-data">

				<?php do_action('lasso_settings_before');?>

				<div class="lasso-editor-settings--option-wrap">
					<div class="lasso-editor-settings--option-inner">
						<label><?php _e( 'Article Class', 'lasso' );?></label>
						<span class="lasso--setting-description"><?php _e( 'Provide the CSS class (including the preceding dot) of container that holds the post. This should be the first parent container class that holds the_content.', 'lasso' );?></span>
						<input required type="text" name="lasso_editor[article_class]" id="lasso_editor[article_class]" value="<?php echo esc_attr( $article_object );?>" placeholder=".entry-content">
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
						<span class="lasso--setting-description"><?php _e( 'If your post container holds additional markup, list the css class names (comma separated, including the dot) of those items. When you enter the editor, Lasso will remove (NOT delete) these items so that it does not save them as HTML.', 'lasso' );?></span>
						<textarea name="lasso_editor[dont_save]" id="lasso_editor[dont_save]" placeholder=".classname, .another-class"><?php echo esc_attr( $objectsNoSave );?></textarea>
					</div>
				</div>

				<div class="lasso-editor-settings--option-wrap">
					<div class="lasso-editor-settings--option-inner">
						<input type="checkbox" class="checkbox" name="lasso_editor[toolbar_headings]" id="lasso_editor[toolbar_headings]" <?php echo checked( $toolbar_headings, 'on' );?> >
						<label for="lasso_editor[toolbar_headings]"><?php _e( 'Enable Toolbar Headings', 'lasso' );?></label>
						<span class="lasso--setting-description"><?php _e( 'By default the H2 and H3 options for headings are in the insert HTML area. You may prefer those headings to act just like the underline, and strikethrough, so toggling this will add them to the toolbar.', 'lasso' );?></span>

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

				<div class="lasso-editor-settings--option-wrap last">
					<div class="lasso-editor-settings--option-inner">
						<input type="checkbox" class="checkbox" name="lasso_editor[shortcodify_disabled]" id="lasso_editor[shortcodify_disabled]" <?php echo checked( $shortcodify_disabled, 'on' );?> >
						<label for="lasso_editor[shortcodify_disabled]"><?php _e( 'Disable Aesop Component Conversion', 'lasso' );?></label>
						<span class="lasso--setting-description"><?php _e( 'Check this box to disable the conversion process used on Aesop Story Engine components.', 'lasso' );?></span>
					</div>
				</div>

				<?php do_action('lasso_settings_after');?>

				<div class="lasso-editor-settings--submit">
				    <input type="hidden" name="action" value="lasso-editor-settings" />
				    <input type="submit" class="button-primary" value="<?php esc_attr_e( 'Save Settings', 'lasso' );?>" />
					<?php wp_nonce_field( 'nonce', 'lasso_editor_settings' ); ?>
				</div>
			</form>

		</div><?php

	}
}

