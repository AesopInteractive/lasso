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
	/*$('#aesop-toolbar--html').live('hover',function(e){
		e.preventDefault();

		var article = document.getElementById(aesop_editor.editor);
		article.focus();

		selRange = saveSelection();
		if ( null == selRange ) {
			selRange = saveSelection();
		}
		console.log(selRange);
	});*/

	$('#aesop-toolbar--html').live('mousedown',function(){
		var article = document.getElementById(aesop_editor.editor);
		article.focus();
		if( typeof selRange === 'undefined' || null == selRange ) {
			selRange = saveSelection();
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
	var ajaxurl =  aesop_editor.ajaxurl;

	$('.aesop-delete').live('click',function(e) {

		// sore reference to this
		var $this = $(this);

		e.preventDefault();

		var data = {
			action: 'process_delete_component',
			nonce: 	$this.data('nonce'),
			postid: $this.data('postid'),
			unique: $this.closest('.aesop-component').data('unique'),
			type:   $this.closest('.aesop-component').data('component-type')
		}

		var deleteComponent = function() {

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
				$this.closest('.aesop-component').remove();
			});
		}

		$.post( ajaxurl, data, function(response) {

			console.log(response);

			if( response == 'success' ) {

				console.log('success');

				deleteComponent();

			} else if( 'error' == response ) {

				alert('error');
				console.log('error');

			}


		});


	});

	/////////////
	/// CLONING
	/////////////
	$('.aesop-clone').live('click',function(e) {

		// sore reference to this
		var $this = $(this);

		e.preventDefault();

		$this.closest('.aesop-component').clone().insertAfter( '.aesop-component' ).hide().fadeIn()

	});

});