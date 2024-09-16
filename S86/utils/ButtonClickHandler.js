class ButtonClickHandler {
  constructor() {
    this.myid = 'https://open.kabi83.com/';
    this.appWeb = 'https://www.660001.net';
    this.store =
      window.navigator.userAgent.indexOf('googleplay') > -1 ? 'googleplay' : '';
    this.account = getAccount();
    this.isNewApp = isNewApp();
  }

  redirectToInviteFriendsPage() {
    const params = {
      account: this.account,
    };
    const url = `${this.appWeb}/#/invite?${objToUrlParam(params)}`;
    window.location.href = url;
  }

  handleCsClick() {
    chat.cs();
  }

  handleOpenAccountClick() {
    if (this.isNewApp) {
      window.location.href = 'sv://register';
      return;
    }
    const params = {
      parentId: this.account,
      action: 0,
    };
    const url = `${this.myid}/new/register.html?${objToUrlParam(params)}`;
    window.location.href = url;
  }

  handleDepositClick() {
    if (this.isNewApp) {
      window.location.href = 'sv://deposit';
      return;
    }
    const params = {
      parentId: this.account,
      action: 0,
    };
    const url = `${this.myid}/new/register.html?${objToUrlParam(params)}`;
    window.location.href = url;
  }

  handleDownloadClick() {
    const params = {
      account: this.account,
      act: 'download',
    };
    const url = `
      ${this.appWeb}${
      this.store === 'googleplay'
        ? '/lp/platform/googleplay.html'
        : '/lp/platform/index.html'
    }?${objToUrlParam(params)}`;
    window.location.href = url;
  }

  handleInviteFriendsClick() {
    this.redirectToInviteFriendsPage();
  }

  handleCouponClick() {
    this.redirectToInviteFriendsPage();
  }
}
