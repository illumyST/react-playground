import { Player } from '@remotion/player';
import { useEffect, useState } from 'react';

import {
    buildCaptionTimeline,
    formatFrameTime,
    parseLyricsMarkdown,
    type CaptionSegment,
} from './components/captions';
import SubtitledVideoComposition from './components/SubtitledVideoComposition';

const FPS = 30;
const VIDEO_SOURCES = ['/video/stone.mp4'] as const;
const LYRICS_SRC = '/video/lyrics.md';
const DEFAULT_DURATION_IN_FRAMES = 26 * FPS;
const FALLBACK_LYRICS = `在草地躺著看星空
聽著歌 心也慢慢地放空
左手 牽著你右手
深夜 還有好多話想說
(但是不行 要回家了)

有時候我們會吵架
因為在意的事情不一樣
右手 牽著我左手
吵完 還是好多話想說`;

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

    if (src.endsWith('.mov')) {
        return 'video/quicktime';
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
                durationInFrames: Math.max(
                    Math.round(video.duration * FPS),
                    DEFAULT_DURATION_IN_FRAMES
                ),
                height: video.videoHeight || 1280,
                width: video.videoWidth || 720,
            });
        };

        const handleError = () => {
            cleanup();
            reject(new Error('Unable to read video metadata.'));
        };

        video.preload = 'metadata';
        video.src = src;
        video.addEventListener('loadedmetadata', handleLoadedMetadata);
        video.addEventListener('error', handleError);
    });

