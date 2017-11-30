(function () {
    particlesJS.load('particles', '/json/particles.json', function () {
        console.log('callback - particles.js config loaded');
    });

    window.onload = function () {
        $('.page-main').css({display: 'flex'});
    };
    
    // 滑动到顶部
    toTop();
    
    // 检测设备
    checkDevice();
})();

function checkDevice() {
    var sUserAgent = navigator.userAgent.toLowerCase();
    var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
    var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
    var bIsMidp = sUserAgent.match(/midp/i) == "midp";
    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    var bIsAndroid = sUserAgent.match(/android/i) == "android";
    var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
    var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
    if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
        // 移动端
        document.writeln("phone");
    } else {
        // PC端
    }

}

function toTop() {
    $(window).scroll(function(){
        if ($(window).scrollTop()>200) $("#pageUp").fadeIn(500);
        else $("#pageUp").fadeOut(500);
    });

    $('#pageUp').click(function () {
        $('body,html').animate({scrollTop:0},800);
    });
}