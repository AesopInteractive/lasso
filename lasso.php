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

if ( version_compare( PHP_VERSION, '5.4.0', '>=' ) ) {
	/*----------------------------------------------------------------------------*
	 * Register Autoloader
	 *----------------------------------------------------------------------------*/
	include_once( LASSO_DIR . '/includes/lasso_autoloader.php' );
	$loader = new lasso_autoloader();

	$loader->register();

	/*----------------------------------------------------------------------------*
	 * Public-Facing Functionality
	 *----------------------------------------------------------------------------*/
	//require_once plugin_dir_path( __FILE__ ) . 'public/class-lasso.php';

	$loader->addNamespace('lasso', LASSO_DIR . 'includes' );
	$loader->addNamespace('lasso_public_facing', LASSO_DIR . 'public/includes' );
	$loader->addNamespace('lasso\internal_api', LASSO_DIR . 'internal-api' );
	new lasso\internal_api\end_points();

	register_activation_hook( __FILE__, array( 'lasso_public_facing\lasso', 'activate' ) );
	register_deactivation_hook( __FILE__, array( 'lasso_public_facing\lasso', 'deactivate' ) );

	add_action( 'plugins_loaded', array( 'lasso_public_facing\lasso', 'get_instance' ) );

	/*----------------------------------------------------------------------------*
	 * Dashboard and Administrative Functionality
	 *----------------------------------------------------------------------------*/

	if ( is_admin() ) {
		$loader->addNamespace('lasso_admin', LASSO_DIR . 'admin/includes' );
		add_action( 'plugins_loaded', array( 'lasso_admin\load_admin', 'get_instance' ) );

	}

}else{
	//@todo error!
}
