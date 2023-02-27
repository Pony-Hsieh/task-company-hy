/**
 * 彈出提示訊息
 * @param {string} content - 提示訊息內容
 * @param {number} time - 顯示時間，預設為 3 秒
 */
function toast(content, time = 3000) {
    const dateTime = Date.now();
    const perform = performance.now().toFixed(0);
    const id = `${dateTime}${perform}`;
    const domEl = `
        <div class="wrapper-toast-msg" id="${id}">
            <div class="toast-msg">
                <p class="content">${content}</p>
                <div class="background"></div>
            </div>
        </div>
    `;

    // 顯示新的 toast 前，先清除目前已有的 toast
    if (
        window.arr_toast_dom_el_id
        && Array.isArray(window.arr_toast_dom_el_id)
        && window.arr_toast_dom_el_id.length !== 0
    ) {
        window.arr_toast_dom_el_id.forEach((eachId) => {
            $(`#${eachId}`).remove();
        });
        window.arr_toast_dom_el_id = [];
        window.arr_toast_dom_el_id.push(id);
    } else if (
        window.arr_toast_dom_el_id
        && Array.isArray(window.arr_toast_dom_el_id)
    ) {
        window.arr_toast_dom_el_id.push(id);
    } else {
        window.arr_toast_dom_el_id = [];
        window.arr_toast_dom_el_id.push(id);
    }

    $("body").append(domEl);
    setTimeout(function () {
        $(`#${id}`).remove();
    }, time);
}