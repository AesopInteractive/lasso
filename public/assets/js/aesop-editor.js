jQuery(document).ready(function($){

    $(aesop_editor.editor).contentbuilder({
        zoom: 0.85
    });

});
    function view() {
        var sHTML = $(aesop_editor.editor).data('contentbuilder').viewHtml();
        alert(sHTML);
    }