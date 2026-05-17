import {
  AbsoluteFill,
  Html5Video,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

import type { CaptionSegment } from '@/remotion/captions';

export type SubtitledVideoCompositionProps = {
  videoSrc: string;
  videoLabel?: string;
  captions: CaptionSegment[];
};

const findActiveCaption = (
  captions: CaptionSegment[],
  frame: number
): CaptionSegment | undefined =>
  captions.find(
    (caption) => frame >= caption.startFrame && frame < caption.endFrame
  ) ?? captions.at(-1);

const SubtitledVideoComposition = ({
  videoSrc,
  videoLabel,
  captions,
}: SubtitledVideoCompositionProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const resolvedVideoSrc = staticFile(videoSrc.replace(/^\//u, ''));
  const activeCaption = findActiveCaption(captions, frame);
  const previousCaption =
    activeCaption == null
      ? undefined
      : captions[captions.findIndex((caption) => caption.id === activeCaption.id) - 1];

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
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, rgba(4,10,26,0.2) 0%, rgba(4,10,26,0.08) 38%, rgba(4,10,26,0.82) 100%)',
        }}
      />
      <AbsoluteFill style={{ justifyContent: 'space-between', padding: '44px 40px' }}>
        <div
          style={{
            alignItems: 'center',
            display: 'inline-flex',
            gap: 12,
            letterSpacing: '0.08em',
          }}
        >
          <span
            style={{
              backdropFilter: 'blur(20px)',
              background: 'rgba(255, 248, 237, 0.14)',
              border: '1px solid rgba(255, 248, 237, 0.2)',
              borderRadius: 999,
              fontSize: 18,
              fontWeight: 600,
              padding: '10px 18px',
              textTransform: 'uppercase',
            }}
          >
            Remotion Subtitle Pass
          </span>
          <span
            style={{
              color: 'rgba(255, 247, 235, 0.72)',
              fontSize: 20,
              fontWeight: 500,
            }}
          >
            {videoLabel ?? 'video'}
          </span>
        </div>

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
              backdropFilter: 'blur(28px)',
              background: 'rgba(8, 13, 31, 0.64)',
              border: '1px solid rgba(255, 247, 235, 0.18)',
              borderRadius: 32,
              boxShadow: '0 28px 80px rgba(0, 0, 0, 0.34)',
              marginTop: 'auto',
              maxWidth: 980,
              padding: '28px 34px 32px',
              transform: `translateY(${(1 - captionProgress) * 32}px)`,
              width: '100%',
            }}
          >
            <div
              style={{
                color: 'rgba(255, 247, 235, 0.56)',
                fontSize: 20,
                lineHeight: 1.45,
                marginBottom: 12,
                minHeight: 29,
                opacity: captionOpacity * 0.72,
                textAlign: 'center',
              }}
            >
              {previousCaption?.text ?? ' '}
            </div>
            <div
              style={{
                fontSize: activeCaption?.emphasis === true ? 44 : 56,
                fontWeight: activeCaption?.emphasis === true ? 600 : 700,
                letterSpacing:
                  activeCaption?.emphasis === true ? '0.04em' : '0.02em',
                lineHeight: 1.18,
                minHeight: 132,
                opacity: captionOpacity,
                textAlign: 'center',
                textShadow: '0 4px 24px rgba(0, 0, 0, 0.45)',
                whiteSpace: 'pre-wrap',
              }}
            >
              {activeCaption?.text ?? '字幕載入中'}
            </div>
            <div
              style={{
                background: 'rgba(255, 247, 235, 0.12)',
                borderRadius: 999,
                height: 8,
                margin: '18px auto 0',
                overflow: 'hidden',
                width: '40%',
              }}
            >
              <div
                style={{
                  background: 'linear-gradient(90deg, #ffb56b 0%, #ffe8bb 100%)',
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