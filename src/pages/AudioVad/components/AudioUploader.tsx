import React, { useRef, useState } from 'react';
import { Button, Icon } from '@/components';
import { cn } from '@/utils/classnames';
import {
  AudioRecorder,
  PRESET_SAMPLES,
  type PresetSample,
} from '../services/audio/sample-generator';

interface AudioUploaderProps {
  onFileSelected: (file: File | Blob, filename: string) => void;
  isAnalyzing: boolean;
  currentFilename?: string;
}

const AUDIO_TEST_FILES = [
  {
    name: 'd1fe6a98-e440-40a7-bc03-2d41a621b347_5-18s.webm',
    label: 'd1fe6a98 (13s, 擷取5-18秒, 有人聲)',
  },
  { name: '1e8aef73-9791-4481-b64b-31be7b0484e2.webm', label: '1e8aef73 (80s, 無人聲)' },
  { name: '2697dc1c-91c4-4081-bbbc-8d0dc3fd5d13.webm', label: '2697dc1c (67s, 有人聲)' },
  { name: '4b34bb9d-65ab-4362-8de9-4c48e709d85b.webm', label: '4b34bb9d (463s, 無人聲)' },
  { name: '72277662-6cd4-45bd-9486-ccb390fa0ba7.webm', label: '72277662 (90s, 有人聲)' },
  { name: '7b0ddf92-ab92-4c72-8d97-41d35e4d4f7b.webm', label: '7b0ddf92 (59s, 有人聲)' },
  { name: '928d684a-a0c9-4806-aec0-7f03d1c56d4c.webm', label: '928d684a (78s, 有人聲)' },
  { name: 'cee55f7a-0c8d-454f-8a42-160ced6f148b.webm', label: 'cee55f7a (51s, 有人聲)' },
  { name: '7a3108ba-a528-4c27-9496-481fe5a1c2a6.webm', label: '7a3108ba (20m, 無人聲)' },
  { name: '9b44bf90-04c5-4612-8f23-00a126efa13d.webm', label: '9b44bf90 (31m, 有人聲)' },
];

export const AudioUploader: React.FC<AudioUploaderProps> = ({
  onFileSelected,
  isAnalyzing,
  currentFilename,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recorderRef = useRef<AudioRecorder | null>(null);
  const timerRef = useRef<number | null>(null);

  const handleAudioTestSelect = async (filename: string) => {
    if (!filename) return;
    try {
      const basePath = import.meta.env.BASE_URL.endsWith('/')
        ? import.meta.env.BASE_URL
        : `${import.meta.env.BASE_URL}/`;
      const res = await fetch(`${basePath}audioTest/${filename}`);
      if (!res.ok) throw new Error(`載入失敗 (${res.status})`);
      const blob = await res.blob();
      onFileSelected(blob, filename);
    } catch (err) {
      alert(`載入 audioTest 測試音檔失敗：${err instanceof Error ? err.message : '未知錯誤'}`);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      onFileSelected(file, file.name);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      onFileSelected(file, file.name);
    }
  };

  const handlePresetSelect = async (preset: PresetSample) => {
    try {
      const blob = await preset.createBlob();
      onFileSelected(blob, `${preset.id}.wav`);
    } catch (err) {
      console.error('Failed to load preset:', err);
    }
  };

  const startRecording = async () => {
    try {
      const recorder = new AudioRecorder();
      await recorder.start();
      recorderRef.current = recorder;
      setIsRecording(true);
      setRecordSeconds(0);

      timerRef.current = window.setInterval(() => {
        setRecordSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      alert(`無法啟動麥克風錄音：${err instanceof Error ? err.message : '未知錯誤'}`);
    }
  };

  const stopRecording = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (recorderRef.current) {
      try {
        const audioBlob = await recorderRef.current.stop();
        setIsRecording(false);
        const filename = `mic-record-${new Date().toISOString().slice(11, 19).replace(/:/g, '')}.webm`;
        onFileSelected(audioBlob, filename);
      } catch (err) {
        console.error('Stop recording error:', err);
        setIsRecording(false);
      }
    }
  };

  return (
    <section className="rounded-lg border border-outline-2 bg-surface-1 p-xl shadow-light-down-3">
      <div className="mb-lg flex flex-wrap items-center justify-between gap-sm">
        <div className="flex items-center gap-sm">
          <Icon iconName="FileAudio" size={20} className="text-primary" />
          <h2 className="title-md">選擇或錄製音訊檔案</h2>
        </div>
        {currentFilename && (
          <div className="flex items-center gap-xs text-sm text-on-surface-variant">
            <Icon iconName="CheckCircle" size={16} className="text-success-variant-1" />
            目前檔案：
            <span className="font-mono text-on-surface">{currentFilename}</span>
          </div>
        )}
      </div>

      {/* Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'mb-lg rounded-lg border-2 border-dashed px-xl py-5xl text-center transition-colors',
          isDragging
            ? 'border-primary bg-primary-container'
            : 'border-outline-3 bg-surface-3 hover:border-primary',
          isAnalyzing ? 'cursor-not-allowed' : 'cursor-pointer',
        )}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInput}
          accept="audio/*,.webm,.mp3,.wav,.m4a,.ogg,.flac"
          className="hidden"
          disabled={isAnalyzing}
        />
        <div className="mx-auto mb-md flex size-[48px] items-center justify-center rounded-full bg-primary-container text-primary">
          <Icon iconName="UploadSimple" size={22} />
        </div>
        <p className="title-sm">點擊上傳 或 拖曳音檔至此處</p>
        <p className="text-sm text-on-surface-variant">
          支援 WebM, MP3, WAV, M4A, OGG 等常見音訊格式 (前端直接解碼)
        </p>
      </div>

      {/* 快速測試集與麥克風錄音 */}
      <div className="flex flex-wrap items-center justify-between gap-md border-t border-outline-2 pt-lg">
        <div className="flex flex-wrap items-center gap-sm">
          <span className="text-sm text-on-surface-variant">快速測試集：</span>
          {PRESET_SAMPLES.map((preset) => (
            <Button
              key={preset.id}
              variant="outlined"
              size="small"
              onClick={() => handlePresetSelect(preset)}
              disabled={isAnalyzing || isRecording}
              title={preset.description}
            >
              <Icon iconName="PlayCircle" size={16} />
              {preset.name}
            </Button>
          ))}

          {/* audioTest 資料夾音檔選單 */}
          <select
            defaultValue=""
            onChange={(e) => {
              if (e.target.value) {
                handleAudioTestSelect(e.target.value);
                e.target.value = '';
              }
            }}
            disabled={isAnalyzing || isRecording}
            className="cursor-pointer rounded-md border border-outline bg-surface-1 px-sm py-xs text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
          >
            <option value="" disabled>
              選擇 audioTest 測試音檔...
            </option>
            {AUDIO_TEST_FILES.map((item) => (
              <option key={item.name} value={item.name}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        {/* 麥克風錄音 */}
        {isRecording ? (
          <Button color="product" size="small" onClick={stopRecording}>
            <span className="size-[8px] animate-pulse rounded-full bg-white" />
            <Icon iconName="Stop" size={16} weight="fill" />
            停止錄音 ({recordSeconds}s) 並分析
          </Button>
        ) : (
          <Button
            variant="outlined"
            color="product"
            size="small"
            onClick={startRecording}
            disabled={isAnalyzing}
          >
            <Icon iconName="Microphone" size={16} />
            麥克風即時錄製人聲測試
          </Button>
        )}
      </div>
    </section>
  );
};
