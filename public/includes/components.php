<?php


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

	?>
	<div class="aesop-component">
		<i class="dashicons dashicons-menu aesop-drag"></i>
		I'm a quote
	</div>

	<?php

	return ob_get_clean();
}

function aesop_image_component(){

	ob_start();

	?>

	<div class="aesop-component">
		<i class="dashicons dashicons-menu aesop-drag"></i>
		I'm a image
	</div>
	<?php

	return ob_get_clean();
}