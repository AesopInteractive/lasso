(function( $ ) {
	'use strict';

	var editor 			= aesop_editor.editor,
		post_container  = aesop_editor.article_object;

	// detect any changes to editor and backup post to local storage
	// @todo - this currently doesn't account for new components dragged into the post
	var oldHtml = $('#'+editor).html();

	$('#'+editor).live('change',function(){

		var $this = $(this);

		var newHtml = $this.html(),
			unique  = $this.closest('article').attr('id');

		if ( oldHtml !== newHtml ) {

			localStorage.setItem( 'aesop_backup_'+unique , newHtml );
		}
	});

})( jQuery );