<?php
/**
 * AH Stripe
 *
 * @package   Lasso_Admin
 * @author    Nick Haskins <nick@aesopinteractive.com>
 * @license   GPL-2.0+
 * @link      http://aesopinteractive.com
 * @copyright 2015 Aesopinteractive LLC
 */
namespace lasso_admin;

use lasso_public_facing\lasso;

class load_admin {

	/**
	 * Instance of this class.
	 *
	 * @since    0.0.1
	 *
	 * @var      object
	 */
	protected static $instance = null;

	/**
	 * Slug of the plugin screen.
	 *
	 * @since    0.0.1
	 *
	 * @var      string
	 */
	protected $plugin_screen_hook_suffix = null;

	/**
	 * Initialize the plugin by loading admin scripts & styles and adding a
	 * settings page and menu.
	 *
	 * @since     0.0.1
	 */
	private function __construct() {

		$plugin = lasso::get_instance();
		$this->plugin_slug = $plugin->get_plugin_slug();

		add_action( 'admin_head',  			array( $this, 'admin_assets' ) );
		add_action( 'admin_notices', 		array( $this, 'license_nag' ) );
		add_filter( 'plugin_row_meta',    	array( $this, 'plugin_meta' ), 10, 2 );

		if ( !class_exists( 'EDD_SL_Plugin_Updater' ) ) {
			include LASSO_DIR.'admin/includes/EDD_SL_Plugin_Updater.php';
		}

		if ( !class_exists( 'TGM_Plugin_Activation' ) ) {
			include LASSO_DIR.'admin/includes/class-tgm-plugin-activation.php';
		}

		new menus\welcome();
		new menus\settings();

		if ( !defined( 'LASSO_AGENCY_MODE' ) ) {
			new menus\license();
		}

	}

	/**
	 * Return an instance of this class.
	 *
	 * @since     0.0.1
	 *
	 * @return    object    A single instance of this class.
	 */
	public static function get_instance() {

		// If the single instance hasn't been set, set it now.
		if ( null == self::$instance ) {
			self::$instance = new self;
		}

		return self::$instance;
	}

	/**
	 * Load some assets for the appropriate pages in admin
	 *
	 * @since 1.0
	 */
	public function admin_assets() {

		$screen = get_current_screen();

		$pages = array(
			'settings_page_lasso-editor-settings',
			'settings_page_lasso-editor-settings-network',
			'dashboard_page_lasso-welcome-screen'
		);

		foreach ( $pages as $page ) {
			wp_enqueue_script( 'lasso-editor-settings-script', LASSO_URL.'/admin/assets/js/lasso-editor-settings.js', array( 'jquery' ), LASSO_VERSION, true );
			wp_enqueue_style( 'lasso-editor-settings-style', LASSO_URL.'/admin/assets/css/lasso-editor-settings.css', LASSO_VERSION );
		}
	}

	/**
	 * Add some custom links to the plugins.php page
	 *
	 * @since 0.8.8
	 * @param unknown $links array array of new links
	 * @param unknown $file
	 *
	 * @return array new array of links for our plugin listing on plugins.php
	 */
	public function plugin_meta( $links, $file ) {

		if ( strpos( $file, 'lasso.php' ) !== false && !defined( 'LASSO_AGENCY_MODE' ) ) {

			$new_links = array(
				'<a href="https://lasso.is/help" target="_blank">Help</a>'
			);

			$links = array_merge( $links, $new_links );
		}

		return $links;
	}

	/**
	*	Adds an admin notice reminding the user if their license key has not been saved
	*
	*	@since 0.9.7
	*	@todo make dismissible
	*/
	public function license_nag(){

		$screen 	= get_current_screen();
		$welcome    = 'toplevel_page_lasso-editor' == $screen->id;
		$license  	= get_option( 'lasso_license_key' );
		$status   	= get_option( 'lasso_license_status' );

		$message_empty    = apply_filters('lasso_empty_license_message','Your license key for support and automatic updates for Lasso is missing!');
		$message_invalid  = apply_filters('lasso_invalid_license_message','Oh snap! It looks like your Lasso license key is invalid. Might check here to see if its been added correctly.');
		$message_inactive  = apply_filters('lasso_inactive_license_message','It looks like your license key has not yet been activated.');

		$license_link 	  = sprintf('<a href="%s">Update License</a>', esc_url( add_query_arg( array( 'page' => 'lasso-license' ), admin_url('admin.php') ) ) );
		$dismiss_link     = sprintf('<a href="%s" id="lasso-dismiss-notice" class="notice-dismiss"><span class="screen-reader-text">%s</span></a>', esc_url( add_query_arg( 'lasso-notice', 'dismiss' ) ), __('Dismiss this notice.','lasso') );

		if ( current_user_can('manage_options') && !$welcome && !defined( 'LASSO_AGENCY_MODE') ) {

			if ( empty( $license ) ) {

        		printf('<div class="error"><p>%s %s</p>%s</div>', $message_empty, $license_link, $dismiss_link );

        	} else if ( 'invalid' == $status ){ // license key entered wrong or something

				printf('<div class="error"><p>%s %s</p>%s</div>', $message_invalid, $license_link , $dismiss_link );

        	} else if ( empty( $status ) ){ // license key saved but not activated

				printf('<div class="error"><p>%s %s</p>%s</div>', $message_inactive, $license_link, $dismiss_link );

        	}
		}

	}
}
