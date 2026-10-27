import {
  ArrowCounterClockwiseIcon,
  ArrowsClockwiseIcon,
  CaretDownIcon,
  CaretUpIcon,
  ChartLineUpIcon,
  CheckCircleIcon,
  CloudSunIcon,
  FileAudioIcon,
  FileDocIcon,
  FilmSlateIcon,
  FirstAidKitIcon,
  GlobeIcon,
  HouseIcon,
  MagnifyingGlassIcon,
  MetronomeIcon,
  MicrophoneIcon,
  PauseIcon,
  PlayCircleIcon,
  PlayIcon,
  SlidersHorizontalIcon,
  SmileyIcon,
  SpeakerHighIcon,
  StopIcon,
  UploadSimpleIcon,
  UsersThreeIcon,
  WarningIcon,
  WaveformIcon,
  XCircleIcon,
} from '@phosphor-icons/react';

type IconName = keyof typeof ICONS;

// 參照Icon庫 https://phosphoricons.com/
interface props {
  iconName: IconName; // Icon名稱
  className?: string; // class
  size?: number; // 大小(預設24)
  weight?: 'regular' | 'bold' | 'fill'; // 樣式(預設regular)
}

const ICONS = {
  ChartLineUp: ChartLineUpIcon,
  House: HouseIcon, // home
  UsersThree: UsersThreeIcon, // grouping tool
  Smiley: SmileyIcon, // emoji
  CloudSun: CloudSunIcon, // weather
  Metronome: MetronomeIcon, // metronome
  Globe: GlobeIcon, // webmcp
  FileDoc: FileDocIcon, // docusaurus
  FilmSlate: FilmSlateIcon, // remotion
  MagnifyingGlass: MagnifyingGlassIcon, // search / 404
  CaretDown: CaretDownIcon,
  CaretUp: CaretUpIcon,
  FirstAid: FirstAidKitIcon, // hospital
  Waveform: WaveformIcon, // audio vad
  // audio vad 頁面內使用
  ArrowCounterClockwise: ArrowCounterClockwiseIcon,
  ArrowsClockwise: ArrowsClockwiseIcon,
  CheckCircle: CheckCircleIcon,
  FileAudio: FileAudioIcon,
  Microphone: MicrophoneIcon,
  Pause: PauseIcon,
  Play: PlayIcon,
  PlayCircle: PlayCircleIcon,
  SlidersHorizontal: SlidersHorizontalIcon,
  SpeakerHigh: SpeakerHighIcon,
  Stop: StopIcon,
  UploadSimple: UploadSimpleIcon,
  Warning: WarningIcon,
  XCircle: XCircleIcon,
};

const Icon = ({ iconName, className = '', size = 24, weight = 'regular' }: props) => {
  const IconComponent = ICONS[iconName];
  return <IconComponent className={className} size={size} weight={weight} />;
};

export { Icon };
export type { IconName };
