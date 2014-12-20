<?php

/*
*
*	Class responsible for building the editor tools
*
*/
class aesopEditorTextEditor {

	function __construct() {

		add_action( 'wp_footer', array($this,'editor_controls'));

	}

	function editor_controls() {
 
		$status = get_post_status( get_the_ID() );

		?><nav id="aesop-editor--controls" class="aesop-post-status--<?php echo sanitize_html_class( $status );?>">
			<a href="#" id="aesop-editor--edit" class="aesop-editor--button__primary"></a>
			<a href="#" data-post-id="<?php echo get_the_ID();?>" id="aesop-editor--save" class="aesop-editor--button"></a>
		</nav>
		<?php

	}

}
new aesopEditorTextEditor;