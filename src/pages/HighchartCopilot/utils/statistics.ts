import type { AssetDataPoint, RangeStats } from '@/types/highchartCopilot';

export const calculateStats = (data: AssetDataPoint[]): RangeStats | null => {
  if (data.length === 0) return null;

  const sorted = [...data].sort((a, b) => a.timestamp - b.timestamp);
  const start = sorted[0];
  const end = sorted[sorted.length - 1];

  const values = sorted.map((d) => d.value);
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);

  const delta = end.value - start.value;
  const deltaPercent = (delta / start.value) * 100;

  return {
    startDate: new Date(start.timestamp).toLocaleDateString('zh-TW'),
    endDate: new Date(end.timestamp).toLocaleDateString('zh-TW'),
    startValue: start.value,
    endValue: end.value,
    maxValue,
    minValue,
    delta,
    deltaPercent,
    dataPointsCount: data.length,
  };
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    maximumFractionDigits: 0,
  }).format(value);
};
