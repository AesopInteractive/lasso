<?php
/**
*
*	Class responsible for adding a settings submenu
*
*/

class ahEditorAdminSettings {

	function __construct(){

		add_action('admin_menu',					array($this,'menu'));
		add_action('network_admin_menu',			array($this,'menu'));
		add_action('wp_ajax_lasso-editor-settings',	array($this,'process_settings'));
		add_action('admin_head',					array($this,'lasso_editor_settings_styles'));

	}

	/**
	*
	*	Add a submenu page to the "Settings" tab
	*	@since 1.0
	*/
	function menu(){

		if ( function_exists('is_multisite') && is_multisite() ) {
			add_submenu_page( 'settings.php', 'Lasso', 'Lasso', 'manage_network', 'lasso-editor-settings', array($this, 'settings'));
		} else {
     		add_submenu_page( 'options-general.php', 'Lasso', 'Lasso', 'manage_options', 'lasso-editor-settings', array($this, 'settings'));
		}
	}

	/**
	*
	*	Submenu page callback
	*	@since 1.0
	*/
	function settings(){

		echo self::lasso_editor_settings_form();
	}

	/**
	*
	*	Load some assets for the save page
	*	@since 1.0
	*/
	function lasso_editor_settings_styles(){

		$screen = get_current_screen();

		if ( 'settings_page_lasso-editor-settings' == $screen->id || 'settings_page_lasso-editor-settings-network' == $screen->id ) {
			wp_enqueue_script('lasso-editor-settings-script', LASSO_URL.'/admin/assets/js/lasso-editor-settings.js', array('jquery'), LASSO_VERSION, true );
			wp_enqueue_style('lasso-editor-settings-style', LASSO_URL.'/admin/assets/css/lasso-editor-settings.css', LASSO_VERSION );
		}
	}

	/**
	*
	*	Save settings via ajax
	*	@since 1.0
	*/
	function process_settings(){

		if ( !current_user_can('manage_options') || !is_user_logged_in() )
			return;

		if ( isset( $_POST['action'] ) && 'lasso-editor-settings' == $_POST['action'] && check_admin_referer( 'nonce', 'lasso_editor_settings' ) ) {

			$options = isset( $_POST['lasso_editor'] ) ? $_POST['lasso_editor'] : false;

			$options = array_map('sanitize_text_field', $options);

			if ( function_exists('is_multisite') && is_multisite() ) {

				update_site_option( 'lasso_editor', $options );

			} else {

				update_option( 'lasso_editor', $options );
			}

			wp_send_json_success();

		}

		die();

	}

	/**
	*
	*	Draw the settings form
	*	@since 1.0
	*/
	function lasso_editor_settings_form(){

		if ( !is_user_logged_in() )
			return;

		$article_object 		= lasso_editor_get_option('article_class','lasso_editor');
		$featImgClass 			= lasso_editor_get_option('featimg_class','lasso_editor');
		$titleClass 			= lasso_editor_get_option('title_class','lasso_editor');

		$post_new_disabled 		= lasso_editor_get_option('post_adding_disabled','lasso_editor');
		$save_to_post_disabled 	= lasso_editor_get_option('post_save_disabled','lasso_editor');
		$post_settings_disabled = lasso_editor_get_option('post_settings_disabled','lasso_editor');
		$shortcodify_disabled 	= lasso_editor_get_option('shortcodify_disabled','lasso_editor');

		?>
		<div class="wrap">

	    	<h2>Lasso Settings</h2>

			<form id="lasso-editor-settings-form" method="post" enctype="multipart/form-data">

				<div class="lasso-editor-settings--option-wrap">
					<div class="lasso-editor-settings--option-inner">
						<label>Article Class</label>
						<span class="lasso--setting-description"> Provide the CSS class of container that holds the post. This should be the first parent container class that holds the_content.</span>
						<input required type="text" name="lasso_editor[article_class]" id="lasso_editor[article_class]" value="<?php echo esc_attr( $article_object );?>" placeholder=".entry-content">
					</div>
				</div>

				<div class="lasso-editor-settings--option-wrap">
					<div class="lasso-editor-settings--option-inner">
						<label>Featured Image Class</label>
						<span class="lasso--setting-description"> Provide the CSS class that uses a featured image as a background image. This currently only supports themes that have the featured image set as background image.</span>
						<input type="text" name="lasso_editor[featimg_class]" id="lasso_editor[featimg_class]" value="<?php echo esc_attr( $featImgClass );?>" placeholder=".entry-content">
					</div>
				</div>

				<div class="lasso-editor-settings--option-wrap">
					<div class="lasso-editor-settings--option-inner">
						<label>Article Title Class</label>
						<span class="lasso--setting-description"> Provide the CSS class for the post title. This will enable you to update the title of the post by clicking and typing.</span>
						<input type="text" name="lasso_editor[title_class]" id="lasso_editor[title_class]" value="<?php echo esc_attr( $titleClass );?>" placeholder=".entry-content">
					</div>
				</div>

				<!-- Advanced -->

				<div class="lasso-editor-settings--option-wrap">
					<div class="lasso-editor-settings--option-inner">
						<input type="checkbox" class="checkbox" name="lasso_editor[post_save_disabled]" id="lasso_editor[post_save_disabled]" <?php echo checked( $save_to_post_disabled, 'on' );?> >
						<label for="lasso_editor[post_save_disabled]">Disable Post Saving</label>
						<span class="lasso--setting-description">By default the editor will update the database with the post or page it is being used on. Check this box to disable this. If you check this box, it is assumed that you will be using the provided filters to save your own content.</span>

					</div>
				</div>

				<div class="lasso-editor-settings--option-wrap">
					<div class="lasso-editor-settings--option-inner">
						<input type="checkbox" class="checkbox" name="lasso_editor[post_settings_disabled]" id="lasso_editor[post_settings_disabled]" <?php echo checked( $post_settings_disabled, 'on' );?> >
						<label for="lasso_editor[post_settings_disabled]"> Disable Post Settings</label>
						<span class="lasso--setting-description">Check this to disable users from being able to edit post settings from the front-end.</span>
					</div>
				</div>

				<div class="lasso-editor-settings--option-wrap">
					<div class="lasso-editor-settings--option-inner">
						<input type="checkbox" class="checkbox" name="lasso_editor[post_adding_disabled]" id="lasso_editor[post_adding_disabled]" <?php echo checked( $post_new_disabled, 'on' );?> >
						<label for="lasso_editor[post_adding_disabled]">Disable Post Adding</label>
						<span class="lasso--setting-description">Xheck this box to disable users from being able to add new posts from the front-end.</span>
					</div>
				</div>

				<div class="lasso-editor-settings--option-wrap last">
					<div class="lasso-editor-settings--option-inner">
						<input type="checkbox" class="checkbox" name="lasso_editor[shortcodify_disabled]" id="lasso_editor[shortcodify_disabled]" <?php echo checked( $shortcodify_disabled, 'on' );?> >
						<label for="lasso_editor[shortcodify_disabled]">Disable Lasso Component Conversion</label>
						<span class="lasso--setting-description">Check this box to disable the conversion process used on Lasso Story Engine components.</span>
					</div>
				</div>

				<div class="lasso-editor-settings--submit">
				    <input type="hidden" name="action" value="lasso-editor-settings" />
				    <input type="submit" class="button-primary" value="Save Settings" />
					<?php wp_nonce_field( 'nonce','lasso_editor_settings' ); ?>
				</div>
			</form>

		</div><?php

	}
}
new ahEditorAdminSettings;