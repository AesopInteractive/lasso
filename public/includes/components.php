<?php

// @todo clean up this file

function aesop_editor_components(){

	$array = array(
		'quote' => array(
			'name' 	  => 'Quote',
			'content' => aesop_quote_component(),
		),
		'image' => array(
			'name' 	  => 'Image',
			'content' => aesop_image_component(),
		),
		'parallax' => array(
			'name' 	  => 'Parallax',
			'content' => aesop_parallax_component(),
		),
		'audio' => array(
			'name' 	  => 'Audio',
			'content' => aesop_audio_component(),
		),
		'content' => array(
			'name' 	  => 'Content',
			'content' => aesop_content_component(),
		),
		'character' => array(
			'name' 	  => 'Character',
			'content' => aesop_character_component(),
		),
		'collections' => array(
			'name' 	  => 'Collections',
			'content' => aesop_collections_component(),
		),
		'document' => array(
			'name' 	  => 'Document',
			'content' => aesop_document_component(),
		),
		'gallery' => array(
			'name' 	  => 'Gallery',
			'content' => aesop_gallery_component(),
		),
		'heading' => array(
			'name' 	  => 'Heading',
			'content' => aesop_heading_component(),
		),
		'map' => array(
			'name' 	  => 'Map',
			'content' => aesop_map_component(),
		),
		'timeline' => array(
			'name' 	  => 'Timeline',
			'content' => aesop_timeline_component(),
		),
		'video' => array(
			'name' 	  => 'Video',
			'content' => aesop_video_component(),
		)
	);

	return $array;
}

function aesop_quote_component(){

	ob_start();

	echo do_shortcode('[aesop_quote quote="Stories are made of atoms." cite="This Author"]');

	return ob_get_clean();
}

function aesop_image_component(){

	ob_start();

	echo do_shortcode('[aesop_image img="http://placekitten.com/1200/800" align="center" width="content"]');

	return ob_get_clean();
}

function aesop_parallax_component(){

	ob_start();

	echo do_shortcode('[aesop_parallax img="http://placekitten.com/1200/800"]');

	return ob_get_clean();
}

function aesop_audio_component(){

	ob_start();

	echo '<p>Coming Soon</p>';

	return ob_get_clean();
}

function aesop_content_component(){

	ob_start();

	echo '<p>Coming Soon</p>';

	return ob_get_clean();
}

function aesop_character_component(){

	ob_start();

	echo '<p>Coming Soon</p>';

	return ob_get_clean();
}

function aesop_collections_component(){

	ob_start();

	echo '<p>Coming Soon</p>';

	return ob_get_clean();
}

function aesop_document_component(){

	ob_start();
	echo '<p>Coming Soon</p>';

	return ob_get_clean();
}

function aesop_gallery_component(){

	ob_start();

	echo '<p>Coming Soon</p>';

	return ob_get_clean();
}

function aesop_heading_component(){

	ob_start();

	echo '<p>Coming Soon</p>';

	return ob_get_clean();
}

function aesop_map_component(){

	ob_start();

	echo '<p>Coming Soon</p>';

	return ob_get_clean();
}

function aesop_timeline_component(){

	ob_start();

	echo '<p>Coming Soon</p>';

	return ob_get_clean();
}

function aesop_video_component(){

	ob_start();

	echo '<p>Coming Soon</p>';

	return ob_get_clean();
}






