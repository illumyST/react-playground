import { Suspense } from 'react';

import { Loading } from './Loading';

export const SuspenseWrap = ({ children }: { children: React.ReactNode }): React.ReactNode => (
  <Suspense fallback={<Loading className="py-7xl" size="large" />}>{children}</Suspense>
);
