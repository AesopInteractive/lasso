jQuery(document).ready(function($){

	// entry handler
  	$('#lasso-editor-settings-form').submit(function(e) {

  		var $this = $(this);

  		e.preventDefault();

		$this.find(':submit').attr( 'disabled','disabled' );

  		var data = $this.serialize();

	  	$.post( ajaxurl, data, function(response) {

	  		if ( response.success ) {

	  			$this.find(':submit').addClass('saved');
	  			$this.find('.lasso-editor-settings--submit').append('<div class="lasso-editor-settings--confirm success">Settings Saved!</div>');

	  			setTimeout( function(){
	  				$this.find(':submit').removeClass('saved');
	  				$this.find('.lasso-editor-settings--confirm').remove();
	  				$this.find(':submit').attr( 'disabled',false );
	  			}, 2000 );

	  		} else {

	  			$this.find('.lasso-editor-settings--submit').append('<div class="lasso-editor-settings--confirm error">Something went wrong! :(</div>');

	  		}
	    }).fail(function(xhr, err) { 
			var responseTitle= $(xhr.responseText).filter('title').get(0);
			alert($(responseTitle).text() + "\n" + EditusFormatAJAXErrorMessage(xhr, err) );
			$this.find('.lasso-editor-settings--submit').append('<div class="lasso-editor-settings--confirm error">Something went wrong! :(</div>');		
		});

    });

});