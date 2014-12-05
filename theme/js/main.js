(function () {
    $("ul.tag-list li").on('mouseover', function () {
        /*
         $("ul.tag-list li").each(function(){
         $(this).removeClass('active');
         })
         */
        $(this).addClass('active');
    }).on('mouseout', function () {
        $(this).removeClass('active');
    });
})()
function search() {
    var q = document.getElementById("search-query");
    if (q.value != "") {
        var url = 'http://www.google.com/search?q=site:rainy.im%20' + q.value;
        if (navigator.userAgent.indexOf('iPad') > -1 || navigator.userAgent.indexOf('iPhone') > -1 || navigator.userAgent.indexOf('iPhone') > -1) {
            location.href = url;
        } else {
            window.open(url, "_blank");
        }
        return false;
    } else {
        return false;
    }
}
