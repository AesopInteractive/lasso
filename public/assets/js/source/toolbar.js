jQuery(function( $ ) {

	function saveSelection() {
	    if (window.getSelection) {
	        sel = window.getSelection();
	        if (sel.getRangeAt && sel.rangeCount) {
	            return sel.getRangeAt(0);
	        }
	    } else if (document.selection && document.selection.createRange) {
	        return document.selection.createRange();
	    }
	    return null;
	}

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

	/////////////
	/// DROP UP
	/////////////
	$(document).on('click', '#lasso-toolbar--components', function(e){

		$(this).toggleClass('toolbar--drop-up');
		$('#lasso-toolbar--html').removeClass('html--drop-up');
		$('#lasso-toolbar--link').removeClass('link--drop-up');

		// get the height of the list of components
		var dropUp 			= $(this).find('ul'),
			dropUpHeight 	= $(dropUp).height(),
			caretSpacing  	= 15; // this is the height of the caret

		// and adjust the drop up position as necessary
		$(dropUp).css({
			dropUp: dropUpHeight,
			top:    -(dropUpHeight + caretSpacing)
		});

	});

	/////////////
	/// HTML DROP UP
	/////////////

	$('#lasso-toolbar--html').live('mousedown',function(){
		if( ! $(this).hasClass('html--drop-up') ) {
			var article = document.getElementById(lasso_editor.editor);
			window.selRange = saveSelection();
			if( typeof window.selRange === 'undefined' || null == window.selRange ) {
				article.highlight();
				window.selRange = saveSelection();
			}
		}
	});

	$('#lasso-toolbar--html__inner').live('focusout',function(){
		restoreSelection(window.selRange);
	});

	$('#lasso-toolbar--html__inner').live('focus',function(){
		if ( $(saveSelection().commonAncestorContainer).parents('#lasso--content').length != 0 ) {
			window.selRange = saveSelection();
		}
	});

	$(document).on('click', '#lasso-toolbar--html', function(e){

		$(this).toggleClass('html--drop-up');
		$('#lasso-toolbar--components').removeClass('toolbar--drop-up');
		$('#lasso-toolbar--link').removeClass('link--drop-up');

		// prevent dropup from closing
		$('#lasso-toolbar--html__wrap').live('click',function(){
			return false;
		});

		$(this).find('#lasso-toolbar--html__inner').focus();

	});

	$('.lasso-toolbar--html__cancel').live('click',function(){

		$(this).closest('li').removeClass('html--drop-up');

	});

	//////////////////
	// HTML FORMATTING IN HTML DROP UP MENU
	//////////////////
	var htmlItemInsert = function(markup){

		return $('#lasso-toolbar--html__inner').text(markup);

	}
	$('#lasso-html--h2').live('click',function(e){
		e.preventDefault();
		htmlItemInsert('<h2>H2 Heading</h2>');
	});
	$('#lasso-html--h3').live('click',function(e){
		e.preventDefault();
		htmlItemInsert('<h3>H3 Heading</h3>');
	});
	$('#lasso-html--ul').live('click',function(e){
		e.preventDefault();
		htmlItemInsert('<ul><li>Item</li></ul>');
	});
	$('#lasso-html--ol').live('click',function(e){
		e.preventDefault();
		htmlItemInsert('<ol><li>Item</li></ol>');
	});

	////////////
	/// LINK DROP UIP
	////////////
	$('#lasso-toolbar--link').live('mousedown',function(){
		if( ! $(this).hasClass('link--drop-up') ) {
			var article = document.getElementById(lasso_editor.editor);
			window.selRange = saveSelection();
			if( typeof window.selRange === 'undefined' || null == window.selRange ) {
				article.highlight();
				window.selRange = saveSelection();
			}
		}
	});

	$('#lasso-toolbar--link__inner').live('focusout',function(){
		restoreSelection(window.selRange);
	});

	$('#lasso-toolbar--link__inner').live('focus',function(){
		if ( $(saveSelection().commonAncestorContainer).parents('#lasso--content').length != 0 ) {
			window.selRange = saveSelection();
		}
	});

	$(document).on('click', '#lasso-toolbar--link', function(e){

		$(this).toggleClass('link--drop-up');
		$('#lasso-toolbar--components').removeClass('toolbar--drop-up');
		$('#lasso-toolbar--html').removeClass('html--drop-up');

		// prevent dropup from closing
		$('#lasso-toolbar--link__wrap').live('click',function(){
			return false;
		});

		$(this).find('#lasso-toolbar--link__inner').focus();

	});

	// RESTORING LINK SELECTION
	$('.lasso-link').live('click',function(e){

		e.preventDefault();

		// prevent dropup from closing
		$('#lasso-toolbar--link__wrap').live('click',function(){
			return false;
		});

		var link = $(this).attr('href');

		$('#lasso-toolbar--link').addClass('link--drop-up');
		$('#lasso-toolbar--link__inner').text(link);
	});

	/////////////
	/// DELETING
	/////////////
	$('.lasso-delete').live('click',function(e) {

		e.preventDefault();

		var $this = $(this);

		swal({
			title: "Delete this component?",
			type: "warning",
			text: false,
			showCancelButton: true,
			confirmButtonColor: "#d9534f",
			confirmButtonText: "Yes, delete it!",
			closeOnConfirm: true
		},
		function(){

			// remove component
			$this.closest('.aesop-component').remove();

			// remove wp image if its a wp image
			$this.closest('.lasso-component').remove();

		});

	});

	/////////////
	/// CLONING
	/////////////
	$('.lasso-clone').live('click',function(e) {

		// sore reference to this
		var $this = $(this);

		e.preventDefault();

		$this.closest('.aesop-component').clone().insertAfter( $(this).parent().parent() ).hide().fadeIn()
		$this.closest('.lasso-component').clone().insertAfter( $(this).parent().parent() ).hide().fadeIn()

	});

});