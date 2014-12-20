jQuery(document).ready(function($){

	var editor 	=  aesop_editor.editor,
		toolbar = '<div class="aesop-editor--toolbar_wrap">\
		   <ul class="aesop-editor--toolbar__inner">\
		    <li id="aesop-toolbar--bold"></li>\
		    <li id="aesop-toolbar--underline" ></li>\
		    <li id="aesop-toolbar--italic"></li>\
		    <li id="aesop-toolbar--strike"></li>\
		    <li id="aesop-toolbar--modal"></li>\
		   </ul>\
		</div>',
		modal = aesop_editor.component_modal;

	$('#aesop-editor--edit').click(function(e){
		e.preventDefault();

		// add body class editing
		$('body').toggleClass('aesop-editing');

		// append toolbar
	    $('body').append(toolbar);

	    // show save button
	    $('#aesop-editor--save').css('opacity',1);

	    // set edtior to editable
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