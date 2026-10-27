import { cn } from '@/utils/classnames';

interface ExpandToggleButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

/**
 * 展開/收合按鈕，使用偽元素繪製 ＋/－ 符號：
 * before 是永遠存在的水平線，after 是收合時才出現的垂直線。
 */
const ExpandToggleButton = ({ isOpen, onClick }: ExpandToggleButtonProps): React.ReactNode => (
  <button
    type="button"
    aria-label={isOpen ? 'Collapse row' : 'Expand row'}
    aria-expanded={isOpen}
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    className={cn(
      'relative flex size-[28px] items-center justify-center rounded-full transition-colors hover:bg-overlay-3',
      'before:absolute before:top-1/2 before:left-1/2 before:h-[2px] before:w-[12px] before:-translate-1/2 before:rounded-full before:bg-gray-600',
      !isOpen &&
        'after:absolute after:top-1/2 after:left-1/2 after:h-[12px] after:w-[2px] after:-translate-1/2 after:rounded-full after:bg-gray-600',
    )}
  />
);

export default ExpandToggleButton;
