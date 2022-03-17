(function () {
    new Vue({
        el: "#gameArea",

        data() {
            return {
                finalScore: 0, // 最終分數
                myPlane: { // 己方飛機 己機
                    top: 425,
                    left: (800 / 2 - 70 / 2), // 己方飛機位置 // 行動版的話會需要在 mounted 透過裝置寬度動態改寫
                    boom: false, // 是否已和敵機碰撞
                    translateX: (800 / 2 - 70 / 2),
                    translateY: 425,
                },
                bulletList: [], // 所有子彈
                enemyList: [],  // 所有敵機
                playStatus: "pause",
                /*
                    playStatus 所有參數：
                        "playing"" // 遊戲中
                        "pause"    // 暫停(包含關卡間的切換)
                        "gameover" // 遊戲結束
                */
                gameover: false, // true 代表遊戲結束
                pointTwinkle: false, // 達特定分數要閃爍
                pointDigit_1: {}, // 顯示分數第一位
                pointDigit_2: {}, // 顯示分數第二位
                pointDigit_3: {}, // 顯示分數第三位
                pointDigit_4: {}, // 顯示分數第四位
                btnStatus: {
                    start: false, // 開始遊戲 // 顯示與否是由 hd_common.js 也會控制
                    again: false, // 再來一次
                },
            };
        },

        methods: {
            // 己方飛機相關
            /* PC版 鍵盤左右鍵控制己方飛機 */
            keyDown() {
                document.onkeydown = (e) => {
                    // 事件对象兼容
                    const e1 = e || event || window.event || arguments.callee.caller.arguments[0];
                    // keyCode：左 37；上 38；右 39;下 40
                    if (e1 && e1.keyCode == 37) { // 37 為左鍵的 keyCode
                        this.movePlane("left");
                    }
                    else if (e1 && e1.keyCode == 39) { // 39 為右鍵的 keyCode
                        this.movePlane("right");
                    }
                }
            },
            /* M版 手指壓住控制己方飛機 */
            fingerControl() {
                const vm = this;
                const MY_PLANE = document.getElementById("id_my_plane");
                const PLANE_WIDTH = 70;
                const DEVICE_WIDTH = document.body.clientWidth;
                MY_PLANE.addEventListener("touchmove", function (e) {
                    const TOUCH_POS_X = e.touches[0].clientX;
                    if (TOUCH_POS_X < (0 + PLANE_WIDTH / 2)) {
                        return;
                    }
                    else if (TOUCH_POS_X > ((DEVICE_WIDTH - PLANE_WIDTH) + (PLANE_WIDTH / 2))) {
                        return;
                    }
                    vm.myPlane.left = TOUCH_POS_X - PLANE_WIDTH / 2;
                    vm.myPlane.translateX = TOUCH_POS_X - PLANE_WIDTH / 2;
                });
            },
            /* 移動自己的飛機 */
            movePlane(directionParam) {
                const vm = this;
                if (directionParam === "left") {
                    if (vm.myPlane.left <= 0) { // 己方飛機已達畫面左方邊界，則無作用
                        return;
                    }
                    vm.myPlane.translateX -= 20; // 渲染畫面用
                    vm.myPlane.left -= 20; // 判定碰撞用
                }
                else if (directionParam === "right") {
                    if (vm.myPlane.left >= (801 - 70)) { // 己方飛機已達畫面右方邊界，則無作用
                        return;
                    }
                    vm.myPlane.translateX += 20; // 渲染畫面用
                    vm.myPlane.left += 20; // 判定碰撞用
                }
            },

            // 敵機相關
            /* 定時生產敵機 */
            createEnemy(timeIntervalParam, difficultyParam) {
                const vm = this;
                if (timeIntervalParam === 0) { // 不要生產敵機 // 並 clearInterval
                    vm.enemyList = [];
                    if (window.enemyTimer) {
                        clearInterval(window.enemyTimer);
                        window.enemyTimer === null;
                    }
                }
                else {
                    // 依據畫面寬度，動態調整敵機生成位置
                    /*      
                        - 尺寸判定標準：
                            - 414 ↓       6 個生成點 → 改為  5
                            - 414~750     9 個生成點 → 改為  8
                            - 750 ↑      12 個生成點 → 改為 11
                    */
                    const CW = Number(document.body.clientWidth); // 獲取螢幕寬度
                    const randomPositionArr = [];
                    let generateAmount;
                    if (CW <= 414) {
                        generateAmount = 7;
                        for (let i = 0; i < generateAmount - 1; i++) { // 最後一個會超出範圍，故選擇移除(不加入即為移除)
                            randomPositionArr.push(Number((CW / generateAmount * (i + 1)).toFixed(2)) - (22 / 2)); // 22 為 元素寬度 // 甚麼元素???
                            // toFixed 的回傳值型別為 string，為了保險起見，透過 Number() 轉換為 number 型別
                        }
                    }
                    else if (CW > 414 && CW <= 750) {
                        generateAmount = 10;
                        for (let i = 0; i < generateAmount - 1; i++) { // 最後一個會超出範圍，故選擇移除(不加入即為移除)
                            randomPositionArr.push(Number((CW / generateAmount * (i + 1)).toFixed(2)) - (22 / 2)); // 22 為 元素寬度 // 甚麼元素???
                        }
                    }
                    else if (CW >= 750) {
                        generateAmount = 15;
                        for (let i = 0; i < generateAmount - 1; i++) { // 最後一個會超出範圍，故選擇移除(不加入即為移除)
                            randomPositionArr.push(Number((750 / generateAmount * (i + 1)).toFixed(2))); // 22 為 元素寬度
                        }
                    }

                    window.enemyTimer = setInterval(function () {
                        const nowTime = new Date().getTime(); // 獲取時間戳記
                        const enemyRandomPosition = randomPositionArr[Math.floor(Math.random() * randomPositionArr.length)]; // 敵機隨機出現的位置
                        let bloodDefault; // 敵機血量
                        let enemyWidth; // 敵機寬度
                        let topDefault; // 初始位置 Y；初始位置 X 已於隨機陣列中決定
                        let enemyType; // 敵機類型 // 所有可能："small"、"medium"、"large"

                        // 敵機出現概率
                        /* 
                            第 1 關：
                                小： 100%
                            第 2 關：
                                小： 70% ； 中： 30%
                            第 3 關：
                                小： 60% ； 中： 30% ； 大： 10%
                            第 4 關：
                                小： 50% ； 中： 25% ； 大： 25%
                            第 5 關：
                                小： 20% ； 中： 40% ； 大： 40%
                        */
                        if (difficultyParam === 1) {
                            bloodDefault = 1; // 第一關全部的敵機都只有一滴血
                        }
                        else if (difficultyParam === 2) {
                            const percentData = [];
                            // 透過迴圈的方式將資料加入陣列，用以確保加入陣列的數量是正確的
                            for (let i = 0; i < 7; i++) {
                                percentData.push(1);
                            }
                            for (let i = 0; i < 3; i++) {
                                percentData.push(3);
                            }
                            bloodDefault = percentData[Math.floor(Math.random() * percentData.length)];
                            // 用 Math.floor 是因為 index 是從 0 起算；如果是從 1 起算，就要選用 Math.ceil
                        }
                        else if (difficultyParam === 3) {
                            const percentData = [];
                            for (let i = 0; i < 6; i++) {
                                percentData.push(1);
                            }
                            for (let i = 0; i < 3; i++) {
                                percentData.push(3);
                            }
                            percentData.push(5);
                            bloodDefault = percentData[Math.floor(Math.random() * percentData.length)];
                        }
                        else if (difficultyParam === 4) {
                            const percentData = [1, 1, 3, 5];
                            bloodDefault = percentData[Math.floor(Math.random() * percentData.length)];
                        }
                        else if (difficultyParam === 5) {
                            const percentData = [1, 3, 3, 5, 5];
                            bloodDefault = percentData[Math.floor(Math.random() * percentData.length)];
                        }

                        /* 依據血量決定圖片要用哪張 */
                        if (bloodDefault === 1) { // 大眼怪
                            enemyType = "small";
                            enemyWidth = 70;
                            topDefault = -54;
                            // 因為已經透過調整 class 動態改變背景圖片，所以就不需要再紀錄寬、高的參數了
                            // 要記錄寬的參數是因為需要動態調整生成位置
                            // topDefault 設成負的元素高是因為，要讓敵機看起來像是從畫面外慢慢進入到畫面中
                        }
                        else if (bloodDefault === 3) { // 外星人
                            enemyType = "medium";
                            enemyWidth = 110;
                            topDefault = -94;
                        }
                        else if (bloodDefault === 5) { // 死神
                            enemyType = "large";
                            enemyWidth = 190;
                            topDefault = -188;
                        }

                        const setting = {
                            enemyId: nowTime,
                            // 寬高寫在 css 裡面，再透過 enemyType 動態判斷要加上哪個 class
                            left: (enemyRandomPosition - (enemyWidth * 1 / 3)), // 遊戲畫面中的 X 位置 // 判定碰撞用
                            translateX: (enemyRandomPosition - (enemyWidth * 1 / 3)), // 遊戲畫面中的 X 位置 // 渲染用
                            top: topDefault, // 遊戲畫面中的 Y 位置 // 判定碰撞用
                            translateY: topDefault, // 遊戲畫面中的 Y 位置 // 渲染用
                            /* 
                                之所以要記錄兩種參數是因為：
                                translateY 相較於 position: absolute 效能更好，
                                但當時碰撞邏輯已經用 top、left 寫完了，改了會延長開發時程，
                                因此選擇直接加上 translateX、translateY 作為渲染用
                            */
                            hitted: false, // 是否被擊中 (中、大才會被動到，小的被打到一發就死了)
                            boom: false, // 碰撞狀態； true 為碰到子彈、 false 為沒碰到
                            bloodLeft: bloodDefault, // 殘餘血量
                            enemyType: enemyType, // "small"、"medium"、"large"
                        };
                        vm.enemyList.push(setting);

                        /* 關卡難度設定 */
                        if (difficultyParam === 1) { // level 1 // 0 - 100
                            vm.moveEnemy(nowTime, 10, 1);
                            // 綁定移動敵機的事件 (enemyIdParam, moveSpeed, moveDistance)
                            // 每 moveSpeed(ms) 移動 moveDistance(px)
                        }
                        else if (difficultyParam === 2) { // level 2 // 100 - 200
                            vm.moveEnemy(nowTime, 10, 1.25);
                        }
                        else if (difficultyParam === 3) { // level 3 // 200 - 300
                            vm.moveEnemy(nowTime, 10, 1.5);
                        }
                        else if (difficultyParam === 4) { // level 4 // 300 - 600
                            vm.moveEnemy(nowTime, 10, 1.75);
                        }
                        else if (difficultyParam === 5) { // level 5 // 600 - ∞
                            vm.moveEnemy(nowTime, 10, 2.5);
                        }
                    }, timeIntervalParam); // 這個參數越小，敵機生產速度越快 // 每秒生產 1000/timeIntervalParam 架敵機
                }
            },
            /* 移動敵機 */
            moveEnemy(enemyIdParam, moveSpeed, moveDistance) {
                // moveSpeed 越小，移動速度越快；每秒移動 1000/moveSpeed 次
                // 只會垂直 (y 方向) 移動
                const vm = this;
                setInterval(function () {
                    for (let i = 0; i < vm.enemyList.length; i++) {
                        if (vm.enemyList[i].enemyId === enemyIdParam) {
                            vm.enemyList[i].translateY += moveDistance;
                            vm.enemyList[i].top += moveDistance;
                            break;
                        }
                    }
                }, moveSpeed);
            },
            /* 定時移除不在畫面中的敵機 */
            removeEnemy() {
                const vm = this;
                setInterval(function () {
                    const BOTTOM = 900; // 畫面顯示下緣邊界
                    for (let i = 0; i < vm.enemyList.length; i++) {
                        if (vm.enemyList[i].top >= BOTTOM) {
                            vm.enemyList.splice(i, 1); // 從陣列中移除敵機
                        }
                    }
                }, 3000); // 每 3 秒清一次
            },

            // 子彈相關
            /* 定時生產子彈 */
            createBullet(timeIntervalParam) {
                const vm = this;
                if (timeIntervalParam === 0) { // 不要生產子彈
                    vm.bulletList = [];
                    clearInterval(window.createBulletTimer);
                }
                else {
                    window.createBulletTimer = setInterval(function () {
                        const nowTime = new Date().getTime();
                        const nowLeftPosition = vm.myPlane.left + (70 / 2) - (41 / 2); // 70 是己方飛機寬度； 41 是子彈寬度
                        const setting = {
                            bulletId: nowTime,
                            left: nowLeftPosition,
                            translateX: nowLeftPosition,
                            top: 397,
                            translateY: 397,
                            boom: false, // 是否已經和敵機碰撞； true 為 已經碰撞； false 為 尚未碰撞
                        };
                        vm.bulletList.push(setting);
                        vm.moveBullet(nowTime); // 綁定移動子彈的事件
                    }, timeIntervalParam); // 這個參數越小，子彈生產速度越快 // 1000 除以這個參數，就是每秒發射幾顆子彈
                }
            },
            /* 移動子彈 */
            moveBullet(bulletIdParam) {
                const vm = this;
                setInterval(function () {
                    for (let i = 0; i < vm.bulletList.length; i++) {
                        if (vm.bulletList[i].bulletId === bulletIdParam) {
                            vm.bulletList[i].translateY -= 30;
                            vm.bulletList[i].top -= 30;
                            break;
                        }
                    }
                }, 75); // 這個參數越小，子彈垂直移動速度越快
            },
            /* 定時移除不在畫面中的子彈 */
            removeBullet() {
                const vm = this;
                setInterval(function () {
                    const TOP = -27; // 子彈完全消失於畫面的上緣邊界
                    for (let i = 0; i < vm.bulletList.length; i++) {
                        if (vm.bulletList[i].top <= TOP) {
                            vm.bulletList.splice(i, 1);
                        }
                    }
                }, 3000); // 每 3 秒清一次
            },

            // 碰撞判定相關
            /* 碰撞判定 */
            checkCollision() {
                const vm = this;
                setInterval(function () {
                    // 雙層迴圈；外層 enemy (i)、內層 bullet (j)
                    for (let i = 0; i < vm.enemyList.length; i++) {
                        for (let j = 0; j < vm.bulletList.length; j++) {
                            /* 如果已經爆炸或不是遊玩中，那就停止計算此次迴圈 */
                            if (vm.playStatus !== "playing" || vm.enemyList[i].boom === true || vm.bulletList[j].boom === true) {
                                continue;
                            }

                            let enemyWidth;
                            let enemyHeight;

                            /* 透過敵機類型調整判斷邊界 */
                            {
                                if (vm.enemyList[i].enemyType === "small") { // 小敵機
                                    enemyWidth = 40;
                                    enemyHeight = 30;
                                }
                                else if (vm.enemyList[i].enemyType === "medium") { // 小敵機
                                    enemyWidth = 80;
                                    enemyHeight = 68;
                                }
                                else if (vm.enemyList[i].enemyType === "large") { // 小敵機
                                    enemyWidth = 146;
                                    enemyHeight = 145;
                                }
                            }
                            /* 1. 先檢查 敵機 與 子彈 的碰撞 */
                            {
                                // 檢查 敵機上方邊界 // 先不做，看會不會有甚麼特殊狀況發生 // 阿北！出事了阿北！ 這會造成不在畫面中，但已經產生的敵機被消滅 // 所以還是要寫
                                // 第一個條件為排除畫面外的碰撞計算 // 27 為子彈的高度
                                const CONDITION_TOP = (vm.bulletList[j].top - 27 > 0) && (vm.bulletList[j].top >= vm.enemyList[i].top - 27);
                                // 檢查 敵機下方邊界
                                const CONDITION_BOTTOM = vm.bulletList[j].top <= vm.enemyList[i].top + enemyHeight;
                                // 檢查 敵機左方邊界
                                const CONDITION_LEFT = vm.bulletList[j].left >= vm.enemyList[i].left - 41; // 40 為子彈的寬度
                                // 檢查 敵機右方邊界
                                const CONDITION_RIGHT = vm.bulletList[j].left <= vm.enemyList[i].left + enemyWidth;
                                // 以上條件皆符合，才可列入碰撞計算
                                const CONDITION = CONDITION_TOP && CONDITION_BOTTOM && CONDITION_LEFT && CONDITION_RIGHT;
                                if (CONDITION === true) {
                                    // 檢查 敵人機 血量
                                    if (vm.enemyList[i].bloodLeft === 1) {
                                        // 依據敵機圖片判斷是哪種，並據此判斷要增加的分數
                                        if (vm.enemyList[i].enemyType === "small") { // 小敵機
                                            vm.enemyList[i].boom = true;
                                            vm.finalScore += 10;
                                        }
                                        else if (vm.enemyList[i].enemyType === "medium") { // 中敵機
                                            vm.enemyList[i].boom = true;
                                            vm.finalScore += 20;
                                        }
                                        else if (vm.enemyList[i].enemyType === "large") { // 大敵機
                                            vm.enemyList[i].boom = true;
                                            vm.finalScore += 40;
                                        }
                                        vm.bulletList.splice(j, 1); // 移除子彈
                                    }
                                    else if (vm.enemyList[i].bloodLeft >= 2 && vm.enemyList[i].bloodLeft <= 5) {
                                        window.requestAnimationFrame(() => {
                                            vm.enemyList[i].hitted = true;
                                        });
                                        vm.enemyList[i].bloodLeft -= 1;
                                        vm.bulletList.splice(j, 1); // 移除子彈
                                    }
                                    else {
                                        continue;
                                    }
                                }
                                vm.enemyList[i].hitted = false;
                            }
                            /* 2. 再檢查 敵機 與 己方飛機 的碰撞 */
                            // 碰到就遊戲結束 gameover
                            {
                                // 檢查 碰撞上方邊界 
                                const CONDITION_TOP = vm.enemyList[i].top + enemyHeight > vm.myPlane.top;
                                // 檢查 敵機下方邊界
                                const CONDITION_BOTTOM = vm.enemyList[i].top < 540;
                                // 檢查 碰撞左方邊界 (己機位置 - 敵機寬度)
                                const CONDITION_LEFT = vm.enemyList[i].left + enemyWidth > vm.myPlane.left;
                                // 檢查 碰撞右方邊界 (己機位置 + 己機寬度)
                                const CONDITION_RIGHT = vm.myPlane.left + 70 > vm.enemyList[i].left; // 70 為己機寬度
                                // 以上條件皆符合，才可列入碰撞計算
                                const CONDITION = CONDITION_TOP && CONDITION_BOTTOM && CONDITION_LEFT && CONDITION_RIGHT;
                                if (CONDITION) { // 如果判定為有效碰撞(敵機與己方飛機)，則進行以下行為
                                    vm.btnStatus.start = false; // 隱藏 "開始遊戲"
                                    /* 移除所有子彈、敵機 */
                                    vm.bulletList = []; // 清空畫面中的子彈
                                    vm.createBullet(0); // 停止製造子彈
                                    vm.enemyList = [];  // 清空畫面中的敵機
                                    vm.createEnemy(0);  // 停止製造敵機
                                    /* 己機爆炸動畫 */
                                    window.requestAnimationFrame(() => {
                                        vm.myPlane.boom = true;
                                    });
                                    /* 隔 1 秒顯示 闖關失敗 + 螢幕裂開 */
                                    window.setTimeout(() => {
                                        vm.playStatus = "gameover";
                                        document.querySelector(".section1").classList.add("gameover"); // 調整背景
                                    }, 1000);
                                    /* 再隔 1.5 秒顯示 記分板 + 報名訊息 */
                                    window.setTimeout(() => {
                                        document.querySelector(".total").textContent = vm.finalScore; // 改寫公版記分板分數
                                        document.querySelector(".popMsg").classList.add("dp-block"); // 顯示公版記分板
                                    }, 2500);
                                    /* 再隔 1.5 秒顯示 重來按鈕 */
                                    window.setTimeout(() => {
                                        document.querySelector(".popMsg").classList.remove("dp-block"); //移除公版記分板
                                        vm.btnStatus.again = true; // 顯示 "再來一次"
                                        vm.playStatus = "pause"; // 移除"闖關失敗" (由 class = "fail" 控制)
                                        document.querySelector("body").classList.remove("noYScroll"); // 讓使用者能夠上下滑動
                                    }, 4000);
                                }
                            }
                        }
                    }
                }, 100); // 碰撞判定時間間距太短，可能會造成瀏覽器負荷過重；如果太長，又會造成無法及時判定碰撞；所以要拿捏好
            },

            // 關卡相關
            /* 開始遊戲 */
            startGame() {
                const vm = this;
                const DEVICE_WIDTH = document.body.clientWidth;
                const SCROLL_TO_POS = $(".pointArea").offset().top;
                const PLANE_WIDTH = 70;
                /* 點擊開始遊戲，將頁面滾動至指定位置 (位置同 點擊 "遊戲通關入口" 跳轉到的位置) */
                if (DEVICE_WIDTH >= 768) {
                    window.scrollTo({
                        top: SCROLL_TO_POS - 30, // 上方多一些留白的空間
                        behavior: "smooth",
                    });
                }
                else {
                    window.scrollTo({
                        top: SCROLL_TO_POS - 20, // 上方多一些留白的空間
                        behavior: "smooth",
                    });
                }
                vm.playStatus = "playing";
                vm.btnStatus.start = false; // 隱藏 "開始遊戲"
                $(".btn-start").hide(); // 隱藏 "開始遊戲"
                document.querySelector("body").classList.add("noYScroll"); // 禁止使用者上下滑動
                // 重置己機狀態
                /* 取消己機爆炸狀態 */
                vm.myPlane.boom = false;
                /* 將己機置中 */
                if (DEVICE_WIDTH >= 800) {
                    vm.myPlane.left = (800 / 2) - (PLANE_WIDTH / 2);
                    vm.myPlane.translateX = (800 / 2) - (PLANE_WIDTH / 2);
                }
                else {
                    vm.myPlane.left = (DEVICE_WIDTH / 2) - (PLANE_WIDTH / 2);
                    vm.myPlane.translateX = (DEVICE_WIDTH / 2) - (PLANE_WIDTH / 2);
                }
                // 子彈、敵機、碰撞
                /* 製造 + 移除不在畫面中 子彈 */
                vm.createBullet(225);
                vm.removeBullet();
                /* 製造 + 移除不在畫面中 敵機 */
                vm.createEnemy(1500, 1); // 生怪的時間間隔、難度
                vm.removeEnemy();
                /* 碰撞判定 */
                vm.checkCollision();
            },
            /* 點擊 "再來一次" 要觸發的相關功能 */
            again() {
                const vm = this;
                $(".btn-start").show(); // 顯示 "開始遊戲"
                vm.btnStatus.start = true; // 顯示 "開始遊戲"
                vm.btnStatus.again = false; // 隱藏 "再來一次"
                document.querySelector(".section1").classList.remove("gameover"); // 移除 破碎背景
                /* 重置分數顯示樣式 */
                vm.finalScore = 0;
                /* 重置分數顯示樣式 */
                vm.pointDigit_1 = { // 顯示分數第一位
                    twinkle: false, // 達特定分數要閃爍
                    zero: false,
                    one: false,
                    two: false,
                    three: false,
                    four: false,
                    five: false,
                    six: false,
                    seven: false,
                    eight: false,
                    nine: false,
                };
                vm.pointDigit_2 = { // 顯示分數第二位
                    twinkle: false, // 達特定分數要閃爍
                    zero: false,
                    one: false,
                    two: false,
                    three: false,
                    four: false,
                    five: false,
                    six: false,
                    seven: false,
                    eight: false,
                    nine: false,
                };
                vm.pointDigit_3 = { // 顯示分數第三位
                    twinkle: false, // 達特定分數要閃爍
                    zero: false,
                    one: false,
                    two: false,
                    three: false,
                    four: false,
                    five: false,
                    six: false,
                    seven: false,
                    eight: false,
                    nine: false,
                };
                vm.pointDigit_4 = { // 顯示分數第四位
                    twinkle: false, // 達特定分數要閃爍
                    zero: false,
                    one: false,
                    two: false,
                    three: false,
                    four: false,
                    five: false,
                    six: false,
                    seven: false,
                    eight: false,
                    nine: false,
                };
                /* 重置報名訊息 */
                $(".popMsg > .title").text("报名失败");
                $(".msgText").text("分数未达门槛，报名失败");
            },
            /* 分數閃爍 */
            scoreTwinkle(param) {
                const vm = this;
                if (param === true) {
                    vm.pointTwinkle = true;
                    vm.pointDigit_1.twinkle = true;
                    vm.pointDigit_2.twinkle = true;
                    vm.pointDigit_3.twinkle = true;
                    vm.pointDigit_4.twinkle = true;
                }
                else {
                    vm.pointTwinkle = false;
                    vm.pointDigit_1.twinkle = false;
                    vm.pointDigit_2.twinkle = false;
                    vm.pointDigit_3.twinkle = false;
                    vm.pointDigit_4.twinkle = false;
                }
            },
            /* 報名活動 */
            signUp() {
                $(".popMsg > .title").text("报名成功");
                $(".msgText").text("请对应于下方奖励资格");
            },

            // 其他
            /* 產生隨機時間間隔 */
            generateRandomTime() {
                return (Math.ceil(Math.random() * 3) + 2) * 1000; // 因為爆炸的動畫就要花 1 秒了，所以秒數記得要再 + 1
            },
        },

        watch: {
            /* 自行渲染數字 */
            finalScore: {
                handler: function (newVal, oldVal) {
                    const vm = this;
                    let print;
                    /* 原始分數的開頭要補上幾個 0 */
                    if (newVal < 10) { //  補三個0
                        print = `000${vm.finalScore.toString()}`;
                    }
                    else if (newVal < 100) { //  補兩個0
                        print = `00${vm.finalScore.toString()}`;
                    }
                    else if (newVal < 1000) { //  補一個0
                        print = `0${vm.finalScore.toString()}`;
                    }
                    else {
                        print = `${vm.finalScore.toString()}`;
                    }

                    function renderDigit(digitParam, placeParam) {
                        /* 
                            參數意義：

                            digitParams： 實際數字
                            place： 第幾位
                                1： 千
                                2： 百
                                3： 十
                                4： 個 (好像可以不用判斷，因為永遠都是 0)

                            例如： renderDigit(print[0], 1) 表示，原始分數第一位(第一項 index 為 0)，要渲染到 pointDigit_1 這個陣列中
                        */

                        vm[`pointDigit_${placeParam}`] = {
                            zero: false,
                            one: false,
                            two: false,
                            three: false,
                            four: false,
                            five: false,
                            six: false,
                            seven: false,
                            eight: false,
                            nine: false,
                        };

                        switch (digitParam) {
                            case "0":
                                vm[`pointDigit_${placeParam}`].zero = true;
                                break;
                            case "1":
                                vm[`pointDigit_${placeParam}`].one = true;
                                break;
                            case "2":
                                vm[`pointDigit_${placeParam}`].two = true;
                                break;
                            case "3":
                                vm[`pointDigit_${placeParam}`].three = true;
                                break;
                            case "4":
                                vm[`pointDigit_${placeParam}`].four = true;
                                break;
                            case "5":
                                vm[`pointDigit_${placeParam}`].five = true;
                                break;
                            case "6":
                                vm[`pointDigit_${placeParam}`].six = true;
                                break;
                            case "7":
                                vm[`pointDigit_${placeParam}`].seven = true;
                                break;
                            case "8":
                                vm[`pointDigit_${placeParam}`].eight = true;
                                break;
                            case "9":
                                vm[`pointDigit_${placeParam}`].nine = true;
                                break;
                        }
                    }
                    renderDigit(print[0], 1);
                    renderDigit(print[1], 2);
                    renderDigit(print[2], 3);
                    renderDigit(print[3], 4);

                    /* 通關判定 */
                    // 先渲染完，再依據分數判斷是否要閃爍
                    if (newVal >= 100 && oldVal < 100) {
                        vm.scoreTwinkle(true);
                        window.setTimeout(() => {
                            vm.scoreTwinkle(false);
                        }, 2000); // 閃 2 秒
                        vm.createEnemy(0); // 清除畫面上的敵機
                        vm.createEnemy(1500, 2); // 生怪的時間間隔、難度
                        vm.signUp();
                    }
                    else if (newVal >= 200 && oldVal < 200) {
                        vm.scoreTwinkle(true);
                        window.setTimeout(() => {
                            vm.scoreTwinkle(false);
                        }, 2000);
                        vm.createEnemy(0);
                        vm.createEnemy(1500, 3);
                        vm.signUp();
                    }
                    else if (newVal >= 300 && oldVal < 300) {
                        vm.scoreTwinkle(true);
                        window.setTimeout(() => {
                            vm.scoreTwinkle(false);
                        }, 2000);
                        vm.createEnemy(0);
                        vm.createEnemy(1500, 4);
                        vm.signUp();
                    }
                    else if (newVal >= 600 && oldVal < 600) {
                        vm.scoreTwinkle(true);
                        window.setTimeout(() => {
                            vm.scoreTwinkle(false);
                        }, 2000);
                        vm.createEnemy(0);
                        vm.createEnemy(1050, 5);
                        vm.signUp();
                    }
                },
                deep: true,
            },
        },

        mounted() {
            const vm = this;
            /* 移動判定 */
            vm.keyDown(); // PC 版
            vm.fingerControl(); // M 版
            /* 綁定監聽，點擊 "遊戲通關入口" 跳轉至指定位置 */
            const DEVICE_WIDTH = document.body.clientWidth; // 動態抓取裝置寬度
            const SCROLL_TO_POS = $(".pointArea").offset().top; // 先獲取指定元素距離文件頂部多少距離 // .offset() 為 jQuery 的方法
            if (DEVICE_WIDTH >= 768) {
                // 再綁定監聽，點擊按鈕時滾動至該位置
                $(".badge a")[0].addEventListener("click", function (e) {
                    e.preventDefault();
                    window.scrollTo({
                        top: SCROLL_TO_POS - 30, // 上方多一些留白的空間
                        behavior: "smooth",
                    });
                });
            }
            else {
                $(".badge a")[0].addEventListener("click", function (e) {
                    e.preventDefault();
                    window.scrollTo({
                        top: SCROLL_TO_POS - 20, // 上方多一些留白的空間
                        behavior: "smooth",
                    });
                });
            }
            /* 綁定點擊 banner 敵人，會爆炸消失的效果 */
            function bannerBang(enemySizeParam) {
                $(`#banner_enemy_${enemySizeParam}`)[0].addEventListener("click", function () {
                    $(`#banner_enemy_${enemySizeParam} div`)[0].classList.add("boom");
                    $(`#banner_enemy_${enemySizeParam} .frontSight`)[0].classList.add("boom");
                    window.setTimeout(() => {
                        $(`#banner_enemy_${enemySizeParam} div`)[0].classList.remove("boom");
                        $(`#banner_enemy_${enemySizeParam} .frontSight`)[0].classList.remove("boom");
                    }, vm.generateRandomTime());
                });
            }
            bannerBang("small");
            bannerBang("medium");
            bannerBang("large");
            /* 確認目前有綁定哪些監聽事件 */
            // 在 chrome devtool Console 輸入： getEventListeners(window)
        },
    });
})();