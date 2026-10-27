import React from 'react';
import { Button, Icon } from '@/components';
import { cn } from '@/utils/classnames';
import type { SpeechDetectionResult, SpeechSegment } from '../services/audio/speech-detection';
import type { DecodedAudio } from '../services/audio/audio-decoder';

interface DetectionResultCardProps {
  result: SpeechDetectionResult;
  decodedAudio?: DecodedAudio | null;
  onPlaySegment?: (segment: SpeechSegment) => void;
  activeSegmentId?: string | null;
}

export const DetectionResultCard: React.FC<DetectionResultCardProps> = ({
  result,
  decodedAudio,
  onPlaySegment,
  activeSegmentId,
}) => {
  const formatTime = (ms: number) => {
    const totalSec = ms / 1000;
    const mins = Math.floor(totalSec / 60);
    const secs = (totalSec % 60).toFixed(3);
    return `${mins.toString().padStart(2, '0')}:${secs.padStart(6, '0')}`;
  };

  // 單獨播放該區間音訊
  const playSegmentAudio = (segment: SpeechSegment) => {
    if (onPlaySegment) {
      onPlaySegment(segment);
    } else if (decodedAudio) {
      try {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioContextClass();
        const startSample = Math.floor((segment.startMs / 1000) * decodedAudio.sampleRate);
        const endSample = Math.floor((segment.endMs / 1000) * decodedAudio.sampleRate);
        const length = Math.max(1, endSample - startSample);

        const buffer = ctx.createBuffer(1, length, decodedAudio.sampleRate);
        const channel = buffer.getChannelData(0);
        for (let i = 0; i < length; i++) {
          channel[i] = decodedAudio.samples[startSample + i] || 0;
        }

        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.start();
      } catch (err) {
        console.error('Play segment error:', err);
      }
    }
  };

  const stats = [
    { label: '音訊總時長', value: formatTime(result.totalAudioDurationMs) },
    { label: '人聲總時長', value: formatTime(result.totalSpeechDurationMs) },
    { label: '偵測人聲片段數', value: `${result.segments.length} 段` },
    { label: '語音佔比', value: `${result.speechRatio}%` },
  ];

  return (
    <section className="space-y-xl rounded-lg border border-outline-2 bg-surface-1 p-xl shadow-light-down-3">
      {/* 核心判定 Banner */}
      <div
        className={cn(
          'flex flex-wrap items-center justify-between gap-lg rounded-lg border px-xl py-lg',
          result.hasSpeech
            ? 'border-success-outline bg-success-container-1'
            : 'border-outline-2 bg-surface-3',
        )}
      >
        <div className="flex items-center gap-md">
          <Icon
            iconName={result.hasSpeech ? 'CheckCircle' : 'XCircle'}
            size={40}
            weight="fill"
            className={result.hasSpeech ? 'text-success-variant-1' : 'text-neutral-variant-2'}
          />
          <div>
            <div className="text-xs text-on-surface-variant">VAD 分析判定結果</div>
            <div className={cn('title-xl', result.hasSpeech ? 'text-success' : 'text-on-surface')}>
              {result.hasSpeech ? '檢測到人聲 (Speech Detected)' : '未檢測到人聲 (No Speech)'}
            </div>
          </div>
        </div>

        <span className="rounded-full border border-outline-2 bg-surface-2 px-md py-xs text-xs text-on-surface">
          分析耗時 {result.analysisTimeMs} ms
        </span>
      </div>

      {/* 關鍵統計 */}
      <div className="grid grid-cols-2 gap-md lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-md border border-outline-2 bg-surface-3 px-lg py-md"
          >
            <div className="text-xs text-on-surface-variant">{stat.label}</div>
            <div className="font-mono text-lg font-bold text-on-surface">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* 語音片段清單表格 */}
      <div>
        <h3 className="title-sm mb-md">人聲片段明細列表 (Speech Segments)</h3>

        {result.segments.length === 0 ? (
          <div className="rounded-md border border-outline-2 bg-surface-3 p-2xl text-center text-sm text-on-surface-variant">
            本音檔未偵測到任何符合門檻的人聲片段（如屬微弱語音，可嘗試降低 positiveSpeechThreshold）
          </div>
        ) : (
          <div className="overflow-x-auto rounded-md border border-outline-2">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-3 text-on-surface-variant">
                <tr>
                  <th className="px-md py-sm">#</th>
                  <th className="px-md py-sm">起始時間</th>
                  <th className="px-md py-sm">結束時間</th>
                  <th className="px-md py-sm">時長</th>
                  <th className="px-md py-sm text-right">操作</th>
                </tr>
              </thead>
              <tbody>
                {result.segments.map((seg, idx) => (
                  <tr
                    key={seg.id}
                    className={cn(
                      'border-t border-outline-2 transition-colors',
                      seg.id === activeSegmentId ? 'bg-primary-container' : 'hover:bg-surface-3',
                    )}
                  >
                    <td className="px-md py-sm text-on-surface-variant">{idx + 1}</td>
                    <td className="px-md py-sm font-mono">{formatTime(seg.startMs)}</td>
                    <td className="px-md py-sm font-mono">{formatTime(seg.endMs)}</td>
                    <td className="px-md py-sm font-mono">{seg.durationMs} ms</td>
                    <td className="px-md py-sm text-right">
                      <Button variant="ghost" size="small" onClick={() => playSegmentAudio(seg)}>
                        <Icon iconName="Play" size={14} weight="fill" />
                        單段試聽
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};
