import { atomWithMutation, atomWithQuery } from 'jotai-tanstack-query';
import {
  getApiResponse,
  getApis,
  type ParamsType,
  updateApiResponse,
} from '@/pages/Hospital/MockAdmin/apis/apis';
import { atom } from 'jotai';
import { type RouterApiType } from '@/pages/Hospital/MockAdmin/types/router.type';

export const apisStatusAtom = atomWithQuery(() => ({
  queryKey: ['api/getApiList'],
  queryFn: async () => getApis(),
}));

export const apiParamsAtom = atom({ url: '', status: '' });
export const apiResponseAtom = atomWithQuery((get) => ({
  queryKey: ['getApiResponse', { ...get(apiParamsAtom) }],
  queryFn: async ({ queryKey: [, params] }) => getApiResponse(params as ParamsType)(),
  enabled: !!get(apiParamsAtom).url,
  cacheTime: 0,
  staleTime: 0,
}));

export const updateApiResponseAtom = atomWithMutation((get) => ({
  mutationFn: async (data: { route: RouterApiType; status: string; content: unknown }) =>
    updateApiResponse({ data }),
  onSuccess: () => {
    get(apiResponseAtom).refetch();
  },
}));
