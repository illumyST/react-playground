import { lazy, Suspense } from 'react';
import type { RouteObject } from 'react-router-dom';
import Layouts from '@/pages/Hospital/MockAdmin/layouts';

const ApiListPage = lazy(async () => import('@/pages/Hospital/MockAdmin/pages/apis/ApiList'));
const ApiOverviewPage = lazy(
  async () => import('@/pages/Hospital/MockAdmin/pages/apis/ApiOverviewPage'),
);
const ApiEditPage = lazy(async () => import('@/pages/Hospital/MockAdmin/pages/apis/ApiEditPage'));
const RouterManagerPage = lazy(
  async () => import('@/pages/Hospital/MockAdmin/pages/routers/RouterManager'),
);
const ExamplePage = lazy(
  async () => import('@/pages/Hospital/MockAdmin/pages/example/ExamplePage'),
);
const ConfigPage = lazy(async () => import('@/pages/Hospital/MockAdmin/pages/config/ConfigPage'));
const CryptoPage = lazy(async () => import('@/pages/Hospital/MockAdmin/pages/crypto/CryptoPage'));
const ScenarioPage = lazy(
  async () => import('@/pages/Hospital/MockAdmin/pages/scenario/scenarioPage'),
);

// 掛在 /hospital/mock-admin 底下，所以路徑都改成相對路徑。
const mockAdminRoute: RouteObject = {
  path: 'mock-admin',
  element: <Layouts />,
  children: [
    {
      index: true,
      element: (
        <Suspense>
          <ApiOverviewPage />
        </Suspense>
      ),
    },
    {
      path: 'api/edit/*',
      element: (
        <Suspense>
          <ApiEditPage />
        </Suspense>
      ),
    },
    {
      path: 'apis',
      element: (
        <Suspense>
          <ApiListPage />
        </Suspense>
      ),
      children: [
        {
          path: ':id',
          element: (
            <Suspense>
              <ApiListPage />
            </Suspense>
          ),
        },
      ],
    },
    {
      path: 'routers/*',
      element: (
        <Suspense>
          <RouterManagerPage />
        </Suspense>
      ),
    },
    {
      path: 'examples',
      element: (
        <Suspense>
          <ExamplePage />
        </Suspense>
      ),
    },
    {
      path: 'crypto',
      element: (
        <Suspense>
          <CryptoPage />
        </Suspense>
      ),
    },
    {
      path: 'scenario',
      element: (
        <Suspense>
          <ScenarioPage />
        </Suspense>
      ),
    },
    {
      path: 'configs',
      element: (
        <Suspense>
          <ConfigPage />
        </Suspense>
      ),
    },
  ],
};

export default mockAdminRoute;
