// 須一併引入 jQuery

/** 使用範例
    const modalFactory = new ModalFactory();
    modalFactory.getModal('rulesModal', ['#showRulesModalBtn'], true);

    html 結構可參考 hd.hxfx.com\activity\2024\hd_2409_xkh.html 中 id="rulesModal" 的部分
   */

// 使用工廠類，創建和管理 Modal 實例
class ModalFactory {
  constructor() {
    this.modals = new Map();
  }

  getModal(modalId, showModalTriggerList = [], autoUpdateDate = false) {
    if (this.modals.has(modalId)) {
      return this.modals.get(modalId);
    }
    // 如果 modalId 不在 Map 中，創建新的 Modal 實例並添加到 Map
    const modal = new Modal(modalId, showModalTriggerList, autoUpdateDate);
    this.modals.set(modalId, modal);
  }
}

/**
 * Modal 類用於創建和管理模態框。
 * @class
 */
class Modal {
  /**
   * 創建一個新的 Modal 實例。
   * @param {string} modalId - modal ID，用於選擇該 modal
   * @param {Array<string>} showModalTriggerList - 一個包含觸發 modal 顯示的元素選擇器的陣列。
   * @param {boolean} [autoUpdateDate=false] - 是否自動更新日期。預設為 false。
   * @throws {Error} 如果 modalId 未提供，則拋出錯誤。
   * @warn 如果 showModalTriggerList 為空，則發出警告。
   */
  constructor(modalId, showModalTriggerList, autoUpdateDate = false) {
    if (!modalId) {
      throw new Error('請傳入 modalId');
    }
    if (showModalTriggerList.length === 0) {
      console.warn('沒有傳入任何用於開啟 modal 的 trigger');
    }

    this.modalId = modalId;
    this.modalIdStr = `#${modalId}`;
    this.modal = $(this.modalIdStr);
    this.modalContent = $(`${this.modalIdStr} .modal-content`);
    this.modalCloseBtn = $(`${this.modalIdStr} .modal-close-btn`);
    this.modalOverlay = $(`${this.modalIdStr} .modal-overlay`);

    this.showModalTriggerList = showModalTriggerList;
    this.isModalOpen = false;

    this.bindEvents();

    if (autoUpdateDate) {
      this.updateDate();
    }
  }

  /**
   * 更新 modal 中的日期顯示。
   */
  updateDate() {
    const date = new Date();
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const lastDay = new Date(y, m, 0).getDate();
    const dateContent = `${y}/${m}/1-${y}/${m}/${lastDay}`;
    $('.jsRuleDate').html(dateContent);
    $('.jsLastDay').html(`${y}/${m}/${lastDay}`);
  }

  /**
   * 綁定所有 modal 相關的事件。
   * 包括點擊背景或關閉按鈕隱藏 modal，點擊觸發器顯示 modal，以及按下 Esc 鍵隱藏 modal。
   */
  bindEvents() {
    // 點擊背景，隱藏 modal
    this.modalOverlay.click(() => {
      this.hideModal();
    });

    // 點擊關閉按鈕，隱藏 modal
    this.modalCloseBtn.click(() => {
      this.hideModal();
    });

    // 綁定觸發器點擊事件
    if (this.showModalTriggerList.length > 0) {
      this.showModalTriggerList.forEach((eachTrigger) => {
        $(eachTrigger).click(() => {
          this.showModal();
        });
      });
    }

    // 按下 Esc 鍵，隱藏 modal
    $(document).ready(() => {
      $(document).keydown((event) => {
        if (!this.isModalOpen) {
          return;
        }
        if (event.key === 'Escape' || event.keyCode === 27) {
          this.hideModal();
        }
      });
    });
  }

  /**
   * 顯示 modal。
   * 將 modal 的 `display` 屬性設定為 `flex`，並使用淡入效果顯示 modal 內容。
   * 禁用頁面滾動，並更新 modal 的狀態。
   */
  showModal() {
    this.modal.css('display', 'flex').hide().fadeIn();
    this.modalContent.slideDown();
    $('body').addClass('no-scroll'); // 禁用頁面滾動
    this.isModalOpen = true; // 更新 modal 狀態
  }

  /**
   * 隱藏 modal。
   * 使用淡出效果隱藏 modal 內容，並啟用頁面滾動。
   * 更新 modal 的狀態。
   */
  hideModal() {
    this.modal.fadeOut();
    this.modalContent.slideUp();
    $('body').removeClass('no-scroll'); // 啟用頁面滾動
    this.isModalOpen = false; // 更新 modal 狀態
  }
}
