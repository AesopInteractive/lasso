(function( $ ) {

	$(document).on('submit', '.lasso--post-form', function(e) {

		e.preventDefault();

		var $this 	= $(this)
		,	submit 	= $(this).find('input[type="submit"]')
		,	strings = lasso_editor.strings

		submit.val( strings.saving );

		var data = $this.serialize();

		$.post( lasso_editor.ajaxurl, data, function(response) {

			if( true == response.success ) {

				submit.val( strings.saved ).addClass('saved');

				setTimeout(function(){

					submit.removeClass('saved');
					submit.val( strings.save );

				},1000);

			}

		});

	});


})( jQuery );
