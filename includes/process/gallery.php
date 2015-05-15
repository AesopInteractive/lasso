<?php
/**
 * Process various gallery fucntions like fetching and saving images
 *
 * @since 1.0
 */
namespace lasso\process;

use lasso\internal_api\api_action;
use lasso\save_gallery;

class gallery implements api_action {

	/**
	 * The nonce action for this request.
	 *
	 * @since 0.9.2
	 *
	 * @var string
	 */
	public $nonce_action = 'lasso_gallery';

	/**
	 * Swaps a gallery during live editing
	 *
	 * @since 0.9.2
	 *
	 * @param array $data Sanitized data to use for saving.
	 *
	 * @return array Key "markup" has the HTML.
	 */
	public function swap( $data ) {


		$id = $data[ 'gallery_id' ];
		if ( is_null( $id ) ) {
			$id = false;
		}

		$markup = sprintf( '<div contenteditable="false" class="lasso--empty-component aesop-component aesop-gallery-component" data-component-type="gallery" data-id="%s">%s</div>', $id, __( 'Save and refresh to view gallery.','lasso' ) );

		return array(
			'gallery' => $markup
		);

	}

	/**
	 * Creates a gallery
	 *
	 * @since 0.9.2
	 *
	 * @param array $data Sanitized data to use for saving.
	 *
	 * @return array|bool On success an array containing "message" or on failure false.
	 */
	public function create( $data ) {

		//@todo adapt auth callbacks to work with args.
		if (  ! lasso_user_can( 'publish_posts' ) ) {
			return false;

		}

		$gallery_ids = isset( $data['gallery_ids'] ) ? $data['gallery_ids'] : false;

		// bail if no gallery ids
		if ( empty( $gallery_ids ) ) {
			return false;
		}

		$postid   		 = isset( $data['postid'] ) ? (int) $data['postid'] : false;
		$type   		 = isset( $data['gallery_type'] ) ? $data['gallery_type'] : false;

		// insert a new gallery
		$args = array(
			'post_title'    => $postid.'-'.rand(),
			'post_status'   => 'publish',
			'post_type'     => 'ai_galleries'
		);

		$postid = wp_insert_post( apply_filters( 'lasso_insert_gallery_args', $args ) );

		// update gallery ids
		if ( $gallery_ids ) {

			update_post_meta( $postid, '_ase_gallery_images', $gallery_ids );

		}

		// update the gallery type
		if ( !empty( $type ) ) {

			update_post_meta( $postid, 'aesop_gallery_type', $type );

		}

		do_action( 'lasso_gallery_published', $postid, $gallery_ids, get_current_user_ID() );

		return array(
			'message' => 'gallery-created'
		);

	}

	/**
	 * Update an existing gallery
	 *
	 * @since 0.9.2
	 *
	 * @param array $data Sanitized data to use for saving.
	 *
	 * @return array "message" key has the message.
	 */
	public function update( $data ) {

		$options      = isset( $data['fields'] ) ? $data['fields'] : false;
		$postid   	  = !empty( $options ) ? (int) $options['id'] : false;
		$gallery_ids  = isset( $data['gallery_ids'] ) ? $data['gallery_ids'] : false;
		if ( ! empty( $data ) && $data[ 'gallery_type' ] ) {
			$type = $data[ 'gallery_type' ];
		}elseif ( ! empty( $options ) && $options[ 'galleryType' ] ) {
			$type = $options[ 'galleryType' ];
		}else{
			$type = false;
		}

		save_gallery::save_gallery_options( $postid, $gallery_ids, $options, $type );

		return array(
			'message' => 'gallery-updated'
		);

	}

	/**
	 * When the user clicks the settings icon in the gallery component it
	 * opens the panel, gets the gallery unique, then makes a call to get the gallery images
	 *
	 * @since 0.12
	 *
	 * @param array $data Sanitized data to use for saving.
	 *
	 * @return bool
	 */
	public function get_images( $data ) {

		//check caps
		if ( !current_user_can( 'edit_posts' ) ) {
			return false;
		}

		// bail if no id specified like on new galleries
		if ( is_null( $data['post_id'] ) || empty( $data['post_id'] ) ) {
			return false;
		}

		$postid  = isset( $data['post_id'] ) ? $data['post_id'] : false;

		// fetch image ids from cache
		$image_ids  = get_post_meta( $postid, '_ase_gallery_images', true );

		// send ids to return images
		return self::get_the_images( $image_ids );

	}

	/**
	 *  Return images for a specific gallery when the user goes to edit a gallery
	 *
	 * @param $image_ids array array of image ids
	 * @since 0.1
	 */
	private function get_the_images( $image_ids = '' ) {

		if ( empty( $image_ids ) )
			return;

		$image_ids  = array_map( 'intval', explode( ',', $image_ids ) );

		$out[] = '<ul id="ase-gallery-images">';

		if ( !empty( $image_ids ) ):

			foreach ( $image_ids as $image_id ) {

				$image    =  wp_get_attachment_image_src( $image_id, 'thumbnail', false );

				$out[] = sprintf( '
		        <li id="%1s" class="ase-gallery-image">
		        	<i class="dashicons dashicons-no-alt" title="%2s"></i>
		        	<i class="dashicons dashicons-edit" title="%3s"></i>
		           	<img src="%4s">
		        </li>
		       ',
					absint( $image_id ),
					__( 'Delete From Gallery', 'lasso' ),
					__( 'Edit Image Caption', 'lasso' ),
					esc_url( $image[0] )
				);

			}

		endif;

		$out[] = '</ul>';

		return array( 'html' => implode( '', $out ) );

	}


	/**
	 * The keys required for the actions of this class.
	 *
	 * @since     0.9.2
	 *
	 * @return array Array of keys to pull from $data per action and their sanitization callback
	 */
	public static function params(){
		$params[ 'process_gallery_swap' ] = array(
			'gallery_id' => 'absint',

		);

		$params[ 'process_gallery_create' ] = array(
			'postid'   => 'absint',
			'content'   => 'wp_kses_post',
			'galleryType'      => array(
				'sanitize_text_field',
				'trim'
			),
			'gallery_ids'   => 'lasso_sanitize_data',

		);

		$params[ 'process_gallery_update' ] = array(
			'postid'        => 'absint',
			'gallery_ids'   => 'lasso_sanitize_data',
			'fields'        => 'lasso_sanitize_data',
			'gallery_type'      => array(
				'sanitize_text_field',
				'trim'
			)
		);

		$params[ 'process_gallery_get_images' ] = array(
			'post_id'       => 'absint'
		);

		return $params;

	}

	/**
	 * Additional auth callbacks to check.
	 *
	 * @since     0.9.2
	 *
	 * @return array Array of additional functions to use to authorize action.
	 */
	public static function auth_callbacks() {
		$params[ 'process_gallery_swap' ] = array(
			'lasso_user_can'
		);

		$params[ 'process_gallery_create' ] = array(
			'is_user_logged_in'
		);

		$params[ 'process_gallery_update' ] = array(
			'lasso_user_can'
		);

		$params[ 'process_gallery_get_images' ] = array();

		return $params;

	}


}

