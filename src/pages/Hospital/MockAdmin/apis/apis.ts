import { type ConfigType } from '@/pages/Hospital/MockAdmin/types/config.type';
import { type RouterApiType } from '@/pages/Hospital/MockAdmin/types/router.type';
import { clientGet, clientPost } from '@/pages/Hospital/MockAdmin/utils/client';

export type ParamsType = { url: string; status: string };

export const getApis = clientGet('api');

export const getApiResponse = (params: ParamsType) => {
  const { url, status } = params;
  return clientGet(`${url}?status=${status}`);
};
export const updateApiResponse = clientPost<{
  route: RouterApiType;
  status: string;
  content: unknown;
}>(`api/response/update`);

export const getApiEncryptedResponse = (route: string) =>
  clientPost<{ publicKey: string }>(`${route}`);

export const getConfig = clientGet<ConfigType>(`config`);
export const updateConfig = clientPost<ConfigType>(`config`);
