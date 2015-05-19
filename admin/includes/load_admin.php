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

		add_action( 'admin_head',  array( $this, 'admin_assets' ) );
		add_filter( 'plugin_row_meta',    array( $this, 'plugin_meta' ), 10, 2 );

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
}
