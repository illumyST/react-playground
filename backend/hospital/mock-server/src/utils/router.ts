import fs from 'node:fs';
import path from 'node:path';
import routerDemoData from '../apis/router-demo.json';
import {
  isRouterPathType,
  RouterApiType,
  RouterHandlerParams,
  RouterHandlerResponse,
  RouterPathType,
  RouterType,
} from '../types/router';
import { handleValidateOrUpdateRoute } from './common';
import { runtimePaths } from './paths';

export const apiPath = runtimePaths.apis;

export function getRouterWithUrl<T extends RouterApiType>(data: Array<RouterPathType<T> | T>): T[] {
  return data.flatMap((item): T[] => {
    if (isRouterPathType(item)) {
      return getRouterWithUrl(item.children);
    }

    return item.url ? [item] : [];
  });
}

export const updateRoutersJson = (content: string) => {
  fs.mkdirSync(runtimePaths.apis, { recursive: true });
  fs.writeFileSync(path.join(apiPath, 'routers.json'), content);
};

export const getRouters = () => {
  try {
    fs.mkdirSync(runtimePaths.apis, { recursive: true });

    const routersFile = path.join(apiPath, 'routers.json');
    if (!fs.existsSync(routersFile)) {
      fs.writeFileSync(routersFile, JSON.stringify(routerDemoData));
      return routerDemoData;
    }

    return JSON.parse(fs.readFileSync(routersFile, 'utf8'));
  } catch (error) {
    console.error('getRouters error:', error);
    return [];
  }
};

const handleDeleteRoute = ({ items, id }: Omit<RouterHandlerParams<RouterType>, 'parents'>) => ({
  result: items.filter((item) => item.id !== id),
});

const handleInsertRoute = (
  items: Array<RouterType>,
  data: Omit<RouterPathType<RouterApiType>, 'children'>,
) => {
  const hasData = items.some((item) => item.id === data.id);

  if (!hasData) {
    items.push({ ...data, children: [] });
  }

  return {
    result: items,
    isError: hasData,
    message: hasData ? '資料重複' : undefined,
  };
};

const handleUpdateRoute = ({
  items,
  id,
  data,
}: Omit<RouterHandlerParams<RouterType>, 'parents'>) => ({
  result: items.map((item) => (item.id === id ? { ...item, ...data } : item)),
});

export const createRoute = ({
  items,
  parents,
  parentsIdx = 0,
  data,
}: RouterHandlerParams<RouterType>): RouterHandlerResponse => {
  return parents.length <= parentsIdx
    ? handleInsertRoute(items, data!)
    : handleValidateOrUpdateRoute({ items, parents, parentsIdx, data }, createRoute);
};

export const updateRouter = ({
  items,
  parents,
  parentsIdx = 0,
  data,
  id,
}: RouterHandlerParams<RouterType>): RouterHandlerResponse => {
  return parents.length <= parentsIdx
    ? handleUpdateRoute({ items, data, id })
    : handleValidateOrUpdateRoute({ items, parents, parentsIdx, data, id }, updateRouter);
};

export const deleteRouter = ({
  items,
  parents,
  parentsIdx = 0,
  id,
}: Omit<RouterHandlerParams<never>, 'data'>): RouterHandlerResponse => {
  return parents.length <= parentsIdx
    ? handleDeleteRoute({ items, id })
    : handleValidateOrUpdateRoute({ items, parents, parentsIdx, id }, deleteRouter);
};

const handleCreateApiRoute = ({
  items,
  parents,
  data,
}: Pick<RouterHandlerParams<RouterType>, 'items' | 'data' | 'parents'>) => {
  const apiData = data as RouterApiType;
  const hasData = items.some(
    (item) => !isRouterPathType(item) && item.filename === apiData.filename,
  );

  if (!hasData) {
    items.push({
      ...apiData,
      id: `${apiData.filename}${Date.now()}`,
      path: parents.join(path.sep),
      current: 'default',
      apis: ['default', 'success', 'noData', 'error', 'schema'],
      delayTime: 3000,
      httpStatus: 200,
      isCrypto: false,
    });
  }

  return {
    result: items,
    isError: hasData,
    message: hasData ? '檔案名稱重複' : undefined,
  };
};

const handleUpdateApiRoute = ({
  items,
  id,
  data,
}: Omit<RouterHandlerParams<RouterType>, 'parents'>) => ({
  result: items.map((item) =>
    item.id === id
      ? {
          ...item,
          ...data,
          id: `${(data as RouterApiType).filename}${Date.now()}`,
        }
      : item,
  ),
});

export const createApiRouter = ({
  items,
  parents,
  data,
  parentsIdx = 0,
}: RouterHandlerParams<RouterType>): RouterHandlerResponse => {
  return parents.length <= parentsIdx
    ? handleCreateApiRoute({ items, parents, data })
    : handleValidateOrUpdateRoute({ items, parents, parentsIdx, data }, createApiRouter);
};

export const updateApiRouter = ({
  items,
  parents,
  data,
  parentsIdx = 0,
  id,
}: RouterHandlerParams<RouterType>): RouterHandlerResponse => {
  return parents.length <= parentsIdx
    ? handleUpdateApiRoute({ items, id, data })
    : handleValidateOrUpdateRoute({ items, parents, parentsIdx, data, id }, updateApiRouter);
};
