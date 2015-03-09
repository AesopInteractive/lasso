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

class Lasso_Admin {

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

		$plugin = Lasso::get_instance();
		$this->plugin_slug = $plugin->get_plugin_slug();

		add_action('admin_head',		array($this,'admin_assets'));

		require_once(LASSO_DIR.'/admin/includes/class.menu--welcome.php');
		require_once(LASSO_DIR.'/admin/includes/class.menu--settings.php');
		require_once(LASSO_DIR.'/admin/includes/class.menu--addons.php');

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
	*
	*	Load some assets for the appropriate pages in admin
	*	@since 1.0
	*/
	function admin_assets(){

		$screen = get_current_screen();

		$pages = array(
			'settings_page_lasso-editor-settings',
			'settings_page_lasso-editor-settings-network',
			'dashboard_page_lasso-welcome-screen'
		);

		foreach( $pages as $page ){
			wp_enqueue_script('lasso-editor-settings-script', LASSO_URL.'/admin/assets/js/lasso-editor-settings.js', array('jquery'), LASSO_VERSION, true );
			wp_enqueue_style('lasso-editor-settings-style', LASSO_URL.'/admin/assets/css/lasso-editor-settings.css', LASSO_VERSION );
		}
	}
}
