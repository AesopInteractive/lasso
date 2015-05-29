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

	$out = sprintf('<form id="lasso--post-form-%s" class="lasso--post-form">', $name );

		$out .= lasso_option_fields( $options );

		$out .='<div class="form--bottom">';
			$out .='<input type="submit" value="Save">';
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
function lasso_option_fields( $options = array() ){

	$out = '';
	foreach ( (array) $options as $option ) {

		$type = isset( $option['type'] ) ? $option['type'] : 'text';

		switch ( $type ) {
			case 'text':
				$out .= lasso_option_engine_option__text( $option );
				break;
			case 'textarea':
				$out .= lasso_option_engine_option__textarea( $option );
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
function lasso_option_engine_option__text( $option = '' ) {

	if ( empty( $option ) )
		return;

	$id = isset( $option['id'] ) ? $option['id'] : false;
	$id = $id ? lasso_clean_string( $id ) : false;

	$out = sprintf('<input id="lasso--post-option-%s" name="%s" type="text">', $id, $id );

	return $out;
}

/**
*	Return an input style option
*
*	@param $option mixed object
*	@since 5.0
*/
function lasso_option_engine_option__textarea( $option = '' ) {

	if ( empty( $option ) )
		return;

	$id = isset( $option['id'] ) ? $option['id'] : false;
	$id = $id ? lasso_clean_string( $id ) : false;

	$out = sprintf('<textarea id="lasso--post-option-%s" name="%s"></textarea>', $id, $id );

	return $out;
}