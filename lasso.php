<?php
/**
 *
 *
 * @package   Editus
 * @author    Hyun Supul <hyun@aesopinteractive.com>, Nick Haskins <nick@aesopinteractive.com>
 * @link      http://edituswp.com
 * @copyright 2015-2018 Aesopinteractive 
 *
 * Plugin Name:       Editus
 * Plugin URI:        http://edituswp.com
 * Description:       Front-end editor and story builder.
 * Version:           1.0.8.3
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
define( 'LASSO_VERSION', '1.0.8.3' );
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

		printf('<div class="error"><p>Editus requires PHP 5.4 or higher.</p></div>');

	}
}

add_filter('register_post_type_args', 'lasso_show_in_rest', 10, 2);
function lasso_show_in_rest($args, $post_type){
 
    $allowed_post_types = lasso_editor_get_option( 'allowed_post_types', 'lasso_editor', array( ) );
	$allowed_post_types = apply_filters( 'lasso_allowed_post_types', $allowed_post_types );
	if (in_array( $post_type,$allowed_post_types)) {
		$args['show_in_rest'] = true;
		if ($post_type != 'post' && $post_type != 'page') {
			$args['rest_base'] = $post_type;
		}
	}
 
    return $args;
}


register_meta('user', 'lasso_hide_tour', array(
  "type" => "string",
  "show_in_rest" => true // this is the key part
));

// Gutenberg
if( function_exists( 'is_gutenberg_page' ) ) {
	function add_raw_to_post( $response, $post, $request ) {
		$response_data = $response->get_data();
		if ( is_array( $response_data['content'] )) {
			$response_data['content']['raw'] =  $post->post_content ;
			$response->set_data( $response_data );
		}

		return $response;
	}
	add_filter( "rest_prepare_post", 'add_raw_to_post', 10, 3 );
}

