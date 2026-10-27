import React, { useState, useEffect, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import type { AssetDataPoint, ChartSelection } from '@/types/highchartCopilot';

interface AssetChartProps {
  data: AssetDataPoint[];
  onSelectionChange: (selection: ChartSelection | null) => void;
}

const AssetChart: React.FC<AssetChartProps> = ({ data, onSelectionChange }) => {
  const chartRef = useRef<HighchartsReact.RefObject>(null);
  const [chartOptions, setChartOptions] = useState<Highcharts.Options>({});

  useEffect(() => {
    const options: Highcharts.Options = {
      chart: {
        type: 'line',
        backgroundColor: 'transparent',
        borderRadius: 12,
        zooming: {
          type: 'x',
        },
        events: {
          selection: function (event) {
            if (event.xAxis) {
              const min = event.xAxis[0].min;
              const max = event.xAxis[0].max;
              onSelectionChange({ min, max });
              return false;
            } else {
              onSelectionChange(null);
              return undefined;
            }
          },
        },
      },
      title: {
        text: '資產趨勢折線圖',
        align: 'left',
        style: {
          fontWeight: 'bold',
          fontSize: '18px',
          color: '#1f2937',
        },
      },
      subtitle: {
        text: '拖曳圖表以選取區間進行 AI 分析',
        align: 'left',
        style: {
          color: '#6b7280',
        },
      },
      xAxis: {
        type: 'datetime',
        gridLineWidth: 1,
        gridLineColor: '#f3f4f6',
        labels: {
          style: { color: '#6b7280' },
        },
      },
      yAxis: {
        title: {
          text: '資產金額 (TWD)',
          style: { color: '#6b7280' },
        },
        gridLineColor: '#f3f4f6',
        labels: {
          style: { color: '#6b7280' },
          formatter: function () {
            return (this.value as number).toLocaleString();
          },
        },
      },
      tooltip: {
        shared: true,
        borderRadius: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        shadow: true,
        xDateFormat: '%Y-%m-%d',
        pointFormat:
          '<span style="color:{point.color}">\u25CF</span> <b>{point.y:,.0f} TWD</b><br/>',
      },
      legend: {
        enabled: false,
      },
      credits: {
        enabled: false,
      },
      plotOptions: {
        line: {
          marker: {
            enabled: false,
            states: {
              hover: {
                enabled: true,
              },
            },
          },
          lineWidth: 3,
          color: '#3b82f6',
          states: {
            hover: {
              lineWidth: 4,
            },
          },
        },
        series: {
          cursor: 'pointer',
          animation: {
            duration: 1000,
          },
        },
      },
      series: [
        {
          type: 'line',
          name: '總資產',
          data: data.map((d) => [d.timestamp, d.value]),
        },
      ],
    };

    setChartOptions(options);
  }, [data, onSelectionChange]);

  return (
    <div className="w-full h-full p-4 rounded-xl">
      <HighchartsReact
        highcharts={Highcharts}
        options={chartOptions}
        ref={chartRef}
        containerProps={{ style: { height: '100%', width: '100%' } }}
      />
    </div>
  );
};

export default React.memo(AssetChart);
