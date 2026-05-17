import { useNavigate } from 'react-router-dom';
import { Button, Icon } from '@/components';

const NotFoundPage = (): React.ReactNode => {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-xl text-center">
      <Icon iconName="MagnifyingGlass" size={48} />
      <h1 className="title-3xl">404 Not Found</h1>
      <p className="text-on-surface-variant">
        找不到您要的頁面，請確認網址是否正確。
      </p>
        <Button onClick={(e)=>{
          // for docusaurus
          if (window !== window.parent) {
            e.preventDefault();
            window.parent.location.href = '/';
          } else {
          // nomal case
            navigate('/');
          }
        }}>回首頁</Button>
    </div>
  );
};

export default NotFoundPage;
