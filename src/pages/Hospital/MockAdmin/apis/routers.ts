import { type RouterArray } from '@/pages/Hospital/MockAdmin/types/router.type';
import { clientGet, clientPost } from '@/pages/Hospital/MockAdmin/utils/client';

export const getRouter = clientGet<RouterArray>('router');

/**
 * 父層 Router - Create, Update
 */
export const createRouter = clientPost<{
  id: string;
  title: string;
  parents: string[];
}>('router/create');

export const updateRouter = (id: string) =>
  clientPost<{ updateId: string; title: string; parents: string[] }>(`router/${id}/update`);

/**
 * API Router - Create, Update
 */
export interface APIDataType {
  parents: string[];
  title?: string;
  url?: string;
  filename?: string;
  current?: string;
  delayTime?: number;
  isCrypto?: boolean;
  httpStatus?: number;
}

export const createApiRouter = clientPost<APIDataType>('api/create');

export const updateApiRouter = (id: string) => clientPost<APIDataType>(`api/${id}/update`);

/**
 * 父層 Router & Api Router - delete 共用
 */
export const deleteRouter = (id: string) =>
  clientPost<{ parents: string[] }>(`router/${id}/delete`);
