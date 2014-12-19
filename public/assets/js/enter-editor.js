jQuery(document).ready(function($){

	var editor 	=  aesop_editor.editor

	$('#aesop-editor--edit').click(function(e){
		e.preventDefault();
	    $(editor).attr('contenteditable',true);

	    new Medium({
	        element: document.getElementById('aesop-editor--content')
	    });

	});

});