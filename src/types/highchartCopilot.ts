export interface AssetDataPoint {
  timestamp: number;
  value: number;
}

export interface RangeStats {
  startDate: string;
  endDate: string;
  startValue: number;
  endValue: number;
  maxValue: number;
  minValue: number;
  delta: number;
  deltaPercent: number;
  dataPointsCount: number;
}

export interface ChartSelection {
  min: number;
  max: number;
}
