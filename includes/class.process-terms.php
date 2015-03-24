<?php

/**
 * This class is responsible for updating the post terms, and hooks into the update save
 * process with an action, which is toggle from the post settings modal
 *	@subpackage clas.process-object-update.php
 * 	@since 0.9.1
 */
class lassoProcessTerms {

	public function __construct() {

		add_action( 'lasso_post_updated',     array( $this, 'process_add_terms' ), 10, 3 );

	}

	/**
	 * Process the post update
	 *
	 * @since 1.0
	 */
	public function process_add_terms( $postid ) {

		var_dump($_POST);

	}
}
new lassoProcessTerms;
