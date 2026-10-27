import { lazy } from 'react';
import { Navigate, type RouteObject } from 'react-router-dom';

import { SuspenseWrap } from '@/components';
import MenuGuard from '@/pages/Hospital/components/MenuGuard';
import { HospitalFallback, HospitalNotFound } from '@/pages/Hospital/components/RouteStatus';
import mockAdminRoute from '@/pages/Hospital/MockAdmin/routers';

const HospitalLayout = lazy(() => import('@/pages/Hospital/HospitalLayout'));
const QueryStringGuard = lazy(() => import('@/pages/Hospital/components/QueryStringGuard'));
const Shell = lazy(() => import('@/pages/Hospital/components/Shell'));
const DashboardPage = lazy(() => import('@/pages/Hospital/pages/DashboardPage'));
const IntegrationsPage = lazy(() => import('@/pages/Hospital/pages/IntegrationsPage'));
const StickyTablePage = lazy(() => import('@/pages/Hospital/pages/StickyTablePage'));
const SettingsPage = lazy(() => import('@/pages/Hospital/pages/SettingsPage'));

const guarded = (menuId: string, page: React.ReactNode) => (
  <SuspenseWrap>
    <MenuGuard menuId={menuId}>{page}</MenuGuard>
  </SuspenseWrap>
);

export const hospitalRoute: RouteObject = {
  path: '/hospital',
  element: (
    <SuspenseWrap>
      <HospitalLayout />
    </SuspenseWrap>
  ),
  errorElement: <HospitalFallback />,
  children: [
    {
      element: (
        <SuspenseWrap>
          <QueryStringGuard />
        </SuspenseWrap>
      ),
      children: [
        {
          element: (
            <SuspenseWrap>
              <Shell />
            </SuspenseWrap>
          ),
          children: [
            { index: true, element: <Navigate to="dashboard" replace /> },
            {
              path: 'dashboard',
              element: guarded('hospital.dashboard', <DashboardPage />),
            },
            {
              path: 'integrations',
              element: guarded('hospital.integrations', <IntegrationsPage />),
            },
            {
              path: 'sticky-table',
              element: guarded('hospital.stickyTable', <StickyTablePage />),
            },
            {
              path: 'settings',
              element: guarded('hospital.settings', <SettingsPage />),
            },
            mockAdminRoute,
          ],
        },
      ],
    },
    { path: '*', element: <HospitalNotFound /> },
  ],
};
