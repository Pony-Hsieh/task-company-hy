const btnClickHandler = new ButtonClickHandler();

// 使用倒數計時模組
const countdownTimer = new CountdownTimer(
  '#countdownTimer',
  getLastDate(),
  true,
);
countdownTimer.start();

// 使用 modal 模組
const modalFactory = new ModalFactory();
modalFactory.getModal('rulesModal', ['#showRulesModalBtn'], true);