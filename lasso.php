<?php
/**
 *
 *
 * @package   Lasso
 * @author    Nick Haskins <nick@aesopinteractive.com>
 * @link      http://lasso.is
 * @copyright 2015 Aesopinteractive LLC
 *
 * Plugin Name:       Lasso (beta)
 * Plugin URI:        http://lasso.is
 * Description:       Front-end editor and story builder.
 * Version:           0.9.1.1
 * Author:            Aesopinteractive LLC
 * Author URI:        http://aesopstoryengine.com
 * Text Domain:       lasso
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

// Set some constants
define( 'LASSO_VERSION', '0.9.1.1' );
define( 'LASSO_DIR', plugin_dir_path( __FILE__ ) );
define( 'LASSO_URL', plugins_url( '', __FILE__ ) );

/*----------------------------------------------------------------------------*
 * Public-Facing Functionality
 *----------------------------------------------------------------------------*/
require_once plugin_dir_path( __FILE__ ) . 'public/class-lasso.php';


register_activation_hook( __FILE__, array( 'Lasso', 'activate' ) );
register_deactivation_hook( __FILE__, array( 'Lasso', 'deactivate' ) );

add_action( 'plugins_loaded', array( 'Lasso', 'get_instance' ) );

/*----------------------------------------------------------------------------*
 * Dashboard and Administrative Functionality
 *----------------------------------------------------------------------------*/

if ( is_admin() ) {

	require_once plugin_dir_path( __FILE__ ) . 'admin/class-lasso-admin.php';
	add_action( 'plugins_loaded', array( 'Lasso_Admin', 'get_instance' ) );

}