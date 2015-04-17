<?php

if ( !function_exists( 'lasso_backbone_templates' ) ):

	add_action('wp_footer', 'lasso_backbone_templates');
	function lasso_backbone_templates(){

		$can_delete = lasso_user_can('delete_others_posts');
		$can_delete_class = $can_delete ? false : 'no-delete';

		// only run on posts and pages if user is logged in
		if ( apply_filters('lasso_runs_on', is_singular() || is_home() ) ) { ?>
			<script type="text/html" id="lasso-tmpl--post">
				<li>
					<a href="<%= post.link %>" class="lasso--post-list__item <?php echo $can_delete_class;?>" data-postid="<%= post.ID %>">
						<%= post.title %>

						<div class="lasso--post-list__controls">
							<span title="<?php echo esc_attr_e('Edit Post','lasso');?>" id="lasso--post__edit"></span>
							<?php if( $can_delete ): ?>
							<span title="<?php echo esc_attr_e('Delete Post','lasso');?>" id="lasso--post__delete"></span>
							<?php endif; ?>
						</div>
					</a>
				</li>
			</script>
		<?php }

	}

endif;