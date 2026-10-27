import { useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

import { Loading } from '@/components';
import { useHospitalTranslation } from '@/pages/Hospital/i18n/useHospitalTranslation';
import { useAuthSession } from '@/pages/Hospital/queries/useAuthSession';
import { useNavigationMenu } from '@/pages/Hospital/queries/useNavigationMenu';
import { applyAuthSessionAtom, applyNavigationMenuAtom } from '@/pages/Hospital/states/shellAtoms';
import { cn } from '@/utils/classnames';

// mock API 回傳的是絕對路徑（/dashboard），在 playground 內掛在 /hospital 底下，所以轉成相對路徑。
const toRelativePath = (to: string) => to.replace(/^\/+/, '');

const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
  cn(
    'rounded-md px-md py-xs text-sm transition-colors hover:overlay-2',
    isActive && 'bg-steel-50 font-bold text-steel-700',
  );

const Shell = (): React.ReactNode => {
  const { t, changeLanguage } = useHospitalTranslation();
  const authSession = useAuthSession();
  const navigationMenu = useNavigationMenu();
  const applyAuthSession = useSetAtom(applyAuthSessionAtom);
  const applyNavigationMenu = useSetAtom(applyNavigationMenuAtom);

  useEffect(() => {
    if (!authSession.data) return;

    applyAuthSession(authSession.data);
    changeLanguage(authSession.data.language);
  }, [applyAuthSession, authSession.data, changeLanguage]);

  useEffect(() => {
    if (!navigationMenu.data) return;
    applyNavigationMenu(navigationMenu.data);
  }, [applyNavigationMenu, navigationMenu.data]);

  const menus = navigationMenu.data?.menus || [];
  const user = authSession.data?.user;
  const scenario = authSession.data?.defaultScenario || 'default';

  return (
    <div className="flex flex-col gap-2xl text-left">
      <header className="flex flex-col gap-lg rounded-lg border border-outline-2 bg-surface-1 px-2xl py-lg md:flex-row md:items-center md:justify-between">
        <div>
          <p className="title-lg">{t('common.appName')}</p>
          <p className="text-sm text-gray-600">
            {user ? `${user.name} · ${user.role} · scenario ${scenario}` : 'Loading shell context'}
          </p>
        </div>
        <nav className="flex flex-wrap items-center gap-xs">
          {navigationMenu.isLoading ? (
            <Loading size="small" />
          ) : (
            menus.map((item) => (
              <NavLink key={item.id} to={toRelativePath(item.to)} className={navLinkClassName}>
                {item.label}
              </NavLink>
            ))
          )}
          <NavLink to="mock-admin" className={navLinkClassName}>
            {t('common.mockAdmin')}
          </NavLink>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Shell;
