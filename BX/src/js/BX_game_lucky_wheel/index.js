// 引入 dayjs isBetween 擴充功能
dayjs.extend(window.dayjs_plugin_isBetween);

// 轉盤獎項圖片
const arrPrizeImg = [
    // 黃金
    {
        src: "../../BX/src/images/BX_game_lucky_wheel/prize-gold.png",
        width: "2rem",
        top: "0"
    },
    // 指數
    {
        src: "../../BX/src/images/BX_game_lucky_wheel/prize-index.png",
        width: "2rem",
        top: "0"
    },
    // 原油
    {
        src: "../../BX/src/images/BX_game_lucky_wheel/prize-crude-oil.png",
        width: "2rem",
        top: "0"
    },
    // 先贈3美元
    {
        src: "../../BX/src/images/BX_game_lucky_wheel/prize-us-dollar.png",
        width: "2rem",
        top: "0"
    },
    // 再接再勵
    {
        src: "../../BX/src/images/BX_game_lucky_wheel/prize-again.png",
        width: "2rem",
        top: "0"
    },
    // 銘謝惠顧
    {
        src: "../../BX/src/images/BX_game_lucky_wheel/prize-thanks.png",
        width: "2rem",
        top: "0"
    },

];

// 錯誤提示訊息
const objErrorMessage = {
    failToDraw: "未能成功抽奖，请稍后再试",
    networkBusy: "目前网路繁忙，请稍后再试",
    remindToLogin: "请先登陆！",
    contactCustomerService: "抽奖失败，请联系客服",
};

// 獎項名稱：
const prizeName0 = "gold";
const prizeName1 = "index";
const prizeName2 = "crudeOil";
const prizeName3 = "usDollar";
const prizeName4 = "again";
const prizeName5 = "thanks";

// 這次抽到哪個獎項
let getPrizeNumber = null;

// 獎項名稱
let getPrizeName = null;

// 輪盤抽獎套件
const myLuckyWheel = new LuckyCanvas.LuckyWheel('#my-lucky-wheel', {
    width: "6.4rem",
    height: "6.4rem",
    blocks: [{
        padding: "0.7rem",
        imgs: [{
            src: "../../BX/src/images/BX_game_lucky_wheel/bg-wheel.png",
            width: "100%",
            height: "100%"
        }]
    }],
    prizes: [
        // 黃金 0
        {
            background: "#F8EAC6",
            imgs: [arrPrizeImg[0]],
        },
        // 指數 1
        {
            background: "#fff",
            imgs: [arrPrizeImg[1]],
        },
        // 再接再勵 2
        {
            background: "#F8EAC6",
            imgs: [arrPrizeImg[4]],
        },
        // 原油 3
        {
            background: "#fff",
            imgs: [arrPrizeImg[2]],
        },
        // 先贈3美 4
        {
            background: "#F8EAC6",
            imgs: [arrPrizeImg[3]],
        },
        // 銘謝惠顧 5
        {
            background: "#fff",
            imgs: [arrPrizeImg[5]],
        },
    ],
    // 抽獎用按鈕
    buttons: [{
        radius: "45%",
        imgs: [{
            src: "../../BX/src/images/BX_game_lucky_wheel/bg-wheel-button-draw.png",
            width: "1.5rem",
            top: "-1.1rem"
        }]
    }],
    defaultConfig: {
        // 扇形之間的縫隙
        gutter: "0.05rem",
    },
    // 點擊按鈕之後才會觸發此 function
    start: function () {
        // Step: 抽出獎項
        getPrizeName = drawPrize();

        // 轉動輪盤
        myLuckyWheel.play();

        // Step: 依據不同的獎項 call api 報名，回傳成功才算報名成功
        switch (getPrizeName) {
            // 黃金
            case prizeName0: {
                getPrizeNumber = 0;
                break;
            }
            // 指數
            case prizeName1: {
                getPrizeNumber = 1;
                break;
            }
            // 再接再勵
            case prizeName4: {
                getPrizeNumber = 2;
                break;
            }
            // 原油
            case prizeName2: {
                getPrizeNumber = 3;
                break;
            }
            // 先贈三美
            case prizeName3: {
                getPrizeNumber = 4;
                break;
            }
            // 銘謝惠顧
            case prizeName5: {
                getPrizeNumber = 5;
                break;
            }
        }

        setTimeout(async () => {
            // 停止轉盤
            myLuckyWheel.stop(getPrizeNumber);
        }, 3000);
    },

    // 轉盤停止轉動後
    end: function () {
        console.warn(`您抽中 ${getPrizeName} 了`);
        switch (getPrizeName) {
            // 黃金
            case prizeName0: {
                judgeSignUpResult(prizeName0);
                break;
            }
            // 原油
            case prizeName1: {
                judgeSignUpResult(prizeName1);
                break;
            }
            // 指數
            case prizeName2: {
                judgeSignUpResult(prizeName2);
                break;
            }
            // 先贈三美
            case prizeName3: {
                judgeSignUpResult(prizeName3);
                break;
            }
            // 再接再勵
            case prizeName4: {
                judgeSignUpResult(prizeName4);
                break;
            }
            // 銘謝惠顧
            case prizeName5: {
                judgeSignUpResult(prizeName5);
                break;
            }
        }
    }
});


