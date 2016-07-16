(function( $ ) {

	$(document).on('submit', '#lasso--post-form', function(e) {

		e.preventDefault();

		var $this 	= $(this)
		,	submit 	= $this.find('input[type="submit"]')
		,	strings = lasso_editor.strings
		,	data	= $this.serialize();

		submit.val( strings.saving );

		$.post( lasso_editor.ajaxurl, data, function(response) {

			if( true == response.success ) {

				submit.val( strings.saved ).addClass('saved');

				console.log(response)

				setTimeout(function(){

					submit.removeClass('saved');
					submit.val( strings.save );

				},1000);

			}

		}).fail(function(xhr, err) { 
			var responseTitle= $(xhr.responseText).filter('title').get(0);
			alert($(responseTitle).text() + "\n" + EditusFormatAJAXErrorMessage(xhr, err) );
		});

	});


})( jQuery );
