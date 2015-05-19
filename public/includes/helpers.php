<?php

/**
 * Grab an optoin from our settings
 *
 * If we're on multsite we'll grab the site option which is stored in the main blogs site option tables, otherwise
 * we'll grab the option which is stored on the single blogs option tables
 *
 * @param unknown $option  string name of the option
 * @param unknown $section string name of the section
 * @param unknown $default string/int default option value
 * @return the option value
 * @since 1.0
 */
function lasso_editor_get_option( $option, $section, $default = '' ) {

	if ( empty( $option ) )
		return;

	if ( function_exists( 'is_multisite' ) && is_multisite() ) {

		$options = get_site_option( $section );

	} else {

		$options = get_option( $section );
	}

	if ( isset( $options[$option] ) ) {
		return $options[$option];
	}

	return $default;
}

/**
 * Check to see if any Lasso galleries exist
 *
 * @since 1.0
 */
function lasso_editor_galleries_exist() {

	$q = new wp_query( array( 'post_type' => 'ai_galleries', 'post_status' => 'publish' ) );

	if ( $q->have_posts() )
		return true;
	else
		return false;
}

/**
 * Get a list of themes automatically supported by Lasso and return their contents CSS class
 *
 * @param unknown $textdomain string the textdomain of the WordPress theme. We're using the textdomain because it's automatically slugified by the author and its easy.
 * @since 0.8.6
 * @return a css class if the theme is supported, false if nothing
 */
function lasso_supported_themes( $textdomain = '' ) {

	if ( empty( $textdomain ) )
		return;

	switch ( $textdomain ) {

		case 'twentytwelve': // automattic
			$out = '.entry-content';
			break;
		case 'twentythirteen': // automattic
			$out = '.entry-content';
			break;
		case 'twentyfourteen': // automattic
			$out = '.entry-content';
			break;
		case 'twentyfifteen': // automattic
			$out = '.entry-content';
			break;
		case 'aesop-story-theme': // aesop
			$out = '.aesop-entry-content';
			break;
		case 'jorgen': // aesop
			$out = '.aesop-entry-content';
			break;
		case 'novella': // aesop
			$out = '.novella-entry-content';
			break;
		case 'genji': // aesop
			$out = '.genji-entry-content';
			break;
		case 'kerouac': // aesop
			$out = '.kerouac-entry-content';
			break;
		case 'worldview': // upthemes
			$out = '.entry-content';
			break;
		case 'genesis': // genesis
			$out = '.entry-content';
			break;
		case 'camera': // array.is
			$out = '.entry-content';
			break;
		default:
			$out = '.entry-content';

	}

	return !empty( $out ) ? $out : false;
}

/**
*	Return a string of classes with items that Lasso will remove when entering the editor
*	so that we don't save them as HTML
*
*	@since 0.8.7
*	@return string of comma separated classes
*/
function lasso_supported_no_save(){

	return apply_filters('lasso_dont_save', '.lasso--ignore, .sharedaddy, .us_wrapper, .twitter-tweet');
}

/**
 * Generic sanitization, useful for sanitization of arrays.
 *
 * @since 0.9.2
 *
 * @param array|object|string $data Data to sanatize.
 *
 * @return array|mixed|object|string|void
 */
function lasso_sanitize_data( $data ) {
	return \lasso\sanatize::do_sanitize( $data );

}

////////////////////
// PLUGGABLE
////////////////////

/**
 * Check if the user is logged in and has the correctly passed capability
 *
 * @param unknown $action string a capability such as edit_posts or publish_posts
 * @param unknown $postid int the id of the post object to check against
 * @since 1.0
 */
if ( !function_exists( 'lasso_user_can' ) ):
	function lasso_user_can( $action = '', $postid = 0 ) {

		if ( empty( $action ) )
			$action = 'edit_post';

		if ( empty( $postid ) )
			$postid = get_the_ID();

		if ( is_user_logged_in() && current_user_can( $action, $postid ) ) {

			return true;

		} else {

			return false;

		}

	}
endif;