/**
 * 判斷目前為 3 月第幾週
 */
function judgeNowMarchWeek() {
    // 取得目前時間
    const now = dayjs(new Date());
    // 判斷目前時間為三月第幾週
    if (dayjs(now).isBetween("2023-03-01", "2023-03-05", "day", "[]")) {
        return 1;
    }
    if (dayjs(now).isBetween("2023-03-06", "2023-03-12", "day", "[]")) {
        return 2;
    }
    if (dayjs(now).isBetween("2023-03-13", "2023-03-19", "day", "[]")) {
        return 3;
    }
    if (dayjs(now).isBetween("2023-03-20", "2023-03-26", "day", "[]")) {
        return 4;
    }
    if (dayjs(now).isBetween("2023-03-27", "2023-03-31", "day", "[]")) {
        return 5;
    }
    // TODO: 待移除
    // for test
    return "test";
}


/**
 * 抽獎
 * @return {"gold"|"crudeOil"|"index"|"usDollar"|"again"|"thanks"} 
 */
function drawPrize() {
    // Step: 設置中獎機率 (機率：probability)
    let pGold = 0;
    let pCrudeOil = 0;
    let pIndex = 0;
    let pUsDollar = 0;
    let pAgain = 0;
    let pThanks = 0;
    switch (judgeNowMarchWeek()) {
        // 連 default 都不給，這樣不在設定日期區間的話永遠抽不中
        // TODO: 待移除
        // for test
        case "test": {
            pGold = 40;
            pCrudeOil = 30;
            pIndex = 20;
            pUsDollar = 8;
            pAgain = 1;
            pThanks = 1;
        }
        case 1: {
            pGold = 40;
            pIndex = 20;
            pCrudeOil = 30;
            pUsDollar = 8;
            pAgain = 1;
            pThanks = 1;
            break;
        }
        case 2: {
            pGold = 20;
            pIndex = 30;
            pCrudeOil = 40;
            pUsDollar = 8;
            pAgain = 1;
            pThanks = 1;
            break;
        }
        case 3: {
            pGold = 30;
            pIndex = 40;
            pCrudeOil = 20;
            pUsDollar = 8;
            pAgain = 1;
            pThanks = 1;
            break;
        }
        case 4: {
            pGold = 20;
            pIndex = 20;
            pCrudeOil = 20;
            pUsDollar = 40;
            pAgain = 0;
            pThanks = 0;
            break;
        }
        case 5: {
            pGold = 20;
            pIndex = 20;
            pCrudeOil = 20;
            pUsDollar = 40;
            pAgain = 0;
            pThanks = 0;
            break;
        }
    }

    // 機率標準 (機率：probability)
    let p1 = pGold;
    let p2 = pGold + pIndex;
    let p3 = pGold + pIndex + pCrudeOil;
    let p4 = pGold + pIndex + pCrudeOil + pUsDollar;
    let p5 = pGold + pIndex + pCrudeOil + pUsDollar + pAgain;
    let p6 = pGold + pIndex + pCrudeOil + pUsDollar + pAgain + pThanks;

    // 取得一個隨機數字
    const randomNumber = Math.ceil(Math.random() * 100);
    console.log("res", randomNumber);

    // 黃金
    if (randomNumber > 0 && randomNumber <= p1) {
        return prizeName0;
    }
    // 指數
    if (randomNumber > p1 && randomNumber <= p2) {
        return prizeName1;
    }
    // 原油
    if (randomNumber > p2 && randomNumber <= p3) {
        return prizeName2;
    }
    // 先贈3美
    if (randomNumber > p3 && randomNumber <= p4) {
        return prizeName3;
    }
    // 再接再勵
    if (randomNumber > p4 && randomNumber <= p5) {
        return prizeName4;
    }
    // 銘謝惠顧
    if (randomNumber > p5 && randomNumber <= p6) {
        return prizeName5;
    }
}


