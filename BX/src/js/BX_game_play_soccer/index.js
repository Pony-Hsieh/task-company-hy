(function () {
    new Vue({
        el: "#game-area",

        data() {
            return {
                level: 1, // 目前通過第幾關
                /**
                 * game_status 所有參數：
                 * - "pause"     // 暫停(包含遊戲開始前、關卡間的切換)
                 * - "playing"   // 遊戲中
                 * - "game_over" // 遊戲結束
                 */
                game_status: "pause",
                btn_status: {
                    start: true, // 開始遊戲
                    restart: false, // 再來一次
                },
                show_message: {
                    goal_successfully: false, // 射門成功提示動畫
                    fail: false, // 闖關失敗
                    bonus_1: false, // 恭喜通關
                    bonus_2: false, // 再加碼 3 美元
                },
                show_animation_before_start: {
                    status: false,
                    time: 3000, // 單位：ms // 開始前動畫時長
                },
                interval_id: {
                    countdown_seconds: null,
                    rotate_pointer: null,
                    move_soccer: null,
                    move_goalkeeper: null,
                },
                degree: {
                    value: 0, // 指針偏移角度 // 可用於控制顯示指針偏移量、足球移動方向
                    move_direction: "left" // "left"、"right"
                },
                goal: { // 球門
                    x: 0,
                    y: 0,
                    width: 5.7, // 單位： rem
                    height: 2.9, // 單位： rem
                },
                goalkeeper: { // 守門員位置
                    x: 0, // 僅移動 x
                    y: 0, // y 基本上是固定的
                    width: 1.54, // 單位： rem
                    height: 1.72, // 單位： rem
                    move_direction: "left", // "left"、"right"
                    move_unit: 5,
                },
                soccer: { // 足球位置
                    x: 0,
                    y: 0,
                    width: 0.8, // 單位： rem
                    height: 0.8, // 單位： rem
                    goal_status: "spinning", // "spinning"、"in"、"out"、"reset" // in 為進球、out 為沒進(被守門員擋下或射到門外)
                    move_time: 800, // 單位： ms // 足球移動動畫需時 0.8 秒
                    moving_direction: "original", // "original"、"forward"、"backward"
                },
                remaining_time: 30, // 剩餘秒數
                time_digit: { // 顯示秒數
                    tens_digit: { // 顯示秒數 個位數
                        zero: false,
                        one: false,
                        two: false,
                        three: true,
                        four: false,
                        five: false,
                        six: false,
                        seven: false,
                        eight: false,
                        nine: false,
                    },
                    unit_digit: { // 顯示秒數 個位數
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
                    },
                },
                news_ticker: { // 跑馬燈訊息
                    msg: {
                        start: false,
                        game_over: false,
                        news_ticker_complete_level_1: false,
                        news_ticker_complete_level_2: false,
                        news_ticker_complete_level_3: false,
                    },
                    show_time: 3000, // 顯示時間 // scss 中有動畫相關設定
                },
            }
        },

        methods: {
            /* 通用 function start */


            /**
             * 將 rem 轉換為 px
             */
            calRemToPx(remParam) {
                if (typeof remParam !== "number") {
                    return false;
                }
                const CW = document.body.clientWidth;
                let remToPixel = 0;
                if (window.innerWidth <= 768) {
                    remToPixel = CW / 7.68;
                }
                else if (window.innerWidth >= 1920) {
                    remToPixel = 1920 / 19.2;
                }
                else {
                    remToPixel = CW / 19.2;
                }
                return remToPixel * remParam;
            },

            /**
             * 計算球門初始位置
             */
            calGoalOriginalPosition() {
                const vm = this;
                vm.goal.x = vm.calRemToPx(0.9);
                vm.goal.y = vm.calRemToPx(0);
            },

            /**
             * 計算守門員初始位置
             */
            calGoalkeeperOriginalPosition() {
                const vm = this;
                // 水平置中
                vm.goalkeeper.x = vm.calRemToPx(7.5 / 2 - vm.goalkeeper.width / 2);
                vm.goalkeeper.y = vm.calRemToPx(vm.goal.height - vm.goalkeeper.height);
            },

            /**
             * 計算足球初始位置
             */
            calSoccerOriginalPosition() {
                const vm = this;
                vm.soccer.x = vm.calRemToPx(7.5 / 2 - vm.soccer.width / 2);
                // 不太確定為什麼是 5.6，但畫面上看起來是剛好的
                vm.soccer.y = vm.calRemToPx(5.6);
            },

            /**
             * 從指標的旋轉角度換算出足球如何移動
             */
            calSoccerMove() {
                const vm = this;
                // vm.degree.value = ±35° 測試起來應該是極限
                const deltaY = vm.calRemToPx(5.6 - vm.goal.height + vm.soccer.height); // 全部 - 球門高 + 足球高
                const deltaX = deltaY * Math.tan(vm.degree.value * (Math.PI / 180));
                vm.soccer.x += deltaX;
                vm.soccer.y -= deltaY;
                clearInterval(vm.interval_id.rotate_pointer);
                vm.interval_id.rotate_pointer = null;
            },

            /**
             * 隨機決定指針初始偏移方向
             */
            randomlyDecidePointerDirection() {
                const vm = this;
                if (Math.random() > 0.5) {
                    vm.degree.move_direction = "left";
                }
                else {
                    vm.degree.move_direction = "right";
                }
            },

            /**
             * 定時旋轉角度(單位：deg)
             */
            rotatePointer() {
                const vm = this;
                vm.interval_id.rotate_pointer = setInterval(function () {
                    // 實測後發現兩側的角度極限約為 32°
                    const rotate_degree = 32;
                    if (vm.degree.move_direction === "left") {
                        if (vm.degree.value <= rotate_degree && vm.degree.value >= rotate_degree * -1) {
                            vm.degree.value -= 2;
                        }
                        if (vm.degree.value > rotate_degree || vm.degree.value < rotate_degree * -1) {
                            vm.degree.move_direction = "right";
                            vm.degree.value += 2;
                        }
                    }
                    else if (vm.degree.move_direction === "right") {
                        if (vm.degree.value <= rotate_degree && vm.degree.value >= rotate_degree * -1) {
                            vm.degree.value += 2;
                        }
                        if (vm.degree.value > rotate_degree || vm.degree.value < rotate_degree * -1) {
                            vm.degree.move_direction = "left";
                            vm.degree.value -= 2;
                        }
                    }
                }, 45);
            },

            /**
             * 移動守門員
             */
            moveGoalkeeper() {
                const vm = this;
                let interval = 0;
                vm.goalkeeper.move_unit = 0;

                // 依據遊戲狀態判定
                if (vm.game_status !== "playing") {
                    return;
                }
                // 依據 關卡 判定
                if (vm.level === 2) {
                    // 慢速移動
                    interval = 50;
                    vm.goalkeeper.move_unit = 5;
                }
                else if (vm.level === 3) {
                    // 快速移動
                    interval = 50;
                    vm.goalkeeper.move_unit = 8;
                }
                else {
                    return;
                }

                vm.interval_id.move_goalkeeper = setInterval(function () {
                    if (vm.goalkeeper.move_direction === "left") {
                        vm.goalkeeper.x -= vm.goalkeeper.move_unit;
                        if (vm.goalkeeper.x < vm.goal.x) {
                            vm.goalkeeper.move_direction = "right";
                            vm.goalkeeper.x += vm.goalkeeper.move_unit;
                        }
                    }
                    else if (vm.goalkeeper.move_direction === "right") {
                        vm.goalkeeper.x += vm.goalkeeper.move_unit;
                        if (vm.goalkeeper.x + vm.calRemToPx(vm.goalkeeper.width) > vm.goal.x + vm.calRemToPx(vm.goal.width)) {
                            vm.goalkeeper.move_direction = "left";
                            vm.goalkeeper.x -= vm.goalkeeper.move_unit;
                        }
                    }
                }, interval);
            },

            /**
             * 判斷是否射門成功
             * @return {boolean} true - 射門成功, false - 射門失敗
             */
            judgeSoccerGoal() {
                const vm = this;
                // 條件： 是否在遊戲中？
                if (vm.game_status !== "playing") {
                    return;
                }

                // 條件： 是否在球門範圍內？
                // (目前指針的擺動範圍，一定會在球門範圍內)

                // 條件： 球是否與守門員碰撞？
                if (vm.soccer.x + vm.calRemToPx(vm.soccer.width) <= vm.goalkeeper.x) { // 球在人左邊，守門員沒碰到
                    vm.soccer.goal_status = "in";
                    return true;
                }
                else if (vm.goalkeeper.x + vm.calRemToPx(vm.goalkeeper.width) <= vm.soccer.x) { // 球在人右邊，守門員沒碰到
                    vm.soccer.goal_status = "in";
                    return true;
                }
                else { // 守門員守到了
                    vm.soccer.goal_status = "out";
                    return false;
                }
            },

            /**
             * 重置沒踢進的足球資訊
             */
            resetOutSoccer() {
                const vm = this;
                vm.calSoccerOriginalPosition();
                vm.soccer.moving_direction = "backward";
                setTimeout(function () {
                    vm.soccer.goal_status = "spinning";
                    vm.soccer.moving_direction = "original";
                }, vm.soccer.move_time);
            },

            /**
             * 點擊足球時，要觸發的相關事件
             */
            handleSoccerClick() {
                const vm = this;
                if (vm.game_status !== "playing") {
                    return;
                }
                if (vm.remaining_time < 0) {
                    return;
                }
                if (vm.soccer.moving_direction === "forward") {
                    return;
                }

                vm.soccer.moving_direction = "forward";
                vm.calSoccerMove();
                // 由於足球移動動畫需時 vm.soccer.move_time 秒，故 setTimeout vm.soccer.move_time 秒
                setTimeout(function () {
                    if (vm.judgeSoccerGoal()) { // 有射進
                        vm.connectBetweenTwoLevels();
                    }
                    else { // 沒射進
                        // n 秒後重置狀態
                        setTimeout(function () { // 沒射進
                            vm.resetOutSoccer();
                            vm.randomlyDecidePointerDirection();
                            vm.rotatePointer();
                            vm.moveGoalkeeper();
                        }, vm.soccer.move_time);
                        // }, 1000);
                    }
                    clearInterval(vm.interval_id.move_goalkeeper);
                }, vm.soccer.move_time);
            },

            /**
             * 將倒數的秒數渲染成特殊樣式
             */
            renderCountdownSecondsDigit() {
                const vm = this;
                vm.clearTimeDigit();
                const tens_digit = Math.floor(vm.remaining_time / 10); // 十位數
                const unit_digit = vm.remaining_time % 10; // 個位數
                switch (tens_digit) {
                    case 0:
                        vm.time_digit.tens_digit.zero = true;
                        break;
                    case 1:
                        vm.time_digit.tens_digit.one = true;
                        break;
                    case 2:
                        vm.time_digit.tens_digit.two = true;
                        break;
                    case 3:
                        vm.time_digit.tens_digit.three = true;
                        break;
                    case 4:
                        vm.time_digit.tens_digit.four = true;
                        break;
                    case 5:
                        vm.time_digit.tens_digit.five = true;
                        break;
                    case 6:
                        vm.time_digit.tens_digit.six = true;
                        break;
                    case 7:
                        vm.time_digit.tens_digit.seven = true;
                        break;
                    case 8:
                        vm.time_digit.tens_digit.eight = true;
                        break;
                    case 9:
                        vm.time_digit.tens_digit.nine = true;
                        break;
                }
                switch (unit_digit) {
                    case 0:
                        vm.time_digit.unit_digit.zero = true;
                        break;
                    case 1:
                        vm.time_digit.unit_digit.one = true;
                        break;
                    case 2:
                        vm.time_digit.unit_digit.two = true;
                        break;
                    case 3:
                        vm.time_digit.unit_digit.three = true;
                        break;
                    case 4:
                        vm.time_digit.unit_digit.four = true;
                        break;
                    case 5:
                        vm.time_digit.unit_digit.five = true;
                        break;
                    case 6:
                        vm.time_digit.unit_digit.six = true;
                        break;
                    case 7:
                        vm.time_digit.unit_digit.seven = true;
                        break;
                    case 8:
                        vm.time_digit.unit_digit.eight = true;
                        break;
                    case 9:
                        vm.time_digit.unit_digit.nine = true;
                        break;
                }
            },

            /**
             * 秒數倒數
             */
            countdownSeconds() {
                const vm = this;
                vm.interval_id.countdown_seconds = setInterval(function () {
                    vm.remaining_time -= 1;
                    vm.renderCountdownSecondsDigit();
                    if (vm.remaining_time <= 0 && vm.interval_id.countdown_seconds !== null) {
                        vm.show_message.fail = true;
                        vm.game_status = "game_over";
                        clearInterval(vm.interval_id.countdown_seconds); // 停止倒數計時
                        clearInterval(vm.interval_id.rotate_pointer); // 指針停止轉動
                        clearInterval(vm.interval_id.move_goalkeeper); // 守門員停止移動
                        setTimeout(function () {
                            vm.show_message.fail = false;
                            vm.game_status = "pause";
                            vm.btn_status.restart = true;
                        }, 3000);
                    }
                }, 1000);
            },

            /**
             * 歸零跑馬燈秒數顯示(重置顯示為 00 秒)
             */
            clearTimeDigit() {
                const vm = this;
                // 重置十位數
                for (const number in vm.time_digit.tens_digit) {
                    vm.time_digit.tens_digit[number] = false;
                }
                // 重置個位數
                for (const number in vm.time_digit.unit_digit) {
                    vm.time_digit.unit_digit[number] = false;
                }
            },

            /**
             * 將所有按鈕狀態設置為 false
             */
            clearBtnStatus() {
                const vm = this;
                for (const btn in vm.btn_status) {
                    vm.btn_status[btn] = false;
                }
            },

            /**
             * 將所有跑馬燈訊息狀態設置為 false
             */
            clearNewsTickerMsg() {
                const vm = this;
                for (const each_msg in vm.news_ticker.msg) {
                    vm.news_ticker.msg[each_msg] = false;
                }
            },

            /**
             * 將所有 interval id 設為 null
             */
            clearIntervalId() {
                const vm = this;
                for (const id in vm.interval_id) {
                    vm.interval_id[id] = null;
                }
            },

            /**
             * 串接兩關
             */
            connectBetweenTwoLevels() {
                const vm = this;
                if (vm.level === 1) {
                    vm.clearNewsTickerMsg();
                    vm.show_message.goal_successfully = true;
                    vm.news_ticker.msg.news_ticker_complete_level_1 = true;
                    setTimeout(function () {
                        vm.show_message.goal_successfully = false;
                    }, 2000);
                    setTimeout(function () {
                        vm.news_ticker.msg.news_ticker_complete_level_1 = false;
                        vm.level = 2;
                        vm.resetOutSoccer();
                        vm.randomlyDecidePointerDirection();
                        vm.rotatePointer();
                        vm.moveGoalkeeper();
                    }, vm.news_ticker.show_time);
                }
                else if (vm.level === 2) {
                    vm.clearNewsTickerMsg();
                    vm.show_message.goal_successfully = true;
                    vm.news_ticker.msg.news_ticker_complete_level_2 = true;
                    setTimeout(function () {
                        vm.show_message.goal_successfully = false;
                    }, 2000);
                    setTimeout(function () {
                        vm.news_ticker.msg.news_ticker_complete_level_2 = false;
                        vm.level = 3;
                        vm.resetOutSoccer();
                        vm.randomlyDecidePointerDirection();
                        vm.rotatePointer();
                        vm.moveGoalkeeper();
                    }, vm.news_ticker.show_time);
                }
                else if (vm.level === 3) { // 最後一關
                    vm.clearNewsTickerMsg();
                    vm.show_message.goal_successfully = true;
                    vm.news_ticker.msg.news_ticker_complete_level_3 = true;
                    clearInterval(vm.interval_id.countdown_seconds); // 停止倒數
                    setTimeout(function () {
                        vm.show_message.goal_successfully = false;
                    }, 2000);
                    setTimeout(function () {
                        vm.game_status = "pause";
                        vm.news_ticker.msg.news_ticker_complete_level_3 = false;
                        vm.show_message.bonus_1 = true;
                        setTimeout(function () {
                            vm.show_message.bonus_1 = false;
                            vm.show_message.bonus_2 = true;
                            setTimeout(function () {
                                vm.show_message.bonus_2 = false;
                                vm.btn_status.restart = true;
                            }, 3000);
                        }, 5000);
                    }, vm.news_ticker.show_time);
                }
            },

            /* 通用 function end */



            /* 關卡相關 function start */

            /**
             * 重置所有資料
             */
            resetAllData() {
                const vm = this;
                vm.level = 0;
                vm.game_status = "pause";
                vm.clearBtnStatus();
                vm.clearIntervalId();
                vm.clearNewsTickerMsg();
                vm.show_animation_before_start.status = false;
                vm.degree.value = 0;
                vm.degree.move_direction = "left";
                vm.degree.move_direction = "left";
                vm.calGoalOriginalPosition();
                vm.calGoalkeeperOriginalPosition();
                vm.resetOutSoccer();
                vm.remaining_time = 30
                vm.renderCountdownSecondsDigit();
            },

            /**
             * 開始遊戲
             */
            startGame() {
                const vm = this;
                vm.resetAllData();
                vm.show_animation_before_start.status = true;
                setTimeout(function () {
                    vm.show_animation_before_start.status = false;

                    vm.level = 1;

                    // 切換遊戲狀態 + 隱藏遮罩
                    vm.game_status = "playing";

                    // 旋轉指針
                    vm.randomlyDecidePointerDirection();
                    vm.rotatePointer();

                    // 秒數倒數
                    vm.countdownSeconds();
                }, vm.show_animation_before_start.time);
            },

            /* 關卡相關 function end */
        },

        // Vue 實體尚未與模板 (DOM 節點) 綁定
        beforeMount() {
            const vm = this;
            vm.calGoalOriginalPosition();
            vm.calSoccerOriginalPosition();
            vm.calGoalkeeperOriginalPosition();
        },

        // Vue 實體與掛載完成， el 的目標 DOM 被 $el 所替換 (可以視作 jQuery 的 Ready)
        mounted() {
            const vm = this;

            // 綁定監聽，點擊 "遊戲通關入口" 跳轉至指定位置
            const scroll_to_pos = $(".game-mask").offset().top; // 先獲取指定元素距離文件頂部多少距離 // .offset() 為 jQuery 的方法
            $(".badge")[0].addEventListener("click", function () {
                window.scrollTo({
                    top: scroll_to_pos,
                    behavior: "smooth",
                });
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

            // 確認目前有綁定哪些監聽事件
            // 在 chrome devtool Console 輸入： getEventListeners(window)
        },
    });
})();