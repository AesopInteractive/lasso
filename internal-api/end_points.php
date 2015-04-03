<?php
/**
 * Add hooks for internal API.
 *
 * @package   lasso
 * @author    Josh Pollock <Josh@JoshPress.net>
 * @license   GPL-2.0+
 */

namespace lasso\internal_api;


class end_points {

	/**
	 * Constructor for this class.
	 *
	 * Adds our API endpoint and hooks it in at template_redirect
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'add_endpoints' ) );
		add_action( 'template_redirect', array( route::init(), 'do_api' ) );
	}

	/**
	 * Add endpoints for the API
	 *
	 * @uses "init" action
	 */
	public function add_endpoints() {
		//add "action" as a rewrite tag
		add_rewrite_tag( '%action%', '^[a-z0-9_\-]+$' );

		//add the endpoint
		add_rewrite_rule( 'lasso-internal-api/^[a-z0-9_\-]+$/?', 'index.php?action=$matches[1]', 'top' );

	}
}
