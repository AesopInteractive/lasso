jQuery(document).ready(function($){

	var editor 			= aesop_editor.editor,
		post_container  = aesop_editor.article_object,
		toolbar 		= aesop_editor.toolbar,
		panel           = aesop_editor.component_sidebar,
		postid          = aesop_editor.postid,
		modal 			= aesop_editor.component_modal,
		components 		= aesop_editor.components,
		featImgClass   	= aesop_editor.featImgClass,
		featImgNonce    = aesop_editor.featImgNonce,
		titleClass      = aesop_editor.titleClass,
		uploadControls  = aesop_editor.featImgControls,
		wpImgEdit 		= aesop_editor.wpImgEdit,
		aesopDragHandle = aesop_editor.handle;

	function restoreSelection(range) {
	    if (range) {
	        if (window.getSelection) {
	            sel = window.getSelection();
	            sel.removeAllRanges();
	            sel.addRange(range);
	        } else if (document.selection && range.select) {
	            range.select();
	        }
	    }
	}

	$('#aesop-editor--edit').click(function(e){
		e.preventDefault();

		// add body class editing
		$('body').toggleClass('aesop-editing');

		//append editor id to post container
		$(post_container).attr('id', editor);

		// append toolbar
		$(toolbar).hide().appendTo('body').fadeIn(200);

		// fade in controls if previous exacped
		$('.aesop-editor--controls__right').css('opacity',1);

	    // set edtior to editable
	    $('#'+editor).attr('contenteditable',true);

	    // add settings panel
		$('body').append(panel);

		// append upload bar to featured image if present
		if ( $( featImgClass ).length > 0 ) {
			$(featImgClass).append( uploadControls );
		}

		// append contenteditable to title if set
		if ( $(titleClass).length > 0 ) {
			$(titleClass).attr('contenteditable', true);
		}

		// append the toolbar to any components that dont have them
		$('.aesop-component').each(function(){

			if ( !$('.aesop-component--toolbar').length > 0 ) {
				$(this).append( aesopDragHandle );
			}
		});

		// find images inserted from within the wordpress backend post editor and
		// wrap them in a div, then append an edit button for editing the image
		$("[class*='wp-image-']").each(function(){

			var $this = $(this)

			if ( !$('.aesop-editor--wpimg-edit').length > 0 ) {

				$this.wrap('<div class="aesop-editor--wpimg__wrap">')
				$('.aesop-editor--wpimg__wrap').prepend(wpImgEdit)

			}

		});

		/////////////////
		/// CONTENT EDITABLE / TOOLBAR
		///////////////////
		article = document.getElementById(editor),
	    articleMedium = new Medium({
	        element: article,
	        mode: Medium.richMode,
	        attributes: null,
	        tags: null,
	        placeholder:'Just write...',
		    pasteAsText: true,
	    	cssClasses: {
				editor: 'aesop-editor',
				pasteHook: 'aesop-editor-paste-hook',
				placeholder: 'aesop-editor-placeholder',
				clear: 'aesop-editor-clear'
			}
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

		document.getElementById('aesop-toolbar--html__insert').onmousedown = function() {

		    restoreSelection(window.selRange);
		    articleMedium.insertHtml( $('#aesop-toolbar--html__inner').text() );

		    window.selRange = null;

		    // close modal drag
        	$('#aesop-toolbar--html').removeClass('html--drop-up');

		    return false;
		};

		/////////////////
		/// EXIT EDITOR
		///////////////////
		$(document).keyup(function(e) {

			if ( 27 == e.keyCode ) {

				$('body').removeClass('aesop-sidebar-open aesop-editing');

				$('.aesop-editor--toolbar_wrap, #aesop-editor--sidebar, #aesop-editor--featImgControls, #aesop-editor--wpimg-edit').fadeOut().remove();

				$('#aesop-editor--edit').css('opacity',1);
				$('.aesop-editor--controls__right').css('opacity',0);
				$(post_container).attr('id','');

				// unwrap wp images
				$(".aesop-editor--wpimg__wrap").each(function(){
					$(this).children().unwrap()
				});

				$(titleClass).attr('contenteditable', false);

				articleMedium.destroy();
			}

		});

		/////////////////
		/// DRAG DROP
		///////////////////
		$('#'+editor).sortable({
			opacity: 0.65,
			placeholder:'aesop-drop-zone',
			handle: '.aesop-drag',
            cursor:'move',
            refreshPositions: true,
            helper: function( e, ui ) {

		    	// get the curent target and add the type class to the drag event
				var item = ui['context'],
					type = $(item).attr('data-component-type');

            	return $('<div class="aesop-drag-holder '+type+'"></div>'); 
            },
        	beforeStop: function (event, ui) { draggedItem = ui.item },
            receive: function () {

            	// close modal drag
            	$('#aesop-toolbar--components').removeClass('toolbar--drop-up');

            	// get the item and type
				var item = draggedItem['context'],
					type = $(item).attr('data-type');

				// if coming from draggable replace with our content and prepend toolbar
				if ( origin == 'draggable' ) {

					$(item).replaceWith( $(components[type]['content'])
						.prepend( aesopDragHandle )
						.attr({
							'data-component-type': type
						})
					)
				}

		    }
		});

		$('#aesop-toolbar--components__list li').draggable({
			axis:'y',
			helper:'clone',
		    cursor: 'move',
		    connectToSortable: '#'+editor,
		    start: function(ui) {

		    	// add an origin so sortable can detect where comign from
		    	origin = 'draggable';

		    	// get the curent target and add the type class to the drag event
				var item = ui.currentTarget,
					type = $(item).attr('data-type');

              	$(this).addClass(type);
		    }
		});

	});

});





