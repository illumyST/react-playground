export type ResponseOk<T> = {
  status: 'OK';
  message: T;
};

export type ResponseError<E> = {
  status: 'Error';
  message: E;
};

export type Response<T, E> = ResponseOk<T> | ResponseError<E>;
