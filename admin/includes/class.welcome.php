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

	  	wp_safe_redirect( add_query_arg( array( 'page' => 'lasso-welcome-screen' ), admin_url( 'index.php' ) ) );

	}

	/**
	*
	*	Add dashboard pages for welcome and welcome back
	*
	*	@since 0.8
	*/
	function lasso_welcome() {
	  	add_dashboard_page('Welcome to Lasso','Welcome to Lasso','read','lasso-welcome-screen',array($this,'welcome'));
	}

	/**
	*
	*	Callback for the intial welcome screen for new users
	*
	*	@since 0.8.2
	*/
	function welcome() {

		$article_object = lasso_editor_get_option('article_class','lasso_editor');

		$theme 			= wp_get_theme();
		$theme_domain 	= $theme->get('TextDomain');
		$theme_class 	= $theme_domain ? lasso_supported_themes( $theme_domain ) : false;

	  	?>
		  	<div class="wrap lasso--welcome">

		  		<?php self::header();?>

		  		<?php if ( !empty( $article_object ) ) : ?>

			  		<ul class="lasso--welcome__steps">

			  			<li>

			  				<h3>Tell Lasso Where to Work</h3>

			  				<p>Before using Lasso, paste the CSS class of the container hold your post content into the first option under <a href="<?php echo esc_url( admin_url('options-general.php?page=lasso-editor-settings') );?>">Lasso Settings</a>.</p>

			  				<?php if ( false !== $theme_class ): ?>

			  					<p>For your convienience, we've detected that you're running <?php echo $theme->get( 'Name' );?>. Here's the CSS class that you'll need:</p>

			  					<code><?php echo $theme_class; ?></code>

			  				<?php else: ?>

			  					<p>You can use a tool like inspector in Chrome or Firefox to find this CSS class.</p>

			  				<?php endif; ?>
			  			</li>

			  		</ul>

		  		<?php else: ?>

			  		<ul class="lasso--starting__steps">

			  			<li>
			  				<h3>Write with a Pen</h3>
			  				<p>By default Lasso will show a small menu on the bottom of every post and page.Click the "pen" icon to go into edit mode. Press escape to get out of edit mode.</p>
			  			</li>

			  		</ul>

			  	<?php endif; ?>

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

	  		<div class="lasso--welcome__top">

	  			<img src="<?php echo LASSO_URL.'/admin/assets/img/logo.svg';?>">
	    		<h1><?php _e('Welcome to Lasso','lasso');?></h1>
	    		<p>Version <?php echo LASSO_VERSION;?></p>

		    	<ul class="lasso--welcome__social">
		    		<li><a href="https://lasso.is" target="_blank"><i class="dashicons dashicons-admin-site"></i> <?php _e('Website', 'lasso');?></a></li>
		    		<li><a href="dl.dropboxusercontent.com/u/5594632/storyam-media/lasso-docs/index.html" target="_blank"><i class="dashicons dashicons-editor-help"></i> <?php _e('Documentation', 'lasso');?></a></li>
		    		<li><a href="http://twitter.com/aesopinteractiv" target="_blank"><i class="dashicons dashicons-twitter"></i> <?php _e('Twitter','lasso');?></a></li>
		    		<li><a href="http://facebook.com/aesopinteractive" target="_blank"><i class="dashicons dashicons-facebook"></i> <?php _e('Facebook','lasso');?></a></li>
		    	</ul>
	
		    </div>

	 	<?php
	}

	function remove_menu() {
    	remove_submenu_page( 'index.php', 'lasso-welcome-screen' );
	}

}
new lassoWelcome;

















