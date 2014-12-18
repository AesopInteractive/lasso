<?php

/*
*
*	Class responsible for building the template redirect
*
*/
class aesopEditorTemplateLoader {

	function __construct() {

		add_filter( 'template_include', array($this,'template_loader'));

	}

	/**
	*
	* @since version 1.0
	* @param $template - return based on view
	* @return page template based on view regardless if the post type doesnt even exist yet due to no posts
	*/
	function template_loader( $template ) {

	   	if ( is_page('aesop-editor') ):

			$template = AESOP_EDITOR_DIR.'templates/template-aesop-editor.php';

	    endif;

	    return $template;

	}
}
new aesopEditorTemplateLoader;