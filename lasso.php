<?php
/**
 *
 *
 * @package   Editus
 * @author    Hyun Supul <hyun@aesopinteractive.com>, Nick Haskins <nick@aesopinteractive.com>
 * @link      http://edituswp.com
 * @copyright 2015-2017 Aesopinteractive 
 *
 * Plugin Name:       Editus
 * Plugin URI:        http://edituswp.com
 * Description:       Front-end editor and story builder.
 * Version:           0.9.15.1
 * Author:            Aesopinteractive 
 * Author URI:        http://aesopinteractive.com
 * Text Domain:       lasso
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

// Set some constants
define( 'LASSO_VERSION', '0.9.15.1' );
define( 'LASSO_DIR', plugin_dir_path( __FILE__ ) );
define( 'LASSO_URL', plugins_url( '', __FILE__ ) );
define( 'LASSO_FILE', __FILE__ );

/**
 * Load plugin if PHP version is 5.4 or later.
 */
if ( version_compare( PHP_VERSION, '5.4.0', '>=' ) ) {

	include_once( LASSO_DIR . '/bootstrap.php' );

} else {

	add_action('admin_head', 'lasso_fail_notice');
	function lasso_fail_notice(){

		printf('<div class="error"><p>Lasso requires PHP 5.4 or higher.</p></div>');

	}
}

function lasso_show_in_rest() {
	global $wp_post_types;
	
	$allowed_post_types = lasso_editor_get_option( 'allowed_post_types', 'lasso_editor', array( ) );
	$allowed_post_types = apply_filters( 'lasso_allowed_post_types', $allowed_post_types );
	
	foreach( $allowed_post_types as $key ) {
	    
		// If the post type doesn't exist, skip it
		if( !$wp_post_types[$key] )
			continue;
	    	
    	$wp_post_types[$key]->show_in_rest = true;
    }
}

 add_action( 'init', 'lasso_show_in_rest' );

