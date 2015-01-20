<?php
/**
 * AH Stripe
 *
 * @package   Aesop_Editor_Admin
 * @author    Nick Haskins <nick@aesopinteractive.com>
 * @license   GPL-2.0+
 * @link      http://aesopinteractive.com
 * @copyright 2015 Aesopinteractive LLC
 */

class Aesop_Editor_Admin {

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

		$plugin = Aesop_Editor::get_instance();
		$this->plugin_slug = $plugin->get_plugin_slug();

		if ( function_exists('is_multisite') && is_multisite() ) {

			require_once(AESOP_EDITOR_DIR.'/admin/includes/class.network-settings.php');

		} else {

			require_once(AESOP_EDITOR_DIR.'/admin/includes/class.settings.php');

		}
		require_once(AESOP_EDITOR_DIR.'/admin/includes/settings-form.php');


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
