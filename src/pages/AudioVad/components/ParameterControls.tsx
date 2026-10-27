import React from 'react';
import { Button, Icon } from '@/components';
import { cn } from '@/utils/classnames';
import {
  DEFAULT_VAD_OPTIONS,
  type SpeechDetectionOptions,
} from '../services/audio/speech-detection';

interface ParameterControlsProps {
  options: SpeechDetectionOptions;
  onOptionsChange: (options: SpeechDetectionOptions) => void;
  onReanalyze: () => void;
  isAnalyzing: boolean;
  hasAudio: boolean;
}

interface SliderConfig {
  key: keyof SpeechDetectionOptions;
  label: string;
  min: number;
  max: number;
  step: number;
  description: string;
  format: (value: number) => string;
  fullWidth?: boolean;
}

const formatThreshold = (value: number) => value.toFixed(2);
const formatMs = (value: number) => `${value} ms`;

const SLIDERS: SliderConfig[] = [
  {
    key: 'positiveSpeechThreshold',
    label: '說話判定門檻 (positive)',
    min: 0.1,
    max: 0.9,
    step: 0.05,
    description: '數值愈高愈嚴格，降低背景雜音誤判；數值愈低愈敏感（預設 0.60）',
    format: formatThreshold,
  },
  {
    key: 'negativeSpeechThreshold',
    label: '靜音判定門檻 (negative)',
    min: 0.05,
    max: 0.85,
    step: 0.05,
    description: '低於此值結束該段說話，官方建議比 positive 低約 0.15（預設 0.45）',
    format: formatThreshold,
  },
  {
    key: 'minSpeechMs',
    label: '最短說話時長 (minSpeechMs)',
    min: 50,
    max: 1500,
    step: 50,
    description: '短於此時長之脈衝聲音（如敲擊鍵盤）將被過濾拋棄（預設 250ms）',
    format: formatMs,
  },
  {
    key: 'redemptionMs',
    label: '中斷寬限期 (redemptionMs)',
    min: 100,
    max: 1500,
    step: 50,
    description: '說話中途稍微停頓的寬限時間，避免連續講話被切成碎段（預設 500ms）',
    format: formatMs,
  },
  {
    key: 'minTotalSpeechMs',
    label: '全檔有人講話最終門檻 (minTotalSpeechMs)',
    min: 50,
    max: 2000,
    step: 50,
    description:
      '整個音檔累計的人聲總時長必須達到此門檻，hasSpeech 才會被判定為 true（預設 250ms）',
    format: formatMs,
    fullWidth: true,
  },
];

export const ParameterControls: React.FC<ParameterControlsProps> = ({
  options,
  onOptionsChange,
  onReanalyze,
  isAnalyzing,
  hasAudio,
}) => {
  const current = { ...DEFAULT_VAD_OPTIONS, ...options };

  const handleChange = (key: keyof SpeechDetectionOptions, value: number) => {
    onOptionsChange({
      ...options,
      [key]: value,
    });
  };

  const handleReset = () => {
    onOptionsChange(DEFAULT_VAD_OPTIONS);
  };

  return (
    <section className="rounded-lg border border-outline-2 bg-surface-1 p-xl shadow-light-down-3">
      <div className="mb-lg flex flex-wrap items-center justify-between gap-sm">
        <div className="flex items-center gap-sm">
          <Icon iconName="SlidersHorizontal" size={20} className="text-primary" />
          <h2 className="title-md">VAD 閥值與偵測規則控制台</h2>
        </div>
        <div className="flex gap-sm">
          <Button variant="outlined" size="small" onClick={handleReset} disabled={isAnalyzing}>
            <Icon iconName="ArrowCounterClockwise" size={14} />
            重置預設值
          </Button>
          <Button size="small" onClick={onReanalyze} disabled={isAnalyzing || !hasAudio}>
            <Icon
              iconName="ArrowsClockwise"
              size={14}
              className={isAnalyzing ? 'animate-spin' : ''}
            />
            以新閥值重新分析
          </Button>
        </div>
      </div>

      <div className="grid gap-lg md:grid-cols-2">
        {SLIDERS.map((slider) => (
          <div
            key={slider.key}
            className={cn(
              'rounded-md border border-outline-2 bg-surface-3 px-lg py-md',
              slider.fullWidth && 'md:col-span-2',
            )}
          >
            <div className="mb-xs flex items-center justify-between gap-sm">
              <label htmlFor={`vad-${slider.key}`} className="text-sm font-bold text-on-surface">
                {slider.label}
              </label>
              <span className="font-mono text-sm font-bold text-primary">
                {slider.format(current[slider.key])}
              </span>
            </div>
            <input
              id={`vad-${slider.key}`}
              type="range"
              min={slider.min}
              max={slider.max}
              step={slider.step}
              value={current[slider.key]}
              onChange={(e) => handleChange(slider.key, parseFloat(e.target.value))}
              className="w-full accent-steel-500"
            />
            <p className="mt-xs text-xs text-on-surface-variant">{slider.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
