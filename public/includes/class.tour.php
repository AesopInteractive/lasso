<?php

/**
*
*	Class responsible for creating the welcome walkthrough on the editor
*
*	@since 0.6
*/

class lassoEditorWelcome {

	function __construct(){

		add_action( 'wp_footer', 						array($this,'draw_tour'));
		add_action('wp_ajax_process_hide_tour', 		array($this,'process_hide_tour'));

	}

	/*
	*	Draw the modal used to house the walk through
	*/
	function draw_tour(){

		$tour_hidden = get_user_meta( get_current_user_ID(),'lasso_hide_tour', true );

		if ( apply_filters('lasso_runs_on', is_singular() ) && lasso_user_can() && !$tour_hidden ) {

			global $post;

			$nonce = wp_create_nonce('lasso-editor-tour');

			// let users add custom css classes
			$custom_classes = apply_filters('lasso_modal_tour_classes', '' );

			?>
			<script>
			jQuery(document).ready(function($){
				$('body').addClass('lasso-modal-open');
				$('#lasso--tour__slides').unslider({
					dots: true,
					delay:100000
				});
			});
			</script>
			<div id="lasso--tour__modal" class="lasso--modal lasso--tour__modal lasso--modal__checkbox <?php echo sanitize_html_class( $custom_classes );?>">

				<div class="lasso--modal__inner">

					<?php echo self::tour_slides();?>

					<div class="lasso--postsettings__footer">

						<div class="lasso--postsettings__option">
							<label for="hide_tour" class="checkbox-control checkbox">
					        	<input type="checkbox" id="hide_tour" name="hide_tour"/ <?php checked( $tour_hidden, 1 ); ?>>
					        	<span class="control-indicator"></span>
								Don't show this again
					        </label>
						</div>

						<input type="submit" value="<?php _e('Okay, got it','lasso');?>" data-nonce="<?php echo $nonce;?>" >
					</div>

				</div>

			</div>
			<div id="lasso--modal__overlay"></div>
			<?php

		}
	}

	/*
	*	Draw the inner slides for the welcome walkthrough
	*/
	function tour_slides(){

		?>
		<div id="lasso--tour__slides">
			<ul>
				<li>
					<img src="http://placehold.it/400x260">
					<p>Story components can be added by clicking and dragging from the component try into the story.</p>
				</li>
				<li>
					<img src="http://placehold.it/300x260">
					<p>Another item.</p>
				</li>
			</ul>
		</div>

		<?php

	}

	/*
	*
	*	When the user decides to not have this show again save user meta
	*/
	function process_hide_tour(){

		if ( isset( $_POST['action'] ) && $_POST['action'] == 'process_hide_tour' ) {

			// only run for logged in users and check caps
			if( !lasso_user_can() )
				return;

			// ok security passes so let's process some data
			if ( wp_verify_nonce( $_POST['nonce'], 'lasso-editor-tour' ) ) {

				$user_id = get_current_user_ID();

				update_user_meta( $user_id,'lasso_hide_tour', true );

				do_action( 'lasso_tour_hidden', $user_id );

				wp_send_json_success();

			} else {

				wp_send_json_error();
			}
		}
	}
}
new lassoEditorWelcome;