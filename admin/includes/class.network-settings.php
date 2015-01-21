<?php
/**
*
*	Class responsible for adding network settings
*
*/

class ahEditorNetworkSettings {

	function __construct(){

		add_action('network_admin_menu',			array($this,'add_network_menu'));
		add_action('wp_ajax_aesop-editor-settings',	array($this,'process_settings'));


	}

	function add_network_menu(){
     	add_submenu_page( 'settings.php', 'Aesop Editor', 'Aesop Editor', 'manage_network', 'aesop-editor-settings', array($this, 'network_settings'));
	}

	function network_settings(){

		echo aesop_editor_settings_form();
	}

	/**
	*
	*	Save network settings
	*
	*/
	function process_settings(){

		if ( function_exists('is_multisite') && !is_multisite() && !current_user_can('manage_network') || !is_user_logged_in() )
			return;

		if ( isset( $_POST['action'] ) && 'aesop-editor-settings' == $_POST['action'] && check_admin_referer( 'nonce', 'aesop_editor_settings' ) ) {

			$options = isset( $_POST['aesop_editor'] ) ? $_POST['aesop_editor'] : false;
			$options = array_map('sanitize_text_field', $options);

			update_site_option( 'aesop_editor', $options );

			wp_send_json_success();

		}

		die();

	}

}
new ahEditorNetworkSettings;