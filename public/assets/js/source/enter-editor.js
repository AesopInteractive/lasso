jQuery(document).ready(function($){

	var editor 			= lasso_editor.editor,
		post_container  = lasso_editor.article_object,
		toolbar 		= lasso_editor.toolbar,
		panel           = lasso_editor.component_sidebar,
		postid          = lasso_editor.postid,
		modal 			= lasso_editor.component_modal,
		components 		= lasso_editor.components,
		featImgClass   	= lasso_editor.featImgClass,
		featImgNonce    = lasso_editor.featImgNonce,
		titleClass      = lasso_editor.titleClass,
		uploadControls  = lasso_editor.featImgControls,
		wpImgEdit 		= lasso_editor.wpImgEdit,
		lassoDragHandle = lasso_editor.handle;

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

	$('#lasso--edit').click(function(e){
		e.preventDefault();

		// add body class editing
		$('body').toggleClass('lasso-editing');

		//append editor id to post container
		$(post_container).attr('id', editor);

		// append toolbar
		$(toolbar).hide().appendTo('body').fadeIn(200);

		// fade in controls if previous exacped
		$('.lasso--controls__right').css('opacity',1);

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
		// @todo - this likely needs to be changed to a lasso- namespaced item which then needs to be updated in Aesop Story Engine
		$('.aesop-component').each(function(){

			// if there's no toolbar present
			if ( !$('.lasso-component--toolbar').length > 0 ) {

				// if this is a map then we need to first wrap it so that we can drag the  map around
				if ( $(this).hasClass('aesop-map-component') ) {

					var $this = $(this)

					$this.css('margin',0);

					// so wrap it with a aesop-compoentn aesop-map-component div
					$this.wrap('<div class="aesop-component aesop-map-component lasso--map-drag-holder">').before( lassoDragHandle );

					// then copy all the data attributes from the child to the parent so that the settings panel works
					var attributes = $this.prop('attributes');

					$.each(attributes, function() {
					    $('.aesop-map-component').attr(this.name, this.value);
					});

				} else {

					$(this).append( lassoDragHandle );
				}
			}
		});

		// find images inserted from within the wordpress backend post editor and
		// wrap them in a div, then append an edit button for editing the image
		$("[class*='wp-image-']").each(function(){

			var $this = $(this)

			if ( !$('.lasso--wpimg-edit').length > 0 ) {

				$this.wrap('<div class="lasso--wpimg__wrap">')
				$('.lasso--wpimg__wrap').prepend(wpImgEdit)

			}

		});

		/////////////////
		///
		///   CONTENT EDITABLE / TOOLBAR
		///
		/// - attributes and tags are set to null to allow any markup and block level items to be passed through
		///   this means that medium.js is only providing us with a helper API to invoke certain markup and to 
		///   insert HTML. It's important to realize that the_content filter together with wpautop is responsible
		///   for automatically making new paragraph elements on enter
		///
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
				editor: 'lasso-editor',
				pasteHook: 'lasso-editor-paste-hook',
				placeholder: 'lasso-editor-placeholder',
				clear: 'lasso-editor-clear'
			}
	    });

	    // this forces the default new element in content editable to be a paragraph element if
	    // it has no previous element to depart from 
	    // ref http://stackoverflow.com/a/15482748
	    document.execCommand('defaultParagraphSeparator', false, 'p');

		article.highlight = function() {
			if (document.activeElement !== article) {

				articleMedium.select();

			} else {

				return false;
			}
		};

		document.getElementById('lasso-toolbar--bold').onmousedown = function() {
			article.highlight();
		    articleMedium.invokeElement('b');
			return false;
		};

		document.getElementById('lasso-toolbar--underline').onmousedown = function() {
			article.highlight();
			articleMedium.invokeElement('u');
			return false;
		};

		document.getElementById('lasso-toolbar--italic').onmousedown = function() {
			article.highlight();
			articleMedium.invokeElement('i');
			return false;
		};

		document.getElementById('lasso-toolbar--strike').onmousedown = function() {
			article.highlight();
			articleMedium.invokeElement('strike');
			return false;
		};
		document.getElementById('lasso-toolbar--link__create').onmousedown = function() {

		    restoreSelection(window.selRange);

			articleMedium.insertHtml('<a class="lasso-link" href="'+ $('#lasso-toolbar--link__inner').text() +'">'+window.selRange+'</a>');

		    window.selRange = null;

		    // close modal drag
        	$('#lasso-toolbar--link').removeClass('link--drop-up');

		    return false;
		};
		document.getElementById('lasso-toolbar--html__insert').onmousedown = function() {

		    restoreSelection(window.selRange);
		    articleMedium.insertHtml( $('#lasso-toolbar--html__inner').text() );

		    window.selRange = null;

		    // close modal drag
        	$('#lasso-toolbar--html').removeClass('html--drop-up');

		    return false;
		};

		/////////////////
		/// EXIT EDITOR
		///////////////////
		$(document).keyup(function(e) {

			if ( 27 == e.keyCode ) {

				$('body').removeClass('lasso-sidebar-open lasso-editing');

				$('.lasso--toolbar_wrap, #lasso--sidebar, #lasso--featImgControls, #lasso--wpimg-edit').fadeOut().remove();

				$('#lasso--edit').css('opacity',1);
				$('.lasso--controls__right').css('opacity',0);
				$(post_container).attr('id','');

				// unwrap wp images
				$('.lasso--wpimg__wrap').each(function(){
					$(this).children().unwrap()
				});

				// unwrap map from hits drag holder
				$('.aesop-map-component').each(function(){
					$(this).children().unwrap()
					$(this).find('.lasso-component--controls ').remove()
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
			placeholder:'lasso-drop-zone',
			handle: '.lasso-drag',
            cursor:'move',
            refreshPositions: true,
            helper: function( e, ui ) {

		    	// get the curent target and add the type class to the drag event
				var item = ui['context'],
					type = $(item).attr('data-component-type');

            	return $('<div class="lasso-drag-holder '+type+'"></div>'); 
            },
        	beforeStop: function (event, ui) { draggedItem = ui.item },
            receive: function () {

            	// close modal drag
            	$('#lasso-toolbar--components').removeClass('toolbar--drop-up');

            	// get the item and type
				var item = draggedItem['context'],
					type = $(item).attr('data-type');

				// if coming from draggable replace with our content and prepend toolbar
				if ( origin == 'draggable' ) {

					$(item).replaceWith( $(components[type]['content'])
						.prepend( lassoDragHandle )
						.attr({
							'data-component-type': type
						})
					)
				}

		    }
		});

		$('#lasso-toolbar--components__list li').draggable({
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





