import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Loading } from '@/components';

const SidebarLayout = lazy(() => import('@/components/layout/SidebarLayout'));
const HomePage = lazy(() => import('@/pages/HomePage'));
const RemotionPage = lazy(() => import('@/pages/RemotionPage'));
const GroupingPage = lazy(() => import('@/pages/GroupingPage'));
const EmojiPage = lazy(() => import('@/pages/EmojiPage'));
const WeatherPage = lazy(() => import('@/pages/WeatherPage'));
const MetronomePage = lazy(() => import('@/pages/MetronomePage'));
const WebmcpPage = lazy(() => import('@/pages/WebmcpPage'));
const DocusaurusPage = lazy(() => import('@/pages/DocusaurusPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

const SuspenseWrap = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<Loading className="py-7xl" size="large" />}>
    {children}
  </Suspense>
);

export const routes: RouteObject[] = [
  {
    element: (
      <SuspenseWrap>
        <SidebarLayout />
      </SuspenseWrap>
    ),
    errorElement: (
      <SuspenseWrap>
        <NotFoundPage />
      </SuspenseWrap>
    ),
    children: [
      { path: '/', index: true, element: <SuspenseWrap><HomePage /></SuspenseWrap> },
      { path: '/grouping', element: <SuspenseWrap><GroupingPage /></SuspenseWrap> },
      { path: '/emoji', element: <SuspenseWrap><EmojiPage /></SuspenseWrap> },
      { path: '/weather', element: <SuspenseWrap><WeatherPage /></SuspenseWrap> },
      { path: '/metronome', element: <SuspenseWrap><MetronomePage /></SuspenseWrap> },
      { path: '/webmcp', element: <SuspenseWrap><WebmcpPage /></SuspenseWrap> },
      { path: '/docusaurus', element: <SuspenseWrap><DocusaurusPage /></SuspenseWrap> },
      { path: '/remotion', element: <SuspenseWrap><RemotionPage /></SuspenseWrap> },
    ],
  },
  { path: '*', element: <SuspenseWrap><NotFoundPage /></SuspenseWrap> },
];

export const router = createBrowserRouter(routes);
