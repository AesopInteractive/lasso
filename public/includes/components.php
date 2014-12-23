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
	<div contenteditable="false">
		<i class="dashicons dashicons-menu aesop-drag"></i>
		<?php echo do_shortcode('[aesop_quote width="100%" align="center" quote="Too legit to quit"]');?>
	</div>

	<?php

	return ob_get_clean();
}

function aesop_image_component(){

	ob_start();

	?>

	<div contenteditable="false">
		<i class="dashicons dashicons-menu aesop-drag"></i>
		<?php echo do_shortcode('[aesop_image img="http://placekitten.com/1200/800" align="center" width="content"]');?>
	</div>
	<?php

	return ob_get_clean();
}