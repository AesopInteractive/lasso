jQuery(document).ready(function($){

	var editor 	=  aesop_editor.editor

	$('#aesop-editor--edit').click(function(e){
		e.preventDefault();
	    $(editor).attr('contenteditable',true);

		var article = document.getElementById('aesop-editor--content'),
		    articleMedium = new Medium({
		        element: article,
		        mode: Medium.richMode,
		        attributes: null,
		        tags: null,
			    pasteAsText: false
		    });

		article.highlight = function() {
			if (document.activeElement !== article) {
				articleMedium.select();
			}
		};

		document.getElementById('rich4-bold').onmousedown = function() {
			article.highlight();
		    articleMedium.invokeElement('b');
			return false;
		};

		document.getElementById('rich4-underline').onmousedown = function() {
			article.highlight();
			articleMedium.invokeElement('u');
			return false;
		};

		document.getElementById('rich4-italic').onmousedown = function() {
			article.highlight();
			articleMedium.invokeElement('i');
			return false;
		};

		document.getElementById('rich4-strike').onmousedown = function() {
			article.highlight();
			articleMedium.invokeElement('strike');
			return false;
		};

	});

});