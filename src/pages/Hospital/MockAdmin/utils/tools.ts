import {
  type RouterApiType,
  type RouterPathType,
} from '@/pages/Hospital/MockAdmin/types/router.type';

function findParentNodes<T>(data: RouterPathType<T>[], nodeId: string): RouterPathType<T>[] {
  const parentNodes: RouterPathType<T>[] = [];
  const findParent = (node: RouterPathType<T>): boolean => {
    if (node.id === nodeId) {
      return true;
    }
    if (node.children) {
      const found = node.children.find((child) => findParent(child as RouterPathType<T>));
      if (found) {
        parentNodes.push(node);
        return true;
      }
    }
    return false;
  };
  data.find((node) => findParent(node));
  return parentNodes;
}

function findParentsTitle<T>(data: RouterPathType<T>[], nodeId: string): string[] {
  const parentTitles: string[] = [];
  const findParent = (node: RouterPathType<T>): boolean => {
    if (node.id === nodeId) {
      return true;
    }
    if (node.children) {
      const found = node.children.find((child) => findParent(child as RouterPathType<T>));
      if (found) {
        parentTitles.push(node.title);
        return true;
      }
    }
    return false;
  };
  data.find((node) => findParent(node));
  return parentTitles.reverse();
}

const formatUrl = (url: string) => {
  let result = url.replaceAll(' ', '');
  if (result.endsWith('/')) {
    result = result.substring(0, result.length - 1);
  }
  if (!result.startsWith('/')) {
    result = `/${result}`;
  }
  return result;
};

const getLastFragment = (api: RouterApiType) => `${api.url.split('/').at(-1)}`;

const isApiRouter = (
  route: RouterPathType<RouterApiType> | RouterApiType,
): route is RouterApiType => {
  return (
    Object.hasOwn(route, 'url') &&
    Object.hasOwn(route, 'path') &&
    Object.hasOwn(route, 'filename') &&
    Object.hasOwn(route, 'current')
  );
};

const isPathRouter = (
  route: RouterPathType<RouterApiType> | RouterApiType,
): route is RouterPathType<RouterApiType> => {
  return Object.hasOwn(route, 'children');
};

export { findParentNodes, findParentsTitle, formatUrl, getLastFragment, isApiRouter, isPathRouter };
