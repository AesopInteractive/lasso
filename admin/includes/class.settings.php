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
		add_action('wp_ajax_aesop-editor-settings',	array($this,'process_settings'));
		add_action('admin_head',					array($this,'aesop_editor_settings_styles'));

	}

	/**
	*
	*	Add a submenu page to the "Settings" tab
	*	@since 1.0
	*/
	function menu(){

		if ( function_exists('is_multisite') && is_multisite() ) {
			add_submenu_page( 'settings.php', 'Aesop Editor', 'Aesop Editor', 'manage_network', 'aesop-editor-settings', array($this, 'settings'));
		} else {
     		add_submenu_page( 'options-general.php', 'Aesop Editor', 'Aesop Editor', 'manage_options', 'aesop-editor-settings', array($this, 'settings'));
		}
	}

	/**
	*
	*	Submenu page callback
	*	@since 1.0
	*/
	function settings(){

		echo self::aesop_editor_settings_form();
	}

	/**
	*
	*	Load some assets for the save page
	*	@since 1.0
	*/
	function aesop_editor_settings_styles(){

		$screen = get_current_screen();

		if ( 'settings_page_aesop-editor-settings' == $screen->id || 'settings_page_aesop-editor-settings-network' == $screen->id ) {
			wp_enqueue_script('aesop-editor-settings-script', AESOP_EDITOR_URL.'/admin/assets/js/aesop-editor-settings.js', array('jquery'), AESOP_EDITOR_VERSION, true );
			wp_enqueue_style('aesop-editor-settings-style', AESOP_EDITOR_URL.'/admin/assets/css/aesop-editor-settings.css', AESOP_EDITOR_VERSION );
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

		if ( isset( $_POST['action'] ) && 'aesop-editor-settings' == $_POST['action'] && check_admin_referer( 'nonce', 'aesop_editor_settings' ) ) {

			$options = isset( $_POST['aesop_editor'] ) ? $_POST['aesop_editor'] : false;

			$options = array_map('sanitize_text_field', $options);

			if ( function_exists('is_multisite') && is_multisite() ) {

				update_site_option( 'aesop_editor', $options );

			} else {

				update_option( 'aesop_editor', $options );
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
	function aesop_editor_settings_form(){

		if ( !is_user_logged_in() )
			return;

		$article_object 		= aesop_editor_get_option('article_class','aesop_editor');
		$featImgClass 			= aesop_editor_get_option('featimg_class','aesop_editor');
		$titleClass 			= aesop_editor_get_option('title_class','aesop_editor');

		$post_new_disabled 		= aesop_editor_get_option('post_adding_disabled','aesop_editor');
		$save_to_post_disabled 	= aesop_editor_get_option('post_save_disabled','aesop_editor');
		$post_settings_disabled = aesop_editor_get_option('post_settings_disabled','aesop_editor');
		$shortcodify_disabled 	= aesop_editor_get_option('shortcodify_disabled','aesop_editor');

		?>
		<div class="wrap">

	    	<h2>Aesop Editor Settings</h2>

			<form id="aesop-editor-settings-form" method="post" enctype="multipart/form-data">

				<div class="aesop-editor-settings--option-wrap">
					<div class="aesop-editor-settings--option-inner">
						<label>Article Class</label>
						<span class="aesop-editor--setting-description"> Provide the CSS class of container that holds the post. This should be the first parent container class that holds the_content.</span>
						<input required type="text" name="aesop_editor[article_class]" id="aesop_editor[article_class]" value="<?php echo esc_attr( $article_object );?>" placeholder=".entry-content">
					</div>
				</div>

				<div class="aesop-editor-settings--option-wrap">
					<div class="aesop-editor-settings--option-inner">
						<label>Featured Image Class</label>
						<span class="aesop-editor--setting-description"> Provide the CSS class that uses a featured image as a background image. This currently only supports themes that have the featured image set as background image.</span>
						<input type="text" name="aesop_editor[featimg_class]" id="aesop_editor[featimg_class]" value="<?php echo esc_attr( $featImgClass );?>" placeholder=".entry-content">
					</div>
				</div>

				<div class="aesop-editor-settings--option-wrap">
					<div class="aesop-editor-settings--option-inner">
						<label>Article Title Class</label>
						<span class="aesop-editor--setting-description"> Provide the CSS class for the post title. This will enable you to update the title of the post by clicking and typing.</span>
						<input type="text" name="aesop_editor[title_class]" id="aesop_editor[title_class]" value="<?php echo esc_attr( $titleClass );?>" placeholder=".entry-content">
					</div>
				</div>

				<!-- Advanced -->

				<div class="aesop-editor-settings--option-wrap">
					<div class="aesop-editor-settings--option-inner">
						<input type="checkbox" class="checkbox" name="aesop_editor[post_save_disabled]" id="aesop_editor[post_save_disabled]" <?php echo checked( $save_to_post_disabled, 'on' );?> >
						<label for="aesop_editor[post_save_disabled]">Disable Post Saving</label>
						<span class="aesop-editor--setting-description">By default the editor will update the database with the post or page it is being used on. Check this box to disable this. If you check this box, it is assumed that you will be using the provided filters to save your own content.</span>

					</div>
				</div>

				<div class="aesop-editor-settings--option-wrap">
					<div class="aesop-editor-settings--option-inner">
						<input type="checkbox" class="checkbox" name="aesop_editor[post_settings_disabled]" id="aesop_editor[post_settings_disabled]" <?php echo checked( $post_settings_disabled, 'on' );?> >
						<label for="aesop_editor[post_settings_disabled]"> Disable Post Settings</label>
						<span class="aesop-editor--setting-description">Check this to disable users from being able to edit post settings from the front-end.</span>
					</div>
				</div>

				<div class="aesop-editor-settings--option-wrap">
					<div class="aesop-editor-settings--option-inner">
						<input type="checkbox" class="checkbox" name="aesop_editor[post_adding_disabled]" id="aesop_editor[post_adding_disabled]" <?php echo checked( $post_new_disabled, 'on' );?> >
						<label for="aesop_editor[post_adding_disabled]">Disable Post Adding</label>
						<span class="aesop-editor--setting-description">By default the editor will update the database with the post or page it is being used on. Check this box to disable this. If you check this box, it is assumed that you will be using the provided filters to save your own content.</span>
					</div>
				</div>

				<div class="aesop-editor-settings--option-wrap last">
					<div class="aesop-editor-settings--option-inner">
						<input type="checkbox" class="checkbox" name="aesop_editor[shortcodify_disabled]" id="aesop_editor[shortcodify_disabled]" <?php echo checked( $shortcodify_disabled, 'on' );?> >
						<label for="aesop_editor[shortcodify_disabled]">Disable Aesop Component Conversion</label>
						<span class="aesop-editor--setting-description">Check this box to disable the conversion process used on Aesop Story Engine components.</span>
					</div>
				</div>

				<div class="aesop-editor-settings--submit">
				    <input type="hidden" name="action" value="aesop-editor-settings" />
				    <input type="submit" class="button-primary" value="Save Settings" />
					<?php wp_nonce_field( 'nonce','aesop_editor_settings' ); ?>
				</div>
			</form>

		</div><?php

	}
}
new ahEditorAdminSettings;