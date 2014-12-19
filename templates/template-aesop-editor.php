<?php

get_header();

	?>
		<div id="aesop-editor--content" name="aesop-editor--content">
			<?php

			while( have_posts() ) : the_post();
			echo the_content();

			endwhile;

			?>
		</div>

	<?php

get_footer();