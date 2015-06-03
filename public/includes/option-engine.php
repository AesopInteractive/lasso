<?php

/**
*	Build a post meta options form
*
*	@param $name string the name of this tab being logged
*	@param $options array an array of option fields in the format below
*
*					array(
*						'id'		=> 'title',
*						'name' 		=> 'Title',
*						'type'		=> 'text',
*						'default'	=> 'default',
*						'desc'		=> 'My description'
*					)
*
*	@since 0.9.5
*	@subpackage lasso_modal_addons_content
*/
function lasso_option_form( $name = '', $options = array() ){

	ob_start();

	if ( empty( $name ) || empty( $options ) || !is_array( $options ) )
		return;

	$nonce = wp_create_nonce('lasso-process-post-meta');
	$key   = sprintf('_lasso_%s_settings', $name );

	$out = sprintf('<form id="lasso--post-form-%s" class="lasso--post-form">', $name );

		$out .= lasso_option_fields( $name, $options );
		$out .='<div class="form--bottom">';
			$out .='<input type="submit" value="Save">';
			$out .='<input type="hidden" name="tab_name" value="'.$key.'">';
			$out .='<input type="hidden" name="post_id" value="'.get_the_ID().'">';
			$out .='<input type="hidden" name="nonce" value="'.$nonce.'">';
			$out .='<input type="hidden" name="action" value="process_meta_update">';
		$out .='</div>';

	$out .= '</form>';

	echo $out;

	return ob_get_clean();

}

/**
*	Build settings fields for lasso_option_form
*
*	@param $name string the name of this tab being logged
*	@param $options array an array of option fields in the format above
*	@since 0.9.5
*	@subpackage lasso_modal_addons_content
*/
function lasso_option_fields( $name = '', $options = array() ){

	$out 	= '';
	$before = '<div class="lasso--postsettings__option">';
	$after 	= '</div>';

	if ( empty( $name ) || empty( $options ) )
		return;

	foreach ( (array) $options as $option ) {

		$type = isset( $option['type'] ) ? $option['type'] : 'text';

		switch ( $type ) {
			case 'text':
				$out .= sprintf('%s%s%s', $before, lasso_option_engine_option( $name, $option,'text' ), $after );
				break;
			case 'textarea':
				$out .= sprintf('%s%s%s', $before, lasso_option_engine_option( $name, $option,'textarea' ), $after );
				break;
		}

	}

	return $out;
}


/**
*	Build settings inputs for settings fields
*
*	@param $name
*	@param $option mixed object
*	@param $type string text, textarea, checkbox, color
*	@since 5.0
*/
function lasso_option_engine_option( $name = '', $option = '', $type = '') {

	if ( empty( $type ) || empty( $option ) )
		return;

	$id = isset( $option['id'] ) ? $option['id'] : false;
	$id = $id ? lasso_clean_string( $id ) : false;

	$value = lasso_option_engine_get_option( get_the_ID(), $name, 'text' );

	switch ( $type ) {
		case 'text':
			$out = sprintf('<label>mylabel</label><input id="lasso--post-option-%s" name="text" type="text" value="%s">', $id, $value );
			break;
		case 'textarea':
			$out = sprintf('<label>mylabel</label><textarea id="lasso--post-option-%s" name="textarea">%s</textarea>', $id, $value );
	}

	return $out;
}


////////////////////////////
// HELPERs
////////////////////////////

/**
*	Get a specific field option from post meta
*
*	@param $post_id int id of the post
*	@param $name string the name of the tab registered
*	@param $type string the type of field to get (text, textarea)
*	@return string
*	@since 5.0
*/
function lasso_option_engine_get_option( $post_id = 0, $name = '' ) {

	if ( empty( $post_id ) )
		$post_id = get_the_ID();

	if ( empty( $name ) )
		return;

	$val = get_post_meta( $post_id, '_lasso_'.$name.'_settings', true );

	return !empty( $out ) ? $out : false;
}