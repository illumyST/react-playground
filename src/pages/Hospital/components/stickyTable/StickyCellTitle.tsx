interface StickyCellTitleProps {
  title: string;
  detail: string;
}

const StickyCellTitle = ({ title, detail }: StickyCellTitleProps): React.ReactNode => (
  <div>
    <p className="truncate font-bold">{title}</p>
    <p className="truncate text-xs text-gray-500">{detail}</p>
  </div>
);

export default StickyCellTitle;
