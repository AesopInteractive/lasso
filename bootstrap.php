<?php
/**
 * Bootstrap the plugin if version check passed.
 *
 * @package   @lasso
 * @author    Josh Pollock <Josh@JoshPress.net>
 * @license   GPL-2.0+
 */
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

//load tour
add_action(  'init', function() {
	if (! is_admin() && is_user_logged_in() ) {
		new \lasso_public_facing\tour();
	}
});


/*----------------------------------------------------------------------------*
 * Dashboard and Administrative Functionality
 *----------------------------------------------------------------------------*/

if ( is_admin() ) {
	$loader->addNamespace('lasso_admin', LASSO_DIR . 'admin/includes' );
	add_action( 'plugins_loaded', array( 'lasso_admin\load_admin', 'get_instance' ) );

}
