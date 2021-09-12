(function( $ ) {

	$(document).ready(function(){

		// get the attachment id from teh class wp-image-XXX, where XXX is the id of the attached iamge
		// this oly works if the image was inserted from within the wordpress post editor
		var ase_edit_frame;
		var className;

		$(document).on('click', '.lasso--wpimg-edit',function(e){

			e.preventDefault();
            
            if ($(this).parent().parent().find('img').length==0) {
                return;
            }
            var id ='';
			var selected_img
			, 	clicked = $(this)
			, 	cls 		= $(this).parent().next('img').attr('class');
            if (cls) {
                id = cls.match(/\d+/);
            }

		    className = e.currentTarget.parentElement.className;

		    // create frame
		    ase_edit_frame = wp.media.frames.ase_edit_frame = wp.media({
		      	title: lasso_editor.strings.selectImage,
		      	button: {
		        	text: lasso_editor.strings.insertImage,
		      	},
		      	multiple: false  // Set to true to allow multiple files to be selected
		    });

		    // open frame
			ase_edit_frame.on('open',function(){
				var selection = ase_edit_frame.state().get('selection');
                if (id) {
					var attachment = wp.media.attachment( id );
					attachment.fetch();
					selection.add( attachment ? [ attachment ] : [] );
                }
			});

		    // update image on select
		    ase_edit_frame.on( 'select', function() {
                // here after simple wpimg image select

		      	var attachment = ase_edit_frame.state().get('selection').first().toJSON()
		      	,	imageURL   = undefined === attachment.sizes.large ? attachment.sizes.full.url : attachment.sizes.large.url

		      	$(clicked).parent().parent().find('img').prop({
		      		'src': imageURL,
                    'srcset' :"",
		      		'alt': attachment.alt,
		      		'class': 'aligncenter size-large wp-image-'+attachment.id+''
		      	});
				//$("html").scrollTop(lasso_editor.scrollTop);
                $('#lasso-side-comp-button').remove();
                // set some figures to uneditable
                $("figure.wp-block-image, figure.lasso--wpimg__wrap").attr('contenteditable',false).attr('readonly',true);

		    });

			lasso_editor.scrollTop = $(window).scrollTop();
		    // Finally, open the modal
		    ase_edit_frame.open();

		})
	});

})( jQuery );