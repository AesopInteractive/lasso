(function( $ ) {

	var form;

	$('#lasso--map-form').live('submit', function(e) {

		e.preventDefault();

		var $this = $(this);

		$(this).find('input[type="submit"]').val('Saving...');

		var data = $this.serialize();

		/////////////
		//	DO TEH SAVE
		/////////////
		$.post( lasso_editor.ajaxurl, data, function(response) {

			console.log(response);


		});

	});

})( jQuery );