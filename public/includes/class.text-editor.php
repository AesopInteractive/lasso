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

	function editor_controls( ) {

		?><nav id="aesop-editor--controls">
			<a href="#" id="aesop-editor--edit" class="aesop-editor--button__primary"></a>
			<a href="#" data-post-id="<?php echo get_the_ID();?>" id="aesop-editor--save" class="aesop-editor--button aesop-editor--button__success"></a>
		</nav>
		<div id="aesop-editor--confirm"></div>
		<?php

	}

}
new aesopEditorTextEditor;