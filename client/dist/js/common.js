(function () {
    $(window).scroll(function(){
        if ($(window).scrollTop()>200) $("#pageUp").fadeIn(500);
        else $("#pageUp").fadeOut(500);
    });

    $('#pageUp').click(function () {
        $('body,html').animate({scrollTop:0},800);
    });
})();