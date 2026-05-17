export type CaptionSegment = {
  id: string;
  text: string;
  startFrame: number;
  endFrame: number;
  emphasis: boolean;
};

const MIN_CAPTION_FRAMES = 18;

const sanitizeLine = (line: string): string =>
  line.replace(/^[-*]\s+/, '').trim();

const getCaptionWeight = (text: string): number => {
  const visibleCharacters = [...text.replace(/\s+/g, '')].length;
  const punctuationBonus = (text.match(/[，。！？,.!?]/g) ?? []).length * 0.35;
  const emphasisBonus = /^[（(].+[）)]$/.test(text) ? 1.6 : 0;

  return Math.max(1, visibleCharacters + punctuationBonus + emphasisBonus);
};

export const parseLyricsMarkdown = (markdown: string): string[] =>
  markdown
    .split(/\r?\n/u)
    .map(sanitizeLine)
    .filter(Boolean);

export const buildCaptionTimeline = (
  lines: string[],
  totalFrames: number
): CaptionSegment[] => {
  if (lines.length === 0) {
    return [];
  }

  const introPadding = Math.min(18, Math.max(8, Math.round(totalFrames * 0.02)));
  const availableFrames = Math.max(
    totalFrames - introPadding,
    lines.length * MIN_CAPTION_FRAMES
  );
  const weights = lines.map(getCaptionWeight);
  const weightTotal = weights.reduce((sum, weight) => sum + weight, 0);
  const allocations = weights.map((weight) =>
    Math.max(MIN_CAPTION_FRAMES, Math.floor((weight / weightTotal) * availableFrames))
  );
  let allocatedFrames = allocations.reduce((sum, frames) => sum + frames, 0);
  let cursor = 0;

  while (allocatedFrames < availableFrames) {
    allocations[cursor % allocations.length] += 1;
    allocatedFrames += 1;
    cursor += 1;
  }

  while (allocatedFrames > availableFrames) {
    const index = allocations.findIndex((frames) => frames > MIN_CAPTION_FRAMES);

    if (index === -1) {
      break;
    }

    allocations[index] -= 1;
    allocatedFrames -= 1;
  }

  let currentFrame = introPadding;

  return lines.map((text, index) => {
    const allocated = allocations[index] ?? MIN_CAPTION_FRAMES;
    const endFrame =
      index === lines.length - 1 ? totalFrames : currentFrame + allocated;
    const segment: CaptionSegment = {
      id: `caption-${index + 1}`,
      text,
      startFrame: currentFrame,
      endFrame,
      emphasis: /^[（(].+[）)]$/u.test(text),
    };

    currentFrame = endFrame;

    return segment;
  });
};

export const formatFrameTime = (frame: number, fps: number): string => {
  const totalSeconds = frame / fps;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds - minutes * 60;

  return `${String(minutes).padStart(2, '0')}:${seconds
    .toFixed(1)
    .padStart(4, '0')}`;
};