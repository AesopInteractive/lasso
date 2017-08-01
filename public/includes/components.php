<?php
/**
 * The functions in this file register the components that will be shown in the component drop-up menu
 * and are filterable and pluggable
 *
 */

/**
 * Build an array of components that will be shown in the
 * component drop-up menu on click
 *
 * @return array of components
 * @since 1.0
 */
function lasso_editor_components() {

	$array = array(
		'quote' => array(
			'name'    => __('Quote','lasso'),
			'content' => lasso_quote_component(),
		),
		'image' => array(
			'name'    => __('Image','lasso'),
			'content' => lasso_image_component(),
		),
		'parallax' => array(
			'name'    => __('Parallax','lasso'),
			'content' => lasso_parallax_component(),
		),
		'audio' => array(
			'name'    => __('Audio','lasso'),
			'content' => lasso_audio_component(),
		),
		'content' => array(
			'name'    => __('Content','lasso'),
			'content' => lasso_content_component(),
		),
		'character' => array(
			'name'    => __('Character','lasso'),
			'content' => lasso_character_component(),
		),
		'collection' => array(
			'name'    => __('Collection','lasso'),
			'content' => lasso_collections_component(),
		),
		'document' => array(
			'name'    => __('Document','lasso'),
			'content' => lasso_document_component(),
		),
		'gallery' => array(
			'name'    => __('Gallery','lasso'),
			'content' => lasso_gallery_component(),
		),
		'chapter' => array(
			'name'    => __('Chapter','lasso'),
			'content' => lasso_heading_component(),
		),
		'map' => array(
			'name'    => __('Map','lasso'),
			'content' => lasso_map_component(),
		),
		'timeline_stop' => array(
			'name'    => __('Timeline','lasso'),
			'content' => lasso_timeline_component(),
		),
		'video' => array(
			'name'    => __('Video','lasso'),
			'content' => lasso_video_component(),
		),
		'wpimg' => array(
			'name'    => __('WordPress Image','lasso'),
			'content' => lasso_wp_image(),
		),
		'wpquote' => array(
			'name'    => __('WordPress Quote','lasso'),
			'content' => lasso_wp_quote(),
		),
		'gallery_pop' => array(
			'name'    => __('Gallery Pop','lasso'),
			'content' => lasso_gallery_pop_component(),
		),
		'events' => array(
			'name'    => __('Events','lasso'),
			'content' => lasso_event_component(),
		),
		'wpvideo' => array(
			'name'    => __('WordPress Image','lasso'),
			'content' => lasso_wp_video(),
		),
	);

	return apply_filters( 'lasso_components', $array );
}

/**
 * Here each of the components content is being registered and retrieved above
 *
 * Notes:  - these functions are pluggable
 *     - custom modules must have data-component-type="whatever"
 *   - custom modules must have all options as data-attributes if utilizing settings panel
 *
 * 1.  Quote
 * 2.  Image
 * 3. Parallax
 * 4. Audio
 * 5. Content
 * 6. Character
 * 7. Collections
 * 8. Document
 * 9. Gallery
 * 10. Heading
 * 11. Map
 * 12. Timeline
 * 13. Video
 */

// 1
if ( !function_exists( 'lasso_quote_component' ) ):
	function lasso_quote_component() {

		return do_shortcode( '[aesop_quote quote="The Universe is made of stories, not of atoms."]' );
	}
endif;

// 2
if ( !function_exists( 'lasso_image_component' ) ):
	function lasso_image_component() {

		return do_shortcode( '[aesop_image img="'.LASSO_URL.'/public/assets/img/empty-img.png" align="center" imgwidth="800px"]' );
	}
endif;

// 3
if ( !function_exists( 'lasso_parallax_component' ) ):
	function lasso_parallax_component() {

		return do_shortcode( '[aesop_parallax img="'.LASSO_URL.'/public/assets/img/empty-img.png"]' );
	}
endif;

// 4
if ( !function_exists( 'lasso_audio_component' ) ):
	function lasso_audio_component() {

		return do_shortcode( '[aesop_audio src="http://users.skynet.be/fa046054/home/P22/track06.mp3"]' );

	}
