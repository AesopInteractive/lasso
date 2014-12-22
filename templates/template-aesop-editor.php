<?php

get_header();

	?>

		<div style="font-size:22px;width:800px;margin:0 auto;" id="aesop-editor--content" name="aesop-editor--content">
			<?php

			while( have_posts() ) : the_post();
			echo the_content();

			endwhile;

			?>
		</div>
		<p>
			<a href="" data-post-id="<?php echo get_the_ID();?>" style="z-index:999;position:fixed;bottom:20px;
		right:20px;" id="aesop-editor--save" value="Save" class="btn btn-primary">save</a>
		</p>

	<?php

get_footer();