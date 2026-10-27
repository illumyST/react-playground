export type RouterApiType = {
  id: string;
  title: string;
  url: string;
  path: string;
  filename: string;
  current: string;
  apis?: string[];
  delayTime: number;
  isCrypto: boolean;
  httpStatus?: number;
};

export type RouterPathType<T> = {
  id: string;
  title: string;
  children: Array<RouterPathType<T> | T>;
};

export type RouterArray = Array<RouterApiType | RouterPathType<RouterApiType>>;
