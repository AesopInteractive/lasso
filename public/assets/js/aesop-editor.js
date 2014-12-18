jQuery(document).ready(function($){

    $('.aesop-editable').contentbuilder({
        zoom: 0.85
    });

});
    function view() {
        var sHTML = $('.aesop-editable').data('contentbuilder').viewHtml();
        alert(sHTML);
    }