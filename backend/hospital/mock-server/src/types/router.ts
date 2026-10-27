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
  httpStatus: number;
};

export type RouterPathType<T> = {
  id: string;
  title: string;
  children: Array<RouterPathType<T> | T>;
};

export type RouterType = RouterPathType<RouterApiType> | RouterApiType;

export type RouterHandlerType = ({
  items,
  parents,
  data,
  parentsIdx,
}: RouterHandlerParams<RouterType>) => RouterHandlerResponse;

export type RouterHandlerResponse = {
  result: Array<RouterType>;
  isError?: boolean;
  message?: string;
};

export type RouterHandlerParams<T> = {
  items: (RouterApiType | RouterPathType<RouterApiType>)[];
  parents: string[];
  parentsIdx?: number;
  data?: T;
  id?: string;
};

export type MockDataResp = {
  id: number;
  label: string;
  isChecked: boolean;
  response: unknown;
};

export function isRouterPathType<T>(item: RouterPathType<T> | T): item is RouterPathType<T> {
  return (item as RouterPathType<T>).children !== undefined;
}
