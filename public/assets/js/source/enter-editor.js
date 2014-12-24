jQuery(document).ready(function($){

	var editor 	=  aesop_editor.editor,
		toolbar = aesop_editor.toolbar,
		modal = aesop_editor.component_modal,
		components = aesop_editor.components,
		aesopDragHandle = aesop_editor.handle;

	$('#aesop-editor--edit').click(function(e){
		e.preventDefault();

		// add body class editing
		$('body').toggleClass('aesop-editing');

		//get the ID of the current article, store it, replace it with
		//ID defined in class.assets.php
		$('article').attr('id', editor);

		// append toolbar
   		$(toolbar).hide().appendTo('body').fadeIn(200);

	    // show save button
	    $('#aesop-editor--save').css('opacity',1);

	    // set edtior to editable
	    $('#'+editor).attr('contenteditable',true);

		/////////////////
		/// CONTENT EDITABLE / TOOLBAR
		///////////////////
		var article = document.getElementById(editor),
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

		/////////////////
		/// DRAG DROP
		///////////////////

		$('#'+editor).sortable({
			opacity:0.65,
			placeholder:'aesop-drop-zone',
			handle: '.aesop-drag',
            tolerance: 'pointer',
            containment:'#'+editor,
            cursor:'move',
            cursorAt:{ left:5, top:5 },
            helper: function( e, ui ) {

                return $('<div class="aesop-drag-holder"></div>');

            },
            receive: function (e, ui) {

            	$('#aesop-toolbar--components').removeClass('toolbar--drop-up');

            	var el = ui.item['context'],
            		type = $(el).attr('data-type');

	            $(this).find('li').replaceWith(components[type]['content']);

			    $('.aesop-component').each(function(){

			    	$(this).css('position','relative'); // tis needs to go in aesop

			    	$(this).prepend(aesopDragHandle);
			    });

		    }
		});

		$('#aesop-toolbar--components__list li').draggable({
			axis:'y',
			helper:'clone',
		    cursor: 'move',
		    tolerance: 'fit',
		    connectToSortable: '#'+editor,
		});

	});

});





