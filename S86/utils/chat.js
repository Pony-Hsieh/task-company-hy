const chat = {
  online: function () {
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });
    const appUserId = params.loginName;
    const domain = 'xnz.svcustomerservice.com';
    const accountId = '137216';
    const userAccount = sessionStorage.getItem('account');
    const url = `https://${domain}//Web/im.aspx?_=t&accountid=${accountId}&visitorId=${
      appUserId || userAccount || ''
    }`;
    window.open(url);
  },
  cs: function () {
    this.online();
  },
};
