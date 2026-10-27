# React Playground

這個專案是個人的 React Playground，用來快速試驗新的套件、互動元件、瀏覽器 API、外部服務串接，以及一些小型工具頁面的實作方式。

## 目的

- 作為 React / TypeScript / Vite 的實驗場
- 快速驗證新套件是否適合之後的正式專案
- 累積可重用的 UI primitive、頁面模式與整合經驗
- 放置獨立的小工具或 demo，而不是單一產品功能

## 目前功能

| 頁面               | 路徑                 | 說明                                                           | 額外需要的服務                               |
| ------------------ | -------------------- | -------------------------------------------------------------- | -------------------------------------------- |
| Grouping Tool      | `/grouping`          | 隨機分組，支援拖曳調整名單                                     | —                                            |
| Emoji              | `/emoji`             | 搜尋 emoji、依群組篩選、點擊複製                               | Emoji API key                                |
| Weather API        | `/weather`           | 查詢城市即時天氣                                               | OpenWeather API key                          |
| Metronome          | `/metronome`         | 使用 Web Audio API 的節拍器                                    | —                                            |
| WebMCP             | `/webmcp`            | Declarative / Imperative API 範例頁                            | 支援 WebMCP 的瀏覽器                         |
| Docusaurus         | `/docusaurus`        | 嵌入靜態文件站內容                                             | —                                            |
| Remotion           | `/remotion`          | 可編輯字幕時間軸與影片播放實驗                                 | —                                            |
| Color Converter    | `/color-converter`   | HEX / RGB 色碼互轉                                             | —                                            |
| Highcharts Copilot | `/highchart-copilot` | 圖表資產分析與 AI 表單助理（CopilotKit + Gemini）              | Node runtime、Python backend、Gemini API key |
| Hospital           | `/hospital`          | 醫療資訊產品的前端 shell 練習，含 mock API 管理後台            | Hospital mock server                         |
| Audio VAD          | `/audio-vad`         | 純前端語音活動偵測（Silero VAD），判定音檔是否有人聲並標示片段 | —                                            |

## 技術棧

**共用**

- React 19、TypeScript 5
- Vite 7（rolldown-vite）
- React Router 6（`createBrowserRouter`）
- Tailwind CSS 4（design tokens 在 `src/styles`）
- Axios、React Hook Form
- ESLint 9 + Prettier
- pnpm 9（workspace）

**個別頁面使用**

- Highcharts、CopilotKit（Highcharts Copilot）
- Remotion（Remotion）
- TanStack Query 5、Jotai（Hospital、Mock Admin）
- Chakra UI v3、FontAwesome、jsoneditor（僅 Mock Admin，樣式隔離在 `/hospital/mock-admin` 範圍內）
- `@ricky0123/vad-web`、`onnxruntime-web`、lucide-react（Audio VAD）

**後端 / 本地服務**

- Node CopilotKit runtime（`backend/copilotKit/runtime`）
- Python FastAPI + CopilotKit SDK（`backend/copilotKit`）
- Express mock server（`backend/hospital/mock-server`）

## 專案結構

```text
.
├─ backend/
│  ├─ copilotKit/          # Highcharts Copilot
│  │  ├─ runtime/server.js # Node CopilotKit runtime（:4000）
│  │  ├─ example_server.py # Python FastAPI backend（:8000），實際呼叫 Gemini
│  │  └─ requirements.txt
│  └─ hospital/
│     └─ mock-server/      # Hospital 的 Express mock server（:5005，pnpm workspace package）
│        └─ src/
│           ├─ apis/       # 各 mock API 的回應資料（JSON）
│           ├─ configs/    # Mock Admin 的系統設定
│           └─ scenarios/  # 複合情境設定
├─ env/                    # 環境變數（見下方 Environment Variables）
├─ public/
│  ├─ docusaurus/          # Docusaurus 靜態輸出
│  └─ remotion/            # Remotion 影片、音訊、字幕素材
└─ src/
   ├─ components/          # 可重用元件（primitives、feedback、layout、Icon）
   ├─ pages/               # 各 playground 頁面
   │  ├─ AudioVad/         # Audio VAD（元件、音訊服務 services/audio）
   │  └─ Hospital/         # Hospital 子應用（自有 routes、queries、states、i18n）
   │     └─ MockAdmin/     # Mock API 管理後台（Chakra UI v3）
   ├─ routes/              # 路由配置
   ├─ styles/              # 全域樣式與 design tokens
   ├─ types/               # 型別宣告
   └─ utils/               # 共用工具
```

