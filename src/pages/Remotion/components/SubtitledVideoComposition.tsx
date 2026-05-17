import {
  AbsoluteFill,
  Html5Video,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

import type { CaptionSegment } from './captions';

export type SubtitledVideoCompositionProps = {
  videoSrc: string;
  videoLabel?: string;
  captions: CaptionSegment[];
};

// 依目前 frame 找出要顯示的字幕；超過最後一段時保留最後一句，避免畫面瞬間變空。
const findActiveCaption = (
  captions: CaptionSegment[],
  frame: number
): CaptionSegment | undefined =>
  captions.find(
    (caption) => frame >= caption.startFrame && frame < caption.endFrame
  ) ?? captions.at(-1);

const SubtitledVideoComposition = ({
  videoSrc,
  captions,
}: SubtitledVideoCompositionProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // public 目錄下的素材會透過 staticFile 映射成 Remotion composition 可讀的路徑。
  const resolvedVideoSrc = staticFile(videoSrc.replace(/^\//u, ''));
  const activeCaption = findActiveCaption(captions, frame);
  const previousCaption =
    activeCaption == null
      ? undefined
      : captions[captions.findIndex((caption) => caption.id === activeCaption.id) - 1];

  // spring 會回傳一條隨時間變化的動畫曲線，用來讓字幕進場不要像硬切。
  const captionProgress =
    activeCaption == null
      ? 0
      : spring({
          fps,
          frame: Math.max(frame - activeCaption.startFrame, 0),
          config: {
            damping: 16,
            stiffness: 180,
            mass: 0.9,
          },
        });

  // 透明度與位移分開控制，讓字幕有進場、停留、退場三段式效果。
  const captionOpacity =
    activeCaption == null
      ? 0
      : interpolate(
          frame,
          [
            activeCaption.startFrame,
            activeCaption.startFrame + 6,
            Math.max(activeCaption.endFrame - 8, activeCaption.startFrame + 6),
            activeCaption.endFrame,
          ],
          [0, 1, 1, 0],
          {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }
        );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#05070f',
        color: '#fff7eb',
        fontFamily: 'Roboto Flex, Noto Sans TC, sans-serif',
      }}
    >
      <Html5Video
        src={resolvedVideoSrc}
        style={{
          height: '100%',
          objectFit: 'cover',
          width: '100%',
        }}
      />
      {/* 疊一層漸層，確保底部字幕在亮背景上仍保有可讀性。 */}
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, rgba(4,10,26,0.2) 0%, rgba(4,10,26,0.08) 38%, rgba(4,10,26,0.82) 100%)',
        }}
      />
      <AbsoluteFill style={{ justifyContent: 'flex-end', padding: '44px 40px' }}>
        <div
          style={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <div
            style={{
              backdropFilter: 'blur(8px)',
              background: 'rgba(90, 144, 166, 0.15)',
              border: '1px solid rgba(155, 218, 242, 0.15)',
              borderRadius: 16,
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
              marginTop: 'auto',
              maxWidth: 700,
              padding: '16px 24px',
              transform: `translateY(${(1 - captionProgress) * 10}px)`,
              width: '100%',
            }}
          >
            <div
              style={{
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: 16,
                fontWeight: 400,
                lineHeight: 1.5,
                marginBottom: 6,
                minHeight: 24,
                opacity: captionOpacity * 0.8,
                textAlign: 'center',
                letterSpacing: '0.02em',
              }}
            >
              {previousCaption?.text ?? ' '}
            </div>
            <div
              style={{
                color: activeCaption?.emphasis === true ? '#9BDAF2' : '#ffffff',
                fontSize: 32,
                fontWeight: 500,
                letterSpacing: '0.04em',
                lineHeight: 1.4,
                opacity: captionOpacity,
                textAlign: 'center',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
                whiteSpace: 'pre-wrap',
              }}
            >
              {activeCaption?.text ?? '字幕載入中'}
            </div>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 999,
                height: 2,
                margin: '12px auto 0',
                overflow: 'hidden',
                width: '40%',
              }}
            >
              <div
                style={{
                  background: 'linear-gradient(90deg, #5A90A6 0%, #9BDAF2 100%)',
                  borderRadius: 999,
                  height: '100%',
                  transform: `scaleX(${captionProgress})`,
                  transformOrigin: 'left center',
                  width: '100%',
                }}
              />
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export default SubtitledVideoComposition;