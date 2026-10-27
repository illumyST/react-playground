import axios, { AxiosError } from 'axios';

import { getResolvedMockScenario } from '@/pages/Hospital/utils/mockScenario';
import { left, right } from '@/pages/Hospital/utils/effect/either';
import { ApiError } from '@/pages/Hospital/utils/errors';

import { type ClientProps, type Fetcher } from './types';

type PlatformResponse<TResponse> = {
  returnCode: string;
  returnDesc: string;
  systemTime: string;
  content: TResponse;
};

const authAxios = axios.create();

authAxios.interceptors.request.use((config) => {
  config.method = config.method || 'POST';
  config.headers.set('x-demo-auth', 'hospital-shell');
  config.headers.set('x-mock-scenario', getResolvedMockScenario());
  return config;
});

export default function authClient<TRequest, TResponse>(url: string): Fetcher<TRequest, TResponse> {
  return async (props?: ClientProps<TRequest>) => {
    try {
      const response = await authAxios<PlatformResponse<TResponse>>(url, props);

      if (response.data.returnCode !== '0000') {
        return left(
          new ApiError<TRequest, TResponse>({
            apiPath: url,
            params: props?.data,
            reason: response.data.returnDesc,
            returnCode: response.data.returnCode,
            systemTime: response.data.systemTime,
            content: response.data.content,
          }),
        );
      }

      return right({
        ...response.data.content,
        systemTime: response.data.systemTime,
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        return left(
          new ApiError<TRequest>({
            apiPath: error.config?.url || url,
            params: props?.data,
            reason: error.message,
            returnCode: 'HTTP_ERROR',
          }),
        );
      }

      return left(
        new ApiError<TRequest>({
          apiPath: url,
          params: props?.data,
          reason: error instanceof Error ? error.message : 'Unknown client error',
          returnCode: 'CLIENT_ERROR',
        }),
      );
    }
  };
}
