jQuery(document).ready(function($){

	var editor 	=  aesop_editor.editor,
		toolbar = aesop_editor.toolbar,
		modal = aesop_editor.component_modal;

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

		$('#aesop-toolbar--components__list li').draggable({
			axis:'y',
		   	helper: 'clone',
		    cursor: 'move',
		    tolerance: 'fit',
		    //connectToSortable: '#'+editor,
		});

		$('#'+editor).droppable({
		    accept: "#aesop-toolbar--components__list li",
			activeClass: "drop-area",
		    drop: function (e, ui) {

		    	x = ui.helper.clone();

	            // remove the helpder
	            ui.helper.remove();

	            x.appendTo('#'+editor);

	            x.css('position','static')

	            // replace with
	            x.replaceWith('<div style="height:auto;background:red;">yo</div>');
		    }
		})

		/* @todo - need to utilize the handle option to scontent editable still works
		$('#'+editor).sortable({
			items:'.aesop-component:not(p)',
         	containment: 'parent',
            //handle: '.item-container',
            //tolerance: 'pointer'
		});
		*/

	});

});





