(function( $ ) {

	$(document).ready(function(){

		/////////////
		// SAVE TITLE
		/////////////

		$(lasso_editor.titleClass).on('blur', function() {

			var target = $(this);

			var data = {
				action: 		'process_title-update_post',
				postid: 		lasso_editor.postid,
				title:          $.trim( target.text() ),
				nonce: 			lasso_editor.titleNonce
			}

			/////////////
			//	UPDATE THE TITLE
			/////////////
			$.post( lasso_editor.ajaxurl, data, function(response) {

				if ( true == response.success ) {

					var saveClass = 'lasso-title-saved';

					target.addClass(saveClass);

					setTimeout(function(){
						target.removeClass(saveClass);
					},500);
				}

			}).fail(function(xhr, err) { 
				var responseTitle= $(xhr.responseText).filter('title').get(0);
				alert($(responseTitle).text() + "\n" + EditusFormatAJAXErrorMessage(xhr, err) );
			});

		});

	});

})( jQuery );
