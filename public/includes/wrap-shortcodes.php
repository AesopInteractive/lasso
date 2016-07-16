<?php
/**
 * Wraps shortcodes of other Plugins in prep for later replacement on save to preserve the shortcodes
 */

if ( lasso_user_can( 'edit_posts' ) && ! is_admin() ) {
	add_filter( 'the_content', 'lasso_wrap_shortcodes', 9 );
}

/**
 * Parses the_content and wraps uses preg_replace_callback to wrap shortcodes in HTML Comments.
 * Mostly copied from do_shortcode function.
 *
 * @since 0.9.9
 *
 * @param string $content
 *
 * @return string
 */
function lasso_wrap_shortcodes( $content ) {
	global $shortcode_tags;

	if ( false === strpos( $content, '[' ) ) {
		return $content;
	}

	if ( empty( $shortcode_tags ) || ! is_array( $shortcode_tags ) ) {
		return $content;
	}

	$tagnames  = array_keys( $shortcode_tags );
	$tagregexp = join( '|', array_map( 'preg_quote', $tagnames ) );
	$pattern   = "/\\[($tagregexp)/s";

	if ( 1 !== preg_match( $pattern, $content ) ) {
		// Avoids parsing HTML when there are no shortcodes or embeds anyway.
		return $content;
	}

	$content = do_shortcodes_in_html_tags( $content, true ,$tagnames);

	$pattern = get_shortcode_regex();
	$content = preg_replace_callback( "/$pattern/s", 'lasso_wrap_shortcode_tag', $content );

	// Always restore square braces so we don't break things like <!--[if IE ]>
	$content = unescape_invalid_shortcodes( $content );

	return $content;
}

/**
 * Callback for preg_replace_callback in lasso_wrap_shortcodes. Returns shortcode wrapped in HTML Comments.
 *
 * @since 0.9.9
 *
 * @param array $m
 *
 * @return string
 */
function lasso_wrap_shortcode_tag( $m ) {
	// allow [[foo]] syntax for escaping a tag
	if ( $m[1] == '[' && $m[6] == ']' ) {
		return substr( $m[0], 1, - 1 );
	}
	//array('aesop_quote','aesop_gallery','aesop_chapter','aesop_timeline_stop','aesop_video','aesop_collection','aesop_character','aesop_document','aesop_audio','aesop_content','aesop_map')

	if ( strpos( $m[2],'aesop_'  ) === 0 ) {
		// check against the exceptions
		if (strpos_arr($m[2],array('aesop_gallery_pop','aesop_character_carousel'))===false) {
		    return $m[0];
		}
	}

	return '<!--EDITUS_OTHER_SHORTCODE_START|[' . $m[0] . ']-->' . $m[0] . '<!--EDITUS_OTHER_SHORTCODE_END-->';
}

/* a helper function */
function strpos_arr($haystack, $needle) {
    if(!is_array($needle)) $needle = array($needle);
    foreach($needle as $what) {
        if(($pos = strpos($haystack, $what))!==false) return $pos;
    }
    return false;
}