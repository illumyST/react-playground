import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createStore, Provider as JotaiProvider } from 'jotai';
import { Outlet } from 'react-router-dom';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false,
      staleTime: 30_000,
    },
  },
});

const store = createStore();

// Hospital 專屬的 Query / Jotai provider 只包在 /hospital 範圍內，不影響其他頁面。
const HospitalLayout = (): React.ReactNode => (
  <QueryClientProvider client={queryClient}>
    <JotaiProvider store={store}>
      <Outlet />
    </JotaiProvider>
  </QueryClientProvider>
);

export default HospitalLayout;