## 快速開始

### 需求

- Node.js 20.17+
- pnpm 9（專案指定 `pnpm@9.12.0`，可用 `corepack enable` 自動切換）
- Python 3（僅 Highcharts Copilot 的 Python backend 需要）

### 1. 安裝

```bash
pnpm install
```

`backend/hospital/mock-server` 是 pnpm workspace package，會在根目錄一併安裝，不需要另外進資料夾安裝。

### 2. 設定 Gemini API key（必要）

建立 `env/.env.development.local`（已被 `.gitignore` 的 `*.local` 忽略，不會進版控）：

```bash
GEMINI_API_KEY=你的_Gemini_API_key
```

> **為什麼是必要的**：`pnpm dev` 用 `concurrently -k` 同時啟動多個服務，其中一個結束就會關閉全部。Node runtime 在沒有 `GEMINI_API_KEY` 時會直接結束，連帶 Vite 與 mock server 也會被關掉。若暫時沒有 key，請改用下方「[不使用 Copilot 時的啟動方式](#不使用-copilot-時的啟動方式)」。

### 3. 啟動

```bash
pnpm dev
```

會同時啟動以下三個服務，輸出以 `[runtime]`、`[mock]`、`[vite]` 前綴區分：

| 服務                    | 位址                               | 說明                                                  |
| ----------------------- | ---------------------------------- | ----------------------------------------------------- |
| Vite 前端               | `http://localhost:5173`            | 開這個網址即可使用所有頁面                            |
| Node CopilotKit runtime | `http://127.0.0.1:4000/copilotkit` | 前端透過 Vite proxy `/copilotkit` 呼叫                |
| Hospital mock server    | `http://127.0.0.1:5005`            | 前端透過 Vite proxy `/hospital-api`、`/mock-api` 呼叫 |

### 4.（選用）啟動 Highcharts Copilot 的 Python backend

只有 Highcharts Copilot 頁面需要。另開一個 terminal：

```bash
# 首次：建立 backend/copilotKit/.venv 並安裝套件
pnpm setup:copilot-backend

# 啟動（:8000）
pnpm dev:copilot-backend
```

請求流程：

```text
瀏覽器 → Vite proxy /copilotkit → Node runtime (:4000) → Python backend (:8000) → Gemini
```

### 不使用 Copilot 時的啟動方式

沒有 Gemini key、只想開其他頁面（包含 Hospital）時，分兩個 terminal 個別啟動：

```bash
# Terminal 1：前端
pnpm exec vite --mode development

# Terminal 2：Hospital mock server（不用 Hospital 頁面可省略）
pnpm dev:hospital-mock
```

## 指令一覽

| 指令                         | 說明                                              |
| ---------------------------- | ------------------------------------------------- |
| `pnpm dev`                   | 同時啟動 Node runtime、Hospital mock server、Vite |
| `pnpm build`                 | 型別檢查（`tsc -b`）並以 production mode 建置     |
| `pnpm preview`               | 預覽 build 結果                                   |
| `pnpm lint`                  | 執行 ESLint（含 Prettier 格式檢查）               |
| `pnpm lint --fix`            | 自動修正可修正的 lint 與格式問題                  |
| `pnpm dev:copilot-runtime`   | 單獨啟動 Node CopilotKit runtime                  |
| `pnpm setup:copilot-backend` | 建立 Python venv 並安裝 backend 套件              |
| `pnpm dev:copilot-backend`   | 啟動 Python backend（uvicorn，自動 reload）       |
| `pnpm dev:hospital-mock`     | 單獨啟動 Hospital mock server（tsx watch）        |

## Environment Variables

環境變數放在 `env/`，依 mode 讀取：

| 檔案                         | 用途                                   | 進版控 |
| ---------------------------- | -------------------------------------- | ------ |
| `env/.env.development`       | 開發環境的共用設定                     | 是     |
| `env/.env.production`        | production 的共用設定                  | 是     |
| `env/.env.development.local` | 本機機密（API key 等），會覆蓋同名變數 | **否** |

**讀取順序**：Vite、Node runtime、Python backend 都採用相同規則，`.local` 優先於共用檔。API key 等機密請只放在 `.local`，不要寫進 `env/.env.development`。

- 前端程式只能透過 `import.meta.env.VITE_XXX` 取得 `VITE_` 開頭的變數
- 沒有 `VITE_` 前綴的變數只給 `vite.config.ts`、Node runtime、Python backend 使用，不會送到瀏覽器

### 變數一覽

**前端（`VITE_`）**

| 變數                                                                                     | 說明                                                                                |
| ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `VITE_EMOJI_API_URL` / `VITE_EMOJI_API_KEY`                                              | Emoji 頁面的 API endpoint 與 access key                                             |
| `VITE_WEATHER_API_URL` / `VITE_WEATHER_API_KEY`                                          | Weather 頁面的 OpenWeather endpoint 與 API key                                      |
| `VITE_WEATHER_ICON_BASE_URL`                                                             | Weather icon base URL                                                               |
| `VITE_COPILOT_RUNTIME_URL`                                                               | 前端呼叫 CopilotKit runtime 的路徑（預設 `/copilotkit/`）                           |
| `VITE_HOSPITAL_API_URL`                                                                  | Hospital 頁面的 API 前綴（預設 `/hospital-api`）                                    |
| `VITE_MOCK_ADMIN_API_URL`                                                                | Mock Admin 的 API 前綴（預設 `/mock-api`，需與 mock server 的 `MOCK_API_URL` 一致） |
| `VITE_APP_NAME`、`VITE_API_BASE_URL`、`VITE_ENABLE_MOCK`、`VITE_FEATURE_EXPERIMENTAL_UI` | 預留，目前程式未使用                                                                |

**本地服務 / 建置設定**

| 變數                          | 使用者                         | 說明                                                                      |
| ----------------------------- | ------------------------------ | ------------------------------------------------------------------------- |
| `GEMINI_API_KEY`              | Node runtime、Python backend   | Gemini API key，**請放在 `.local`**                                       |
| `COPILOTKIT_MODEL`            | Node runtime、Python backend   | Gemini model 名稱（預設 `gemini-2.5-flash`）                              |
| `COPILOTKIT_RUNTIME_PORT`     | Node runtime、`vite.config.ts` | Node runtime 埠號（預設 `4000`）                                          |
| `COPILOTKIT_BACKEND_URL`      | Node runtime                   | 轉送到 Python backend 的 endpoint                                         |
| `HOSPITAL_MOCK_SERVER_TARGET` | `vite.config.ts`               | `/hospital-api`、`/mock-api` proxy 的目標（預設 `http://127.0.0.1:5005`） |

**Hospital mock server（`backend/hospital/mock-server/.env`）**

| 變數           | 說明                                                      |
| -------------- | --------------------------------------------------------- |
| `PORT`         | mock server 埠號（預設 `5005`）                           |
| `MOCK_API_URL` | Mock Admin 管理 API 與動態 mock API 的前綴（`/mock-api`） |

## Hospital

將 hospital-tech-starter 以本專案的技術棧（Tailwind、React 19）改寫而成，掛在 `/hospital` 底下。

### 路由

| 路徑                     | 說明                                                                 |
| ------------------------ | -------------------------------------------------------------------- |
| `/hospital/dashboard`    | 站台健康度、API 延遲、整合狀態總覽                                   |
| `/hospital/integrations` | 整合元件狀態卡片                                                     |
| `/hospital/sticky-table` | sticky header / sticky column / 巢狀子表格示範                       |
| `/hospital/settings`     | 切換院區、mock scenario、語系（中文 / EN）                           |
| `/hospital/mock-admin`   | Mock API 管理後台：Router 管理、API 回應編輯、複合情境切換、系統設定 |

導覽列由 mock API（`/hospital-api/navigation/menu`）決定，因此不同 scenario 可見的頁面不同（例如 `limited-access` 只開放 Dashboard 與 Settings）。

### Mock scenario

mock server 依 request header `x-mock-scenario` 回傳不同情境的資料（`default`、`warning`、`limited-access`）。請在 `/hospital/settings` 的「Mock Scenario」切換，選擇的值會存在 localStorage。

> 已知問題：程式中保留了以 `?scenario=` query string 指定情境的邏輯，但 `QueryStringGuard` 會先把 query string 從網址移除，因此目前 `?scenario=` 不會生效。

### API 與 proxy

| 前綴              | 用途                                                                                    |
| ----------------- | --------------------------------------------------------------------------------------- |
| `/hospital-api/*` | Hospital 頁面使用的 API                                                                 |
| `/mock-api/*`     | Mock Admin 的管理 API（router / api / scenario / config / rollback），以及動態 mock API |

### 注意事項

- **Mock Admin 的編輯會直接寫入檔案**：在 Mock Admin 新增或修改 API、情境、設定時，會改寫 `backend/hospital/mock-server/src/{apis,configs,scenarios}` 底下的 JSON，這些變更會出現在 `git status`。備份寫在 `src/backup`（已忽略）。
- **樣式隔離**：Mock Admin 使用 Chakra UI v3，`ChakraProvider` 只包在 `/hospital/mock-admin` 內，preflight 與 `html` 全域樣式也限縮在 `.mock-admin-scope`，不會影響其他 Tailwind 頁面。
- **Provider 範圍**：TanStack Query 與 Jotai 的 provider 只包在 `/hospital` 範圍內；語系以 Jotai atom 管理（取代原本的 i18next）。

## Audio VAD

由 audio-vad-detector 專案搬入，掛在 `/audio-vad`。使用 `@ricky0123/vad-web` 的 `NonRealTimeVAD`（Silero VAD 模型 + ONNX Runtime WASM）在瀏覽器端分析音檔，不需要後端。

### 功能

- 上傳 / 拖曳音檔（WebM、MP3、WAV、M4A、OGG 等），或用麥克風錄音
- 內建合成測試音：純靜音、風扇雜音、440Hz 單音（預期皆判定為無人聲）
- Canvas 波形與人聲區段標示，可點擊跳轉、單段試聽
- 調整門檻參數後直接以記憶體中的 samples 重新分析，不需重新解碼

### 模型與 WASM 檔案

模型與 WASM **不放在 `public/`**，而是由 `vite.config.ts` 的 `vadAssets` plugin 直接取自 `node_modules`：

| 檔案                                        | 來源                      |
| ------------------------------------------- | ------------------------- |
| `silero_vad_legacy.onnx`                    | `@ricky0123/vad-web/dist` |
| `ort-wasm-simd-threaded.jsep.mjs` / `.wasm` | `onnxruntime-web/dist`    |

- **開發**：攔截 `/vad/*` 請求直接串流檔案（避免 Vite 轉換 `.mjs`）
- **建置**：輸出至 `dist/vad/`（約 31MB）

若升級 `onnxruntime-web` 後載入失敗，請確認預設 bundle 引用的 WASM 檔名是否改變，並同步更新 `VAD_ASSETS`。

### 注意事項

- **單執行緒**：`ort.env.wasm.numThreads = 1`，不需要 SharedArrayBuffer，因此沒有設定 COOP / COEP 標頭（避免影響其他頁面載入外部資源）
- **樣式隔離**：原專案的全域 CSS token 與 class（`.btn`、`.badge`、`.glass-panel` 等）都限定在 `.audio-vad` 容器內
- **audioTest 下拉選單**：引用 `public/audioTest/*.webm`，這些音檔未進版控，需自行放入才能使用

## 程式碼風格與 Lint

- 格式設定在 `.prettierrc`（單引號、100 字寬），由 ESLint 的 `prettier/prettier` 規則檢查
- 提交前建議執行 `pnpm lint`；格式問題可用 `pnpm lint --fix` 自動修正
- 目前保留部分 `react-hooks/exhaustive-deps` warning，補上依賴可能改變執行行為，需個別確認後再處理

## 備註

- 這個 repo 偏向實驗用途，不保證每個 playground 都是完整產品級實作
- 某些頁面依賴外部 API；若未設定對應 env，API 請求會安全地失敗並由 catch 區塊接手處理，介面不會崩潰
- `public/docusaurus` 內容為靜態輸出結果，可直接由頁面 iframe 載入

## Remotion Playground

Remotion 頁面目前使用 `public/remotion` 底下的素材：

- `stone.mp4`：背景影片
- `my-song.mp3`：預留的音訊素材
- `captions.json`：字幕時間軸資料來源

目前字幕不再由 lyrics.md 自動切段，而是直接讀取 `captions.json`，這樣可以更精準地控制每段字幕的開始時間、結束時間與是否強調。

`captions.json` 格式如下：

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

- `id`：字幕識別值，用於 React list key 與編輯操作
- `text`：字幕內容
- `startTime` / `endTime`：以秒為單位，頁面會再換算成 Remotion 的 frame
- `emphasis`：是否用較強的視覺樣式顯示這句字幕
