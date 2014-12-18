<?php

get_header();

	?>
	<form id="aesop-editor--form" method="post">
		<textarea id="aesop-editor--content" name="aesop-editor--content">
			<?php

			while( have_posts() ) : the_post();
			echo the_content();

			endwhile;

			?>
		</textarea>
		<p>
			<input type="submit" data-post-id="<?php echo get_the_ID();?>" style="z-index:999;position:fixed;bottom:20px;
		right:20px;" id="aesop-editor--save" value="Save" class="btn btn-primary">
		</p>
	</form>
	<?php

get_footer();