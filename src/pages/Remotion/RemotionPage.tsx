import { Player } from '@remotion/player';
import { useEffect, useMemo, useRef, useState } from 'react';

import {
  type EditableCaption,
  editableCaptionToSegment,
  formatFrameTime,
} from './components/captions';
import { Icon } from '@/components/Icon/Icon';

import SubtitledVideoComposition from './components/SubtitledVideoComposition';

const FPS = 30;
const VIDEO_SOURCES = ['/remotion/stone.mp4'] as const;
const CAPTIONS_SRC = '/remotion/captions.json';
const DEFAULT_DURATION_IN_FRAMES = 26 * FPS;
const FALLBACK_CAPTIONS: EditableCaption[] = [
  { id: 'caption-1', text: '在草地躺著看星空', startTime: 0.5, endTime: 6, emphasis: false },
  { id: 'caption-2', text: '聽著歌 心也慢慢地放空', startTime: 6, endTime: 11.5, emphasis: false },
  { id: 'caption-3', text: '左手 牽著你右手', startTime: 11.5, endTime: 17, emphasis: false },
  { id: 'caption-4', text: '深夜 還有好多話想說', startTime: 17, endTime: 22, emphasis: false },
  { id: 'caption-5', text: '(但是不行 要回家了)', startTime: 22, endTime: 24, emphasis: true },
  { id: 'caption-6', text: '有時候我們會吵架', startTime: 24.5, endTime: 27.3, emphasis: false },

  {
    id: 'caption-7',
    text: '因為在意的事情不一樣',
    startTime: 27.3,
    endTime: 30.5,
    emphasis: false,
  },
  { id: 'caption-8', text: '右手 牽著我左手', startTime: 30.5, endTime: 32.8, emphasis: false },
  { id: 'caption-9', text: '吵完 還是好多話想說', startTime: 32.8, endTime: 36.0, emphasis: false },
];

type VideoMetadata = {
  durationInFrames: number;
  height: number;
  width: number;
};

type ResolvedVideoSource = VideoMetadata & {
  src: string;
};

const getVideoMimeType = (src: string): string | null => {
  if (src.endsWith('.mp4')) {
    return 'video/mp4';
  }

  return null;
};

const canBrowserPlaySource = (src: string): boolean => {
  const video = document.createElement('video');
  const mimeType = getVideoMimeType(src);

  if (mimeType == null) {
    return true;
  }

  return video.canPlayType(mimeType) !== '';
};

const loadVideoMetadata = (src: string): Promise<VideoMetadata> =>
  new Promise((resolve, reject) => {
    const video = document.createElement('video');

    const cleanup = () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('error', handleError);
    };

    const handleLoadedMetadata = () => {
      cleanup();
      resolve({
        durationInFrames: Math.max(Math.round(video.duration * FPS), DEFAULT_DURATION_IN_FRAMES),
        height: video.videoHeight || 720,
        width: video.videoWidth || 1280,
      });
    };

    const handleError = () => {
      cleanup();
      reject(new Error('Unable to read video metadata.'));
    };

    video.preload = 'metadata';
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('error', handleError);
    video.src = src;
  });

const resolvePlayableVideoSource = async (
  sources: readonly string[],
): Promise<ResolvedVideoSource> => {
  // 依序測試候選影片來源，找到第一個可播放且讀得到 metadata 的檔案就採用。
  for (const src of sources) {
    if (!canBrowserPlaySource(src)) {
      continue;
    }

    try {
      const metadata = await loadVideoMetadata(src);

      return {
        src,
        ...metadata,
      };
    } catch {
      continue;
    }
  }

  throw new Error('No playable video source found.');
};