const resolvePlayableVideoSource = async (
    sources: readonly string[]
): Promise<ResolvedVideoSource> => {
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

const RemotionPage = () => {
    const [captions, setCaptions] = useState<CaptionSegment[]>([]);
    const [videoSrc, setVideoSrc] = useState<string>(VIDEO_SOURCES[0]);
    const [videoMetadata, setVideoMetadata] = useState<VideoMetadata>({
        durationInFrames: DEFAULT_DURATION_IN_FRAMES,
        height: 1280,
        width: 720,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [warning, setWarning] = useState<string | null>(null);

    useEffect(() => {
        let isCancelled = false;

        const bootstrap = async () => {
            setIsLoading(true);

            const [lyricsResult, metadataResult] = await Promise.allSettled([
                fetch(LYRICS_SRC).then(async (response) => {
                    if (!response.ok) {
                        throw new Error('Unable to load lyrics.');
                    }

                    return response.text();
                }),
                resolvePlayableVideoSource(VIDEO_SOURCES),
            ]);

            if (isCancelled) {
                return;
            }

            const lyricsMarkdown =
                lyricsResult.status === 'fulfilled'
                    ? lyricsResult.value
                    : FALLBACK_LYRICS;
            const nextVideoMetadata =
                metadataResult.status === 'fulfilled'
                    ? {
                            durationInFrames: metadataResult.value.durationInFrames,
                            height: metadataResult.value.height,
                            width: metadataResult.value.width,
                        }
                    : {
                            durationInFrames: DEFAULT_DURATION_IN_FRAMES,
                            height: 1280,
                            width: 720,
                        };
            const lyricLines = parseLyricsMarkdown(lyricsMarkdown);

            setVideoSrc(
                metadataResult.status === 'fulfilled'
                    ? metadataResult.value.src
                    : VIDEO_SOURCES[0]
            );
            setCaptions(
                buildCaptionTimeline(lyricLines, nextVideoMetadata.durationInFrames)
            );
            setVideoMetadata(nextVideoMetadata);
            setWarning(
                lyricsResult.status === 'rejected' || metadataResult.status === 'rejected'
                    ? '歌詞或影片 metadata 讀取失敗，已改用內建 fallback 版本。'
                    : null
            );
            setIsLoading(false);
        };

        bootstrap().catch(() => {
            if (isCancelled) {
                return;
            }

            const lyricLines = parseLyricsMarkdown(FALLBACK_LYRICS);

            setCaptions(buildCaptionTimeline(lyricLines, DEFAULT_DURATION_IN_FRAMES));
            setWarning('初始化 Remotion 播放器時發生錯誤，已改用 fallback 字幕設定。');
            setIsLoading(false);
        });

        return () => {
            isCancelled = true;
        };
    }, []);

    return (
        <main className="min-h-main bg-[radial-gradient(circle_at_top,#2f4f4f_0%,#10182f_35%,#06070b_100%)] px-2xl py-4xl text-stone-50 md:px-6xl md:py-6xl">
            <div className="mx-auto grid max-w-2/3 gap-4xl lg:grid-cols-[minmax(0,1.7fr)_360px]">
                <section className="space-y-xl">
 

                    <div className="overflow-hidden rounded-[36px] border border-white/12 bg-black/25 p-md shadow-[0_40px_120px_rgba(0,0,0,0.32)] backdrop-blur-xl">
                        <div
                            className="overflow-hidden rounded-[28px] bg-black"
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
                                        <div className="flex h-full items-center justify-center bg-black px-2xl text-center text-sm leading-7 text-red-100">
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
                    <div className="rounded-[28px] border border-white/12 bg-white/8 p-xl backdrop-blur-xl">
                        <div className="mb-lg flex items-center justify-between gap-lg">
                            <h2 className="text-lg font-semibold">字幕設定</h2>
                            <span className="rounded-full bg-amber-300/18 px-md py-xs text-xs font-medium text-amber-100">
                                {isLoading ? '載入中' : `${captions.length} 段字幕`}
                            </span>
                        </div>
                        <dl className="space-y-md text-sm text-white/70">
                            <div className="flex items-center justify-between gap-lg">
                                <dt>影片來源</dt>
                                <dd className="font-medium text-white">{videoSrc}</dd>
                            </div>
                            <div className="flex items-center justify-between gap-lg">
                                <dt>歌詞來源</dt>
                                <dd className="font-medium text-white">/video/lyrics.md</dd>
                            </div>
                            <div className="flex items-center justify-between gap-lg">
                                <dt>影格率</dt>
                                <dd className="font-medium text-white">30 fps</dd>
                            </div>
                            <div className="flex items-center justify-between gap-lg">
                                <dt>影片尺寸</dt>
                                <dd className="font-medium text-white">
                                    {videoMetadata.width} × {videoMetadata.height}
                                </dd>
                            </div>
                            <div className="flex items-center justify-between gap-lg">
                                <dt>總長度</dt>
                                <dd className="font-medium text-white">
                                    {formatFrameTime(videoMetadata.durationInFrames, FPS)}
                                </dd>
                            </div>
                        </dl>
                        {warning ? (
                            <p className="mt-lg rounded-2xl border border-amber-200/15 bg-amber-200/10 px-lg py-md text-sm leading-6 text-amber-50">
                                {warning}
                            </p>
                        ) : null}
                    </div>

                    <div className="rounded-[28px] border border-white/12 bg-black/18 p-xl backdrop-blur-xl">
                        <h2 className="mb-lg text-lg font-semibold">字幕時間軸</h2>
                        <div className="space-y-md">
                            {captions.map((caption, index) => (
                                <div
                                    key={caption.id}
                                    className="rounded-2xl border border-white/8 bg-white/6 px-lg py-md"
                                >
                                    <div className="mb-xs flex items-center justify-between gap-md text-xs uppercase tracking-[0.2em] text-white/48">
                                        <span>#{String(index + 1).padStart(2, '0')}</span>
                                        <span>
                                            {formatFrameTime(caption.startFrame, FPS)} -{' '}
                                            {formatFrameTime(caption.endFrame, FPS)}
                                        </span>
                                    </div>
                                    <p className="text-sm leading-6 text-white/88">{caption.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    );
};

export default RemotionPage;