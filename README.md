# RV Video Observer Clientsite

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## 1. Available Scripts

### `npm start`
開發模式下 websocket 主動連往 localhost:80 (請參考 `src/store/index.ts`)

### `npm run build`
產生前端檔案於 build/ 請將結果 copy 至 [RV Video Observer](https://github.com/snowwayne1231/rv_video_observer_serversite) 內的 frontend/ 目錄下

---

## 2. Requirements

* Node.js 16+
* React & Redux
* Sass
* Webpack


## 3. Installation

```shell
npm install
```

## 4. Folder Construct
- build **(編譯後的成果)**
- config **(webpack與各種編譯器/環境的設定, 不建議更改)**
- public **(存放web根目錄資訊與圖片)**
- scripts **(啟動腳本, 不建議更改)**
- src
  - | - images **(Type script include的圖片)**
  - | - store **(Redux store處理資料流) [Redux reducers](https://chentsulin.github.io/redux/docs/basics/Reducers.html)**
  -  - | - reducers **(存放 reducers)**
  -  - | - `hooks.ts` **(for hooks mode in react)**
  -  - | - `index.ts` **(bridges for socket and redux)**
  - | - styles **(Css樣式與Sass)**
  - | - `App.test.tsx` **(資料流單元測試)**
  - | - `App.tsx` **(應用程序主體)**
  - | - `HeaderComponment.tsx` **(頁面頭部組件)**
  - | - `index.tsx` **(應用程序入口)**
  - | - `react-app-env.d.ts` **(CRA環境設定, 不建議更改)**
  - | - `reportWebVitals.ts` **(web指標報告)**
  - | - `setupTests.ts` **(Type script DOM檢測)**
  - | - `VideoComponment.tsx` **(頁面顯示影像內容部分)**
- `package-lock.json`
- `package.json`
- `tsconfig.json` **(VS code的Type script設定)**