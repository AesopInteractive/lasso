<?php
/**
*
*	Class responsible for adding a submenu page with Lasso addons
*
*/

class lassoMenuAddons {

	function __construct(){

		add_action('admin_menu',					array($this,'menu'));

	}

	/**
	*
	*	Add a submenu page only if not network activated
	*	@since 1.0
	*/
	function menu(){

		if ( function_exists('is_multisite') && !is_multisite() ) {

     		add_submenu_page( 'lasso-editor', __('Addons','lasso'), __('Addons','lasso'), 'manage_options', 'lasso-editor-addons', array($this, 'draw_page'));

		}
	}

	/**
	*
	*	Submenu page callback
	*	@since 1.0
	*/
	function draw_page(){
		?>
		<div class="wrap">

	    	<h2><?php _e('Lasso Addons','lasso');?></h2>

			<p><?php _e('Coming soon!!','lasso');?></p>

		</div>
		<?php
	}

}
new lassoMenuAddons;








