import { Link } from 'react-router-dom';
import { Icon } from '@/components';
import type { IconName } from '@/components';

interface ToolCard {
  to: string;
  icon: IconName;
  title: string;
  description: string;
}

const TOOLS: ToolCard[] = [
  {
    to: '/grouping',
    icon: 'UsersThree',
    title: 'Grouping Tool',
    description: '隨機分組工具，支援拖曳調整成員',
  },
  {
    to: '/emoji',
    icon: 'Smiley',
    title: 'Emoji',
    description: 'Emoji 搜尋與複製工具',
  },
  {
    to: '/weather',
    icon: 'CloudSun',
    title: 'Weather Api',
    description: '查詢全球城市即時天氣資訊',
  },
  {
    to: '/metronome',
    icon: 'Metronome',
    title: 'Metronome',
    description: 'Web Audio API 節拍器',
  },
  {
    to: '/webmcp',
    icon: 'Globe',
    title: 'WebMCP',
    description: 'WebMCP Declarative / Imperative API 範例',
  },
  {
    to: '/docusaurus',
    icon: 'FileDoc',
    title: 'Docusaurus',
    description: 'Docusaurus 文件嵌入',
  },
  {
    to: '/remotion',
    icon: 'FilmSlate',
    title: 'Remotion',
    description: '影片字幕播放器',
  },
];

const HomePage = (): React.ReactNode => {
  return (
    <div className="space-y-2xl">
      <div>
        <h1 className="title-3xl mb-sm">Stone&apos;s Playground</h1>
        <p className="text-on-surface-variant">
          選擇下方任一工具開始使用
        </p>
      </div>

      <div className="grid gap-lg sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((tool) => (
          <Link
            key={tool.to}
            to={tool.to}
            className="group rounded-lg border border-outline-2 bg-surface-1 p-xl transition-all hover:shadow-light-down-1 hover:overlay-2"
          >
            <Icon iconName={tool.icon} size={32} />
            <h2 className="title-sm mb-xs">{tool.title}</h2>
            <p className="text-sm text-on-surface-variant">{tool.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomePage;