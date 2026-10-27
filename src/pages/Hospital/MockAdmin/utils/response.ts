import { type Response, type ResponseError, type ResponseOk } from '../types/serverResconse';

export const createResponseOk = <T>(data: T): Response<T, never> => {
  return {
    status: 'OK',
    message: data,
  };
};

export const createResponseError = <E>(data: E): Response<never, E> => {
  return {
    status: 'Error',
    message: data,
  };
};

export const isResponseOk = <T, E>(res: Response<T, E>): res is ResponseOk<T> => {
  return res.status === 'OK';
};

export const isResponseError = <T, E>(res: Response<T, E>): res is ResponseError<E> => {
  return res.status === 'Error';
};
