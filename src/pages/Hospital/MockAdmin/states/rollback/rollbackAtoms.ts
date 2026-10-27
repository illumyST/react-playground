import { atomWithQuery } from 'jotai-tanstack-query';
import { getRollbackList } from '@/pages/Hospital/MockAdmin/apis/rollback';

export const rollbackListQueryAtom = atomWithQuery(() => ({
  queryKey: ['rollback/list'],
  queryFn: async () => getRollbackList(),
}));
