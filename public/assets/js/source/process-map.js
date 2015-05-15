(function( $ ) {

	var form;

	$('#lasso--map-form').live('submit', function(e) {

		e.preventDefault();

		var $this = $(this);

		$(this).find('input[type="submit"]').val('Saving...').addClass('being-saved');

		var data = $this.serialize();

		/////////////
		//	DO TEH SAVE
		/////////////
		$.post( lasso_editor.ajaxurl, data, function(response) {

			if ( true == response.success ) {

				$this.find('input[type="submit"]').val('Saved');
				$this.removeClass('being-saved').addClass('lasso--saved');

				setTimeout(function(){
					$this.find('input[type="submit"]').val('Save Locations').removeClass('lasso-saved');
				},1200);

			} else {
				$this.removeClass('being-saved').addClass('lasso--error');
			}


		});

	});

})( jQuery );