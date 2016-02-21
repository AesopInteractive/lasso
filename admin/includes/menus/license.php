<?php

namespace lasso_admin\menus;

class license {

	function __construct() {

		define( 'LASSO_STORE_ITEM_NAME', 'lasso' );
		define( 'LASSO_STORE_URL', 'https://edituswp.com' );

		add_action( 'admin_init',  array( $this, 'plugin_updater' ), 0 );
		add_action( 'admin_menu',  array( $this, 'license_menu' ) );
		add_action( 'network_admin_menu',  array( $this, 'license_menu' ) ); // CHANGED Added hook.
		add_action( 'admin_init',  array( $this, 'register_option' ) );
		add_action( 'admin_init',  array( $this, 'activate_license' ) );
		add_action( 'admin_init',  array( $this, 'deactivate_license' ) );
	}

	function plugin_updater() {

		// retrieve our license key from the DB
		$license_key = trim( get_option( 'lasso_license_key' ) );

		// setup the updater
		$edd_updater = new \EDD_SL_Plugin_Updater( LASSO_STORE_URL , LASSO_FILE, array(
				'version'  => LASSO_VERSION,
				'license'  => $license_key,
				'item_name' => LASSO_STORE_ITEM_NAME,
				'author'  => __( 'Aesopinteractive LLC', 'lasso' )
			)
		);

	}
	function license_menu() {

		// CHANGED Removed condition.
		add_submenu_page( 'lasso-editor', __( 'License Key', 'lasso' ), __( 'License', 'lasso' ), 'manage_options', 'lasso-license', array( $this, 'license_page' ) );

	}
	function license_page() {
		$license  = get_option( 'lasso_license_key' );
		$status  = get_option( 'lasso_license_status' );

?>
		<div class="wrap">
			<h2><?php _e( 'Editus License', 'lasso' ); ?></h2>
			<p><?php _e( 'Input the license key you recieved with your purchase to ensure your version of Editus stays updated.', 'lasso' );?></p>
			<form class="lasso--form-settings" method="post" action="options.php">

				<?php settings_fields( 'lasso_license' ); ?>

				<table class="form-table">
					<tbody>
						<tr valign="top">
							<th scope="row" valign="top">
								<?php _e( 'License Key', 'lasso' ); ?>
							</th>
							<td>
								<input id="lasso_license_key" name="lasso_license_key" type="text" class="regular-text" value="<?php esc_attr_e( $license ); ?>" />
							</td>
						</tr>
						<?php if ( false !== $license ) { ?>
							<tr valign="top">
								<th scope="row" valign="top">
									<?php _e( 'Activate License', 'lasso' ); ?>
								</th>
								<td>
									<?php if ( $status !== false && $status == 'valid' ) { ?>
										<span style="color:green;"><?php _e( 'active' ); ?></span>
										<?php wp_nonce_field( 'lasso_license_nonce', 'lasso_license_nonce' ); ?>
										<input type="submit" class="button-secondary" name="edd_license_deactivate" value="<?php esc_attr_e( 'Deactivate License', 'lasso' ); ?>"/>
									<?php } else {
				wp_nonce_field( 'lasso_license_nonce', 'lasso_license_nonce' ); ?>
										<input type="submit" class="button-secondary" name="edd_license_activate" value="<?php esc_attr_e( 'Activate License', 'lasso' ); ?>"/>
									<?php } ?>
								</td>
							</tr>
						<?php } ?>
					</tbody>
				</table>
				<?php submit_button( 'Save License' ); ?>

			</form>
		<?php
	}

	// register option
	function register_option() {

		register_setting( 'lasso_license', 'lasso_license_key', array( $this, 'sanitize_license' ) );
	}

	// santize
	function sanitize_license( $new ) {
		$old = get_option( 'lasso_license_key' );
		if ( $old && $old != $new ) {
			delete_option( 'lasso_license_status' ); // new license has been entered, so must reactivate
		}
		return $new;
	}

	// activate
	function activate_license() {

		// listen for our activate button to be clicked
		if ( isset( $_POST['edd_license_activate'] ) ) {

			// run a quick security check
			if ( ! check_admin_referer( 'lasso_license_nonce', 'lasso_license_nonce' ) )
				return; // get out if we didn't click the Activate button

			// retrieve the license from the database
			$license = trim( get_option( 'lasso_license_key' ) );

			// data to send in our API request
			$api_params = array(
				'edd_action'=> 'activate_license',
				'license'  => $license,
				'item_name' => urlencode( LASSO_STORE_ITEM_NAME ), // the name of our product in EDD
				'url'       => home_url()
			);

			// Call the custom API.
			$response = wp_remote_post( LASSO_STORE_URL, array( 'body' => $api_params, 'timeout' => 15, 'sslverify' => false ) );

			// make sure the response came back okay
			if ( is_wp_error( $response ) )
				return false;

			// decode the license data
			$license_data = json_decode( wp_remote_retrieve_body( $response ) );

			// $license_data->license will be either "valid" or "invalid"

			update_option( 'lasso_license_status', $license_data->license );

		}
	}

	function deactivate_license() {

		// listen for our activate button to be clicked
		if ( isset( $_POST['edd_license_deactivate'] ) ) {

			// run a quick security check
			if ( ! check_admin_referer( 'lasso_license_nonce', 'lasso_license_nonce' ) )
				return; // get out if we didn't click the Activate button

			// retrieve the license from the database
			$license = trim( get_option( 'lasso_license_key' ) );


			// data to send in our API request
			$api_params = array(
				'edd_action'=> 'deactivate_license',
				'license'  => $license,
				'item_name' => urlencode( LASSO_STORE_ITEM_NAME ), // the name of our product in EDD
				'url'       => home_url()
			);

			// Call the custom API.
			$response = wp_remote_post( LASSO_STORE_URL, array( 'body' => $api_params, 'timeout' => 15, 'sslverify' => false ) );

			// make sure the response came back okay
			if ( is_wp_error( $response ) )
				return false;

			// decode the license data
			$license_data = json_decode( wp_remote_retrieve_body( $response ) );

			// $license_data->license will be either "deactivated" or "failed"
			if ( $license_data->license == 'deactivated' )
				delete_option( 'lasso_license_status' );

		}
	}

	// check status of license
	function check_license() {

		global $wp_version;

		$license = trim( get_option( 'lasso_license_key' ) );

		$api_params = array(
			'edd_action' => 'check_license',
			'license' => $license,
			'item_name' => urlencode( LASSO_STORE_ITEM_NAME ),
			'url'       => home_url()
		);

		// Call the custom API.
		$response = wp_remote_post( LASSO_STORE_URL, array( 'body' => $api_params, 'timeout' => 15, 'sslverify' => false ) );

		if ( is_wp_error( $response ) )
			return false;

		$license_data = json_decode( wp_remote_retrieve_body( $response ) );

		if ( $license_data->license == 'valid' ) {
			echo 'valid'; exit;
			// this license is still valid
		} else {
			echo 'invalid'; exit;
			// this license is no longer valid
		}
	}
}