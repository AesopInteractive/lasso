<?php

/**
*	Build a post meta options form
*
*	@param $name string the name of this tab being logge
*	@param $options array an array of option fields in the format below
*
*
*
*
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
*	Build post meta options fields for lasso_option_form
*
*	@since 0.9.5
*	@subpackage lasso_modal_addons_content
*/
function lasso_option_fields( $name = '', $options = array() ){

	$out = '';
	foreach ( (array) $options as $option ) {

		$type = isset( $option['type'] ) ? $option['type'] : 'text';

		switch ( $type ) {
			case 'text':
				$out .= lasso_option_engine_option__text( $name, $option );
				break;
			case 'textarea':
				$out .= lasso_option_engine_option__textarea( $name, $option );
				break;
		}

	}

	return $out;
}

/**
*	Return an input style option
*
*	@param $option mixed object
*	@since 5.0
*/
function lasso_option_engine_option__text( $name = '', $option = '' ) {

	if ( empty( $option ) )
		return;

	$id = isset( $option['id'] ) ? $option['id'] : false;
	$id = $id ? lasso_clean_string( $id ) : false;

	$value = lasso_option_engine_get_option( get_the_ID(), $name, 'text' );

	$out = sprintf('<input id="lasso--post-option-%s" name="text" type="text" value="%s">', $id, $value );

	return $out;
}

/**
*	Return an input style option
*
*	@param $option mixed object
*	@since 5.0
*/
function lasso_option_engine_option__textarea( $name = '', $option = '' ) {

	if ( empty( $option ) )
		return;

	$id = isset( $option['id'] ) ? $option['id'] : false;
	$id = $id ? lasso_clean_string( $id ) : false;

	$value = lasso_option_engine_get_option( get_the_ID(), $name, 'textarea' );

	$out = sprintf('<textarea id="lasso--post-option-%s" name="textarea">%s</textarea>', $id, $value );

	return $out;
}

function lasso_option_engine_get_option( $post_id = 0, $name = '', $type = 'text' ) {

	if ( empty( $post_id ) )
		$post_id = get_the_ID();

	if ( empty( $name ) )
		return;

	$val = get_post_meta( $post_id, '_lasso_'.$name.'_settings', true );

	switch ( $type ) {
		case 'text':
			$out = isset( $val['text'] ) ? $val['text'] : false;
			break;
		case 'textarea':
			$out = isset( $val['textarea'] ) ? $val['textarea'] : false;
			break;
	}

	return !empty( $out ) ? $out : false;
}