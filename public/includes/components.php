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
		'collection' => array(
			'name' 	  => 'Collection',
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
		'chapter' => array(
			'name' 	  => 'Chapter',
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

	echo do_shortcode('[aesop_image img="'.AESOP_EDITOR_URL.'/public/assets/img/empty-img.png" align="center" imgwidth="content" caption="A lonely image is no image to be" ]');

	return ob_get_clean();
}

function aesop_parallax_component(){

	ob_start();

	echo do_shortcode('[aesop_parallax img="'.AESOP_EDITOR_URL.'/public/assets/img/empty-img.png" caption="Love is all we need"]');

	return ob_get_clean();
}

function aesop_audio_component(){

	ob_start();

	echo do_shortcode('[aesop_audio src="http://users.skynet.be/fa046054/home/P22/track06.mp3"]');

	return ob_get_clean();
}

function aesop_content_component(){

	ob_start();

	echo do_shortcode('[aesop_content]Start typing here...[/aesop_content]');

	return ob_get_clean();
}

function aesop_character_component(){

	ob_start();

	echo do_shortcode('[aesop_character img="'.AESOP_EDITOR_URL.'/public/assets/img/empty-img.png" name="Joes Apartment" caption="Joe likes cockroaches." width="150px"]');

	return ob_get_clean();
}

function aesop_collections_component(){

	ob_start();

	echo do_shortcode('[aesop_collection]');

	return ob_get_clean();
}

function aesop_document_component(){

	ob_start();

	echo do_shortcode('[aesop_document src="'.AESOP_EDITOR_URL.'/public/assets/img/empty-img.png" ]');

	return ob_get_clean();
}

function aesop_gallery_component(){

	ob_start();

	echo do_shortcode('[aesop_gallery]');

	return ob_get_clean();
}

function aesop_heading_component(){

	ob_start();

	echo do_shortcode('[aesop_chapter title="Chapter One" subtitle="It started this morning..." img="'.AESOP_EDITOR_URL.'/public/assets/img/empty-img.png" full="on"]');

	return ob_get_clean();
}

function aesop_map_component(){

	ob_start();

	echo do_shortcode('[aesop_map sticky="off"]');

	return ob_get_clean();
}

function aesop_timeline_component(){

	ob_start();

	echo do_shortcode('[aesop_timeline]');

	return ob_get_clean();
}

function aesop_video_component(){

	ob_start();

	echo do_shortcode('[aesop_video id="59940289" width="100%" align="center"]');

	return ob_get_clean();
}






