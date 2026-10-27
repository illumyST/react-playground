import { atomWithMutation, atomWithQuery } from 'jotai-tanstack-query';
import { atom } from 'jotai';
import {
  type APIDataType,
  createApiRouter,
  createRouter,
  deleteRouter,
  getRouter,
  updateApiRouter,
  updateRouter,
} from '@/pages/Hospital/MockAdmin/apis/routers';
import {
  type RouterApiType,
  type RouterArray,
  type RouterPathType,
} from '@/pages/Hospital/MockAdmin/types/router.type';
import { isApiRouter, isPathRouter } from '@/pages/Hospital/MockAdmin/utils/tools';

export const routersStatusAtom = atomWithQuery(() => ({
  queryKey: ['router/getRouterList'],
  queryFn: async () => getRouter(),
}));

export const flattenRoutersMapAtom = atom((get) => {
  const routers = get(routersStatusAtom);

  function createRouterMap(routers: RouterArray) {
    const pathRouteMap = new Map<string, RouterPathType<RouterApiType>>();
    const apiRouteMap = new Map<string, RouterApiType>();

    function helper(routers: RouterArray, path: string[]) {
      for (const route of routers) {
        if (isPathRouter(route)) {
          pathRouteMap.set([...path, route.id].join('/'), route);
          helper(route.children, [...path, route.id]);
        } else if (isApiRouter(route)) {
          apiRouteMap.set([...path, route.filename].join('/'), route);
        }
      }
    }

    helper(routers, []);

    return { pathRouteMap, apiRouteMap };
  }

  return createRouterMap(routers.data || []);
});

/**
 * 父層 Router - Create, Update
 */
export const createRouterAtom = atomWithMutation((get) => ({
  mutationFn: async (data: { id: string; title: string; parents: string[] }) =>
    createRouter({ data }),
  onSuccess: () => {
    get(routersStatusAtom).refetch();
  },
  onError: (err) => {
    console.error('atom error', err);
  },
}));

export const updateRouterAtom = atomWithMutation((get) => ({
  mutationFn: async ({
    id,
    ...data
  }: {
    id: string;
    updateId: string;
    title: string;
    parents: string[];
  }) => updateRouter(id)({ data }),
  onSuccess: () => {
    get(routersStatusAtom).refetch();
  },
}));

/**
 * API Router - Create, Update
 */
export const createApiRouterAtom = atomWithMutation((get) => ({
  mutationFn: async (data: { url: string; title: string; filename: string; parents: string[] }) =>
    createApiRouter({ data }),
  onSuccess: () => {
    get(routersStatusAtom).refetch();
  },
}));

// Route 管理 & API 修改目前狀態 & 修改 delay 時間
export const updateApiAtom = atomWithMutation((get) => ({
  mutationFn: async ({
    id,
    ...data
  }: {
    id: string;
  } & APIDataType) => updateApiRouter(id)({ data }),
  onSuccess: () => {
    get(routersStatusAtom).refetch();
  },
}));

/**
 * 父層 Router & Api Router - delete 共用
 */
export const deleteRouterAtom = atomWithMutation((get) => ({
  mutationFn: async ({ id, ...data }: { id: string; parents: string[] }) =>
    deleteRouter(id)({ data }),
  onSuccess: () => {
    get(routersStatusAtom).refetch();
  },
}));
