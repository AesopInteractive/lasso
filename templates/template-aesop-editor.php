<?php

get_header();

	?>
	 <div class="toolbar-top">
	   <span class="toolbar">
	    <span id="rich4-bold" style="font-weight: bold;">B</span>
	    <span id="rich4-underline" style="text-decoration: underline;">U</span>
	    <span id="rich4-italic" style="font-style: italic;">I</span>
	    <span id="rich4-strike" style="text-decoration: line-through;">S</span>
	   </span>
	  </div>
		<div id="aesop-editor--content" name="aesop-editor--content">
			<?php

			while( have_posts() ) : the_post();
			echo the_content();

			endwhile;

			?>
		</div>

	<?php

get_footer();