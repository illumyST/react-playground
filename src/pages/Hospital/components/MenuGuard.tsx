import { useSetAtom } from 'jotai';
import { type PropsWithChildren, useEffect } from 'react';

import { Loading } from '@/components';
import { useNavigationMenu } from '@/pages/Hospital/queries/useNavigationMenu';
import { currentMenuIdAtom } from '@/pages/Hospital/states/shellAtoms';

import { Alert } from './Card';

type MenuGuardProps = PropsWithChildren<{
  menuId: string;
}>;

const MenuGuard = ({ menuId, children }: MenuGuardProps): React.ReactNode => {
  const navigationMenu = useNavigationMenu();
  const setCurrentMenuId = useSetAtom(currentMenuIdAtom);

  useEffect(() => {
    setCurrentMenuId(menuId);
  }, [menuId, setCurrentMenuId]);

  if (navigationMenu.isLoading) return <Loading size="small" className="justify-start" />;

  if (navigationMenu.isError) {
    return <Alert status="error">Failed to load shell navigation profile.</Alert>;
  }

  if (!navigationMenu.data?.allowedMenuIds.includes(menuId)) {
    return <Alert status="warning">This route is not enabled for the current shell profile.</Alert>;
  }

  return children;
};

export default MenuGuard;
