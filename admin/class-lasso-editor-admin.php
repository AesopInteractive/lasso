<?php
/**
 * AH Stripe
 *
 * @package   Lasso_Editor_Admin
 * @author    Nick Haskins <nick@lassointeractive.com>
 * @license   GPL-2.0+
 * @link      http://lassointeractive.com
 * @copyright 2015 Lassointeractive LLC
 */

class Lasso_Editor_Admin {

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

		$plugin = Lasso_Editor::get_instance();
		$this->plugin_slug = $plugin->get_plugin_slug();

		require_once(LASSO_DIR.'/admin/includes/class.settings.php');

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
}
