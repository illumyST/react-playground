# Highcharts Copilot Backend

這個 backend 提供 CopilotKit remote endpoint，供 Highcharts Copilot 的 Node runtime 轉接使用。

## 安裝

```bash
pnpm setup:copilot-backend
```

## 啟動

```bash
pnpm dev:copilot-backend
```

## 環境變數

請在 `env/.env.development` 設定下列值：

- `GEMINI_API_KEY`
- `COPILOTKIT_MODEL`（可選，預設 `gemini-2.5-flash`）