/**
 * 判斷報名結果
 * @param {string} prizeName - 獎項名稱
 */
function judgeSignUpResult(prizeName) {
    if (prizeName === prizeName0) {
        showMsgPhotoDrawResult("msg-first-get-prize-gold");
        return;
    }
    if (prizeName === prizeName1) {
        showMsgPhotoDrawResult("msg-first-get-prize-index");
        return;
    }
    if (prizeName === prizeName2) {
        showMsgPhotoDrawResult("msg-first-get-prize-crude-oil");
        return;
    }
    if (prizeName === prizeName3) {
        showMsgPhotoDrawResult("msg-first-get-prize-us-dollar");
        return;
    }
    if (prizeName === prizeName4) {
        showMsgPhotoDrawResult("msg-prize-again");
        return;
    }
    if (prizeName === prizeName5) {
        showMsgPhotoDrawResult("msg-prize-thanks");
        return;
    }
    toast(objErrorMessage.contactCustomerService);
    console.error("judgeSignUpResult");
}


/**
 * 顯示提示圖片
 * @param {string} showMsgClassName - 要顯示的 class name
 */
function showMsgPhotoDrawResult(showMsgClassName) {
    $(".msg-draw-result")
        .removeClass()
        .addClass("msg-draw-result")
        .addClass(showMsgClassName);
    setTimeout(function () {
        $(".msg-draw-result").removeClass(showMsgClassName);
    }, 2500);
}


/**
 * 點擊 "遊戲通關入口" 跳轉至指定位置
 */
$(".badge").on("click", function () {
    const gameInfoTop = $(".game-info").offset().top;
    $("html,body").animate({
        scrollTop: gameInfoTop
    }, 800);
});


/* 避免滑動彈窗訊息時，下方內容一併滑動 start */
const el_pop_notice = document.querySelector("#pop-notice");

function handleScroll() {
    el_pop_notice.scrollTo(0, 0); // required when scroll bar is drgged
}

function handleEvent(e) {
    e.preventDefault(); // disables scrolling by mouse wheel and touch move
}

$(".js-close-pop-notice").click(function () {
    $(".pop-notice-wrapper").hide();
    el_pop_notice.removeEventListener("scroll", handleScroll, false);
    el_pop_notice.removeEventListener("scroll", handleEvent, false);
    el_pop_notice.removeEventListener("mousewheel", handleEvent, false);
    el_pop_notice.removeEventListener("touchmove", handleEvent, false);
});

$(".js-open-pop-notice").click(function () {
    $(".pop-notice-wrapper").css("display", "flex");
    el_pop_notice.addEventListener("scroll", handleScroll, false);
    el_pop_notice.addEventListener("scroll", handleEvent, false);
    el_pop_notice.addEventListener("mousewheel", handleEvent, false);
    el_pop_notice.addEventListener("touchmove", handleEvent, false);
});
/* 避免滑動彈窗訊息時，下方內容一併滑動 end */
