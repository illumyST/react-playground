import axios, { type AxiosError, type AxiosRequestConfig } from 'axios';

import { MOCK_API_URL } from '@/pages/Hospital/MockAdmin/constants';

const apiUrl = `${MOCK_API_URL}/`;

export type ClientProps<RequestContent> = {
  data: RequestContent;
};

const client = axios.create({
  baseURL: apiUrl,
});

const normalizeError = (error: AxiosError) => {
  const statusCode = error.response?.status;

  if (statusCode === 400 || statusCode === 401 || statusCode === 422) {
    return Promise.reject(error.response?.data);
  }

  return Promise.reject(new Error('An unexpected error occurred'));
};

export const clientGet =
  <T, D = unknown>(path: string) =>
  async (config?: AxiosRequestConfig<D>) => {
    const response = await client.get<T>(path, config).catch(normalizeError);
    return response.data;
  };

export const clientPost =
  <RequestContent, ResponseContent = unknown>(path: string) =>
  async ({ data }: ClientProps<RequestContent>) => {
    const response = await client
      .post<ResponseContent>(path, data)
      .catch(normalizeError as (error: AxiosError) => Promise<never>);
    return response.data;
  };

client.interceptors.request.use((config) => {
  const publicKey = config.data?.publicKey;

  if (publicKey) {
    config.headers.set('encryptpublickey', publicKey);
  }

  return config;
});
