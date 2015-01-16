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
	$('#aesop-toolbar--components').live('click',function(){

		$(this).toggleClass('toolbar--drop-up');
		$('#aesop-toolbar--html').removeClass('html--drop-up');

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

	$('#aesop-toolbar--html').live('mousedown',function(){
		if( ! $(this).hasClass('html--drop-up') ) {
			var article = document.getElementById(aesop_editor.editor);
			window.selRange = saveSelection();
			if( typeof window.selRange === 'undefined' || null == window.selRange ) {
				article.highlight();
				window.selRange = saveSelection();
			}
		}
	});

	$('#aesop-toolbar--html__inner').live('focusout',function(){
		restoreSelection(window.selRange);
	});

	$('#aesop-toolbar--html__inner').live('focus',function(){
		if ( $(saveSelection().commonAncestorContainer).parents('#aesop-editor--content').length != 0 ) {
			window.selRange = saveSelection();
		}
	});


	$('#aesop-toolbar--html').live('click',function(e){

		$(this).toggleClass('html--drop-up');
		$('#aesop-toolbar--components').removeClass('toolbar--drop-up');

		// prevent dropup from closing
		$('#aesop-toolbar--html__wrap').live('click',function(){
			return false;
		});

		$(this).find('#aesop-toolbar--html__inner').focus();

	});

	$('.aesop-toolbar--html__cancel').live('click',function(){

		$(this).closest('li').removeClass('html--drop-up');

	});
	/////////////
	/// DELETING
	/////////////
	$('.aesop-delete').live('click',function(e) {

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
			$this.closest('.aesop-editor--wpimg__wrap').remove();

		});

	});

	/////////////
	/// CLONING
	/////////////
	$('.aesop-clone').live('click',function(e) {

		// sore reference to this
		var $this = $(this);

		e.preventDefault();

		$this.closest('.aesop-component').clone().insertAfter( $(this).parent().parent() ).hide().fadeIn()
		$this.closest('.aesop-editor--wpimg__wrap').clone().insertAfter( $(this).parent().parent() ).hide().fadeIn()

	});

});