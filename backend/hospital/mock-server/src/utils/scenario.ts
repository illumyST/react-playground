import fs from 'node:fs';
import path from 'node:path';
import scenarioDemoData from '../scenarios/scenario-demo.json';
import { ApiResponseType } from '../types/config';
import { RouterApiType } from '../types/router';
import {
  ScenarioHandlerParams,
  ScenarioHandlerResponse,
  ScenarioItemType,
} from '../types/scenario';
import { getApiFileWithJson, updateApiFileWithJson } from './api';
import { runtimePaths } from './paths';
import { getRouters, updateRoutersJson } from './router';

export const apiPath = runtimePaths.scenarios;

const flattenRouters = (routers: unknown[]): RouterApiType[] => {
  return routers.reduce<RouterApiType[]>((acc, item) => {
    const route = item as RouterApiType & { children?: unknown[] };

    if (route.children?.length) {
      return acc.concat(flattenRouters(route.children));
    }

    if ('filename' in route) {
      acc.push(route);
    }

    return acc;
  }, []);
};

export const updateScenarioJson = (content: string) => {
  fs.mkdirSync(runtimePaths.scenarios, { recursive: true });
  fs.writeFileSync(path.join(apiPath, 'scenarios.json'), content);
};

export const getScenarios = (): ScenarioItemType[] => {
  try {
    fs.mkdirSync(runtimePaths.scenarios, { recursive: true });

    const scenariosFile = path.join(apiPath, 'scenarios.json');
    if (!fs.existsSync(scenariosFile)) {
      fs.writeFileSync(scenariosFile, JSON.stringify(scenarioDemoData));
      return scenarioDemoData as ScenarioItemType[];
    }

    return JSON.parse(fs.readFileSync(scenariosFile, 'utf8'));
  } catch (error) {
    console.error('getScenarios error:', error);
    return [];
  }
};

const handleDeleteScenario = ({
  items,
  id,
}: Omit<ScenarioHandlerParams<ScenarioItemType>, 'data'>) => ({
  result: items.filter((item) => item.id !== id),
});

export const deleteScenario = ({
  items,
  id,
}: Omit<ScenarioHandlerParams<never>, 'data'>): ScenarioHandlerResponse => {
  return handleDeleteScenario({ items, id });
};

const handleRunScenario = ({
  items,
  id,
}: Omit<ScenarioHandlerParams<ScenarioItemType>, 'data'>) => {
  const data = items.find((item) => item.id === id)?.data || [];
  const routers = getRouters();

  if (!data.length) {
    return {
      isError: true,
      message: '無可執行情境',
    };
  }

  const flatRouters = flattenRouters(routers as unknown[]);

  for (const item of data) {
    const router = flatRouters.find((route) => route.filename === item.filename);

    if (!router) {
      continue;
    }

    router.current = item.current;

    const responses = getApiFileWithJson(router, { status: item.current }) as ApiResponseType[];
    const updatedResponses = responses.map((response) => ({
      ...response,
      isChecked: String(response.id) === item.responseId,
    }));

    updateApiFileWithJson(router, item.current, updatedResponses);
  }

  updateRoutersJson(JSON.stringify(routers));

  return {
    isError: false,
    message: '',
  };
};

export const runScenario = ({
  items,
  id,
}: Omit<ScenarioHandlerParams<never>, 'data'>): Omit<ScenarioHandlerResponse, 'result'> => {
  return handleRunScenario({ items, id });
};

export const reorderScenario = ({
  items,
  data,
}: {
  items: ScenarioItemType[];
  data: { category: string; ids: string[] };
}): ScenarioHandlerResponse => {
  const { category, ids } = data;

  if (!category || !ids?.length) {
    return { result: items, isError: true, message: '缺少 category 或 ids' };
  }

  const categoryItems = items.filter((item) => item.category === category);
  const sorted = ids
    .map((scenarioId) => categoryItems.find((item) => item.id === scenarioId))
    .filter(Boolean) as ScenarioItemType[];
  const remaining = categoryItems.filter((item) => !ids.includes(item.id));

  const result: ScenarioItemType[] = [];
  let inserted = false;

  for (const item of items) {
    if (item.category === category) {
      if (!inserted) {
        result.push(...sorted, ...remaining);
        inserted = true;
      }
      continue;
    }

    result.push(item);
  }

  return { result, isError: false, message: '' };
};

export const handleGetScenario = ({
  items,
}: Pick<ScenarioHandlerParams<ScenarioItemType>, 'items'>) => {
  const flatRouters = flattenRouters(getRouters() as unknown[]);

  items.forEach((scenario) => {
    // 透過 Admin 新增、尚未設定 API 的情境沒有 data 欄位
    (scenario.data ?? []).forEach((item) => {
      const router = flatRouters.find((route) => route.filename === item.filename);

      if (!router) {
        return;
      }

      const responses = getApiFileWithJson(router, { status: item.current }) as ApiResponseType[];
      const response = responses.find((entry) => String(entry.id) === item.responseId);
      item.isRunning = router.current === item.current && response?.isChecked === true;
    });
  });

  return {
    result: items,
    isError: false,
    message: '',
  };
};

export const handleCreateScenario = ({
  items,
  data,
}: Pick<ScenarioHandlerParams<ScenarioItemType>, 'items' | 'data'>) => {
  const nextItem = data as ScenarioItemType;
  const hasData = items.some(
    (item) => `${item.category}${item.name}` === `${nextItem.category}${nextItem.name}`,
  );

  if (!hasData) {
    items.push({
      ...nextItem,
      id: `${nextItem.name}${Date.now()}`,
    });
  }

  return {
    result: items,
    isError: hasData,
    message: hasData ? '檔案名稱重複' : undefined,
  };
};

const handleUpdateScenario = ({
  items,
  id,
  data,
}: Omit<ScenarioHandlerParams<ScenarioItemType>, 'data'> & { data?: ScenarioItemType }) => ({
  result: items.map((item) =>
    item.id === id
      ? {
          id: item.id,
          category: data?.category || item.category,
          data: data?.data || item.data,
          name: data?.name || item.name,
        }
      : item,
  ),
});

export const updateScenario = ({
  items,
  data,
  id,
}: ScenarioHandlerParams<ScenarioItemType>): ScenarioHandlerResponse => {
  return handleUpdateScenario({ items, id, data });
};
