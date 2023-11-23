/** 透過 jQuery 封裝 Promise 方法 */
function ajaxPromise(options) {
    return new Promise(function (resolve, reject) {
        $.ajax(options)
            .done(resolve)
            .fail(reject);
    });
}


/** 是否在指定的時間區間內
 * @param {string} beginDateStr - 開始時間
 * @param {string} endDateStr - 結束時間
 * @return {boolean} true: 在區間內； false: 不在區間內
 */
function isDuringDate(beginDateStr, endDateStr) {
    const curDate = new Date();
    const beginDate = new Date(beginDateStr);
    const endDate = new Date(endDateStr);
    if (curDate >= beginDate && curDate <= endDate) {
        return true;
    }
    return false;
}


/** 查詢 query string 中是否包含特定 name
 * @param {string} name - 要查詢的 name
 * @return {string} 如果有，則回傳該 name 對應的 value(型別必為 string)；如果沒有，則回傳 ""
 */
function getQueryString(name) {
    const res = new URL(window.location.href).searchParams.get(name);
    return res ? res : "";
}


/** 產生隨機字串
 * - 由大小寫英文字母及數字組成
 * @param {number} 產生的隨機字串長度
 * @return {string} 回傳指定長度的隨機字串
 */
function generateRandomString(num) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let res = "";
    const charactersLength = characters.length;
    for (let i = 0; i < num; i++) {
        res += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return res;
}


/** 用 "&" 串接物件的 key value
 * - 依據物件的 key 值首個字元的 ASCII Code 升序排序
 * @param {Object} 要被拼接 key value 的物件
 * @return {string} 拼接後的字串 - 回傳 key1=value1&key2=value2 ......
 */
function concatObjectKeyValueWithAnd(obj) {
    const res = [];
    Object.keys(obj).sort().forEach((key) => {
        res.push(`${key}=${obj[key]}`);
    });
    return res.join("&");
}


/** 獲取特定 cookie 的值
 * @param {string} name - 要查詢的 cookie
 * @return {string}
 * 資料來源：https://stackoverflow.com/questions/10730362/get-cookie-by-name
 * 解釋這個 function：https://devsheet.com/javascript-function-to-get-cookie-value-by-name/
 */
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop().split(";").shift();
    }
    return "";
}


/** 判斷移動端作業系統
 * @return {"android" | "ios" | false} - 
 */