/** 使用範例
    const countdownTimer = new CountdownTimer(
      "#countdownTimer",
      "2024-09-30",
      true
    );
    countdownTimer.start();
   */

class CountdownTimer {
  constructor(target, endTime, alwaysShow = false) {
    if (!target) {
      throw new Error('請傳入 target');
    }
    if (!endTime) {
      throw new Error('請傳入 endTime');
    }
    this.target = target;
    this.endTime = new Date(endTime);
    this.alwaysShow = alwaysShow;
    this.startTime = new Date();
    this.timeData = {};
    this.showTimerThresholdDays = alwaysShow ? 3650 : 10; // 預設小於截止時間前 10 天開始顯示
  }

  formatTimeUnit(unit) {
    return unit < 10 ? `0${unit}` : unit;
  }

  updateTimeData() {
    const now = new Date();
    // 單位： ms
    const timeRemaining = this.endTime - now;
    // 單位： 天
    const timeRemainingDays = Math.floor(timeRemaining / 1000 / (3600 * 24));

    // 剩餘天數大於閾值，則不顯示
    if (timeRemainingDays > this.showTimerThresholdDays) {
      $(this.target).html('');
      this.stop();
      return;
    }

    // 如果截止時間已過，停止計時
    if (timeRemaining <= 0) {
      this.timeData = {
        Day: '0',
        Hour: '00',
        Minute: '00',
        Second: '00',
      };
      this.renderTime();
      return;
    }

    const totalSeconds = Math.floor(timeRemaining / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    this.timeData = {
      Day: days,
      Hour: this.formatTimeUnit(hours),
      Minute: this.formatTimeUnit(minutes),
      Second: this.formatTimeUnit(seconds),
    };

    this.renderTime();

    return this.updateTimeData;
  }

  renderTime() {
    $(this.target).html(`
      <div class="countdown-wrapper">
        <ul class="countdown-time">
          <li class="day">${this.timeData.Day}</li>
          <li class="separator">天</li>
          <li class="hour">${this.timeData.Hour}</li>
          <li class="separator">:</li>
          <li class="minute">${this.timeData.Minute}</li>
          <li class="separator">:</li>
          <li class="second">${this.timeData.Second}</li>
        </ul>
      </div>
    `);
  }

  clear() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  start() {
    this.updateTimeData();
    this.clear();
    this.interval = setInterval(() => this.updateTimeData(), 1000);
  }

  stop() {
    this.clear();
  }
}
