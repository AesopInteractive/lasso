(function( $ ) {

	$(document).ready(function(){

		/////////////
		// SAVE TITLE
		/////////////

		$(aesop_editor.titleClass).on('blur', function() {

			var target = $(this);

			var data = {
				action: 		'process_update_title',
				postid: 		aesop_editor.postid,
				title:          $.trim( target.text() ),
				nonce: 			aesop_editor.titleNonce
			}

			/////////////
			//	UPDATE THE TITLE
			/////////////
			$.post( aesop_editor.ajaxurl, data, function(response) {

				if ( true == response.success ) {

					var saveClass = 'aesop-title-saved';

					target.addClass(saveClass);

					setTimeout(function(){
						target.removeClass(saveClass);
					},500);
				}

			});

		});

	});

})( jQuery );