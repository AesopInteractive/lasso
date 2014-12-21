<?php

/**
*
*	Draw teh component modal
*
*
*/
function aesop_editor_component_modal(){

	$out = '<div id="aesop-editor--modal">';
		$out .= '<div class="aesop-editor--modal__inner">';
			$out .= '<p>Component Settings</p>';
		$out .= '</div>';
	$out .= '</div>';
	$out .= '<div id="aesop-editor--modal__overlay"></div>';

	return $out;
}