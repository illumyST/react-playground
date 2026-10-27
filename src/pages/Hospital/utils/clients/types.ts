import { type Either } from '@/pages/Hospital/utils/effect/either';
import { type ApiError } from '@/pages/Hospital/utils/errors';

export type WithSystemTime<T> = T & {
  systemTime: string;
};

export type ClientProps<TRequest> = {
  data?: TRequest;
  headers?: Record<string, string>;
};

export type Fetcher<TRequest, TResponse> = (
  props?: ClientProps<TRequest>,
) => Promise<Either<ApiError<TRequest>, WithSystemTime<TResponse>>>;
