(function () {
    const gameVueObj = new Vue({
        el: "#gameArea",

        data() {
            return {
                level: 0, // 目前通過第幾關
                /**
                 * game_status 所有參數：
                 * - "pause"     // 暫停(包含遊戲開始前、關卡間的切換)
                 * - "playing"   // 遊戲中
                 * - "game_over" // 遊戲結束
                 */
                game_status: "pause",
                remaining_time: {
                    seconds: 0, // 剩餘秒數
                    showing_remaining_time: "", // 顯示用剩餘秒數 (因為小於 10 秒首位要補 0)
                    background_style: "start_with_3",
                },
                target: {
                    target_wrong: { // 使用者沒有點擊到正確的選項時要用的
                        translateX: 0,
                        translateY: 0,
                        show: false
                    },
                    target_1: {
                        found: false, // 是否已被發現
                    },
                    target_2: {
                        found: false,
                    },
                    target_3: {
                        found: false,
                    },
                },
                btn_status: {
                    start: true, // 開始遊戲
                    restart: false, // 再來一次
                },
                showBeatLevelMessage: false,
                showAnimationBeforeStart: false,
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
             * 生成圖片中的錯誤提示
             */
            generateWrongHint(e) {
                const vm = this;
                const allClassName = Array.from(e.target.classList);
                if (allClassName.includes("target")) {
                    return;
                }
                if (vm.target.target_wrong.show) {
                    clearTimeout(window.g_timer);
                    vm.target.target_wrong.show = false;
                }
                vm.target.target_wrong.translateX = e.offsetX - vm.calRemToPx(1.4 / 2);
                vm.target.target_wrong.translateY = e.offsetY - vm.calRemToPx(1.4 / 2);
                vm.target.target_wrong.show = true;
                window.g_timer = setTimeout(() => {
                    vm.target.target_wrong.translateX = -200;
                    vm.target.target_wrong.translateY = -200;
                    vm.target.target_wrong.show = false;
                }, 800);
            },

            /**
             * 重置目標
             */
            resetTarget() {
                const vm = this;
                // TODO: 最後再回頭檢查需要重置的資料是否有誤
                vm.target = {
                    target_wrong: {
                        translateX: 0,
                        translateY: 0,
                        show: false
                    },
                    target_1: {
                        found: false
                    },
                    target_2: {
                        found: false
                    },
                    target_3: {
                        found: false
                    }
                };
            },

            /**
             * 重置按鈕
             */
            resetBtnStatus() {
                const vm = this;
                for (const btn in vm.btn_status) {
                    vm.btn_status[btn] = false;
                }
            },

            /**
             * 串接兩關
             */
            connectBetweenTwoLevels() {
                const vm = this;
                clearInterval(window.g_gameCountDownTimer);
                vm.game_status = "pause";
                vm.showBeatLevelMessage = true;
                if (vm.level === 4) {
                    setTimeout(() => {
                        vm.showBeatLevelMessage = false;
                        vm.btn_status.restart = true;
                    }, 3000);
                }
                else {
                    setTimeout(() => {
                        vm.showBeatLevelMessage = false;
                        vm.showAnimationBeforeStart = true;
                        vm.resetTarget();
                        vm.level++;
                        // 遮罩顯示的時候，秒數顯示為接下來那關的秒數
                        if (vm.level === 1) {
                            vm.remaining_time.seconds = 40;
                        }
                        else if (vm.level === 2) {
                            vm.remaining_time.seconds = 30;
                        }
                        else if (vm.level === 3) {
                            vm.remaining_time.seconds = 20;
                        }
                        else if (vm.level === 4) {
                            vm.remaining_time.seconds = 10;
                        }
                        setTimeout(() => {
                            vm.showAnimationBeforeStart = false;
                            vm.game_status = "playing";
                            vm.gameCountDown(vm.level); // 開始倒數
                        }, 3000);
                    }, 3000);
                }
            },

            /**
             * 判定單一目標點擊
             * @param {number} - 點擊目標編號，ex: 1
             */
            judgeSingleTarget(targetNum) {
                const vm = this;
                vm.target[`target_${targetNum}`].found = true;
                if (vm.judgeAllTargets()) {
                    vm.connectBetweenTwoLevels();
                }
            },

            /**
             * 判定目前所有目標是否都被點擊過
             * @return {boolean}
             */
            judgeAllTargets() {
                const vm = this;
                if (vm.target.target_1.found === true
                    && vm.target.target_2.found === true
                    && vm.target.target_3.found === true) {
                    return true;
                }
                else {
                    return false;
                }
            },

            /**
             * 遊戲時間倒數
             * @param {number} level - 接下來要進到第幾關
             */
            gameCountDown(level) {
                const vm = this;
                if (level === 1) {
                    vm.remaining_time.seconds = 40;
                }
                else if (level === 2) {
                    vm.remaining_time.seconds = 30;
                }
                else if (level === 3) {
                    vm.remaining_time.seconds = 20;
                }
                else if (level === 4) {
                    vm.remaining_time.seconds = 10;
                }
                window.g_gameCountDownTimer = setInterval(() => {
                    vm.remaining_time.seconds--;
                    if (vm.remaining_time.seconds <= 0 || vm.game_status !== "playing") {
                        clearInterval(window.g_gameCountDownTimer);
                    }
                }, 1000);
            },

            /**
             * 判斷剩餘秒數開頭是否需要補 0
             * @param {number} seconds - 目前剩餘秒數
             * @return {string} - 目前剩餘秒數 (調整格式後)
             */
            addZero(seconds) {
                return seconds >= 10 ? `${seconds}` : `0${seconds}`;
            },

            /* 通用 function end */



            /* 關卡相關 function start */

            /**
             * 開始遊戲
             */
            startGame() {
                const vm = this;
                vm.showAnimationBeforeStart = true;
                vm.resetBtnStatus();
                vm.resetTarget();
                vm.remaining_time.seconds = 40;
                vm.level = 1;
                setTimeout(() => {
                    vm.showAnimationBeforeStart = false;
                    vm.gameCountDown(1);
                    vm.game_status = "playing";
                }, 3100);
            },

            /**
             * 遊戲結束
             */
            gameOver() {
                const vm = this;
                vm.remaining_time.seconds = 0;
                vm.game_status = "game_over";
                setTimeout(() => {
                    vm.game_status = "pause";
                    vm.resetTarget();
                    vm.btn_status.restart = true;
                }, 2000);
            },

            /* 關卡相關 function end */
        },

        watch: {
            remaining_time: {
                handler: function (newVal) {
                    const vm = this;
                    // 依據秒數調整背景
                    if (newVal.seconds >= 31) {
                        vm.remaining_time.background_style = "start_with_3";
                    }
                    else if (newVal.seconds >= 21) {
                        vm.remaining_time.background_style = "start_with_2";
                    }
                    else if (newVal.seconds >= 11) {
                        vm.remaining_time.background_style = "start_with_1";
                    }
                    else if (newVal.seconds >= 0) {
                        vm.remaining_time.background_style = "start_with_0";
                    }
                    if (newVal.seconds <= 0 && vm.judgeAllTargets() === false) {
                        if (vm.btn_status.restart === true) {
                            return;
                        }
                        vm.gameOver();
                    }
                },
                deep: true,
            }
        },

        mounted() {
            // 綁定監聽，點擊 "遊戲通關入口" 跳轉至指定位置
            const DEVICE_WIDTH = document.body.clientWidth; // 動態抓取裝置寬度
            const SCROLL_TO_POS = $(".game-mask").offset().top; // 先獲取指定元素距離文件頂部多少距離 // .offset() 為 jQuery 的方法
            if (DEVICE_WIDTH >= 768) {
                // 再綁定監聽，點擊按鈕時滾動至該位置
                $(".badge a")[0].addEventListener("click", function () {
                    window.scrollTo({
                        top: SCROLL_TO_POS,
                        behavior: "smooth",
                    });
                });
            }
            else {
                $(".badge a")[0].addEventListener("click", function () {
                    window.scrollTo({
                        top: SCROLL_TO_POS,
                        behavior: "smooth",
                    });
                });
            }

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

    window.GAME_VUE_INTSTANCE = gameVueObj; // 將 gameVueObj 綁定到 window 上
})();