<?php
/**
 * Class responsible for creating the welcome walkthrough on the editor
 *
 * @since 0.6
 */

namespace lasso_public_facing;

class tour {

	public function __construct() {

		add_action( 'wp_footer',       array( $this, 'draw_tour' ) );

	}

	/**
	*	Draw the modal used to house the walk through
	*	@since 0.6
	*/
	public function draw_tour() {

		$tour_hidden = get_user_meta( get_current_user_ID(), 'lasso_hide_tour', true );

		if ( lasso_user_can() && !$tour_hidden ) {

			global $post;

			$nonce = wp_create_nonce( 'lasso-editor-tour' );

			// let users add custom css classes
			$custom_classes = apply_filters( 'lasso_modal_tour_classes', '' );

			?>
			<div id="lasso--tour__modal" class="lasso--modal lasso--tour__modal lasso--modal__checkbox <?php echo sanitize_html_class( $custom_classes );?>">
				<script>
					jQuery(window).ready(function($){

						$('body').addClass('lasso-modal-open');

		    			$('.lasso--loading').remove();
						$('#lasso--tour__slides').hide().fadeIn()

						$('#lasso--tour__slides').unslider({
							dots: true,
							delay:7000
						});

					});
				</script>
				<div class="lasso--modal__inner">

					<?php echo self::tour_slides();?>

					<div class="lasso--postsettings__footer">

						<div class="lasso--postsettings__option">
							<label for="hide_tour" class="checkbox-control checkbox">
					        	<input type="checkbox" id="hide_tour" name="hide_tour" <?php checked( $tour_hidden, 1 ); ?>>
					        	<span class="control-indicator"></span>
								<?php _e('Don\'t show this again','lasso');?>
					        </label>
						</div>

						<input type="submit" value="<?php _e( 'Okay, got it!', 'lasso' );?>" data-nonce="<?php echo $nonce;?>" >
					</div>

				</div>

			</div>
			<div id="lasso--modal__overlay"></div>
			<?php

		}
	}

	/**
	*	Draw the inner slides for the welcome walkthrough
	*	@since 0.6
	*/
	public function tour_slides() { ?>

		<div id="lasso--loading" class="lasso--loading"><div class="lasso--loader"></div></div>
		<div id="lasso--tour__slides">

			<?php

			$out = '<ul><li>';
			$out .= sprintf( '<img src="%s">', LASSO_URL.'/public/assets/img/enter-editor.gif' );
			$out .= '<p>'.__('Access posts by clicking the list icon. Create a new post by clicking the new post icon.','lasso').'</p>';
			$out .= '</li><li>';
			$out .= sprintf( '<img src="%s">', LASSO_URL.'/public/assets/img/enter-editor.gif' );
			$out .= '<p>'.__('While on a single post, edit by clicking the Pen icon. Access post settings with the settings icon. Press escape to exit any modal.','lasso').'</p>';
			$out .= '</li><li>';
			$out .= sprintf( '<img src="%s">', LASSO_URL.'/public/assets/img/editor-highlight.gif' );
			$out .= '<p>'.__('Highlight a piece of text, and click on a formatting option to style it. Click the Disk icon or CMD-S to save. Click the orange "X" button to exit the editor.','lasso').'</p>';
			$out .= '</li><li>';
			$out .= sprintf( '<img src="%s">', LASSO_URL.'/public/assets/img/editor-component.gif' );
			$out .= '<p>'.__('Story components can be added by clicking the plus icon, and dragging any component from the component tray into the story.','lasso').'</p>';
			$out .= '</li></ul>';

			echo apply_filters( 'lasso_tour_slides', $out );

		?></div><?php

	}

}