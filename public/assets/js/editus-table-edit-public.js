jQuery(document).ready(function($){
	'use strict';
	if (typeof lasso_editor !== 'undefined') {

		// JAVASCRIPT (jQuery)
		var enable = false;
		var table;
		var tableWidth;
		var col;
		var row;
		
		if (lasso_editor.enterEditorHookArray) {
			lasso_editor.enterEditorHookArray.push(whenEnterEditor);
		} else {
			lasso_editor.enterEditorHookArray = [whenEnterEditor];
		}
	  
		if (lasso_editor.exitEditorHookArray) {
			lasso_editor.exitEditorHookArray.push(whenExitEditor);
		} else {
			lasso_editor.exitEditorHookArray = [whenExitEditor];
		}

		// Trigger action when the contexmenu is about to be shown
		$(document).bind("contextmenu", function (event) {
			if (enable && (event.target.nodeName =="TH" || event.target.nodeName =="TD" )) {
				// Avoid the real one
				event.preventDefault();
				var cell = event.target;
				table = cell.parentNode.parentNode;
				tableWidth = $(table).find("tr:first td").length;
				col = $(cell).parent().children().index($(cell));
				row = $(cell).parent().parent().children().index($(cell).parent());
				if (!tableWidth) {
					tableWidth = $(table).find("tr:first th").length;
				}
				
				// Show contextmenu
				$(".editus-table-menu").finish().toggle(100).
				
				// In the right position (the mouse)
				css({
					top: event.pageY + "px",
					left: event.pageX + "px"
				});
				
				// If the menu element is clicked
				$(".editus-table-menu li").on('click',function(){
					// This is the triggered action name
					if (!table) return;
					switch($(this).attr("data-action")) {
						
						// A case for each action. Your actions here
						case "insertcol": addColumn(col); break;
						case "insertrow": addRow(row); break;
						case "delcol": deleteColumn(col); break;
						case "delrow": deleteRow(row); break;
                        case "deltable": deleteTable(); break;
					}
					
					articleMedium.makeUndoable();
					table = 0;
				  
					// Hide it AFTER the action was triggered
					$(".custom-menu").hide(100);
				
				});
			}
		});


		// If the document is clicked somewhere
		$(document).bind("mousedown", function (e) {
			
			// If the clicked element is not the menu
			if (!$(e.target).parents(".editus-table-menu").length > 0) {
				
				// Hide it
				$(".editus-table-menu").hide(100);
			}
		});


		
		
		function addColumn(n) {
			$(table).find('tr').each(function(){
			//$("tr").each(function() {
				$(this).find('th').eq(n).after('<th>new cell added</th>');
				$(this).find('td').eq(n).after('<td>new cell added</td>');
			});
			tableWidth = $(table).find("tr:first td").length;
		}
		
		function addRow(n) {
			var str = '<tr>';
			for (var i =0; i<tableWidth;i++) {
				str += '<td>New Cell</td>';
			}
			str += '</tr>';
			$(table).find('tr').eq(n).after(str);
		}
		
		function deleteColumn(n) {
			$(table).find('tr').each(function(){
			//$("tr").each(function() {
				$(this).find('th').eq(n).remove();
				$(this).find('td').eq(n).remove();
			});
			tableWidth = $(table).find("tr:first td").length;
		}
		
		function deleteRow(n) {
			$(table).find('tr').eq(n).remove();
		}
        
        function deleteTable() {
			$(table).remove();
		}
		
		function whenExitEditor(){
		  enable = false;
		}
	  
		function whenEnterEditor(){
		  enable = true;
		}
	}

});