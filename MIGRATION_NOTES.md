# Migration Notes

## 移除 Chakra UI 與 Stylelint 決策

- 目標：降低 bundle 體積、避免雙重設計系統、專注 Tailwind + Radix primitives。
- Chakra UI / @emotion / Stylelint / Sass 均不導入至目標專案 `react-playground`。
- 若未來需要主題化：採 Tailwind tokens + `class-variance-authority (cva)` / `tailwind-merge` (可再導入)。

## 替代策略

| 原用途                      | Chakra / Stylelint      | 替代方案                                        |
| --------------------------- | ----------------------- | ----------------------------------------------- |
| Button, Input, Modal, Toast | <ChakraProvider> + 元件 | Radix primitives + 自製 UI (tailwind)           |
| 樣式系統與 spacing scale    | Chakra theme            | Tailwind config `theme.extend`                  |
| Color mode 切換             | Chakra color mode       | `next-themes` 或手寫 `data-theme` 切換 (視需求) |
| Stylelint 規範              | .stylelintrc            | 使用 ESLint + Tailwind 插件 + Prettier          |

## 檢查步驟 (完成)

- 搜索 `chakra|stylelint|@emotion` 無結果。
- `package.json` 無相關依賴。

## 後續注意

1. PR review 時若出現新增 `@chakra-ui/*`、`@emotion/*`、`stylelint*`，直接要求移除。
2. UI 元件放置位置：`src/components/`，分層建議：
	- `components/primitives/` 基礎可重用（Button, Input, Dialog, Tooltip）
	- `components/form/` 表單相關（FormField, FieldError, ControlledX）
	- `components/feedback/` Loading, EmptyState, Toast 觸發器
	- `components/layout/` Container, Flex, Grid, Section
	- `components/index.ts` barrel 匯出對外使用界面
3. 若之後需要動畫或更進階的可及時導入 `framer-motion`，但避免重新引入整套 UI 框架。

---

此檔案建立於任務 #21：移除 Chakra UI 與 Stylelint。
