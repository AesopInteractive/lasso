<?php

// @todo clean up this file!!

// add some handles to the components
add_action('aesop_quote_inside_top', 'aesop_add_drag_handle');
add_action('aesop_image_inside_top', 'aesop_add_drag_handle');
function aesop_add_drag_handle(){

	echo  aesop_editor_handle();

}

function aesop_editor_components(){

	$array = array(
		'quote' => array(
			'name' 	  => 'Quote',
			'content' => aesop_quote_component(),
		),
		'image' => array(
			'name' 	  => 'Image',
			'content' => aesop_image_component(),
		)
	);

	return $array;
}

function aesop_quote_component(){

	ob_start();

	echo do_shortcode('[aesop_quote width="100%" align="center" quote="Too legit to quit"]');

	return ob_get_clean();
}

function aesop_image_component(){

	ob_start();

	echo do_shortcode('[aesop_image img="http://placekitten.com/1200/800" align="center" width="content"]');

	return ob_get_clean();
}