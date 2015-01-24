<?php
/**
 * Fired when the plugin is uninstalled.
 *
 * @package   Lasso
 * @author    Nick Haskins <nick@lassointeractive.com>
 * @license   GPL-2.0+
 * @link      http://lassointeractive.com
 * @copyright 2015 Lassointeractive LLC
 */

// If uninstall not called from WordPress, then exit
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

// @TODO: Define uninstall functionality here