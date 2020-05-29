jQuery(document).ready(function($){

	var ajaxurl 	=  lasso_editor.ajaxurl,
		save    	=  $('.lasso--controls__right a'),
		editor 		=  lasso_editor.editor,
		postid 		=  lasso_editor.postid,
		oldHtml 	=  $('#'+editor).html(),
		warnNoSave 	=  'You have unsaved changes!';
		
	// Set to true when we want to reload the current page without a warning message
	noWarningReload = false;

	///////////////////////
	// 1. IF UNSAVED CHANGES STORE IN LOCAL STORAGE
	// @todo - need to account for component on the page this only accounts for text
	///////////////////////
	//$('#'+editor).live('change',function(){
	jQuery(document).on('change', '#'+editor, function(){

		var $this = $(this),
			newHtml = $this.html();

		if ( oldHtml !== newHtml ) {

			localStorage.setItem( 'lasso_backup_'+postid , newHtml );
		}

	});

	///////////////////////
	// 2. WARN THE USER IF THEY TRY TO NAVIGATE AWAY WITH UNSAVED CHANGES
	///////////////////////
	window.onbeforeunload = function () {

		if ( localStorage.getItem( 'lasso_backup_'+postid ) && lasso_editor.userCanEdit ) {
        	return warnNoSave;
        	$('#lasso--save').css('opacity',1);
        }
    }
	
	// but also clear the unsaved changes if the user does navigate away
	window.onunload = function () {
		if ( localStorage.getItem( 'lasso_backup_'+postid ) && lasso_editor.userCanEdit ) {
        	localStorage.clear();
        }
    }
    
    function process_html(html, do_shortcodify) {
        	
		// take care of twitter widget
		html = process_twitter(html);
			
	    // remove objects to ignore if they are not removed already
		if (lasso_editor.showIgnoredItems ) {
			var $temp = $('<div></div>').html( html );
			$temp.find(lasso_editor.objectsNoSave).remove();
			$temp.find(lasso_editor.supportedNoSave).remove();
			html = $temp.html();
		}	
		
		// remove extra classes
		{
			var $temp = $('<div></div>').html( html );
			$temp.find("a").removeClass("lasso-link");
			$temp.find("span").removeClass("lasso-span");
			$temp.find("h2").removeClass("lasso-h2");
			$temp.find("h3").removeClass("lasso-h3");
			$temp.find(".lasso-noclass").removeClass("lasso-noclass");
			$temp.find(".lasso-undeletable").removeClass("lasso-undeletable");
			$temp.find(".lasso-component--controls, .aesop-events-edit").remove();
			
			$temp.find('*[class=""]').removeAttr('class');
			
			html = $temp.html();
		}
		
		// remove all contenteditable attr
		html = removeEditable(html);
		
		// if custom fields
		if (lasso_editor.customFields) {
			saveCustomFields(html);
		}
		
		// shortcode ultimate
		html = shortcodify_su(html);
		
		// shortcode aesop
		html = do_shortcodify ? shortcodify(html) : html;
		
		
		
		// restore other shortcodes to the original shortcodes
		html = replace_rendered_shortcodes( html );

		// avia editor
		if (lasso_editor.aviaEditor) {
			html = shortcodify_avia(html);
		}
        
        // WordPress Block
        if (lasso_editor.hasGutenberg) {
            html = process_gutenberg(html);
        }
        
        // if multi page
        if (lasso_editor.multipages != "-1") {
            var res = lasso_editor.post_content.split("<!--nextpage-->");
            var html2 = "";
            res[parseInt(lasso_editor.multipages)] = html;
            html = res.join("<!--nextpage-->");
        }
        
        // any user supplied filters
	
		if (lasso_editor.filterArray) {
			$(lasso_editor.filterArray).each(function(key, val){
				html = val(html );
			});
		}
        
        return html
    }

	///////////////////////
	// 3. SAVE OR PUBLISH OBJECT
	///////////////////////
	//$('.lasso--controls__right a:not(#lasso--exit)').live('click',function(e) {
	//jQuery(document).on('click', '.lasso--controls__right a:not(#lasso--exit)', function(e){
	//jQuery('.lasso--controls__right a:not(#lasso--exit)').on('click', function(e){
	jQuery(document).on('click','#lasso--save, #lasso--publish', function(e){

		var warnNoSave = null;

		e.preventDefault();

		// sore reference to this
		var $this = $(this);

		// unwrap wp images
		$(".lasso--wpimg__wrap").each(function(){

			if ( !$(this).hasClass('wp-caption') ) {

				$(this).children().unwrap()

			}

			$('.lasso-component--controls').remove();
		});

		// unwrap custom components
		$('.lasso-component').each(function(){
			$('.lasso-component--controls').remove();
		});

		// unwrap map from hits drag holder
		$('#lasso--map-form').each(function(){

			var $this = $(this)

			$this.find('.lasso-component--controls, .lasso--map-form__footer ').remove()

			$this.children().unwrap()
		});

		// if tehre are any scrollnav sections we need to break them open so the editor doesnt save the html
		$('.scroll-nav__section').each(function(){
			$(this).children().unwrap();
		})

		// remoe any notices
		$('#lasso--notice').remove();
        
        		// let user know someting is happening on click
		$(this).addClass('being-saved');

		// get the html from our div
		var html = $('#'+editor).html(),
			postid = lasso_editor.postid;
		if (!html) return;
        
        html =  process_html(html, $this.hasClass('shortcodify-enabled'));
		
		
		
		
		
		// gather the data
		var data      = {
			action:    	($this.hasClass('lasso-publish-post') && lasso_editor.can_publish) ? 'process_save_publish-content' : 'process_save_content',
			author:  	lasso_editor.author,
			content: 	html,
			post_id:   	postid,
			nonce:     	lasso_editor.nonce
		};
		
		

		// intercept if publish to confirm
		if ( $this.hasClass('lasso-publish-post') ) {	
			if (lasso_editor.publishHandler) {
				// custom publish handler
				lasso_editor.publishHandler(data);
			} else {
				swal({
					title: lasso_editor.strings.publishPost,
					type: "info",
					text: false,
					showCancelButton: true,
					confirmButtonColor: "#5bc0de",
					confirmButtonText: lasso_editor.strings.publishYes,
					closeOnConfirm: true
				},
				function(){
					runSavePublish(true)

				});
				
			}

		} else {

			runSavePublish(false)

		}
        
        function process_html(html, do_shortcodify) {
        	
            // take care of twitter widget
            html = process_twitter(html);
                
            // remove objects to ignore if they are not removed already
            if (lasso_editor.showIgnoredItems ) {
                var $temp = $('<div></div>').html( html );
                $temp.find(lasso_editor.objectsNoSave).remove();
                $temp.find(lasso_editor.supportedNoSave).remove();
                html = $temp.html();
            }	
            
            // remove extra classes
            {
                var $temp = $('<div></div>').html( html );
                $temp.find("a").removeClass("lasso-link");
                $temp.find("span").removeClass("lasso-span");
                $temp.find("h2").removeClass("lasso-h2");
                $temp.find("h3").removeClass("lasso-h3");
                $temp.find(".lasso-noclass").removeClass("lasso-noclass");
                $temp.find(".lasso-undeletable").removeClass("lasso-undeletable");
                $temp.find(".lasso-component--controls, .aesop-events-edit").remove();
                
                $temp.find('*[class=""]').removeAttr('class');
                
                html = $temp.html();
            }
            
            // remove all contenteditable attr
            html = removeEditable(html);
            
            // if custom fields
            if (lasso_editor.customFields) {
                saveCustomFields(html);
            }
            
            // shortcode ultimate
            html = shortcodify_su(html);
            
            // shortcode aesop
            html = do_shortcodify ? shortcodify(html) : html;
            
            
            
            // restore other shortcodes to the original shortcodes
            html = replace_rendered_shortcodes( html );

            // avia editor
            if (lasso_editor.aviaEditor) {
                html = shortcodify_avia(html);
            }
            
            // WordPress Block
            if (lasso_editor.hasGutenberg) {
                html = process_gutenberg(html);
            }
            
            // if multi page
            if (lasso_editor.multipages != "-1") {
                var res = lasso_editor.post_content.split("<!--nextpage-->");
                var html2 = "";
                res[parseInt(lasso_editor.multipages)] = html;
                html = res.join("<!--nextpage-->");
            }
            
            // any user supplied filters
        
            if (lasso_editor.filterArray) {
                $(lasso_editor.filterArray).each(function(key, val){
                    html = val(html );
                });
            }
            
            return html
        }

		
		function removeComment(content) {
			return content.replace(/<!--[\s\S]*?-->/g, "");
		}
		
		function removeEditable(content) 
		{	
			return content.replace(/contenteditable="(false|true)"/g, "");
		}
		
		// gather the custom field data and save to lasso_editor.cftosave

		function saveCustomFields(content) {
			var data ={};
			var customFields = lasso_editor.customFields;
			for (var key in customFields) {
				var selector ='';
				var html = false;
				var isimgurl = false;
				if (typeof(lasso_editor.customFields[key]) == 'object') {
					selector = customFields[key]['selector'];
					html = customFields[key]['html'];
					isimgurl = customFields[key]['imgurl'];
				} else {
					selector =customFields[key];
				}
				var arr = $(document).find(selector);
				if (arr.length) {
					if (html) {
						data[key] = arr[0].innerHTML.replace(/[\n\r]/g, '');;
					} else if (isimgurl) {
						data[key] = $(arr[0]).attr('src');
					} else {
						data[key] = arr[0].innerText;//.replace(/[\n\r]/g, '');
					}
				}
			}
			lasso_editor.cftosave = data;
		}

		/**
		 	* Turn content html into shortcodes
		 	* @param  {[type]} content  [description]
		 	* @param  {[type]} selector [description]
		 	* @return {[type]}          [description]
		*/
		function shortcodify(content,selector){

			// Convert the html into a series of jQuery objects
			var j = $.parseHTML(content);
			var processed = '';
			if (j == null) {
				return content;
			}

			// Iterate through the array of dom objects
			for (var i = 0; i < j.length; i++) {

	    		var component = $(j[i]);

	    		// If it's not a component, move along
	    		if ( !component.hasClass('aesop-component') ) {
					
					if(component.find('.aesop-component').length !== 0) {
						// if there is an aesop component in a child, recursively process it
						var comp_content = component.html();
						comp_content = shortcodify(comp_content);
						component.html(comp_content);
						processed += component.clone().wrap('<p>').parent().html();;
					} else   			// Let's test what kind of object it is
	    			if ( component.context.nodeType == 3 ) {
	    				// Text only object without dom
	    				processed += j[i].data;
	    			} else if ( component.context.nodeType == 8 ) {
	    				processed += '<!--' + j[i].data + '-->';
	    			} else {
	    				// DOM object
	    				processed += j[i].outerHTML;
	    			}
	    			continue;
	    		}

	    		var data = component.data();
	    		var params = '';

	    		// It's a component, let's check to make sure it's defined properly
				if ( data.hasOwnProperty('componentType') ) {

					for ( var index in data ) {

						// Don't accept componentType as a param
						if ( !data.hasOwnProperty(index) || index == 'componentType' ) {
							continue;
						}

						// Build the params string out of the data attributes
						params += " " + index + '="' + data[index] + '"';

					}

					var sc = '[aesop_' + data.componentType + params + ']';

					// Let's check to see if it's a "full" shortcode
					var inner = component.find('.aesop-component-content-data');

					if ( inner.length != 0 ) {
						sc += inner[0].innerHTML + "[/aesop_" + data.componentType + "]";
					}

					processed += sc;

				}

			}

			return processed;

		}
		
		function process_twitter(html)
		{
			// if twitter widget doesn't exist return
			if (!html) return null;
			if (html.indexOf("twitterwidget") ==-1) return html;
			var t = $('#'+editor).clone();
			var t1 = t.find('twitterwidget');
			var t2 = $('#'+editor).find('twitterwidget');
			var i;
			for (i = 0; i<t1.length; i++) {
				var t5 = $('<div></div>').html(t2[i].shadowRoot.innerHTML).find('.EmbeddedTweet').data('click-to-open-target');
				$(t1[i]).replaceWith(t5);
			}
			
			var html2 = t.html();
			return html2;
		}
		
		//shortcode ultimates
		function shortcodify_su(content,selector){

			// Convert the html into a series of jQuery objects
			var j = $.parseHTML(content);
			var processed = '';

			// Iterate through the array of dom objects
			for (var i = 0; i < j.length; i++) {

	    		var component = $(j[i]);

	    		// If it's not a component, move along
	    		if ( !component.hasClass('su-box') &&  !component.hasClass('su-note') && !component.hasClass('su-document') && !component.hasClass('su-spoiler')) {

	    			// Let's test what kind of object it is
	    			if ( component.context.nodeType == 3 ) {
	    				// Text only object without dom
	    				processed += j[i].data;
	    			} else if ( component.context.nodeType == 8 ) {
	    				processed += '<!--' + j[i].data + '-->';
	    			} else {
	    				// DOM object
	    				processed += j[i].outerHTML;
	    			}
	    			continue;
	    		}
				
				
				if ( component.hasClass('su-box')) {
					var box_title = component.find('.su-box-title')[0].innerHTML;
					var box_content = component.find('.su-box-content')[0].innerHTML;
					var box_color = component.find('.su-box-title')[0].style.backgroundColor;
					var sc = '[su_box title="'+box_title+'"'+' box_color="' +box_color+'"]' + box_content+'[/su_box]';
					processed += sc;
					
				} else if ( component.hasClass('su-note')) {
					var note_content = component.find('.su-note-inner')[0].innerHTML;
					note_content = shortcodify_su(note_content);
					var note_color = component.find('.su-note-inner')[0].style.backgroundColor;
					var text_color = component.find('.su-note-inner')[0].style.color;
					var sc = '[su_note note_color="'+ note_color + '" text_color="'+text_color +'"]' + note_content+'[/su_note]';
					processed += sc;
					
				} else if ( component.hasClass('su-document')) {
					
					var ifr = component.find('iframe.su-document')[0];
					var url = getParameterByName("url",ifr.src);
					var width = ifr.width;
					var height = ifr.height;
					var sc = '[su_document url="'+ url + '" width="'+ width +'" height="' + height+'"]';
					processed += sc;
					
				} else if ( component.hasClass('su-spoiler')) {
					var spoiler_content = component.find('.su-spoiler-content')[0].innerHTML;
					spoiler_content = shortcodify_su(spoiler_content);
					var title = component.find('.su-spoiler-title')[0].textContent;
					
					var sc = '[su_spoiler title="'+ title + '" style="fancy" open="no"]' + spoiler_content+'[/su_spoiler]';
					processed += sc;
					
				}		

			}

			return processed;
		}
        
        function process_gutenberg(content){
			// Convert the html into a series of jQuery objects
			var k = $.parseHTML(content);
			var processed = '';
			if (k == null) {
				return content;
			}
            
            j =  $('<div>').append($(k).clone())
            // columns
            $(j).find(".wp-block-column").before("<!-- wp:column -->" );
            $(j).find(".wp-block-column").after("<!-- /wp:column -->" );
            $(j).find(".wp-block-columns").before("<!-- wp:columns -->" );
            $(j).find(".wp-block-columns").after("<!-- /wp:columns -->" );
            $(j).find("p").before("<!-- wp:paragraph -->" );
            $(j).find("p").after("<!-- /wp:paragraph -->" );
            
            
            // spacer
            $(j).find(".wp-block-spacer").before("<!-- wp:spacer -->" );
            $(j).find(".wp-block-spacer").after("<!-- /wp:spacer -->" );
            
            // separator
            $(j).find(".wp-block-separator").before("<!-- wp:separator  -->" );
            $(j).find(".wp-block-separator").after("<!-- /wp:separator  -->" );
            
            var html = $(j).html(); 
            return html;
        }
		
		//shortcode avia layout editor
		function shortcodify_avia(content,selector){
			// Convert the html into a series of jQuery objects
			var j = $.parseHTML(content);
			var processed = '';

			// Iterate through the array of dom objects
			for (var i = 0; i < j.length; i++) {

	    		var component = $(j[i]);

	    		// If it's not a component, move along
	    		if ( !component.hasClass('av_textblock_section') && !component.hasClass('av_toggle_section') && !component.hasClass('togglecontainer')) {

	    			// Let's test what kind of object it is
	    			if ( component.context.nodeType == 3 ) {
	    				// Text only object without dom
	    				processed += j[i].data;
	    			} else if ( component.context.nodeType == 8 ) {
	    				processed += '<!--' + j[i].data + '-->';
	    			} else {
	    				// DOM object
	    				processed += j[i].outerHTML;
	    			}
	    			continue;
	    		}
				
				
				if ( component.hasClass('av_textblock_section')) {
					var box_text = component.find('.avia_textblock')[0].innerHTML;
					var sc = '[av_textblock]' + box_text+'[/av_textblock]';
					processed += sc;
					
				} else if ( component.hasClass('togglecontainer')) {
					
					var content = component[0].innerHTML;
					var mode ="accordion";
					content = shortcodify_avia(content);
					if (component[0].hasClass('enable_toggles')) {
						mode = "toggle";
					}
					var sc = "[av_toggle_container mode='"+mode+"']" + content+'[/av_toggle_container]';
					processed += sc;
					
				} else if ( component.hasClass('av_toggle_section')) {
					var toggle_title = component.find('.toggler')[0].innerText;
					var toggle_content = component.find('.toggle_content')[0].innerHTML;
					var sc = '[av_toggle title="'+toggle_title+'"]' + toggle_content+'[/av_toggle]';
					processed += sc;
					
				}

			}

			return processed;
		}
		
		function replace_rendered_shortcodes( content ) {
			// also remove scripts
			content = content.replace(/<script.*>.*<\/script>/g, " ");
			
			if ( content.indexOf('--EDITUS_OTHER_SHORTCODE_START|' ) == -1) {
				return content;
			}

			var re = /<!--EDITUS_OTHER_SHORTCODE_START\|\[([\s\S]*?)\]-->([\s\S]*?)<!--EDITUS_OTHER_SHORTCODE_END-->/g ;
			content = content.replace(re,'$1');
			
			return content;
		}
		
		// Save post using REST API V2
		function savePublishREST(postid, title, subtitle, content_, type_,status_,forcePublish){
			
			var data      = {
				content: 	content_,
				status: status_
			};
			if (lasso_editor.aviaEditor) {
				data['content'] ="";
				data['metadata'] = { '_aviaLayoutBuilderCleanData': content_};
			}
			
			//custom fields to save
			if (lasso_editor.cftosave) {
				if (!data['metadata']) {
					data['metadata']=  lasso_editor.cftosave;
				} else {
					Object.assign(data['metadata'], lasso_editor.cftosave);
				}
			}
			
			var type;
			if (type_=="post") {
				type = "posts";
			} else if (type_=="page"){
				type = "pages";
			} else {
				type = type_;
			}
			if (title.length>0) {
				data['title'] = title;
			}
			if (subtitle.length>0) {
				data['metadata'] = { '_subtitle': subtitle};
			}
			
			if (lasso_editor.disableSavePost == 'on') {
				delete data['content'];
			}
			
			$.ajax({
				method: "POST",
				url: lasso_editor.rest_root + 'wp/v2/'+type+'/'+postid,
				data: data,
				beforeSend: function ( xhr ) {
					xhr.setRequestHeader( 'X-WP-Nonce', lasso_editor.rest_nonce );
				},
				success : function( response ) {
					saveSuccess();
                    if (forcePublish) {
                        var data = {
                            action: 		'editus_publish_post',
                            postid: 		lasso_editor.postid
                        }

                        $.post( lasso_editor.ajaxurl2, data);
                    }
				},
				error : function (xhr, exception) {
					console.log( xhr );
					alert("AJAX Error: "+xhr.responseText );
					$('#lasso--save').removeClass('being-saved').addClass('lasso--error');	
				}
			});
		}
		
		// code to run when post saving is successful
		function saveSuccess() {
			// change button class to saved
			$('#lasso--save').removeClass('being-saved').addClass('lasso--saved');

			// if this is being published then remove the publish button afterwards
			if ( $this.hasClass('lasso-publish-post') ) {
				$this.remove();
			}

			// wait a bit then remvoe the button class so they can save again
			setTimeout(function(){
				$('#lasso--save').removeClass('lasso--saved');

				if ( $this.hasClass('lasso-publish-post') ) {
					location.reload()
				}

			},1200);

			// then remove this copy from local stoarge
			localStorage.removeItem( 'lasso_backup_'+postid );
			lasso_editor.dirtyByComponent = false;
			articleMedium.dirty = false;
			if (lasso_editor.saveSuccessHookArray) {
				$(lasso_editor.saveSuccessHookArray).each(function(key, val){
					val();
				});
			}
		}
		

		// make the actual ajax call to save or publish
		function runSavePublish(forcePublish){
			if (lasso_editor.saveusingrest) {
				// get the status of the post (published/draft)
				var status_ = $('.lasso--controls__right').data( "status" );
				var title="";
				if ($(lasso_editor.titleClass).length>0) {
					title = $(lasso_editor.titleClass)[0].innerText;
				}
				var subtitle="";
				if ($(lasso_editor.subtitleClass).length>0) {
					subtitle = $(lasso_editor.subtitleClass)[0].innerText;
				}
				if (forcePublish) {
					status_ = "publish";				
					if (!lasso_editor.can_publish) {
						status_ = "pending";
					}
				}
				savePublishREST(lasso_editor.postid, title, subtitle, data.content, $('.lasso--controls__right').data( "posttype" ), status_, forcePublish);
				return;
			}
			
			$.post( ajaxurl, data, function(response) {

				if( true == response.success ) {
					saveSuccess();
				} else {
					$('#lasso--save').removeClass('being-saved').addClass('lasso--error');
				}

			}).fail(function(xhr, err) { 
				var responseTitle= $(xhr.responseText).filter('title').get(0);
				alert($(responseTitle).text() + "\n" + EditusFormatAJAXErrorMessage(xhr, err) );
				$('#lasso--save').removeClass('being-saved').addClass('lasso--error');				
			});
		}

	});
	
	
	jQuery(document).on('click','#lasso--post-delete', function(e){
		e.preventDefault();
		var $this = $(this);
		swal({
			title: lasso_editor.strings.deletePost,
			type: "error",
			text: false,
			showCancelButton: true,
			confirmButtonColor: "#d9534f",
			confirmButtonText: lasso_editor.strings.deleteYes,
			closeOnConfirm: true
		},
		function(){

			var data = {
				action: 		'editus_delete_post',
				postid: 		lasso_editor.postid,
				nonce: 			lasso_editor.deletePost
			}

			$.post( lasso_editor.ajaxurl2, data, function(response) {
				//load home page after deleting the post
				window.location.assign(lasso_editor.siteUrl);
			}).fail(function(xhr, err) { 
				var responseTitle= $(xhr.responseText).filter('title').get(0);
				alert($(responseTitle).text() + "\n" + EditusFormatAJAXErrorMessage(xhr, err) );
			});


		});
	});
});

function EditusFormatAJAXErrorMessage(jqXHR, exception) {
	if (jqXHR.status === 0) {
		return ('AJAX Error: Not connected.\nPlease verify your network connection.');
	} else if (jqXHR.status == 404) {
		return ('AJAX Error: The requested page not found. [404]');
	} else if (jqXHR.status == 500) {
		return ('AJAX Error: Internal Server Error [500].');
	} else if (exception === 'parsererror') {
		return ('AJAX Error: Requested JSON parse failed.');
	} else if (exception === 'timeout') {
		return ('AJAX Error: Time out error.');
	} else if (exception === 'abort') {
		return ('AJAX Error: Ajax request aborted.');
	} else {
		return ('AJAX Error: Uncaught Error.\n' + jqXHR.responseText);
	}
}
