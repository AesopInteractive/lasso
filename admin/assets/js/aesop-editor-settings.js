jQuery(document).ready(function($){

	// entry handler
  	$('#aesop-editor-settings-form').submit(function(e) {

  		var $this = $(this);

  		e.preventDefault();

		$this.find(':submit').attr( 'disabled','disabled' );

  		var data = $this.serialize();

	  	$.post( ajaxurl, data, function(response) {

	  		if ( response.success ) {

	  			alert('yep');

	  		} else {

	  			alert('error');

	  		}
	    });

    });

});