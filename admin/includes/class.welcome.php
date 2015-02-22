<?php
/**
*
*	Creates a welcome screen when the plugin is activated
*
*/
class lassoWelcome {

	function __construct(){

		add_action( 'admin_init', 		array($this,'redirect' ));
		add_action('admin_menu', 		array($this,'lasso_welcome'));
		add_action( 'admin_head', 		array($this,'remove_menu' ));

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

	  	$updated = get_option( 'lasso_updated_from' );

		if( !$updated ) {

			// first time visitor
	  		wp_safe_redirect( add_query_arg( array( 'page' => 'lasso-welcome-screen' ), admin_url( 'index.php' ) ) );

	  	} else {

	  		// upgraded
	  		wp_safe_redirect( add_query_arg( array( 'page' => 'lasso-welcome-back' ), admin_url( 'index.php' ) ) );

	  	}


	}

	/**
	*
	*	Add dashboard pages for welcome and welcome back
	*
	*	@since 0.8
	*/
	function lasso_welcome() {
	  	add_dashboard_page('Welcome to Lasso','Welcome to Lasso','read','lasso-welcome-screen',array($this,'welcome'));
	  	add_dashboard_page('Welcome Back to Lasso','Welcome Back to Lasso','read','lasso-welcome-back',array($this,'welcome_back'));
	}

	/**
	*
	*	Callback for the intial welcome screen for new users
	*
	*	@since 0.8.2
	*/
	function welcome() {

	  	?>
		  	<div class="wrap lasso--welcome">

		  		<?php echo self::header();?>

			   	<div class="lasso--welcome__section lasso--welcome__section--quickstart">
			   		<h2><?php _e('Getting Started','lasso');?></h2>
			   		<p class="lasso--welcome__lead"><?php _e('It\'s easy to get Lasso implemented into your theme. Just follow these short steps below and you\'ll be on your way!','lasso');?></p>
					<ul class="lasso--welcome__steps">
						<li>
							<strong><?php _e('Add Article Class','lasso');?></strong>
							<p><?php _e('At minimum, the editor requires the CSS class of the main container holding the post content to be saved in the settings at Settings-->Lasso-->Article Class. All other settings are optional. You an use a tool such as Chrome Inspector to find the CSS class that you\'ll need to enter into the settings so Lasso knows where it needs to work','lasso');?></p>
						</li>
						<li>
							<strong><?php _e('View a Post','lasso');?></strong>
							<p><?php _e('After you have entered your CSS class, view any existing post to start editing. If that post happens to have existing Aesop Story Engine components, then they will all automatically work with Lasso','lasso');?></p>
						</li>
					</ul>
				</div>

		  	</div>
	 	<?php
	}

	/**
	*
	*	Callback for the screen for users who havew updated from a previous version
	*
	*	@since 0.8.2
	*/
	function welcome_back() {

	  	?>
		  	<div class="wrap lasso--welcome">

				<?php echo self::header();?>

			   	<div class="lasso--welcome__section lasso--welcome__section--quickstart">
			   		<h2><?php _e('Changelog','lasso');?></h2>
			   		<p class="lasso--welcome__lead"><?php _e('Here\'s what\'s changed in Lasso since the last update.','lasso');?></p>
					<div class="lasso--welcome__changelog">
						changelog here
					</div>
				</div>

		  	</div>
	 	<?php
	}

	/**
	*
	*	Universal header draw on both welcome and activation screens
	*
	*	@since 0.8.2
	*/
	function header() {

	  	?>

	  		<div class="lasso--welcome__section lasso--welcome__section--top">
	  			<div class="lasso--welcome__left">
		  			<img src="<?php echo LASSO_URL.'/admin/assets/img/logo.svg';?>">
		    		<h1><?php _e('Welcome to Lasso ','lasso');?><?php echo LASSO_VERSION;?></h1>
		    		<h3><?php _e('It\'s a mighty fine time to wrangle us some content!','lasso');?></h3>
		    	</div>
		    	<div class="lass--welcome__right">
			    	<ul class="lasso--welcome__social">
			    		<li><a href="https://lasso.is" target="_blank"><i class="dashicons dashicons-admin-site"></i> <?php _e('Website', 'lasso');?></a></li>
			    		<li><a href="https://dl.dropboxusercontent.com/u/5594632/aesop-editor-docs/index.html" target="_blank"><i class="dashicons dashicons-editor-help"></i> <?php _e('Documentation', 'lasso');?></a></li>
			    		<li><a href="http://twitter.com/aesopinteractiv" target="_blank"><i class="dashicons dashicons-twitter"></i> <?php _e('Twitter','lasso');?></a></li>
			    		<li><a href="http://facebook.com/aesopinteractive" target="_blank"><i class="dashicons dashicons-facebook"></i> <?php _e('Facebook','lasso');?></a></li>
			    	</ul>
			    </div>
		    </div>

	 	<?php
	}

	function remove_menu() {
    	remove_submenu_page( 'index.php', 'lasso-welcome-screen' );
    	remove_submenu_page( 'index.php', 'lasso-welcome-back' );
	}
}
new lassoWelcome;