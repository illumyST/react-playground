import {
  isRouterPathType,
  RouterApiType,
  RouterHandlerParams,
  RouterHandlerType,
  RouterPathType,
  RouterType,
} from '../types/router';

/* 驗證父層是否確實存在，存在則進行 Route 更新 */
export const handleValidateOrUpdateRoute = (
  { items, parents, parentsIdx, ...rest }: RouterHandlerParams<RouterType>,
  callback: RouterHandlerType,
) => {
  const currentParent = parents[parentsIdx!];
  const target = items.find((item) => item.id === currentParent);
  const isNotExists = !target || !isRouterPathType(target);

  return isNotExists
    ? {
        result: items,
        isError: true,
        message: '查無父層',
      }
    : handleUpdateRouteChild(
        { items, target, parents, parentsIdx: ++parentsIdx!, ...rest },
        callback,
      );
};

/* 更新子層路徑，若建立過層出錯，直接將錯誤回到最上層 */
export const handleUpdateRouteChild = (
  {
    items,
    target,
    parents,
    ...rest
  }: { target: RouterPathType<RouterApiType> } & RouterHandlerParams<RouterType>,
  callback: RouterHandlerType,
) => {
  const { result, isError, message } = callback({ items: target.children, parents, ...rest });

  if (!isError) {
    target.children = result;
  }

  return {
    result: items.map((item) => (item.id === target.id ? target : item)),
    isError,
    message,
  };
};
