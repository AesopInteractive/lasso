<?php

/*
*
*	Class responsible for building the editor tools
*
*/
class aesopEditorTextEditor {

	function __construct() {

		add_action( 'wp_footer', array($this,'editor_nav'));
		add_action('wp_head',array($this,'editor_confirm'));

	}

	function editor_nav( ) {

		?><nav id="aesop-editor--controls">
			<a href="#" id="aesop-editor--edit" class="aesop-editor--button__primary">edit</a>
			<a href="#" data-post-id="<?php echo get_the_ID();?>" id="aesop-editor--save" class="aesop-editor--button aesop-editor--button__success">save</a>
		</nav><?php

	}

	function editor_confirm(){
		?>
		<div id="aesop-editor--confirm"></div>
		<?php
	}
}
new aesopEditorTextEditor;