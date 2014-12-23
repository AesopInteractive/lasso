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
			axis:'y',
			helper:'clone',
			placeholder:'aesop-drop-zone',
			handle: '.aesop-drag',
         	containment: 'parent',
            tolerance: 'pointer',
            cursor:'move',
            receive: function (e, ui) {

            	$('#aesop-toolbar--components').removeClass('toolbar--drop-up');

            	var el = ui.item['context'];
            	var type = $(el).attr('data-type');

            	console.log(type);

	            //$(this).find('li').replaceWith('<div class="'+cl+'" style="height:auto;background:red;">'+aesopDragHandle+' <span>'+cl+'</span></div>')
	            $(this).find('li').replaceWith(components[type]['content']);

	            console.log(components[type]['content']);
		    }
		});

		$('#aesop-toolbar--components__list li').draggable({
			axis:'y',
			helper:'clone',
		    cursor: 'move',
		    tolerance: 'fit',
		    connectToSortable: '#'+editor
		});

	});

});





