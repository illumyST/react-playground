import authClient from './authClient';
import { type Fetcher } from './types';

export default function cryptoClient<TRequest, TResponse>(
  url: string,
): Fetcher<TRequest, TResponse> {
  const fetcher = authClient<TRequest, TResponse>(url);

  return (props) =>
    fetcher({
      ...props,
      headers: {
        ...props?.headers,
        'x-demo-crypto': 'enabled',
      },
    });
}
