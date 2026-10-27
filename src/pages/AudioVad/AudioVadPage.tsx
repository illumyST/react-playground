import React, { useState } from 'react';
import { AudioUploader } from './components/AudioUploader';
import { WaveformVisualizer } from './components/WaveformVisualizer';
import { ParameterControls } from './components/ParameterControls';
import { DetectionResultCard } from './components/DetectionResultCard';
import {
  DEFAULT_VAD_OPTIONS,
  detectSpeech,
  detectSpeechFromSamples,
  type SpeechDetectionOptions,
  type SpeechDetectionResult,
  type SpeechSegment,
} from './services/audio/speech-detection';
import type { DecodedAudio } from './services/audio/audio-decoder';
import { Icon, Loading } from '@/components';

const TECH_TAGS = ['Silero VAD + ONNX WASM', '@ricky0123/vad-web', '純前端零伺服端傳輸'];

const AudioVadPage: React.FC = () => {
  const [file, setFile] = useState<Blob | File | null>(null);
  const [filename, setFilename] = useState<string>('');
  const [decodedAudio, setDecodedAudio] = useState<DecodedAudio | null>(null);
  const [result, setResult] = useState<SpeechDetectionResult | null>(null);
  const [options, setOptions] = useState<SpeechDetectionOptions>(DEFAULT_VAD_OPTIONS);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [activeSegmentId, setActiveSegmentId] = useState<string | null>(null);

  // 處理上傳或選取音檔
  const handleFileSelected = async (selectedFile: File | Blob, name: string) => {
    setFile(selectedFile);
    setFilename(name);
    setError(null);
    setIsAnalyzing(true);
    setStatusMessage('正在透過 Web Audio API 解碼音訊為 Float32Array...');

    try {
      // 步驟 1 & 2: 解碼音檔並執行 NonRealTimeVAD 分析
      setStatusMessage('正在載入 Silero VAD 模型並由 ONNX WASM 執行語音分析...');
      const detectionResult = await detectSpeech(selectedFile, options);

      setResult(detectionResult);
      if (detectionResult.decodedAudio) {
        setDecodedAudio(detectionResult.decodedAudio);
      }
      setActiveSegmentId(null);
    } catch (err) {
      console.error('Analysis failed:', err);
      setError(err instanceof Error ? err.message : '分析過程發生未知錯誤，請檢視主控台');
    } finally {
      setIsAnalyzing(false);
      setStatusMessage('');
    }
  };

  // 處理以新參數重新分析 (毋須重新讀取檔案，直接使用記憶體中的 samples)
  const handleReanalyze = async () => {
    if (!decodedAudio) return;

    setIsAnalyzing(true);
    setError(null);
    setStatusMessage('正在以新設定之閥值重新計算語音區段...');

    try {
      const updatedResult = await detectSpeechFromSamples(
        decodedAudio.samples,
        decodedAudio.sampleRate,
        decodedAudio.durationMs,
        options,
      );

      setResult({
        ...updatedResult,
        decodedAudio,
      });
      setActiveSegmentId(null);
    } catch (err) {
      console.error('Re-analysis failed:', err);
      setError(err instanceof Error ? err.message : '重新分析失敗');
    } finally {
      setIsAnalyzing(false);
      setStatusMessage('');
    }
  };

  const handleSelectSegment = (seg: SpeechSegment) => {
    setActiveSegmentId(seg.id);
  };

  return (
    <div className="flex w-full min-h-main flex-col space-y-lg text-left">
      <div className="space-y-sm">
        <h1 className="title-2xl">Audio VAD</h1>
        <p className="text-sm text-on-surface-variant">
          直接在前端瀏覽器分析音檔 samples，精確判定是否有人講話並標記片段時間
        </p>
        <div className="flex flex-wrap gap-sm">
          {TECH_TAGS.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-outline-2 bg-surface-2 px-md py-xs text-xs text-on-surface"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* 錯誤通知 Banner */}
      {error && (
        <div className="flex items-center gap-sm rounded-lg border border-error-outline bg-error-container-1 px-lg py-md text-sm text-error">
          <Icon iconName="Warning" size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* 上傳與測試音檔區塊 */}
      <AudioUploader
        onFileSelected={handleFileSelected}
        isAnalyzing={isAnalyzing}
        currentFilename={filename}
      />

      {/* 分析中載入狀態 */}
      {isAnalyzing && (
        <div className="space-y-sm rounded-lg border border-outline-2 bg-surface-1 p-2xl text-center shadow-light-down-3">
          <Loading size="large" />
          <h3 className="title-md">語音特徵提取與分析中</h3>
          <p className="text-sm text-on-surface-variant">
            {statusMessage || '請稍候，模型正在瀏覽器本機端 WASM 核心計算中...'}
          </p>
        </div>
      )}

      {/* 分析結果與視覺化呈現 */}
      {result && decodedAudio && file && !isAnalyzing && (
        <>
          {/* 波形與播放時間軸 */}
          <WaveformVisualizer
            decodedAudio={decodedAudio}
            segments={result.segments}
            audioBlob={file}
            activeSegmentId={activeSegmentId}
            onSelectSegment={handleSelectSegment}
          />

          {/* 判定結果卡片與片段清單 */}
          <DetectionResultCard
            result={result}
            decodedAudio={decodedAudio}
            activeSegmentId={activeSegmentId}
            onPlaySegment={handleSelectSegment}
          />

          {/* 閥值微調面板 */}
          <ParameterControls
            options={options}
            onOptionsChange={setOptions}
            onReanalyze={handleReanalyze}
            isAnalyzing={isAnalyzing}
            hasAudio={!!decodedAudio}
          />
        </>
      )}

      {/* 未上傳檔案時之導引提示卡片 */}
      {!result && !isAnalyzing && (
        <div className="rounded-lg border border-dashed border-outline-3 bg-surface-1 p-xl">
          <h3 className="title-sm mb-sm">如何使用本工具驗證？</h3>
          <ul className="list-disc space-y-xs pl-xl text-sm text-on-surface-variant">
            <li>
              <strong className="text-on-surface">快速驗證</strong>
              ：點選上方「純靜音」、「風扇雜音」或「440Hz 單音」預設集，預期判定皆為「未檢測到人聲
              (No Speech)」。
            </li>
            <li>
              <strong className="text-on-surface">真人語音測試</strong>
              ：點擊「麥克風即時錄製人聲測試」，對著麥克風說話 3~5
              秒後停止，系統將立即解碼並精確框出人聲區段。
            </li>
            <li>
              <strong className="text-on-surface">本機音檔分析</strong>
              ：拖曳您手邊既有的音訊檔案（如 <code>.webm</code>, <code>.m4a</code>,{' '}
              <code>.mp3</code>, <code>.wav</code>）即可完全在前端分析，不用擔心資料隱私外洩。
            </li>
            <li>
              <strong className="text-on-surface">參數微調</strong>
              ：分析完成後可透過下方滑桿即時調節門檻，直接測試不同雜訊環境下的最佳判定參數。
            </li>
          </ul>
        </div>
      )}

      <footer className="mt-auto flex flex-wrap items-center justify-between gap-md border-t border-outline-2 pt-lg text-xs text-on-surface-variant">
        <div>
          基於 <strong>@ricky0123/vad-web</strong> (Silero VAD) 與 Web Audio API 實現
        </div>
        <div className="flex gap-lg">
          <span>純客戶端運算 (WASM)</span>
          <span>零伺服端延遲</span>
        </div>
      </footer>
    </div>
  );
};

export default AudioVadPage;
