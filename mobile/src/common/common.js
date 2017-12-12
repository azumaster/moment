(function () {
    setView(document, window, 750, 320, 40);
})();

// 设置UI基准
function setView(doc, win, maxWidth, minWidth, font) {
    var docEl = doc.documentElement,
        resizeEvt = 'resize';
    var maxwidth = maxWidth,
        minwidth = minWidth,
        font = font;
    var setSize = function () {
        var clientWidth = docEl.clientWidth;
        if (clientWidth >= minwidth && clientWidth <= maxwidth) {
            docEl.style.fontSize = font * (clientWidth / maxwidth) + 'px';
        } else if (clientWidth >= maxwidth) {
            docEl.style.fontSize = font + 'px';
        } else if (clientWidth <= minwidth) {
            docEl.style.fontSize = font * (minwidth / maxwidth) + 'px';
        }
    };
    win.addEventListener(resizeEvt, setSize, false);
    doc.addEventListener('DOMContentLoaded', setSize, false);
}