<?php
/**
*
*
*	The functions in this file register the components that will be shown in the component drop-up menu
*	and are filterable and pluggable
*
*/

/**
*
*	Build an array of components that will be shown in the
*	component drop-up menu on click
*
*	@return array of components
*	@since 1.0
*/
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

	return apply_filters('aesop_editor_components', $array );
}

/**
*
*	Here each of the components content is being registered and retrieved above
*
*	Notes: 	- these functions are pluggable
*	 	 	- custom modules must have data-component-type="whatever"
*			- custom modules must have all options as data-attributes if utilizing settings panel
*
*	1.  Quote
*	2.  Image
*	3.	Parallax
*	4.	Audio
*	5.	Content
*	6.	Character
*	7.	Collections
*	8.	Document
*	9.	Gallery
*	10. Heading
*	11. Map
*	12. Timeline
*	13. Video
*/

// 1
if ( !function_exists('aesop_quote_component') ):
	function aesop_quote_component(){

		ob_start();

		echo do_shortcode('[aesop_quote quote="The Universe is made of stories, not of atoms." cite="Muriel Rukeyser"]');

		return ob_get_clean();
	}
endif;

// 2
if ( !function_exists('aesop_image_component') ):
	function aesop_image_component(){

		ob_start();

		echo do_shortcode('[aesop_image img="'.AESOP_EDITOR_URL.'/public/assets/img/empty-img.png" align="center" imgwidth="800px" caption="A lonely image is no image to be" ]');

		return ob_get_clean();
	}
endif;

// 3
if ( !function_exists('aesop_parallax_component') ):
	function aesop_parallax_component(){

		ob_start();

		echo do_shortcode('[aesop_parallax img="'.AESOP_EDITOR_URL.'/public/assets/img/empty-img.png" caption="Love is all we need"]');

		return ob_get_clean();
	}
endif;

// 4
if ( !function_exists('aesop_audio_component') ):
	function aesop_audio_component(){

		ob_start();

		echo do_shortcode('[aesop_audio src="http://users.skynet.be/fa046054/home/P22/track06.mp3"]');

		return ob_get_clean();
	}
endif;

// 5
if ( !function_exists('aesop_content_component') ):
	function aesop_content_component(){

		ob_start();

		echo do_shortcode('[aesop_content]Start typing here...[/aesop_content]');

		return ob_get_clean();
	}
endif;

// 6
if ( !function_exists('aesop_character_component') ):
	function aesop_character_component(){

		ob_start();

		echo do_shortcode('[aesop_character img="'.AESOP_EDITOR_URL.'/public/assets/img/empty-img.png" name="Joes Apartment" caption="Joe likes cockroaches." width="150px"]');

		return ob_get_clean();
	}
endif;

// 7
if ( !function_exists('aesop_collections_component') ):
	function aesop_collections_component(){

		ob_start();

		echo do_shortcode('[aesop_collection]');

		return ob_get_clean();
	}
endif;

// 8
if ( !function_exists('aesop_document_component') ):
	function aesop_document_component(){

		ob_start();

		echo do_shortcode('[aesop_document src="'.AESOP_EDITOR_URL.'/public/assets/img/empty-img.png" ]');

		return ob_get_clean();
	}
endif;

// 9
if ( !function_exists('aesop_gallery_component') ):
	function aesop_gallery_component(){

		ob_start();

		echo do_shortcode('[aesop_gallery]');

		return ob_get_clean();
	}
endif;

// 10
if ( !function_exists('aesop_heading_component') ):
	function aesop_heading_component(){

		ob_start();

		echo do_shortcode('[aesop_chapter title="Chapter One" subtitle="It started this morning..." img="'.AESOP_EDITOR_URL.'/public/assets/img/empty-img.png" full="on"]');

		return ob_get_clean();
	}
endif;

// 11
if ( !function_exists('aesop_map_component') ):
	function aesop_map_component(){

		ob_start();

		echo do_shortcode('[aesop_map sticky="off"]');

		return ob_get_clean();
	}
endif;

// 12
if ( !function_exists('aesop_timeline_component') ):
	function aesop_timeline_component(){

		ob_start();

		echo do_shortcode('[aesop_timeline_stop num="Title" title="2014"]');

		return ob_get_clean();
	}
endif;

// 13
if ( !function_exists('aesop_video_component') ):
	function aesop_video_component(){

		ob_start();

		echo do_shortcode('[aesop_video id="59940289" width="100%" align="center"]');

		return ob_get_clean();
	}
endif;
