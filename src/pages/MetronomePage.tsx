import { useState } from 'react';
import { Button } from '@/components';

let audioCtx: AudioContext;

const play = (): void => {
  audioCtx = new AudioContext();
  const oscillator = new OscillatorNode(audioCtx);
  oscillator.type = 'sine';
  oscillator.frequency.value = 920;
  oscillator.detune.value = 0;
  oscillator.connect(audioCtx.destination);
  oscillator.start();
};

const pause = (): void => {
  audioCtx.close();
};

const MetronomePage = (): React.ReactNode => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) play();
    else pause();
  };

  return (
    <div className="mx-auto flex min-h-main w-full max-w-[768px] flex-col space-y-lg">
      <h1 className="title-2xl">Metronome</h1>
      <Button onClick={handlePlay} className="self-start">
        {isPlaying ? 'Pause' : 'Play'}
      </Button>
    </div>
  );
};

export default MetronomePage;