endif;

// 5
if ( !function_exists( 'lasso_content_component' ) ):
	function lasso_content_component() {

		return do_shortcode( '[aesop_content]Start typing here...[/aesop_content]' );
	}
endif;

// 6
if ( !function_exists( 'lasso_character_component' ) ):
	function lasso_character_component() {

		return do_shortcode( '[aesop_character img="'.LASSO_URL.'/public/assets/img/empty-img.png" name="Joes Apartment" width="150px"]' );

	}
endif;

// 7
if ( !function_exists( 'lasso_collections_component' ) ):
	function lasso_collections_component() {

		return do_shortcode( '[aesop_collection]' );
	}
endif;

// 8
if ( !function_exists( 'lasso_document_component' ) ):
	function lasso_document_component() {

		return do_shortcode( '[aesop_document src="'.LASSO_URL.'/public/assets/img/empty-img.png" ]' );

	}
endif;

// 9
if ( !function_exists( 'lasso_gallery_component' ) ):
	function lasso_gallery_component() {

		return do_shortcode( '[aesop_gallery]' );

	}
endif;

// 10
if ( !function_exists( 'lasso_heading_component' ) ):
	function lasso_heading_component() {

		return do_shortcode( '[aesop_chapter title="Chapter One" img="'.LASSO_URL.'/public/assets/img/empty-img.png" full="on"]' );
	}
endif;

// 11
if ( !function_exists( 'lasso_map_component' ) ):
	function lasso_map_component() {

		return '<form id="lasso--map-form" class="aesop-component aesop-map-component lasso--map-drag-holder" enctype="multipart/form-data">
				'.lasso_map_form_footer().'
				'.do_shortcode( '[aesop_map sticky="off"]' ).'
			</form>';

	}
endif;

// 12
if ( !function_exists( 'lasso_timeline_component' ) ):
	function lasso_timeline_component() {

		return do_shortcode( '[aesop_timeline_stop num="Title" title="2014"]' );

	}
endif;

// 13
if ( !function_exists( 'lasso_video_component' ) ):
	function lasso_video_component() {

		return do_shortcode( '[aesop_video src="vimeo" id="59940289" width="100%" align="center"]' );

	}
endif;

// 14 - since 0.9.1
if ( !function_exists('lasso_wp_image') ):

	function lasso_wp_image(){
		return '<div data-component-type="wpimg" class="lasso--wpimg__wrap lasso-component"><img class="wp-image-0" src="'.LASSO_URL.'/public/assets/img/empty-img.png"></div>';
	}

endif;

// 15 - since 0.9.2
if ( !function_exists('lasso_wp_quote') ):

	function lasso_wp_quote(){
		return '<blockquote data-component-type="wpquote" class="lasso--wpquote lasso-component"><p>The universe is made of stories.</p></blockquote>';
	}

endif;

// 16 gallery pop added but not fully supported as of 0.9.9.11 

if ( !function_exists( 'lasso_gallery_pop_component' ) ):
	function lasso_gallery_pop_component() {
		return do_shortcode( '[aesop_gallery_pop]' );
	}
endif;

// 17 - work in progress

if ( !function_exists( 'lasso_event_component' ) ):
	function lasso_event_component() {
		$id = editus_get_one_id('aesop_events');
		file_put_contents(WP_PLUGIN_DIR."/file1.txt", $id);
		if ($id ==-1) {
			return do_shortcode( '[aesop_events]' );
		} else {
			return do_shortcode( '[aesop_events id = "'.$id.'"]' );
		}
	}
endif;

// 18 - work in progress
if ( !function_exists('lasso_wp_video') ):

	function lasso_wp_video(){
		return '<div data-component-type="wpvideo" class="lasso--wpvideo__wrap lasso-component"><video class="wp-video-0"></video>';
	}

endif;

// helper function to retrieve one id for default option
function editus_get_one_id($type)
{
	$args = array( 'posts_per_page' => 1, 'post_type' => $type );
	$posts = get_posts( $args );
	if ( $posts ) {
		foreach ( $posts as $post ) {
			return $post->ID;
		}
	}
	return -1;
}


