<?php
/**
*
*	Creates a welcome screen with pre-flight check sequence
*
*	@since 0.8.2
*/
class lassoWelcome {

	function __construct(){

		add_action('admin_init', 		array($this,'redirect' ));
		add_action('admin_menu', 		array($this,'lasso_welcome'));

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

	  	wp_safe_redirect( add_query_arg( array( 'page' => 'lasso-editor' ), admin_url( 'admin.php' ) ) );

	}

	/**
	*
	*	Add dashboard pages for welcome and welcome back
	*
	*	@since 0.8
	*/
	function lasso_welcome() {

		if ( function_exists('is_multisite') && !is_multisite() ) {

			add_menu_page( __('Lasso','lasso'), __('Lasso','lasso'), 'manage_options', 'lasso-editor','','dashicons-heart');
			add_submenu_page( 'lasso-editor', __('Welcome','lasso'), __('Status','lasso'), 'manage_options', 'lasso-editor', array($this, 'welcome'));
		}

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
						<li class="success">
							<h3><?php _e('You\'re Ready to Rock!','lasso');?></h3>
			  				<p><?php _e('Lasso will place a small menu on the bottom of every post and page. Click the "pen" icon to go into edit mode. Press escape to get out of edit mode.','lasso');?></p>
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
		    		<li><a href="<?php echo admin_url('options-general.php?page=lasso-editor-settings');?>"><i class="dashicons dashicons-admin-generic"></i> <?php _e('Settings', 'lasso');?></a></li>
		    		<li><a href="dl.dropboxusercontent.com/u/5594632/storyam-media/lasso-docs/index.html" target="_blank"><i class="dashicons dashicons-editor-help"></i> <?php _e('Docs', 'lasso');?></a></li>
		    		<li><a href="https://lasso.is" target="_blank"><i class="dashicons dashicons-sos"></i> <?php _e('Help', 'lasso');?></a></li>
		    		<li><a href="https://lasso.is" target="_blank"><i class="dashicons dashicons-admin-site"></i> <?php _e('Website', 'lasso');?></a></li>
		    		<li><a href="http://twitter.com/aesopinteractiv" target="_blank"><i class="dashicons dashicons-twitter"></i> <?php _e('Twitter','lasso');?></a></li>
		    		<li><a href="http://facebook.com/aesopinteractive" target="_blank"><i class="dashicons dashicons-facebook"></i> <?php _e('Facebook','lasso');?></a></li>
		    	</ul>

		    </div>

	 	<?php
	}

	/**
	*
	*	Run a series of checks to inform the user about incompatibilities, missing option fields, missing license keys for updates and suggested addons
	*
	*	@since 0.8.6
	*/
	function lasso_preflight_check(){

		$notices = array();

		$article_object = lasso_editor_get_option('article_class','lasso_editor');

		$theme 			= wp_get_theme();
		$theme_domain 	= $theme->get('TextDomain');
		$theme_class 	= $theme_domain ? lasso_supported_themes( $theme_domain ) : false;

		$license 		= get_option( 'lasso_license_key' );
		$status 		= get_option( 'lasso_license_status' );

		// if1 the required CSS class has not been saved
		if ( empty( $article_object ) ) :

			// if we have a theme that we automatically support
			if ( false !== $theme_class ) {

				$notices[] = sprintf('<li class="error">
										<h3>'.__('Article CSS Class Needed!','lasso').'</h3>
										<p>'.__('Before using Lasso,','lasso').' <a href="%s">'.__('enter and save','lasso').'</a> '.__('the CSS class of the container that holds your post and page content. We\'ve automatically detected that you\'re running ','lasso').' %s. '.__('Here\'s the CSS class that you\'ll need:','lasso').'</p>
										<code style="display:inline-block;margin-top:15px;">%s</code>
									</li>',admin_url('admin.php?page=lasso-editor-settings'), $theme->get( 'Name' ), $theme_class );

			// we dont automatically support this theme so show them otherwise
			} else {

				$notices[] = '<li class="error">
								<h3>'.__('Article CSS Class Needed!.','lasso').'</h3>
								<p>'.__('You can use a tool like inspector in Chrome or Firefox to find this CSS class, or ','lasso').' <a href="mailto:help@lasso.is">'.__('email us.','lasso').'</a> '.__('with a link to a public URL with the theme and we\'ll find it for you.','lasso').'</p>
								</li>';
			}

		endif;

		// aesop story engine isnt active
		if ( !class_exists('Aesop_Core') ) {
			$notices[] = '<li class="info"><h3>Aesop Story Engine not Activated!</h3>
							<p>'.__('Just a heads up that ','lasso').'<a href="https://wordpress.org/plugins/aesop-story-engine/" target="_blank
							">'.__('Aesop Story Engine','lasso').'</a> '.__('isn\'t activated. It\'s not required to use Lasso, but you won\'t get the cool drag and drop components without it activated. It\'s free!','lasso').'</p>
							</li>';
		}

		// we dont really get along with wp side comments because of the section ids that get applied dynamically. since we save our html, it'll get saved along with the post as HTML
		if ( class_exists('WP_Side_Comments') ) {
			$notices[] = '<li class="error"><h3>'.__('WP Side Comments Compatibility Warning!','lasso').'</h3>
							<p>'.__('Since Lasso saves the HTML of a post, this may cause undesired issues. We\'re working to resolve incompatibilities faster than a jack rabbit in a hot greasy griddle in the middle of August.','lasso').'</p>
							</li>';
		}

		// if the license key isnt activated
		if( empty( $license ) ) {
			$notices[] = '<li class="info"><h3>'.__('License Key Not Activated','lasso').'</h3>
							<p>'.__('Just a heads up, your license key isnt activated. Enter your license key into the License tab on the left in order to receive plugin update notifications.','lasso').'</p>
							</li>';
		}
		if( !empty( $license ) && 'invalid' == $status ) {
			$notices[] = '<li class="error"><h3>'.__('License Key Invalid','lasso').'</h3>
							<p>'.__('The license key that you entered is ','lasso').'<strong>'.__('invalid','lasso').'</strong>'.__('. It may have been entered incorreclty, or may have expired.','lasso').'</p>
							</li>';
		}

		// if their license key is invalid


		return apply_filters('lasso_preflight_notices', $notices );

	}
}
new lassoWelcome;




