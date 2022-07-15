(function () {
    new Vue({
        el: "#gameArea",
        data() {
            return {
                playStatus: "pause",
                /*
                    "playing"  : 遊戲中
                    "pause"    : 暫停(包含關卡間的切換)
                    "gameover" : 遊戲結束
                */
                enemyS: [],
                enemyM1: {},
                enemyM2: {},
                enemyL: {},
                enemyXL: {},
                level: 0,
                needClickAmount: 10, // 還要點幾次才能通關
                leftChance: 10, // 剩餘 miss 次數
                leftChanceStatus: {
                    one: false,
                    two: false,
                    three: false,
                    four: false,
                    five: false,
                    six: false,
                    seven: false,
                    eight: false,
                    nine: false,
                    ten: false,
                },
                showToggle: false, // true 表示要不斷切換顯示、隱藏
                btnStatus: {
                    // login: false, // 登入 // 用不到，因為放在 vue 裡面會失效
                    start: false, // 開始遊戲 // 顯示與否是由 hd_common.js 也會控制
                    again: false, // 再來一次
                    service: false, // 聯繫客服
                },
                missAlert: false, // 是否還在全螢幕提示使用者沒有點擊到
                showLevelReport: false,
                levelReport: 0, // 戰報
                /* 
                    0: 尚未通關
                    1: 通過第 1 關
                    2: 通過第 2 關
                    3: 通過第 3 關
                    4: 通過第 4 關
                */
            }
        },
        /** */
        /** */
        /** */
        /** */
        /** */
        /** */
        /** */

        methods: {
            // 生產怪物
            /**
             * 怪物產生器
             */
            enemyGenerator(enemyParam) {
                /* 
                    參數意義：
                        s:  小怪
                        m:  中怪
                        l:  大怪
                        xl: bonus 怪
                */

                const vm = this; // 綁定 this 指向 Vue 實例

                if (vm.playStatus !== "playing") {
                    return;
                }

                const CW = Number(document.body.clientWidth); // 獲取螢幕寬度

                // PC
                let gameAreaHeight = 540;
                let enemyHeight = 180;

                if (enemyParam === "s") {
                    const enemyWidth = CW / 1920 * 2.503 * 180;
                    const GAP_R1 = (CW - (enemyWidth * 3)) / 4; // 第一行
                    const GAP_R2 = (CW - (enemyWidth * 2)) / 3; // 第二行
                    vm.enemyS = [];
                    for (let i = 0; i < 5; i++) {
                        let PosX;
                        let PosY;
                        let showOrNot;
                        switch (i) {
                            // 1-1
                            case 0:
                                PosX = GAP_R1; // M
                                if (CW >= 800) { // PC
                                    PosX = 65;
                                }
                                PosY = 60;
                                showOrNot = false;
                                break;
                            // 2-1
                            case 1:
                                PosX = GAP_R2; // M
                                if (CW >= 800) { // PC
                                    PosX = 147;
                                }
                                PosY = 300;
                                showOrNot = true;
                                break;
                            // 1-2
                            case 2:
                                PosX = GAP_R1 * 2 + enemyWidth; // M
                                if (CW >= 800) { // PC
                                    PosX = 310;
                                }
                                PosY = 60;
                                showOrNot = false;
                                break;
                            // 2-2
                            case 3:
                                PosX = GAP_R2 * 2 + enemyWidth; // M
                                if (CW >= 800) { // PC
                                    PosX = 474;
                                }
                                PosY = 300;
                                showOrNot = true;
                                break;
                            // 1-3
                            case 4:
                                PosX = GAP_R1 * 3 + enemyWidth * 2; // M
                                if (CW >= 800) { // PC
                                    PosX = 555;
                                }
                                PosY = 60;
                                showOrNot = true;
                                break;
                        }
                        const setting = {
                            order: i,
                            translateX: PosX,
                            translateY: PosY,
                            boom: false, // 或者是這個可以考慮用 life === 0 的判斷替代 // 好像不適合，因為還有爆炸效果的動畫要做
                            nowTwinkleShow: showOrNot, // 目前的怪物是閃爍 or 出現 // true 表示目前是出現； false 表示目前是隱藏
                        };
                        vm.enemyS.push(setting);
                    }
                }
                else if (enemyParam === "m") {
                    vm.enemyM1 = {
                        life: 5, // 目前還要被點擊幾次才會死
                        boom: false, // 爆炸狀態
                        beenShooted: false, // true 表示被射中
                        moveDirection: "left", // "left"、"right" // 一開始在中間，往右移動(或往左)，至右邊界後往左移動
                        nowTwinkleShow: false, // 目前的怪物是閃爍的出現 // true 表示目前是出現； false 表示目前是隱藏
                        translateX: 140,
                        // translateY: 60,
                        translateY: ((gameAreaHeight - enemyHeight * 2) / 3),
                    };
                    vm.enemyM2 = {
                        life: 5, // 目前還要被點擊幾次才會死
                        boom: false, // 爆炸狀態
                        beenShooted: false, // true 表示被射中
                        moveDirection: "right", // "left"、"right" // 一開始在中間，往右移動(或往左)，至右邊界後往左移動
                        nowTwinkleShow: false, // 目前的怪物是閃爍的出現 // true 表示目前是出現； false 表示目前是隱藏
                        translateX: 480,
                        // translateY: 300,
                        translateY: ((gameAreaHeight - enemyHeight * 2) / 3 * 2 + enemyHeight),
                    };
                }
                else if (enemyParam === "l") {
                    vm.enemyL = {
                        life: 10, // 目前還要被點擊幾次才會死
                        boom: false, // 爆炸狀態
                        beenShooted: false, // true 表示被射中
                        moveDirection: "left", // "left"、"right" // 一開始在中間，往右移動(或往左)，至右邊界後往左移動
                        nowTwinkleShow: false, // 目前的怪物是閃爍的出現 // true 表示目前是出現； false 表示目前是隱藏
                        translateX: 100, // 到時候可以改寫為動態抓取寬度並置中
                        translateY: ((gameAreaHeight - enemyHeight) / 2),
                    };
                }
                else if (enemyParam === "xl") {
                    vm.enemyXL = {
                        life: 10, // 目前還要被點擊幾次才會死
                        boom: false, // 爆炸狀態
                        beenShooted: false, // true 表示被射中
                        moveDirection: "left", // "left"、"right" // 一開始在中間，往右移動(或往左)，至右邊界後往左移動
                        nowTwinkleShow: false, // 目前的怪物是閃爍的出現 // true 表示目前是出現； false 表示目前是隱藏
                        translateX: 100, // 到時候可以改寫為動態抓取寬度並置中
                        // translateY: 0,
                        translateY: ((gameAreaHeight - enemyHeight) / 2),
                    };
                }

                /* 
                    需要設定的參數：
                        . 寬、高 (如果只是為了顯示用，那在 css 中設定即可)
                        . 要產生幾隻
                        . 生命值
                        . 定點、移動 (在關卡難度中設定好像比較好(?
                        . 是否會閃爍 (在關卡難度中設定好像比較好(?
                */
            },

            // 敵人移動、閃爍
            /**
             * 移動敵人
             */
            moveEnemy() {
                const vm = this; // 綁定 this 指向 Vue 實例
                const CW = Number(document.body.clientWidth); // 獲取螢幕寬度
                let timeInterval;
                let gameAreaWidth = CW;
                let enemyWidth = CW / 1920 * 2.503 * 180;
                let isMobile = true;

                /* 依據畫面寬度，動態判定要使用哪種移動速度 */
                if (CW >= 800) {
                    isMobile = false;
                }

                /* 依據畫面寬度，動態調整右側折返點 */
                if (gameAreaWidth >= 800) {
                    gameAreaWidth = 800; // PC
                }
                if (enemyWidth >= 180) {
                    enemyWidth = 180; // PC
                }

                /* 依據關卡，動態調整移動速率 */
                if (vm.level === 2) { // 中速移動(沒有閃爍)
                    timeInterval = 50; // 每秒移動 (1000 / timeInterval) 次
                }
                else if (vm.level === 3) { // 低速移動(有閃爍)
                    timeInterval = 50;
                }
                else if (vm.level === 4) { // 快速移動(有閃爍)
                    timeInterval = 45;
                }

                /* 依據關卡，綁定移動定時器 */
                if (vm.level === 2) { // 中速移動
                    window.moveEnemyM1Timer = window.setInterval(function () {
                        if (vm.enemyM1.translateX <= 0) { // 到達左方邊界後，向右移動
                            vm.enemyM1.moveDirection = "right";
                        }
                        else if (vm.enemyM1.translateX >= gameAreaWidth - enemyWidth) {
                            vm.enemyM1.moveDirection = "left";
                        }
                        // 判斷步驟 2.
                        // 依據移動方向移動 vm.enemyM1
                        if (vm.enemyM1.moveDirection === "left") {
                            vm.enemyM1.translateX -= 20;
                            // vm.enemyM1.translateX -= Math.ceil(Math.random() * 25) * 10; // 惡搞難度XD
                        }
                        else if (vm.enemyM1.moveDirection === "right") {
                            vm.enemyM1.translateX += 20;
                            // vm.enemyM1.translateX += Math.ceil(Math.random() * 25) * 10; // 惡搞難度XD
                        }

                        if (vm.enemyM1.life <= 0) { // 如果 enemyL 生命值歸零，則停止移動 enemyL
                            if (window.moveEnemyM1Timer) {
                                window.clearInterval(window.moveEnemyM1Timer);
                            }
                        }
                    }, timeInterval);

                    window.moveEnemyM2Timer = window.setInterval(function () {
                        if (vm.enemyM2.translateX <= 0) { // 到達左方邊界後，向右移動
                            vm.enemyM2.moveDirection = "right";
                        }
                        else if (vm.enemyM2.translateX >= gameAreaWidth - enemyWidth) { // 現在是寫死，到時候可以動態抓取 // 到達右方邊界後，向左移動
                            vm.enemyM2.moveDirection = "left";
                        }
                        // 判斷步驟 2.
                        // 依據移動方向移動 vm.enemyM2
                        if (vm.enemyM2.moveDirection === "left") {
                            vm.enemyM2.translateX -= 20;
                            // vm.enemyM2.translateX -= Math.ceil(Math.random() * 25) * 10; // 惡搞難度XD
                        }
                        else if (vm.enemyM2.moveDirection === "right") {
                            vm.enemyM2.translateX += 20;
                            // vm.enemyM2.translateX += Math.ceil(Math.random() * 25) * 10; // 惡搞難度XD
                        }

                        if (vm.enemyM2.life <= 0) { // 如果 enemyL 生命值歸零，則停止移動 enemyL
                            if (window.moveEnemyM2Timer) {
                                window.clearInterval(window.moveEnemyM2Timer);
                            }
                        }
                    }, timeInterval);
                }
                else if (vm.level === 3) { // 低速移動
                    window.moveEnemyLTimer = window.setInterval(function () {
                        // 判斷步驟 1.
                        // 判定是否已經到達邊界，如是，則切換移動方向
                        if (vm.enemyL.translateX <= 0) { // 到達左方邊界後，向右移動
                            vm.enemyL.moveDirection = "right";
                        }
                        else if (vm.enemyL.translateX >= gameAreaWidth - enemyWidth) { // 現在是寫死，到時候可以動態抓取 // 到達右方邊界後，向左移動
                            vm.enemyL.moveDirection = "left";
                        }
                        // 判斷步驟 2.
                        // 依據移動方向移動 enemy
                        if (vm.enemyL.moveDirection === "left") {
                            if (isMobile) { // M 版移動速度
                                vm.enemyL.translateX -= 10;
                            }
                            else { // PC 版移動速度
                                vm.enemyL.translateX -= 20;
                            }
                            // vm.enemyL.translateX -= Math.ceil(Math.random() * 25) * 10; // 惡搞難度XD
                        }
                        else if (vm.enemyL.moveDirection === "right") {
                            if (isMobile) { // M 版移動速度
                                vm.enemyL.translateX += 10;
                            }
                            else { // PC 版移動速度
                                vm.enemyL.translateX += 20;
                            }
                            // vm.enemyL.translateX += Math.ceil(Math.random() * 25) * 10; // 惡搞難度XD
                        }

                        if (vm.enemyL.life <= 0) { // 如果 enemyL 生命值歸零，則停止移動 enemyL
                            if (window.enemyL) {
                                window.clearInterval(window.enemyL);
                            }
                        }
                    }, timeInterval);
                }
                else if (vm.level === 4) { // 高速移動
                    window.moveEnemyXLTimer = window.setInterval(function () {
                        // 判斷步驟 1.
                        // 判定是否已經到達邊界，如是，則切換移動方向
                        if (vm.enemyXL.translateX <= 0) { // 到達左方邊界後，向右移動
                            vm.enemyXL.moveDirection = "right";
                        }
                        else if (vm.enemyXL.translateX >= gameAreaWidth - enemyWidth) { // 現在是寫死，到時候可以動態抓取 // 到達右方邊界後，向左移動
                            vm.enemyXL.moveDirection = "left";
                        }
                        // 判斷步驟 2.
                        // 依據移動方向移動 enemy
                        if (vm.enemyXL.moveDirection === "left") {
                            if (isMobile) { // M 版移動速度
                                vm.enemyXL.translateX -= 11.5;
                            }
                            else { // PC 版移動速度
                                vm.enemyXL.translateX -= 20;
                            }
                            // vm.enemyXL.translateX -= Math.ceil(Math.random() * 25) * 10; // 惡搞難度XD
                        }
                        else if (vm.enemyXL.moveDirection === "right") {
                            if (isMobile) { // M 版移動速度
                                vm.enemyXL.translateX += 11.5;
                            }
                            else { // PC 版移動速度
                                vm.enemyXL.translateX += 20;
                            }
                            // vm.enemyXL.translateX += Math.ceil(Math.random() * 25) * 10; // 惡搞難度XD
                        }

                        if (vm.enemyXL.life === 0) { // 如果 enemyXL 生命值歸零，則停止移動 enemyXL
                            if (window.moveEnemyXLTimer) {
                                window.clearInterval(window.moveEnemyXLTimer);
                            }
                        }
                    }, timeInterval);
                }
            },
            /**
             * 敵人 閃爍
             */
            hideEnemy() {
                const vm = this; // 綁定 this 指向 Vue 實例

                if (vm.level === 1) {
                    window.toggleShowEnemySTimer = window.setInterval(() => {
                        for (let i = 0; i < vm.enemyS.length; i++) {
                            if (vm.needClickAmount <= 0) {
                                if (window.toggleShowEnemySTimer) {
                                    window.clearInterval(window.toggleShowEnemySTimer);
                                }
                                // console.log("停止 切換");
                                return;
                            }
                            if (vm.enemyS[i].nowTwinkleShow === true) {
                                vm.enemyS[i].nowTwinkleShow = false;
                            }
                            else {
                                vm.enemyS[i].nowTwinkleShow = true;
                            }
                        }
                    }, 1000);
                }
                else if (vm.level === 3) {
                    /* 定期切換 show、hide */
                    window.toggleShowEnemyLTimer = window.setInterval(() => {
                        if (vm.enemyL.life <= 0) { // 如果 enemyL 生命值歸零，則停止切換顯示 enemyL
                            if (window.toggleShowEnemyLTimer) {
                                window.clearInterval(window.toggleShowEnemyLTimer);
                            }
                            vm.enemyL.nowTwinkleShow = false; // 隱藏 enemy
                            // console.log("停止 切換");
                            return;
                        }
                        if (vm.enemyL.nowTwinkleShow === true) {
                            vm.enemyL.nowTwinkleShow = false;
                        }
                        else {
                            vm.enemyL.nowTwinkleShow = true;
                        }
                    }, 1000);
                    // 進階版可改為使用 random 的數字
                }
                else if (vm.level === 4) {
                    /* 定期切換 show、hide */
                    window.toggleShowEnemyXLTimer = window.setInterval(() => {
                        if (vm.enemyXL.life <= 0) { // 如果 enemyXL 生命值歸零，則停止切換顯示 enemyXL
                            if (window.toggleShowEnemyXLTimer) {
                                window.clearInterval(window.toggleShowEnemyXLTimer);
                            }
                            vm.enemyXL.nowTwinkleShow = false; // 隱藏 enemy
                            // console.log("停止 切換");
                            return;
                        }
                        if (vm.enemyXL.nowTwinkleShow === true) {
                            vm.enemyXL.nowTwinkleShow = false;
                        }
                        else {
                            vm.enemyXL.nowTwinkleShow = true;
                        }
                    }, 1000);
                }
            },

            // 射擊判定
            /**
             * 第 1 關 判定點擊
             */
            judgeShootedFixed(enemyOrderParam) { // 只有第一關是固定靶
                const vm = this; // 綁定 this 指向 Vue 實例

                if (vm.playStatus !== "playing" || vm.needClickAmount <= 0) { // 如果遊戲沒有在進行中，則不判斷
                    // console.log("現在遊戲不在進行中，故不進行是否射中的判斷");
                    return;
                }
                if (vm.needClickAmount <= 0) {
                    return;
                }
                for (let i = 0; i < vm.enemyS.length; i++) {
                    if (vm.enemyS[i].order === enemyOrderParam) {
                        if (vm.enemyS[i].boom === true) { // 如果還未復原，則不判斷
                            return;
                        }
                        if (vm.enemyS[i].nowTwinkleShow === false) { // 如果目前為隱藏狀態，則不判斷
                            return;
                        }
                        if (vm.needClickAmount <= 0) {
                            return;
                        }
                        // 第一關 通關
                        // 最後一擊，爆炸完後自動設定通關
                        // else if (vm.needClickAmount === 1) {
                        // 邏輯統一寫在 needClickAmount 監聽那邊

                        // 1. 等待 boom 動畫跑完 // vm.level = null;
                        // 2. 顯示戰報 3 秒
                        // 3. 顯示報名成功/失敗/已報名提示 3 秒 // document.querySelector(".popMsg").classList.add("dp-block");
                        // 4. 自動進入下一關

                        // 如果還沒過關，則設置定時器，讓他自動重生
                        // 目前是設定 1 秒閃爍 1 次，所以間隔要小於 1 秒
                        // 不然會發生已經重新顯示了，但樣式還停留在被擊殺的狀態
                        else if (vm.needClickAmount !== 0) {
                            window.setTimeout(() => {
                                if (vm.enemyS[i]) {
                                    vm.enemyS[i].boom = false;
                                    vm.enemyS[i].nowTwinkleShow = true;
                                }
                            }, 900);
                        }
                        vm.enemyS[i].boom = true;
                        vm.needClickAmount--;
                        // console.log("boom");

                        return;
                    }
                }
            },
            /**
             * 判定移動中的標靶
             */
            judgeShootedMoving(e) {
                const vm = this; // 綁定 this 指向 Vue 實例
                // 不在遊玩中 或 現在並非顯示狀態 ，則不判定
                if (vm.playStatus !== "playing") { // 不在遊玩中
                    return;
                }
                if (vm.level === 2) {
                    if (/enemy-m1/.test(e.target.className)) { // 代表目前擊中的是 m1
                        if (vm.enemyM1.beenShooted === true) { // 如果當下 enemy 尚未結束被傷害的動畫，則不判定
                            // console.log("才剛被打到餒QQ");
                            return;
                        }
                        if (vm.enemyM1.life <= 0) {
                            return;
                        }
                        if (vm.enemyM1.life === 1) { // 代表目前是最後一擊了
                            // console.log("一切都結束ㄌ");
                            vm.enemyM1.boom = true;
                        }
                        vm.enemyM1.life--; // enemy 性命 - 1
                        vm.needClickAmount--; // 需要擊殺數量 - 1

                        vm.enemyM1.beenShooted = true;
                        window.setTimeout(() => {
                            vm.enemyM1.beenShooted = false; // 恢復初始狀態
                            // }, (Math.ceil(Math.random() * 3) + 1) * 1000);
                        }, 500);
                        // console.log("e.target.className", e.target.className);
                    }
                    else { // 代表目前擊中的是 m2
                        if (vm.enemyM2.beenShooted === true) { // 如果當下 enemy 尚未結束被傷害的動畫，則不判定
                            // console.log("才剛被打到餒QQ");
                            return;
                        }
                        if (vm.enemyM2.life <= 0) {
                            return;
                        }
                        if (vm.enemyM2.life === 1) { // 代表目前是最後一擊了
                            // console.log("一切都結束ㄌ");
                            vm.enemyM2.boom = true;
                        }
                        vm.enemyM2.life--; // enemy 性命 - 1
                        vm.needClickAmount--; // 需要擊殺數量 - 1

                        vm.enemyM2.beenShooted = true;
                        window.setTimeout(() => {
                            vm.enemyM2.beenShooted = false; // 恢復初始狀態
                            // }, (Math.ceil(Math.random() * 3) + 1) * 1000);
                        }, 500);
                    }
                }
                if (vm.level === 3) {
                    // 如果現在並非顯示狀態
                    /* // 這種寫法有一定的機率會在 enemy 隱身時仍判定為有效攻擊
                        if (vm.nowTwinkleShow === false) {
                            return;
                        } 
                    */
                    if (/enemy-hide/.test(e.target.className)) { // 如果當下 enemy 為隱藏狀態，則不判定
                        // console.log("/hide/.test(e.target.className)", /hide/.test(e.target.className));
                        // console.log("隱身中，打ㄅ到");
                        return;
                    }
                    if (vm.enemyL.beenShooted === true) { // 如果當下 enemy 尚未結束被傷害的動畫，則不判定
                        // console.log("才剛被打到餒QQ");
                        return;
                    }
                    if (vm.enemyL.life <= 0) {
                        return;
                    }
                    if (vm.enemyL.life === 1) { // 代表目前是最後一擊了
                        // console.log("一切都結束ㄌ");
                        vm.enemyL.boom = true;
                    }

                    // console.log("打到ㄌ");

                    vm.needClickAmount--; // 需要過關的點擊數量 - 1
                    vm.enemyL.life--; // enemy 性命 - 1
                    vm.enemyL.beenShooted = true;
                    window.setTimeout(() => {
                        window.requestAnimationFrame(() => {
                            vm.enemyL.beenShooted = false; // 恢復初始狀態
                        });
                        // }, (Math.ceil(Math.random() * 3) + 1) * 1000);
                    }, 1000);
                    // console.log("judgeShootedMoving");
                }
                if (vm.level === 4) {
                    // 如果現在並非顯示狀態
                    /* // 這種寫法有一定的機率會在 enemy 隱身時仍判定為有效攻擊
                        if (vm.nowTwinkleShow === false) {
                            return;
                        } 
                    */
                    if (/enemy-hide/.test(e.target.className)) { // 如果當下 enemy 為隱藏狀態，則不判定
                        // console.log("/hide/.test(e.target.className)", /hide/.test(e.target.className));
                        // console.log("隱身中，打ㄅ到");
                        return;
                    }
                    if (vm.enemyXL.beenShooted === true) { // 如果當下 enemy 尚未結束被傷害的動畫，則不判定
                        // console.log("才剛被打到餒QQ");
                        return;
                    }
                    if (vm.enemyXL.life <= 0) {
                        return;
                    }
                    if (vm.enemyXL.life === 1) { // 代表目前是最後一擊了
                        // console.log("一切都結束ㄌ");
                        vm.enemyXL.boom = true;
                    }

                    // console.log("打到ㄌ");

                    vm.needClickAmount--; // 需要過關的點擊數量 - 1
                    vm.enemyXL.life--; // enemy 性命 - 1
                    vm.enemyXL.beenShooted = true;
                    window.setTimeout(() => {
                        window.requestAnimationFrame(() => {
                            vm.enemyXL.beenShooted = false; // 恢復初始狀態
                        });
                        // }, (Math.ceil(Math.random() * 3) + 1) * 1000);
                    }, 1000);
                    // console.log("judgeShootedMoving");
                }
            },
            /**
             * 無效射擊判定 (沒打到)
             */
            judgeIfShootEmpty(e) {
                const vm = this; // 綁定 this 指向 Vue 實例
                // 如果遊戲沒有在進行中，則不判斷
                if (vm.playStatus !== "playing") {
                    // console.log("現在遊戲不在進行中，故不進行是否射中的判斷");
                    return;
                }
                // 如果目前還在顯示全螢幕警示圖樣，則不判斷
                if (vm.missAlert) {
                    // console.log("歸剛耶");
                    return;
                }
                // 如果已經沒有剩餘機會了，則跳出函式
                if (vm.leftChance <= 0) {
                    // console.log("現在已經沒有剩餘機會，故不進行是否射中的判斷");
                    return;
                }

                // 判斷是否沒射到
                let shootEmpty = false;
                if (/enemy-hide/.test(e.target.className)) { // 有 enemy-hide
                    shootEmpty = true;
                }
                else if (/enemy/.test(e.target.className) === false) { // 沒有 enemy
                    shootEmpty = true;
                }

                if (shootEmpty) {
                    if (vm.leftChance !== 1) {
                        vm.missAlert = true;
                        document.querySelector(".section1").classList.add("miss"); // 調整背景
                        window.setTimeout(() => {
                            vm.missAlert = false;
                            document.querySelector(".section1").classList.remove("miss"); // 調整背景
                        }, 500);
                        vm.leftChance--;
                    }
                    else { // 這邊的訊息內容由 watch leftChance 控制；這邊僅需將 leftChance -- 即可
                        // 最後一次成功射擊，或者最後一次成功射擊之後
                        vm.leftChance--;
                    }
                }
                else {
                    // console.log("射中ㄌ");
                }
            },
            /**
             * 遊戲開始、遊戲重來
             */
            startGame() {
                const vm = this; // 綁定 this 指向 Vue 實例
                /* 重置 */
                vm.level = 1; // 重置關卡
                vm.levelReport = 0 // 重置戰報
                vm.resetLeftChanceAndNeedClick();
                $(".section1 .filter").hide(); // 隱藏 filter
                vm.btnStatus.start = false; // 隱藏 "遊戲開始" 按鈕
                $(".btn-start").hide(); // 隱藏 "遊戲開始" 按鈕
                /* 開始第一關 */
                vm.playStatus = "playing"; // 因為 enemyGenerator 會吃 vm.playStatus 的參數，所以要放在前方
                vm.enemyGenerator("s");
                vm.hideEnemy();
            },
            /**
             * 點擊 "再來一次" 要觸發的相關功能
             */
            again() {
                const vm = this; // 綁定 this 指向至 vue 實例
                vm.btnStatus.start = true; // 顯示 "開始遊戲"
                $(".btn-start").show();
                vm.btnStatus.again = false; // 隱藏 "再來一次"
            },
            /**
             * 重置 剩餘機會、需點擊次數
             */
            resetLeftChanceAndNeedClick() {
                const vm = this; // 綁定 this 指向至 vue 實例
                vm.needClickAmount = 10; // 還要點幾次才能通關
                vm.leftChance = 10; // 剩餘 miss 次數
                vm.leftChanceStatus.zero = false;
                vm.leftChanceStatus.one = false;
                vm.leftChanceStatus.two = false;
                vm.leftChanceStatus.three = false;
                vm.leftChanceStatus.four = false;
                vm.leftChanceStatus.five = false;
                vm.leftChanceStatus.six = false;
                vm.leftChanceStatus.seven = false;
                vm.leftChanceStatus.eight = false;
                vm.leftChanceStatus.nine = false;
            },
            /**
             * 清除計時器以及敵人
             */
            clearEnemy() {
                const vm = this;
                vm.enemyS = [];
                vm.enemyM1 = {};
                vm.enemyM2 = {};
                vm.enemyL = {};
                vm.enemyXL = {};
                /* 清除 移動 定時器 */
                if (window.moveEnemyM1Timer) {
                    window.clearInterval(window.moveEnemyM1Timer);
                    window.moveEnemyM1Timer = null;
                    // console.log("清除 M1 移動");
                }
                if (window.moveEnemyM2Timer) {
                    window.clearInterval(window.moveEnemyM2Timer);
                    window.moveEnemyM2Timer = null;
                    // console.log("清除 M2 移動");
                }
                if (window.moveEnemyLTimer) {
                    window.clearInterval(window.moveEnemyLTimer);
                    window.moveEnemyLTimer = null;
                    // console.log("清除 L 移動");
                }
                if (window.moveEnemyXLTimer) {
                    window.clearInterval(window.moveEnemyXLTimer);
                    window.moveEnemyXLTimer = null;
                    // console.log("清除 XL 移動");
                }
                /* 清除 閃爍 定時器 */
                if (window.toggleShowEnemySTimer) {
                    window.clearInterval(window.toggleShowEnemySTimer);
                    window.toggleShowEnemySTimer = null;
                    // console.log("清除 S 閃爍");
                }
                if (window.toggleShowEnemyLTimer) {
                    window.clearInterval(window.toggleShowEnemyLTimer);
                    window.toggleShowEnemyLTimer = null;
                    // console.log("清除 L 閃爍");
                }
                if (window.toggleShowEnemyXLTimer) {
                    window.clearInterval(window.toggleShowEnemyXLTimer);
                    window.toggleShowEnemyXLTimer = null;
                    // console.log("清除 XL 閃爍");
                }
            },

            /**
             * 報名活動
             */
            signUp() {
                $(".popMsg > .title").text("报名成功");
                $(".msgText").text("请对应于下方奖励资格");
            },
        },

        watch: {
            leftChance: function (newVal) {
                const vm = this;
                if (newVal <= 0) { // 遊戲結束
                    vm.level = null; // 隱藏所有 enemy list
                    vm.playStatus = "gameover";
                    $(".section1 .filter").show(); // 加上 filter
                    vm.clearEnemy();

                    // console.log("死掉囉");

                    window.setTimeout(() => {
                        vm.playStatus = "pause";
                        vm.btnStatus.again = true;
                    }, 3000);
                }
                switch (newVal) {
                    case 0:
                        vm.leftChanceStatus.zero = true;
                        break;
                    case 1:
                        vm.leftChanceStatus.one = true;
                        break;
                    case 2:
                        vm.leftChanceStatus.two = true;
                        break;
                    case 3:
                        vm.leftChanceStatus.three = true;
                        break;
                    case 4:
                        vm.leftChanceStatus.four = true;
                        break;
                    case 5:
                        vm.leftChanceStatus.five = true;
                        break;
                    case 6:
                        vm.leftChanceStatus.six = true;
                        break;
                    case 7:
                        vm.leftChanceStatus.seven = true;
                        break;
                    case 8:
                        vm.leftChanceStatus.eight = true;
                        break;
                    case 9:
                        vm.leftChanceStatus.nine = true;
                        break;
                }
            },

            needClickAmount: function (newVal) {
                const vm = this;
                if (newVal === 0) {
                    if (vm.playStatus === "gameover") {
                        return;
                    }
                    if (vm.level === 1) { // 第一關結束，晉級至第二關
                        // initHd(window.activityId, 1); // 報名活動
                        vm.signUp();
                        // 顯示過場動畫
                        window.setTimeout(() => {
                            vm.playStatus = "pause";
                            vm.level = null; // 1 秒後消失
                            vm.clearEnemy();
                            vm.levelReport = 1; // 戰報設置為 1
                            vm.showLevelReport = true; // 顯示戰報
                            $(".section1 .filter").show(); // 加上 filter
                            window.setTimeout(() => {
                                vm.showLevelReport = false; // 2. 顯示戰報 3 秒
                                document.querySelector(".popMsg").classList.add("dp-block");
                                window.setTimeout(() => {
                                    // 3. 顯示報名成功/失敗/已報名提示 3 秒
                                    document.querySelector(".popMsg").classList.remove("dp-block");
                                    $(".section1 .filter").hide(); // 隱藏 filter
                                    /* 重置 */
                                    vm.resetLeftChanceAndNeedClick();
                                    /* 開始下一關的內容 */
                                    vm.level = 2;
                                    vm.playStatus = "playing"; // 因為 enemyGenerator 會吃 vm.playStatus 的參數，所以要放在前方
                                    vm.enemyGenerator("m");
                                    vm.moveEnemy(); // 因為 moveEnemy、hideEnemy 每一關結束都會消除，所以開始新的一關就要重新綁定
                                    // 第二關只有一棟沒有隱藏，所以不需要 hideEnemy
                                }, 3000);
                            }, 3000);
                        }, 1000);
                    }
                    else if (vm.level === 2) { // 第二關結束，晉級至第三關
                        // initHd(window.activityId, 2); // 報名活動
                        vm.signUp();
                        // 顯示過場動畫
                        window.setTimeout(() => {
                            vm.playStatus = "pause";
                            vm.level = null; // 1 秒後消失
                            vm.clearEnemy();
                            vm.levelReport = 2; // 戰報設置為 2
                            vm.showLevelReport = true; // 顯示戰報
                            $(".section1 .filter").show(); // 加上 filter
                            window.setTimeout(() => {
                                vm.showLevelReport = false; // 2. 顯示戰報 3 秒
                                document.querySelector(".popMsg").classList.add("dp-block");
                                window.setTimeout(() => {
                                    // 3. 顯示報名成功/失敗/已報名提示 3 秒
                                    document.querySelector(".popMsg").classList.remove("dp-block");
                                    $(".section1 .filter").hide(); // 隱藏 filter
                                    /* 重置 */
                                    vm.resetLeftChanceAndNeedClick();
                                    /* 開始下一關的內容 */
                                    vm.level = 3;
                                    vm.playStatus = "playing"; // 因為 enemyGenerator 會吃 vm.playStatus 的參數，所以要放在前方
                                    vm.enemyGenerator("l");
                                    vm.moveEnemy(); // 因為 moveEnemy、hideEnemy 每一關結束都會消除，所以開始新的一關就要重新綁定
                                    vm.hideEnemy(); // 因為 moveEnemy、hideEnemy 每一關結束都會消除，所以開始新的一關就要重新綁定
                                }, 3000);
                            }, 3000);
                        }, 1000);
                    }
                    else if (vm.level === 3) { // 第三關結束，晉級至第四關
                        // initHd(window.activityId, 3); // 報名活動
                        vm.signUp();
                        // 顯示過場動畫
                        window.setTimeout(() => {
                            vm.playStatus = "pause";
                            vm.level = null; // 1 秒後消失
                            vm.clearEnemy();
                            vm.levelReport = 3; // 戰報設置為 3
                            vm.showLevelReport = true; // 顯示戰報
                            $(".section1 .filter").show(); // 加上 filter
                            window.setTimeout(() => {
                                vm.showLevelReport = false; // 2. 顯示戰報 3 秒
                                document.querySelector(".popMsg").classList.add("dp-block");
                                window.setTimeout(() => {
                                    // 3. 顯示報名成功/失敗/已報名提示 3 秒
                                    document.querySelector(".popMsg").classList.remove("dp-block");
                                    $(".section1 .filter").hide(); // 隱藏 filter
                                    /* 重置 */
                                    vm.resetLeftChanceAndNeedClick();
                                    /* 開始下一關的內容 */
                                    vm.level = 4;
                                    vm.playStatus = "playing"; // 因為 enemyGenerator 會吃 vm.playStatus 的參數，所以要放在前方
                                    vm.enemyGenerator("xl");
                                    vm.moveEnemy(); // 因為 moveEnemy、hideEnemy 每一關結束都會消除，所以開始新的一關就要重新綁定
                                    vm.hideEnemy(); // 因為 moveEnemy、hideEnemy 每一關結束都會消除，所以開始新的一關就要重新綁定
                                }, 3000);
                            }, 3000);
                        }, 1000);
                    }
                    else if (vm.level === 4) { // 第四關結束，遊戲結束
                        // initHd(window.activityId, 4); // 報名活動
                        vm.signUp();
                        // 顯示過場動畫
                        window.setTimeout(() => {
                            vm.playStatus = "pause";
                            vm.level = null; // 1 秒後消失
                            vm.clearEnemy();
                            vm.levelReport = 4; // 戰報設置為 3
                            vm.showLevelReport = true; // 顯示戰報
                            $(".section1 .filter").show(); // 加上 filter
                            window.setTimeout(() => {
                                vm.showLevelReport = false; // 2. 顯示戰報 3 秒
                                document.querySelector(".popMsg").classList.add("dp-block");
                                window.setTimeout(() => {
                                    // 3. 顯示報名成功/失敗/已報名提示 3 秒
                                    document.querySelector(".popMsg").classList.remove("dp-block");
                                    vm.btnStatus.again = true;
                                }, 3000);
                            }, 3000);
                        }, 1000);
                    }
                }
            },
        },

        mounted() {
            /* 綁定監聽，點擊 "遊戲通關入口" 跳轉至指定位置 */
            const CW = document.body.clientWidth; // 動態抓取裝置寬度
            // 1. 先獲取指定元素距離文件頂部多少距離 // .offset() 為 jQuery 的方法
            const SCROLL_TO_POS = $(".left-chance").offset().top;
            if (CW >= 768) { // PC 版
                // 2. 再綁定監聽，點擊按鈕時滾動至該位置
                $(".badge a")[0].addEventListener("click", function () {
                    window.scrollTo({
                        top: SCROLL_TO_POS - 30, // 上方多一些留白的空間
                        behavior: "smooth"
                    });
                });
            }
            else { // M 版
                $(".badge a")[0].addEventListener("click", function () {
                    window.scrollTo({
                        top: SCROLL_TO_POS - 20, // 上方多一些留白的空間
                        behavior: "smooth"
                    });
                });
            }

            /* 確認目前有綁定哪些監聽事件 */
            // 在 chrome devtool Console 輸入： getEventListeners(window)
        }
    });
})();