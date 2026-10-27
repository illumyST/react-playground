# React Playground

這個專案是個人的 React Playground，用來快速試驗新的套件、互動元件、瀏覽器 API、外部服務串接，以及一些小型工具頁面的實作方式。

## 目的

- 作為 React / TypeScript / Vite 的實驗場
- 快速驗證新套件是否適合之後的正式專案
- 累積可重用的 UI primitive、頁面模式與整合經驗
- 放置獨立的小工具或 demo，而不是單一產品功能

## 技術棧

- React 19
- TypeScript 5
- Vite 7（rolldown-vite）
- React Router 6
- Tailwind CSS 4
- Axios
- React Hook Form
- ESLint 9 + Prettier
- pnpm

## 目前功能

- Grouping Tool：隨機分組，支援拖曳調整名單
- Emoji：搜尋 emoji、依群組篩選、點擊複製
- Weather API：查詢城市即時天氣
- Metronome：使用 Web Audio API 的節拍器
- WebMCP：Declarative / Imperative API 範例頁
- Docusaurus：嵌入靜態文件站內容
- Remotion：可編輯字幕時間軸與影片播放實驗
- Hospital：醫療資訊產品的前端 shell 練習（Dashboard / Integrations / Sticky Table / Settings），子路由 `/hospital/mock-admin` 為 mock API 管理後台

## 專案結構

```text
.
├─ backend/
│  ├─ copilotKit/      # Highcharts Copilot：Python backend + runtime/（Node CopilotKit runtime）
│  └─ hospital/
│     └─ mock-server/  # Hospital 的 Express mock server（pnpm workspace package）
├─ env/                # Vite environment files
├─ public/             # 靜態資源與 Docusaurus 輸出
├─ src/
│  ├─ components/      # 可重用元件
│  ├─ pages/           # 各 playground 頁面
│  ├─ routes/          # 路由配置
│  ├─ styles/          # 全域樣式與 design tokens
│  ├─ types/           # 型別宣告
│  └─ utils/           # 共用工具
└─ public/
	├─ docusaurus/      # Docusaurus 靜態輸出
	└─ remotion/        # Remotion 影片、音訊、字幕素材
```

## 開發方式

### 需求

- Node.js 20.17+
- pnpm 9+

### 安裝與啟動

```bash
pnpm install
pnpm dev
```

`pnpm dev` 目前會同時啟動：

- Vite 前端開發伺服器
- Highcharts Copilot 需要的本地 Node runtime（預設 `http://127.0.0.1:4000/copilotkit`）
- Hospital mock server（預設 `http://127.0.0.1:5005`）

### Hospital mock server

`backend/hospital/mock-server` 是 pnpm workspace package，根目錄 `pnpm install` 會一併安裝。Vite dev server 透過 proxy 轉送：

- `/hospital-api/*`：Hospital 頁面使用的 API（依 `x-mock-scenario` header 切換情境）
- `/mock-api/*`：Mock Admin 的管理 API（router / api / scenario / config / rollback），以及動態 mock API

單獨啟動：`pnpm dev:hospital-mock`

### 常用指令

```bash
pnpm dev
pnpm build
pnpm lint
pnpm preview
```

### Highcharts Copilot 需要的額外服務

Highcharts Copilot 頁面除了 `pnpm dev` 啟動的前端與 Node runtime 之外，還需要一個額外的本地服務：

- Python backend：提供 CopilotKit remote endpoint，實際呼叫 Gemini

建議開兩個 terminal：

```bash
# Terminal 1: 前端 + Node runtime
pnpm dev

# Terminal 2: Python backend（首次先安裝）
pnpm setup:copilot-backend
pnpm dev:copilot-backend
```

啟動前請先在 `env/.env.development` 設定 `GEMINI_API_KEY`。

## Environment Variables

Vite 會從 ./env 讀取環境變數。在程式碼中，透過 Vite 原生的 `import.meta.env.VITE_XXX` 來存取環境變數。

### 已使用的 env 值

- VITE_APP_NAME：應用名稱
- VITE_API_BASE_URL：共用 API base URL
- VITE_ENABLE_MOCK：是否啟用 mock
- VITE_FEATURE_EXPERIMENTAL_UI：是否開啟實驗性 UI
- VITE_EMOJI_API_URL：Emoji API endpoint
- VITE_EMOJI_API_KEY：Emoji API access key
- VITE_WEATHER_API_URL：OpenWeather API endpoint
- VITE_WEATHER_API_KEY：OpenWeather API key
- VITE_WEATHER_ICON_BASE_URL：Weather icon base URL
- VITE_COPILOT_RUNTIME_URL：前端 CopilotKit runtime URL
- COPILOTKIT_BACKEND_URL：Node runtime 轉送到 Python backend 的 endpoint
- COPILOTKIT_RUNTIME_PORT：Node runtime 本地埠號
- COPILOTKIT_MODEL：Gemini model 名稱
- GEMINI_API_KEY：供 Highcharts Copilot runtime/backend 使用的 Gemini API key
- HOSPITAL_MOCK_SERVER_TARGET：Vite proxy 轉送 `/hospital-api`、`/mock-api` 的目標
- VITE_HOSPITAL_API_URL：Hospital 頁面的 API 前綴
- VITE_MOCK_ADMIN_API_URL：Mock Admin 的 API 前綴（需與 mock server 的 `MOCK_API_URL` 一致）

### 這次盤點後，適合放入 env 的值

- EmojiPage 內的 access_key
- WeatherPage 內的 OpenWeather API key
- 外部 API endpoint URL
- 既有的 app name / feature flags / API base URL

## 備註

- 這個 repo 偏向實驗用途，不保證每個 playground 都是完整產品級實作
- 某些頁面依賴外部 API；若未設定對應 env，API 請求會安全地失敗並由 catch 區塊接手處理，介面不會崩潰。
- public/docusaurus 內容為靜態輸出結果，可直接由頁面 iframe 載入

## Remotion Playground

Remotion 頁面目前使用 public/remotion 底下的素材：

- stone.mp4：背景影片
- my-song.mp3：預留的音訊素材
- captions.json：字幕時間軸資料來源

目前字幕不再由 lyrics.md 自動切段，而是直接讀取 captions.json，這樣可以更精準地控制每段字幕的開始時間、結束時間與是否強調。

captions.json 格式如下：

```json
{
  "captions": [
    {
      "id": "caption-1",
      "text": "在草地躺著看星空",
      "startTime": 0.5,
      "endTime": 6,
      "emphasis": false
    }
  ]
}
```

欄位說明：

- id：字幕識別值，用於 React list key 與編輯操作
- text：字幕內容
- startTime / endTime：以秒為單位，頁面會再換算成 Remotion 的 frame
- emphasis：是否用較強的視覺樣式顯示這句字幕