/** 以文字模式控制秒數輸入，防止雙小數點、onBlur 自動正規化前導零 */
const TimeInput = ({
  value,
  min,
  max,
  onChange,
  className,
}: {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  className?: string;
}) => {
  const [raw, setRaw] = useState(() => String(value));

  // 當外部 value 變動時同步（例如初始載入）
  useEffect(() => {
    setRaw((prev) => {
      if (parseFloat(prev) !== value) {
        return String(value);
      }
      return prev;
    });
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value;
    // 第一個字是 . → 自動補 0
    if (v.startsWith('.')) {
      v = '0' + v;
    }
    // 只允許數字和單一小數點
    if (/[^0-9.]/.test(v) || (v.match(/\./g) ?? []).length > 1) {
      return;
    }
    setRaw(v);
    const parsed = parseFloat(v);
    if (!isNaN(parsed)) {
      onChange(parsed);
    }
  };

  const handleBlur = () => {
    let parsed = parseFloat(raw);
    if (isNaN(parsed) || raw.trim() === '') {
      parsed = min ?? 0;
    }
    if (min !== undefined) parsed = Math.max(min, parsed);
    if (max !== undefined) parsed = Math.min(max, parsed);
    // 去除浮點雜訊，保留 1 位小數
    parsed = Math.round(parsed * 10) / 10;
    setRaw(String(parsed));
    onChange(parsed);
  };

  return (
    <input
      className={className}
      inputMode="decimal"
      max={max}
      min={min}
      type="text"
      value={raw}
      onBlur={handleBlur}
      onChange={handleChange}
    />
  );
};

const RemotionPage = () => {
  const [isVideoInfoOpen, setIsVideoInfoOpen] = useState(true);
  const [isTimelineOpen, setIsTimelineOpen] = useState(true);
  const [editableCaptions, setEditableCaptions] = useState<EditableCaption[]>([]);
  const [videoSrc, setVideoSrc] = useState<string>(VIDEO_SOURCES[0]);
  const [videoMetadata, setVideoMetadata] = useState<VideoMetadata>({
    durationInFrames: DEFAULT_DURATION_IN_FRAMES,
    height: 720,
    width: 1280,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [warning, setWarning] = useState<string | null>(null);
  const nextIdRef = useRef(10);

  // 側邊欄編輯的是秒數，這裡集中轉成 Remotion 使用的 frame-based 結構。
  const captions = useMemo(
    () => editableCaptions.map((c) => editableCaptionToSegment(c, FPS)),
    [editableCaptions],
  );

  const updateCaption = (id: string, patch: Partial<EditableCaption>) => {
    setEditableCaptions((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  };

  const deleteCaption = (id: string) => {
    setEditableCaptions((prev) => prev.filter((c) => c.id !== id));
  };

  const addCaption = () => {
    const last = editableCaptions.at(-1);
    const newId = `caption-${nextIdRef.current++}`;
    setEditableCaptions((prev) => [
      ...prev,
      {
        id: newId,
        text: '輸入字幕文字',
        startTime: last?.endTime ?? 0,
        endTime: (last?.endTime ?? 0) + 3,
        emphasis: false,
      },
    ]);
  };

  useEffect(() => {
    let isCancelled = false;

    const bootstrap = async () => {
      setIsLoading(true);

      // 字幕資料與影片 metadata 可平行載入，避免初始化時間被串行等待拉長。
      const [captionsResult, metadataResult] = await Promise.allSettled([
        fetch(CAPTIONS_SRC).then(async (response) => {
          if (!response.ok) {
            throw new Error('Unable to load captions.');
          }

          return response.json() as Promise<{ captions: EditableCaption[] }>;
        }),
        resolvePlayableVideoSource(VIDEO_SOURCES),
      ]);

      if (isCancelled) {
        return;
      }

      const nextEditableCaptions =
        captionsResult.status === 'fulfilled' ? captionsResult.value.captions : FALLBACK_CAPTIONS;
      // metadata 失敗時仍保留預設尺寸與長度，讓 Player 能用 fallback 設定繼續工作。
      const nextVideoMetadata =
        metadataResult.status === 'fulfilled'
          ? {
              durationInFrames: metadataResult.value.durationInFrames,
              height: metadataResult.value.height,
              width: metadataResult.value.width,
            }
          : {
              durationInFrames: DEFAULT_DURATION_IN_FRAMES,
              height: 720,
              width: 1280,
            };

      setVideoSrc(
        metadataResult.status === 'fulfilled' ? metadataResult.value.src : VIDEO_SOURCES[0],
      );
      setEditableCaptions(nextEditableCaptions);
      setVideoMetadata(nextVideoMetadata);
      setWarning(
        captionsResult.status === 'rejected' ? '字幕檔讀取失敗，已改用內建 fallback 字幕。' : null,
      );
      setIsLoading(false);
    };

    bootstrap().catch(() => {
      if (isCancelled) {
        return;
      }

      setEditableCaptions(FALLBACK_CAPTIONS);
      setWarning('初始化 Remotion 播放器時發生錯誤，已改用 fallback 字幕設定。');
      setIsLoading(false);
    });

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <div className="flex w-full min-h-main flex-col space-y-lg">
      <h1 className="title-2xl">Remotion</h1>

      <div className="grid gap-2xl lg:grid-cols-[minmax(0,1.7fr)_450px]">
        <section className="space-y-xl grow">
          <div className="overflow-hidden rounded-lg border border-outline-2 bg-surface-1 p-md shadow-light-down-3">
            <div
              className="overflow-hidden rounded-md bg-black"
              style={{ aspectRatio: `${videoMetadata.width} / ${videoMetadata.height}` }}
            >
              <Player
                acknowledgeRemotionLicense
                autoPlay={false}
                clickToPlay
                component={SubtitledVideoComposition}
                compositionHeight={videoMetadata.height}
                compositionWidth={videoMetadata.width}
                controls
                durationInFrames={videoMetadata.durationInFrames}
                errorFallback={({ error }) => {
                  return (
                    <div className="flex h-full items-center justify-center bg-black px-2xl text-center text-sm leading-7 text-rose-500">
                      Remotion 播放器發生錯誤：{error.message}
                    </div>
                  );
                }}
                fps={FPS}
                inputProps={{
                  captions,
                  videoLabel: videoSrc.split('/').at(-1),
                  videoSrc,
                }}
                loop
                style={{
                  height: '100%',
                  width: '100%',
                }}
              />
            </div>
          </div>
        </section>

        <aside className="space-y-lg text-left">
          <div className="rounded-lg border border-outline-2 bg-surface-1 p-xl shadow-light-down-3">
            <div
              className="mb-lg flex cursor-pointer select-none items-center justify-between gap-lg"
              onClick={() => setIsVideoInfoOpen((prev) => !prev)}
            >
              <h2 className="title-lg">影片資訊</h2>
              <div className="flex items-center gap-sm">
                <span className="rounded-md border border-outline-2 bg-surface-3 px-md py-xs text-xs font-medium text-on-surface">
                  {isLoading ? '載入中' : `${captions.length} 段字幕`}
                </span>
                <Icon
                  className="text-on-surface-variant"
                  iconName={isVideoInfoOpen ? 'CaretUp' : 'CaretDown'}
                  size={20}
                />
              </div>
            </div>
            {isVideoInfoOpen && (
              <>
                <dl className="space-y-md text-sm text-on-surface-variant">
                  <div className="flex items-center justify-between gap-lg">
                    <dt>影片來源</dt>
                    <dd className="font-medium text-on-surface">{videoSrc}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-lg">
                    <dt>影格率</dt>
                    <dd className="font-medium text-on-surface">30 fps</dd>
                  </div>
                  <div className="flex items-center justify-between gap-lg">
                    <dt>影片尺寸</dt>
                    <dd className="font-medium text-on-surface">
                      {videoMetadata.width} × {videoMetadata.height}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-lg">
                    <dt>總長度</dt>
                    <dd className="font-medium text-on-surface">
                      {formatFrameTime(videoMetadata.durationInFrames, FPS)}
                    </dd>
                  </div>
                </dl>
                {warning ? (
                  <p className="mt-lg rounded-md border border-rose-500/20 bg-rose-500/10 px-lg py-md text-sm leading-6 text-rose-500">
                    {warning}
                  </p>
                ) : null}
              </>
            )}
          </div>

          <div className="rounded-lg border border-outline-2 bg-surface-1 p-xl shadow-light-down-3">
            <div
              className="mb-lg flex cursor-pointer select-none items-center justify-between gap-md"
              onClick={() => setIsTimelineOpen((prev) => !prev)}
            >
              <h2 className="title-lg">字幕時間軸</h2>
              <div className="flex items-center gap-sm">
                <span className="text-xs text-on-surface-variant">秒 · 精度 0.1 s</span>
                <Icon
                  className="text-on-surface-variant"
                  iconName={isTimelineOpen ? 'CaretUp' : 'CaretDown'}
                  size={20}
                />
              </div>
            </div>
            {isTimelineOpen && (
              <>
                {/* 編輯這裡的文案與秒數後，左側 Player 會立即重新計算字幕 frame。 */}
                <div className="space-y-md">
                  {editableCaptions.map((caption, index) => (
                    <div
                      key={caption.id}
                      className="rounded-md border border-outline-2 bg-surface-3 px-lg py-md"
                    >
                      {/* 第一行：序號 + 強調 + 刪除 */}
                      <div className="mb-sm flex items-center gap-sm">
                        <span className="shrink-0 text-xs font-medium uppercase tracking-[0.18em] text-on-surface-variant">
                          #{String(index + 1).padStart(2, '0')}
                        </span>
                        <label className="ml-auto flex shrink-0 cursor-pointer items-center gap-xs text-xs text-on-surface-variant">
                          <input
                            checked={caption.emphasis}
                            className="accent-primary"
                            type="checkbox"
                            onChange={(e) =>
                              updateCaption(caption.id, {
                                emphasis: e.target.checked,
                              })
                            }
                          />
                          強調
                        </label>
                        <button
                          aria-label="刪除此字幕"
                          className="shrink-0 rounded px-xs py-xs text-xs text-on-surface-variant transition-colors hover:bg-rose-500/10 hover:text-rose-500"
                          type="button"
                          onClick={() => deleteCaption(caption.id)}
                        >
                          ✕
                        </button>
                      </div>

                      {/* 第二行：字幕文字輸入 */}
                      <input
                        className="mb-sm block w-full rounded-md border border-outline bg-surface-1 px-sm py-xs text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50"
                        type="text"
                        value={caption.text}
                        onChange={(e) => updateCaption(caption.id, { text: e.target.value })}
                      />

                      <div className="flex flex-wrap items-center justify-between gap-x-sm gap-y-xs text-xs text-on-surface-variant">
                        <div className="flex items-center gap-xs">
                          <label className="flex shrink-0 items-center gap-xs">
                            <span>起</span>
                            <TimeInput
                              className="w-[4rem] rounded-md border border-outline bg-surface-1 px-xs py-xs text-right text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50"
                              max={caption.endTime}
                              min={0}
                              value={caption.startTime}
                              onChange={(v) => updateCaption(caption.id, { startTime: v })}
                            />
                            <span>s</span>
                          </label>
                          <span className="text-outline">—</span>
                          <label className="flex shrink-0 items-center gap-xs">
                            <span>末</span>
                            <TimeInput
                              className="w-[4rem] rounded-md border border-outline bg-surface-1 px-xs py-xs text-right text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50"
                              min={caption.startTime}
                              value={caption.endTime}
                              onChange={(v) => updateCaption(caption.id, { endTime: v })}
                            />
                            <span>s</span>
                          </label>
                        </div>
                        <span className="shrink-0 text-[10px] tracking-wider text-outline">
                          {formatFrameTime(Math.round(caption.startTime * FPS), FPS)}
                          {' – '}
                          {formatFrameTime(Math.round(caption.endTime * FPS), FPS)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 新增字幕按鈕 */}
                <button
                  className="mt-md w-full rounded-md border border-dashed border-outline-2 py-sm text-sm text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
                  type="button"
                  onClick={addCaption}
                >
                  + 新增字幕
                </button>
              </>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default RemotionPage;
