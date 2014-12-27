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

	/**
	*
	*	Draw the editor controls for entering and saving the editor
	*
	*/
	function editor_controls() {

		if ( is_singular() && is_user_logged_in() && current_user_can('edit_posts') ) {

			$status = get_post_status( get_the_ID() );

			?><nav id="aesop-editor--controls" class="aesop-post-status--<?php echo sanitize_html_class( $status );?>" data-post-id="<?php echo get_the_ID();?>" >
				<a href="#" id="aesop-editor--edit" title="Edit Post" class="aesop-editor--button__primary"></a>

				<div class="aesop-editor--controls__right">
					<a href="#" title="Save Post" id="aesop-editor--save" class="aesop-save-post aesop-editor--button"></a>

					<?php if ( 'draft' == $status ) { ?>
						<a href="#" title="Publish Post" id="aesop-editor--publish" class="aesop-publish-post aesop-editor--button"></a>
					<?php } ?>
				</div>

			</nav>

		<?php }

	}

}
new aesopEditorTextEditor;