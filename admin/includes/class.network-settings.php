<?php
/**
*
*	Class responsible for adding network settings
*
*/

class ahEditorNetworkSettings {

	function __construct(){

     	add_menu_page('Aesop Editor', 'Aesop Editor', 'manage_network', 'aesop-editor-settings', array($this, 'network_settings'));
	}

	function network_settings(){

		if ( function_exists('is_multisite') && !is_multisite() && !current_user_can('manage_network') )
			return;

		?><div class="wrap">

	    	<h2>Aesop Editor Settings</h2>

			<form method="post">

				<p>
					<label>Article Class</label>
					<input type="text" name="aesop_editor[article_class]" id="aesop_editor[article_class]" value="" placeholder=".entry-content">
					<span class="description"> Provide the CSS class of container that holds the post. This should be the first parent container class that holds the_content.</span>
				</p>

				<p>
					<label>Featured Image Class</label>
					<input type="text" name="aesop_editor[featimg_class]" id="aesop_editor[featimg_class]" value="" placeholder=".entry-content">
					<span class="description"> Provide the CSS class that uses a featured image as a background image. This currently only supports themes that have the featured image set as background image.</span>
				</p>

				<p>
					<label>Article Title Class</label>
					<input type="text" name="aesop_editor[title_class]" id="aesop_editor[title_class]" value="" placeholder=".entry-content">
					<span class="description"> Provide the CSS class for the post title. This will enable you to update the title of the post by clicking and typing.</span>
				</p>

				<!-- Advanced -->

				<p>
					<input type="checkbox" class="checkbox" name="aesop_editor[post_save_disabled]" id="aesop_editor[post_save_disabled]" value="">
					<label for="aesop_editor[post_save_disabled]"> By default the editor will update the database with the post or page it is being used on. Check this box to disable this. If you check this box, it is assumed that you will be using the provided filters to save your own content.</label>
				</p>

				<p>
					<input type="checkbox" class="checkbox" name="aesop_editor[post_settings_disabled]" id="aesop_editor[post_settings_disabled]" value="">
					<label for="aesop_editor[post_settings_disabled]"> Check this to disable users from being able to edit post settings from the front-end.</label>
				</p>

				<p>
					<input type="checkbox" class="checkbox" name="aesop_editor[post_adding_disabled]" id="aesop_editor[post_adding_disabled]" value="">
					<label for="aesop_editor[post_adding_disabled]"> By default the editor will update the database with the post or page it is being used on. Check this box to disable this. If you check this box, it is assumed that you will be using the provided filters to save your own content.</label>
				</p>

				<p>
					<input type="checkbox" class="checkbox" name="aesop_editor[shortcodify_disabled]" id="aesop_editor[shortcodify_disabled]" value="">
					<label for="aesop_editor[shortcodify_disabled]"> Check this box to disable the conversion process used on Aesop Story Engine components.</label>
				</p>

				<p class="submit">

				    <input type="hidden" name="action" value="aesop-editor-network-settings" />
				    <input type="submit" class="button-primary" value="Save Settings" />
					<?php wp_nonce_field( 'nonce','aesop_editor_network_settings' ); ?>
				</p>
			</form>


		</div><?php

	}

	/**
	*
	*	Save network settings
	*
	*/
	function process_settings(){

		if ( function_exists('is_multisite') && !is_multisite() && !current_user_can('manage_network') || !is_user_logged_in() )
			return;

		if ( isset( $_POST['action'] ) && 'aesop-editor-network-settings' == $_POST['action'] && check_admin_referer( 'nonce', 'aesop_editor_network_settings' ) ) {

			$options = isset( $_POST['aesop_editor'] ) ? $_POST['aesop_editor'] : false;

			update_site_option( 'aesop_editor', $options );

		}

	}

}
new ahEditorNetworkSettings;