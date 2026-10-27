import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';

const QueryStringGuard = (): React.ReactNode => {
  const [ready, setReady] = useState(false);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (ready) return;

    // 將 query string 搬進 router state，頁面重新整理後 URL 保持乾淨且仍可取得入口參數。
    if (searchParams.toString()) {
      navigate(location.pathname, {
        replace: true,
        state: {
          ...location.state,
          query: Object.fromEntries(searchParams.entries()),
        },
      });
    }

    setReady(true);
  }, [location.pathname, location.state, navigate, ready, searchParams]);

  if (!ready) return null;

  return <Outlet />;
};

export default QueryStringGuard;
