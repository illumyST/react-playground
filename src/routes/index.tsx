import { createBrowserRouter } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import { lazy } from 'react';

const HomePage = lazy(() => import('@/pages/HomePage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
    errorElement: <NotFoundPage />,
  },
  { path: '*', element: <NotFoundPage /> },
];

export const router = createBrowserRouter(routes);
