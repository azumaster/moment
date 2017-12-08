(function () {
    particlesJS.load('particles', '/json/particles.json', function () {
        console.log('callback - particles.js config loaded');
    });

    window.onload = function () {
        $('.page-main').css({display: 'flex'});
    };
    
    // 滑动到顶部
    toTop();

})();

// 回到顶部
function toTop() {
    $(window).scroll(function(){
        if ($(window).scrollTop()>200) $("#pageUp").fadeIn(500);
        else $("#pageUp").fadeOut(500);
    });

    $('#pageUp').click(function () {
        $('body,html').animate({scrollTop:0},800);
    });
}

// Dom准备好
$(document).ready(function () {
    $('#pageLeft, #pageLoading').css({'min-height': (window.innerHeight - 280) + 'px'});
})

// 数据加载完毕
window.onload = function () {

    setTimeout(function () {
        $('.page-loading').fadeOut();
        $('.page-main').fadeIn().css({'display': 'flex'});
        window.scrollTo(0, 0);
    }, 1000)

}