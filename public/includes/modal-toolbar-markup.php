<?php
/**
*
*	Draw teh component modal
*
*
*/
function aesop_editor_component_sidebar(){

	ob_start();

	?>
	<div id="aesop-editor--sidebar">
		<div class="aesop-editor--sidebar__inner">

			<span id="aesop-editor--sidebar__close" >x</span>

			<p>Component Settings</p>

		</div>
	</div>
	<?php

	return ob_get_clean();
}

/**
*
*	Draw teh component modal
*
*
*/
function aesop_editor_component_modal(){

	ob_start();

	?>
	<div id="aesop-editor--modal">
		<div class="aesop-editor--modal__inner">

			<span id="aesop-editor--modal__close" >x</span>

			<p>Component Settings</p>

		</div>
	</div>
	<div id="aesop-editor--modal__overlay"></div>
	<?php

	return ob_get_clean();
}

function aesop_editor_toolbar(){

	ob_start();

	?>
	<div class="aesop-editor--toolbar_wrap">
		<ul class="aesop-editor--toolbar__inner">
		    <li id="aesop-toolbar--bold"></li>
		    <li id="aesop-toolbar--underline" ></li>
		    <li id="aesop-toolbar--italic"></li>
		    <li id="aesop-toolbar--strike"></li>
		    <li id="aesop-toolbar--components">
			    <ul id="aesop-toolbar--components__list">
					<li data-type="image" title="Image" class="image"></li>
					<li data-type="character" title="Character" class="character"></li>
					<li data-type="quote" title="Quote"  class="quote"></li>
					<li data-type="content" title="Content"  class="content"></li>
					<li data-type="chapter" title="Chapter"  class="chapter"></li>
					<li data-type="parallax" title="Parallax"  class="parallax"></li>
					<li data-type="audio" title="Audio"  class="audio"></li>
					<li data-type="video" title="Video"  class="video"></li>
					<li data-type="map" title="Map"  class="map"></li>
					<li data-type="timeline" title="Timeline"  class="timeline"></li>
					<li data-type="document" title="Document"  class="document"></li>
					<li data-type="collection" title="Collection"  class="collection"></li>
					<li data-type="gallery" title="Gallery"  class="gallery"></li>
			    </ul>
			</li>
		</ul>
	</div>
	<?php return ob_get_clean();
}

/*
*
*	Drag handle
*/
function aesop_editor_handle(){

	ob_start();

	if ( !is_user_logged_in() || !current_user_can('edit_posts') )
		return;

	?><ul class="aesop-component--controls" contenteditable="false">
				<li class="aesop-drag"></li>
				<li id="aesop-component--settings__trigger" class="aesop-settings"></li>
			</ul>

	<?php return ob_get_clean();
}