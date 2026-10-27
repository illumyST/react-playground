import type { AssetDataPoint } from '@/types/highchartCopilot';

export const generateMockData = (): AssetDataPoint[] => {
  const data: AssetDataPoint[] = [];
  const now = new Date();
  // Align to start of day for cleaner chart
  now.setHours(0, 0, 0, 0);

  // Start from 90 days ago
  const startDate = new Date(now);
  startDate.setDate(now.getDate() - 90);

  let currentValue = 100000;

  for (let i = 0; i < 90; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);

    // Add volatility: +/- 1% to 3%
    const volatility = (Math.random() * 0.04 + 0.01) * (Math.random() > 0.5 ? 1 : -1);

    // Apply change
    currentValue = currentValue * (1 + volatility);

    data.push({
      timestamp: date.getTime(),
      value: Math.round(currentValue),
    });
  }

  return data;
};
