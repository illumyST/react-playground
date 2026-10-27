import { useState } from 'react';
import { CopilotKit } from '@copilotkit/react-core';
import { Button } from '@/components';
import DashboardTab from './tabs/DashboardTab';
import FormAssistantTab from './tabs/FormAssistantTab';

const TAB_ITEMS = [
  {
    key: 'dashboard',
    label: 'Asset Analyst',
    description: '選取圖表區間後，讓 Copilot 讀取統計結果。',
  },
  { key: 'form', label: 'Form Assistant', description: '用自然語言補齊出差表單欄位並做資料檢查。' },
] as const;

const HighchartCopilotPage = (): React.ReactNode => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'form'>('dashboard');
  const runtimeUrl = import.meta.env.VITE_COPILOT_RUNTIME_URL;
  const activeTabMeta = TAB_ITEMS.find((tab) => tab.key === activeTab);

  return (
    <div className="flex w-full min-w-0 min-h-main flex-col gap-xl text-left">
      <section className="rounded-2xl border border-outline-2 bg-surface-1 p-xl shadow-light-down-1">
        <div className="flex flex-col gap-md lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-sm min-w-0 flex-1">
            <h1 className="title-2xl">Highcharts × CopilotKit</h1>
            <p className="max-w-[48rem] text-on-surface-variant">
              圖表資產分析與 AI 表單助理範例，示範如何把 Highcharts 的互動資料帶進 CopilotKit
              對話流程。
            </p>
          </div>
          <div className="rounded-xl border border-outline-2 bg-surface-2 px-lg py-md text-sm text-on-surface-variant lg:max-w-[24rem]">
            {runtimeUrl
              ? 'Copilot Runtime 已設定，可直接切換不同助理情境。'
              : '尚未設定 Copilot Runtime，頁面內容仍可瀏覽，但 AI 對話功能會停用。'}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-outline-2 bg-surface-1 p-lg shadow-light-down-1">
        <div className="flex flex-wrap gap-sm" role="tablist" aria-label="Highcharts Copilot views">
          {TAB_ITEMS.map((tab) => (
            <Button
              key={tab.key}
              type="button"
              variant={activeTab === tab.key ? 'filled' : 'outlined'}
              color="primary"
              size="small"
              role="tab"
              aria-selected={activeTab === tab.key}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </Button>
          ))}
        </div>
        <p className="mt-md text-sm text-on-surface-variant">{activeTabMeta?.description}</p>
      </section>

      {!runtimeUrl && (
        <section className="rounded-2xl border border-warning-outline bg-warning-container-1 px-lg py-md text-sm text-warning-variant-1">
          請先設定 VITE_COPILOT_RUNTIME_URL，才能使用 CopilotKit 的聊天與自動分析能力。
        </section>
      )}

      <div className="flex-1 min-w-0">
        {runtimeUrl ? (
          <CopilotKit runtimeUrl={runtimeUrl}>
            {activeTab === 'dashboard' && <DashboardTab />}
            {activeTab === 'form' && <FormAssistantTab />}
          </CopilotKit>
        ) : (
          <section className="rounded-2xl border border-outline-2 bg-surface-1 p-2xl text-left shadow-light-down-1">
            <h2 className="title-sm">Copilot Runtime Required</h2>
            <p className="mt-sm max-w-[42rem] text-on-surface-variant">
              這個示範頁的圖表分析、表單解析與聊天追問都依賴 CopilotKit provider。請先在環境變數設定{' '}
              VITE_COPILOT_RUNTIME_URL，再重新載入頁面。
            </p>
          </section>
        )}
      </div>
    </div>
  );
};

export default HighchartCopilotPage;
