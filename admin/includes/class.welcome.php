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


	  	?>
		  	<div class="wrap lasso--welcome">

		  		<?php self::header();?>

		  		<ul class="lasso--welcome__steps">

		  		<?php
			  		$checks = self::lasso_preflight_check();

			  		if ( $checks ):

				  		foreach ( (array) $checks as $key => $check) {

				  			echo $check;
				  		}

				  	else:

				  		// pre-flight is go for flight
				  		?>
						<li>
							<h3>Write with a Pen</h3>
			  				<p>By default Lasso will show a small menu on the bottom of every post and page.Click the "pen" icon to go into edit mode. Press escape to get out of edit mode.</p>
			  			</li>
			  			<?php

				  	endif;

			  	?>
			  	</ul>
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

	/**
	*
	*	Run a series of checks to inform the user about incompatibilities, missing option fields, and suggested addons which is shown to the user on the welcome page when the plugin is activated
	*
	*	@since 0.8.6
	*/
	function lasso_preflight_check(){

		$notices = array();

		$article_object = lasso_editor_get_option('article_class','lasso_editor');

		$theme 			= wp_get_theme();
		$theme_domain 	= $theme->get('TextDomain');
		$theme_class 	= $theme_domain ? lasso_supported_themes( $theme_domain ) : false;

		// if the required CSS class has not been saved
		if ( empty( $article_object ) ) :

			// if we have a theme that we automatically support
			if ( false !== $theme_class ) {

				$notices[] = sprintf('<li>
										<h3>Tell Lasso Where to Work</h3>
										<p>Before using Lasso, <a href="%s">enter and save</a> the CSS class of the container that holds your post and page content.We\'ve detected that you\'re running %s. Here\'s the CSS class that you\'ll need:</p>
										<code style="display:inline-block;margin-top:15px;">%s</code>
									</li>',admin_url('options-general.php?page=lasso-editor-settings'), $theme->get( 'Name' ), $theme_class );

			// we dont automatically support this theme so show them otherwise
			} else {

				$notices[] = '<li>
								<h3>Tell Lasso Where to Work</h3>
								<p>You can use a tool like inspector in Chrome or Firefox to find this CSS class, or <a href="mailto:help@lasso.is">email us</a> with a link to a public URL with the theme and we\'ll find it for you.</p>
								</li>';
			}

		endif;

		// aesop story engine isnt active
		if ( !class_exists('Aesop_Core') ) {
			$notices[] = '<li><h3>Aesop Story Engine not Activated!</h3>
							<p>Just a heads up that Aesop Story Engine isn\'t activated. It\'s not required to use Lasso, but you won\'t get the cool drag and drop components without it activated. It\'s free!</p>
							</li>';
		}

		// we dont really get along with wp side comments because of the section ids that get applied dynamically. since we save our html, it'll get saved along with the post as HTML
		if ( class_exists('WP_Side_Comments') ) {
			$notices[] = '<li><h3>WP Side Comments Compatibility Warning!</h3>
							<p>Since Lasso saves the HTML of a post, this may cause undesired issues. We\'re working to resolve incompatibilities faster than a jack rabbit in a hot greasy griddle in the middle of August.</p>
							</li>';
		}

		return apply_filters('lasso_preflight_notices', $notices );

	}
}
new lassoWelcome;




