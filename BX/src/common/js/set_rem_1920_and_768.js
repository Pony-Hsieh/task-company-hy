(function (doc, win) {
    const docEl = doc.documentElement;
    // 手机旋转事件
    // 大部分手机浏览器都支持 onorientationchange
    // 如果不支持，可以使用原始的 resize
    const resizeEvt = "orientationchange" in window ? "orientationchange" : "resize";
    function recalc() {
        // clientWidth: 获取对象可见内容的宽度；不包括滚动条，不包括边框
        const clientWidth = docEl.clientWidth;
        if (!clientWidth) {
            return;
        }
        if (window.innerWidth <= 768) {
            document.documentElement.style.fontSize = clientWidth / 7.68 + "px";
        } else if (window.innerWidth >= 1920) {
            document.documentElement.style.fontSize = 1920 / 19.2 + "px";
        } else {
            document.documentElement.style.fontSize = clientWidth / 19.2 + "px";
        }
    };
    recalc();
    // 判断是否支持监听事件 ，不支持则停止
    if (!doc.addEventListener) {
        return;
    };
    // 注册翻转事件
    win.addEventListener(resizeEvt, recalc, false);
})(document, window);
