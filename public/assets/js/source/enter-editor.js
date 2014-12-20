jQuery(document).ready(function($){

	var editor 	=  aesop_editor.editor,
		toolbar = '<div class="aesop-editor--toolbar_wrap">\
		   <span class="aesop-editor--toolbar__inner">\
		    <span id="aesop-toolbar--bold"></span>\
		    <span id="aesop-toolbar--underline" ></span>\
		    <span id="aesop-toolbar--italic"></span>\
		    <span id="aesop-toolbar--strike"></span>\
		   </span>\
		</div>';

	$('#aesop-editor--edit').click(function(e){
		e.preventDefault();
		$('body').toggleClass('aesop-editing');
	    $(editor).attr('contenteditable',true);
	    $('body').prepend(toolbar);

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

		document.getElementById('aesop-toolbar--bold').onmousedown = function() {
			article.highlight();
		    articleMedium.invokeElement('b');
			return false;
		};

		document.getElementById('aesop-toolbar--underline').onmousedown = function() {
			article.highlight();
			articleMedium.invokeElement('u');
			return false;
		};

		document.getElementById('aesop-toolbar--italic').onmousedown = function() {
			article.highlight();
			articleMedium.invokeElement('i');
			return false;
		};

		document.getElementById('aesop-toolbar--strike').onmousedown = function() {
			article.highlight();
			articleMedium.invokeElement('strike');
			return false;
		};

	});

});