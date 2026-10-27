import React, { useMemo, useState } from 'react';
import { useCopilotReadable } from '@copilotkit/react-core';
import AssetChart from '../components/AssetChart';
import CopilotWidget from '../components/CopilotWidget';
import { generateMockData } from '../utils/dataGenerator';
import { calculateStats, formatCurrency } from '../utils/statistics';
import type { ChartSelection, RangeStats } from '@/types/highchartCopilot';

const getDeltaTone = (delta: number | null) => {
  if (delta === null) return 'text-on-surface';
  return delta < 0 ? 'text-negative' : 'text-positive';
};

const DashboardTab: React.FC = () => {
  // 1. Data State
  const data = useMemo(() => generateMockData(), []);

  // 2. Selection State
  const [selection, setSelection] = useState<ChartSelection | null>(null);

  // 3. Derived Stats
  const selectedData = useMemo(() => {
    if (!selection) return [] as ReturnType<typeof generateMockData>;
    return data.filter((d) => d.timestamp >= selection.min && d.timestamp <= selection.max);
  }, [data, selection]);

  const stats: RangeStats | null = useMemo(() => {
    return calculateStats(selectedData);
  }, [selectedData]);

  // 4. Copilot Integration: expose selection stats to Copilot context
  useCopilotReadable({
    description:
      'The currently selected asset chart range statistics. Use this to analyze financial performance.',
    value: stats || 'No range selected',
  });

  return (
    <div className="flex flex-col gap-xl text-on-surface">
      <div className="grid gap-md md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-outline-2 bg-surface-1 p-lg shadow-light-down-1">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-on-surface-variant">
            目前資產價值
          </p>
          <p className="mt-xs text-2xl font-bold">{formatCurrency(data[data.length - 1].value)}</p>
        </div>
        <div
          className={`rounded-2xl border border-outline-2 bg-surface-1 p-lg shadow-light-down-1 ${
            stats ? 'ring-2 ring-primary/30' : ''
          }`}
        >
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-on-surface-variant">
            選取區間變動
          </p>
          <p className={`mt-xs text-2xl font-bold ${getDeltaTone(stats?.delta ?? null)}`}>
            {stats ? `${stats.delta > 0 ? '+' : ''}${formatCurrency(stats.delta)}` : '-'}
          </p>
        </div>
        <div className="rounded-2xl border border-outline-2 bg-surface-1 p-lg shadow-light-down-1">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-on-surface-variant">
            選取期間
          </p>
          <p className="mt-sm text-sm font-semibold">
            {stats ? `${stats.startDate} - ${stats.endDate}` : '請選取圖表區間'}
          </p>
        </div>
        <div className="rounded-2xl border border-outline-2 bg-surface-1 p-lg shadow-light-down-1">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-on-surface-variant">
            資料筆數
          </p>
          <p className="mt-xs text-2xl font-bold">{stats ? stats.dataPointsCount : data.length}</p>
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-outline-2 bg-surface-1 shadow-light-down-1">
        <div className="border-b border-outline-2 px-lg py-md">
          <h2 className="title-sm">Asset Trend</h2>
          <p className="text-sm text-on-surface-variant">
            拖曳圖表區間後，Copilot 會根據目前選取範圍整理統計摘要。
          </p>
        </div>
        <div className="h-[500px] p-sm">
          <AssetChart data={data} onSelectionChange={setSelection} />
        </div>
      </section>

      <div className="mx-auto max-w-[42rem] rounded-xl border border-outline-2 bg-surface-2 px-lg py-md text-center text-sm text-on-surface-variant">
        操作提示：在圖表上按住滑鼠左鍵拖曳，即可選取特定時間區間並觸發 Copilot 分析。
      </div>

      <CopilotWidget selectionStats={stats} />
    </div>
  );
};

export default DashboardTab;
