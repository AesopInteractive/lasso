<?php
/**
 *
 * @package   Lasso
 * @author    Nick Haskins <nick@lassointeractive.com>
 * @license   GPL-2.0+
 * @link      http://lassointeractive.com
 * @copyright 2015 Lassointeractive LLC
 *
 * Plugin Name:       Lasso
 * Plugin URI:        http://lasso.is
 * Description:       Lasso - Front End Editor
 * Version:           Beta0.1
 * GitLab Plugin URI: https://gitlab.com/lasso/lasso-editor
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

// Set some constants
define('LASSO_VERSION', '0.1');
define('LASSO_DIR', plugin_dir_path( __FILE__ ));
define('LASSO_URL', plugins_url( '', __FILE__ ));

/*----------------------------------------------------------------------------*
 * Public-Facing Functionality
 *----------------------------------------------------------------------------*/
require_once( plugin_dir_path( __FILE__ ) . 'public/class-lasso-editor.php' );


register_activation_hook( __FILE__, array( 'Lasso_Editor', 'activate' ) );
register_deactivation_hook( __FILE__, array( 'Lasso_Editor', 'deactivate' ) );

add_action( 'plugins_loaded', array( 'Lasso_Editor', 'get_instance' ) );

/*----------------------------------------------------------------------------*
 * Dashboard and Administrative Functionality
 *----------------------------------------------------------------------------*/

if ( is_admin() ) {

	require_once( plugin_dir_path( __FILE__ ) . 'admin/class-lasso-editor-admin.php' );
	add_action( 'plugins_loaded', array( 'Lasso_Editor_Admin', 'get_instance' ) );

}
