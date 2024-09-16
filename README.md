# 頁面對照

## 中國母公司官網改版
- [舊版官網](https://xnfq88.com/)
  - 僅支援簡體中文
  - 不支援 RWD
- [新版官網](https://xnfq88.com/index2.html)
  - 透過 Vue 3 + Vue I18n(多國語系套件) 全面改寫為支援多國語系的 RWD 頁面
  - 支援簡體中文、英文，預設為英文；  
    [簡體中文網址](https://xnfq88.com/index2.html?language=zh_CN)
  - 部分內容，例如首頁的 banner 廣告，透過 API 串接 CMS 後台來顯示
  - 手刻 RWD，使用 CSS 預處理器 (SCSS) 提升 CSS 開發效率
  - 自行練習改寫為
    - [Nuxt 3 + Vue I18n + TypeScript](https://test-nuxt3-i18n.vercel.app/)
    - [Next.js 14 + next-intl + TypeScript](https://next-js-14-ying-an-official-website.vercel.app/)
## 切版頁面
- [2024.09 新客戶活動頁](https://pony-hsieh.github.io/task-company-hy/S86/pages/hd_2409_xkh/)

<br/>
<br/>
<br/>

# 製作、整合共用元件
## 1. 登入模組
- 新增功能
  - 使用單例模式，確保頁面上只有唯一的登入元件實例
  - 使用 debounce，避免重複送出請求
- [程式碼](https://github.com/Pony-Hsieh/task-company-hy/blob/master/S86/other/loginRWD.html#L265)
## 2. modal 模組
- 使用工廠模式，創建、管理 Modal 實例  
  使用單例模式，確保同一個 modal id 會取得相同的 Modal 實例
- 使用 class 封裝
- [程式碼](https://github.com/Pony-Hsieh/task-company-hy/blob/master/S86/components/CountdownTimer.js)
## 3. 倒數計時器 模組
- 使用 class 封裝
- [程式碼](https://github.com/Pony-Hsieh/task-company-hy/blob/master/S86/components/Modal.js)

<br/>
<br/>
<br/>

# 前端工程化
- 統一檔案格式
  - editorconfig 可以確保團隊成員在不同的編輯器中使用相同的程式碼風格和配置
  - vscode 需安裝插件 `EditorConfig for VS Code`
  - [editorconfig 設定檔](https://github.com/Pony-Hsieh/webpack-5-practice/blob/master/.editorconfig)
- 流程
  1. husky 在指定的 git hook 觸發相對應設定，例如 `pre-commit`, `commit-msg`
     - [pre-commit 設定檔](https://github.com/Pony-Hsieh/webpack-5-practice/blob/master/.husky/pre-commit)
     - [commit-msg 設定檔](https://github.com/Pony-Hsieh/webpack-5-practice/blob/master/.husky/commit-msg)
  2. lint-staged 只會針對暫存的檔案執行對應的檢查，這樣就不需要耗費資源檢查整個專案
     1. js: eslint + prettier
     2. scss: stylelint + prettier
     - 設定檔
       - [lintstaged 設定檔](https://github.com/Pony-Hsieh/webpack-5-practice/blob/master/.lintstagedrc.js)
       - [prettier 設定檔](https://github.com/Pony-Hsieh/webpack-5-practice/blob/master/.prettierrc.cjs)
       - [eslint 設定檔](https://github.com/Pony-Hsieh/webpack-5-practice/blob/master/.eslintrc.js)
       - [stylelint 設定檔](https://github.com/Pony-Hsieh/webpack-5-practice/blob/master/.stylelintrc.js)
  3. commitlint 用於檢查 commit 訊息是否符合規範，基本上是承襲於 AngularJS Git Commit Message Conventions
     - [commitlint 設定檔](https://github.com/Pony-Hsieh/webpack-5-practice/blob/master/commitlint.config.js)

<br/>
<br/>
<br/>

# 其他
- [前端分享會 - 2023.01.12 - 演算法入門](https://github.com/Pony-Hsieh/task-company-hy/blob/master/%E5%89%8D%E7%AB%AF%E5%88%86%E4%BA%AB%E6%9C%83%20-%202023.01.12%20-%20%E6%BC%94%E7%AE%97%E6%B3%95%E5%85%A5%E9%96%80.md)