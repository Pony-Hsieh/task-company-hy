function getLastDate() {
  const date = new Date();
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const lastDay = new Date(y, m, 0).getDate();
  const lastDate = `${y}-${m}-${lastDay}`;
  return lastDate;
}

function getQueryParameterValue(param) {
  try {
    const urlObj = new URL(window.location.href);
    const searchParams = new URLSearchParams(urlObj.search);
    const value = searchParams.get(param);
    return value || '';
  } catch (error) {
    console.error('無效的 URL 或其他錯誤:', error);
    return '';
  }
}

function getAccount() {
  try {
    return (
      getQueryParameterValue('account') ||
      getQueryParameterValue('loginName') ||
      sessionStorage.getItem('account') ||
      ''
    );
  } catch (error) {
    console.error('獲取帳號時發生錯誤：', error);
    return '';
  }
}

function isNewApp() {
  if (window.navigator.userAgent.indexOf('RhinoSmart') > -1) {
    return true;
  }
  return false;
}

function objToUrlParam(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return '';
  }

  const params = new URLSearchParams();

  Object.entries(obj).forEach(([key, value]) => {
    if (value !== '' && value !== undefined && value !== null) {
      params.append(key, value);
    }
  });

  return params.toString();
}
