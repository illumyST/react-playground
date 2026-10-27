import React, { useEffect, useRef, useState } from 'react';
import { Button, Icon } from '@/components';
import type { DecodedAudio } from '../services/audio/audio-decoder';
import type { SpeechSegment } from '../services/audio/speech-detection';

// Canvas 無法使用 Tailwind class，色彩對應 src/styles/tokens.css 的 token
const COLORS = {
  centerLine: '#d9d9d9', // gray-200
  speechBar: '#5A90A6', // steel-500
  silenceBar: '#bdbdbd', // gray-300
  segmentFill: 'rgba(155, 218, 242, 0.25)', // steel-200
  segmentFillActive: 'rgba(155, 218, 242, 0.55)',
  segmentStroke: '#74C4E5', // steel-300
  segmentStrokeActive: '#3B6578', // steel-700
  playhead: '#D4728A', // rose-500
};

interface WaveformVisualizerProps {
  decodedAudio: DecodedAudio;
  segments: SpeechSegment[];
  audioBlob: Blob | File;
  activeSegmentId?: string | null;
  onSelectSegment?: (segment: SpeechSegment) => void;
}

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
  decodedAudio,
  segments,
  audioBlob,
  activeSegmentId,
  onSelectSegment,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimeMs, setCurrentTimeMs] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const playheadAnimationRef = useRef<number | null>(null);

  // 產生音訊播放 URL
  useEffect(() => {
    const url = URL.createObjectURL(audioBlob);
    setAudioUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [audioBlob]);

  // 更新播放進度與動畫
  const updatePlayhead = () => {
    if (audioRef.current) {
      setCurrentTimeMs(audioRef.current.currentTime * 1000);
      if (!audioRef.current.paused && !audioRef.current.ended) {
        playheadAnimationRef.current = requestAnimationFrame(updatePlayhead);
      }
    }
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
      playheadAnimationRef.current = requestAnimationFrame(updatePlayhead);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    if (playheadAnimationRef.current) {
      cancelAnimationFrame(playheadAnimationRef.current);
    }
  };

  // 繪製波形與語音區間標記
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 處理 high-DPI 螢幕
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const centerY = height / 2;

    ctx.clearRect(0, 0, width, height);

    // 1. 繪製背景網格與中線
    ctx.strokeStyle = COLORS.centerLine;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    const totalDuration = decodedAudio.durationMs || 1;

    // 2. 繪製語音高亮區間 (Speech Segments Overlays)
    segments.forEach((seg) => {
      const startX = (seg.startMs / totalDuration) * width;
      const endX = (seg.endMs / totalDuration) * width;
      const segWidth = Math.max(2, endX - startX);
      const isActive = seg.id === activeSegmentId;

      ctx.fillStyle = isActive ? COLORS.segmentFillActive : COLORS.segmentFill;
      ctx.fillRect(startX, 0, segWidth, height);

      // 上下邊緣邊線
      ctx.strokeStyle = isActive ? COLORS.segmentStrokeActive : COLORS.segmentStroke;
      ctx.lineWidth = isActive ? 2 : 1;
      ctx.strokeRect(startX, 0, segWidth, height);
    });

    // 3. 繪製音訊波形柱 (Peaks Bars)
    const peaks = decodedAudio.peaks;
    const barCount = peaks.length;
    const barWidth = Math.max(1.5, (width / barCount) * 0.7);
    const gap = (width - barCount * barWidth) / (barCount - 1);

    for (let i = 0; i < barCount; i++) {
      const x = i * (barWidth + gap);
      const barHeight = Math.max(3, peaks[i] * (centerY - 8));
      const timeAtBar = (i / barCount) * totalDuration;

      // 檢查此點是否在任何 speech segment 內
      const isInSpeech = segments.some((seg) => timeAtBar >= seg.startMs && timeAtBar <= seg.endMs);

      ctx.beginPath();
      ctx.fillStyle = isInSpeech ? COLORS.speechBar : COLORS.silenceBar;

      // 上下對稱柱
      ctx.roundRect(x, centerY - barHeight, barWidth, barHeight * 2, 1.5);
      ctx.fill();
    }

    // 4. 繪製當前播放指針 (Playhead)
    const playheadX = (currentTimeMs / totalDuration) * width;
    if (playheadX >= 0 && playheadX <= width) {
      ctx.strokeStyle = COLORS.playhead;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(playheadX, 0);
      ctx.lineTo(playheadX, height);
      ctx.stroke();

      // 指針頂部圓點
      ctx.fillStyle = COLORS.playhead;
      ctx.beginPath();
      ctx.arc(playheadX, 6, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [decodedAudio, segments, currentTimeMs, activeSegmentId]);

  // 點擊波形進行播放尋軌 (Seek)
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !audioRef.current) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const targetMs = ratio * decodedAudio.durationMs;

    audioRef.current.currentTime = targetMs / 1000;
    setCurrentTimeMs(targetMs);

    // 若點在特定 segment 上，通知父層
    const clickedSegment = segments.find((s) => targetMs >= s.startMs && targetMs <= s.endMs);
    if (clickedSegment && onSelectSegment) {
      onSelectSegment(clickedSegment);
    }
  };

  const formatTime = (ms: number) => {
    const totalSec = ms / 1000;
    const mins = Math.floor(totalSec / 60);
    const secs = (totalSec % 60).toFixed(2);
    return `${mins.toString().padStart(2, '0')}:${secs.padStart(5, '0')}`;
  };

  return (
    <section className="rounded-lg border border-outline-2 bg-surface-1 p-xl shadow-light-down-3">
      <div className="mb-lg flex flex-wrap items-center justify-between gap-sm">
        <div className="flex items-center gap-sm">
          <Icon iconName="SpeakerHigh" size={20} className="text-primary" />
          <h2 className="title-md">音訊波形與人聲區間時間軸</h2>
        </div>
        <div className="flex items-center gap-md">
          <div className="flex items-center gap-xs text-xs text-on-surface-variant">
            <span className="inline-block size-[10px] rounded-sm bg-steel-500" />
            人聲區間 (Speech Segment)
          </div>
          <span className="font-mono text-sm text-primary">
            {formatTime(currentTimeMs)} / {formatTime(decodedAudio.durationMs)}
          </span>
        </div>
      </div>

      {/* Canvas 波形容器 */}
      <div className="relative mb-lg h-[120px] w-full cursor-crosshair overflow-hidden rounded-md border border-outline-2 bg-surface-3">
        <canvas ref={canvasRef} onClick={handleCanvasClick} className="block size-full" />
      </div>

      {/* 播放控制列 */}
      <div className="flex flex-wrap items-center justify-between gap-md">
        <div className="flex items-center gap-sm">
          <Button size="small" onClick={handlePlayPause}>
            <Icon iconName={isPlaying ? 'Pause' : 'Play'} size={16} weight="fill" />
            {isPlaying ? '暫停播放' : '播放音訊'}
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.currentTime = 0;
                setCurrentTimeMs(0);
              }
            }}
            title="回到開頭"
          >
            <Icon iconName="ArrowCounterClockwise" size={16} />
          </Button>
        </div>

        <p className="text-xs text-on-surface-variant">
          提示：點擊波形任何位置即可跳轉播放；藍色區塊為 VAD 偵測到之語音區間
        </p>
      </div>

      {/* 隱藏原生 Audio 標籤 */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={handleAudioEnded}
          onPause={() => setIsPlaying(false)}
        />
      )}
    </section>
  );
};
