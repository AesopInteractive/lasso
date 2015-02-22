<?php
/**
*
*	Creates a welcome screen when the plugin is activated
*
*/
class lassoWelcome {

	function __construct(){

		add_action( 'admin_init', 		array($this,'redirect' ));
		add_action('admin_menu', 		array($this,'welcome'));
		//add_action( 'admin_head', 		array($this,'remove_menu' ));

	}

	function redirect() {

	  	// Bail if no activation redirect
	    if ( ! get_transient( '_lasso_welcome_redirect' ) ) {
	    	return;
	  	}

	  	// Delete the redirect transient
	  	delete_transient( '_lasso_welcome_redirect' );

	  	// Bail if activating from network, or bulk
	  	if ( is_network_admin() || isset( $_GET['activate-multi'] ) ) {
	    	return;
	  	}

	  	// Redirect to welcome page
	  	wp_safe_redirect( add_query_arg( array( 'page' => 'lasso-welcome-screen' ), admin_url( 'index.php' ) ) );

	}

	function welcome() {
	  	add_dashboard_page('Welcome to Lasso','Welcome to Lasso','read','lasso-welcome-screen',array($this,'content'));
	}

	function content() {

	  	?>
		  	<div class="wrap">
		    	<h2>Welcome to Lasso</h2>
		    	<p>Coming soon!</p>
		  	</div>
	 	<?php
	}

	function remove_menu() {
    	remove_submenu_page( 'index.php', 'lasso-welcome-screen' );
	}
}
new lassoWelcome;