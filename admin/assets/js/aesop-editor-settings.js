jQuery(document).ready(function($){

	// entry handler
  	$('#aesop-editor-settings-form').submit(function(e) {

  		var $this = $(this);

  		e.preventDefault();

		$this.find(':submit').attr( 'disabled','disabled' );

  		var data = $this.serialize();

	  	$.post( ajaxurl, data, function(response) {

	  		if ( response.success ) {

	  			$this.find(':submit').addClass('saved');
	  			$this.find('.aesop-editor-settings--submit').append('<div class="aesop-editor-settings--confirm success">Settings Saved!</div>');

	  			setTimeout( function(){
	  				$this.find(':submit').removeClass('saved');
	  				$this.find('.aesop-editor-settings--confirm').remove();
	  				$this.find(':submit').attr( 'disabled',false );
	  			}, 2000 );

	  		} else {

	  			$this.find('.aesop-editor-settings--submit').append('<div class="aesop-editor-settings--confirm error">Something went wrong! :(</div>');

	  		}
	    });

    });

});