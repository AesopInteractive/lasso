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

/**
 * Load plugin if PHP version is 5.4 or later.
 */
if ( version_compare( PHP_VERSION, '5.4.0', '>=' ) ) {
	include_once( LASSO_DIR . '/bootstrap.php' );

}else{
	//@todo error!
}
