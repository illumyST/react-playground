import fs from 'node:fs';
import path from 'node:path';
import { getConfigWithJson } from './config';
import { genSchemaTools } from './genSchema';
import { runtimePaths } from './paths';
import { ApiResponseType } from '../types/config';
import { MockDataResp, RouterApiType } from '../types/router';

export const apiPath = runtimePaths.apis;
export const configPath = runtimePaths.configs;

const getCurrentTaipeiIsoString = () => {
  const now = new Date();
  const taipeiTime = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  return taipeiTime.toISOString().replace('Z', '+08:00');
};

const convertSpecialValue = <T>(value: T) => {
  if (typeof value === 'string' && value === '$datetime') {
    return getCurrentTaipeiIsoString();
  }

  return value;
};

const createGenSchemaFileWithJson = (
  filename: string,
  schema: unknown,
  origin: MockDataResp[] | MockDataResp,
): string => {
  const schemaData = genSchemaTools(schema);

  try {
    fs.writeFileSync(filename, JSON.stringify(origin));
    return JSON.stringify(schemaData);
  } catch (error) {
    console.error('createGenSchemaFileWithJson error:', error);
    return JSON.stringify({ error: 'Error generating schema file' });
  }
};

const getNotFoundFallback = () => {
  try {
    const configData = fs.readFileSync(path.join(configPath, 'config.json'), { encoding: 'utf8' });
    const configJson = JSON.parse(configData);
    return configJson.api?.error || {};
  } catch {
    return {};
  }
};

export const getApiFileWithJson = (
  route: RouterApiType,
  options?: { status?: string; label?: string; id?: string },
) => {
  const status = options?.status;
  const label = options?.label;
  const id = options?.id;
  const filePath = route.path.replace(/[\\/]/g, path.sep);
  const filename = `${route.filename}.${status || route.current}.json`;
  const file = path.join(apiPath, filePath, filename);
  const notFoundFallback = getNotFoundFallback();
  const isRequestFromApi = !status;

  try {
    const parseData = JSON.parse(fs.readFileSync(file, { encoding: 'utf8', flag: 'rs' }));
    let selectData =
      (isRequestFromApi && parseData.find((item: MockDataResp) => item.isChecked)?.response) ||
      parseData;

    if (label || id) {
      if (Array.isArray(parseData)) {
        const found = parseData.find(
          (item: MockDataResp) =>
            (label ? item.label === label : true) && (id ? String(item.id) === String(id) : true),
        );

        selectData = found ? found.response : notFoundFallback;
      } else if (typeof parseData === 'object') {
        const matched =
          (label && parseData.label === label) || (id && String(parseData.id) === String(id));
        selectData = matched ? parseData.response : notFoundFallback;
      }
    }

    if (selectData?.type === 'obj') {
      return JSON.parse(createGenSchemaFileWithJson(file, selectData, parseData));
    }

    if (isRequestFromApi) {
      return Object.keys(selectData).reduce((acc: Record<string, unknown>, key) => {
        acc[key] = convertSpecialValue(selectData[key]);
        return acc;
      }, {});
    }

    return selectData;
  } catch {
    const config = getConfigWithJson();
    const defaultData = (() => {
      switch (status || route.current) {
        case 'success':
          return config.api?.success || {};
        case 'noData':
          return config.api?.noData || {};
        case 'error':
          return config.api?.error || {};
        case 'schema':
          return config.api?.schema || {};
        default:
          return config.api?.default || {};
      }
    })();

    return createApiFileWithJson(filePath, filename, defaultData);
  }
};

export const createApiFileWithJson = (dirPath: string, filename: string, data?: unknown) => {
  const config = getConfigWithJson();
  const newData = data || config.api?.default || {};

  const apiData: Array<ApiResponseType> = [
    {
      id: 1,
      label: '預設測資1',
      isChecked: true,
      response: newData as object,
    },
  ];

  try {
    const targetDir = path.join(apiPath, dirPath);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    fs.writeFileSync(path.join(targetDir, filename), JSON.stringify(apiData));
    return apiData;
  } catch (error) {
    console.error('createApiFileWithJson error:', error);
    return {};
  }
};

export const updateApiFileWithJson = (route: RouterApiType, status?: string, data?: unknown) => {
  const filePath = route.path.replace(/[\\/]/g, path.sep);
  const filename = `${route.filename}.${status}.json`;
  const file = path.join(apiPath, filePath, filename);

  if (filename.includes('schema')) {
    try {
      const parseData = (data as MockDataResp[]).find((item) => item.isChecked)?.response;
      return {
        message: JSON.parse(createGenSchemaFileWithJson(file, parseData, data as MockDataResp[])),
        isError: false,
      };
    } catch (error) {
      console.error('updateApiFileWithJson schema error:', error);
      return {
        error,
        isError: true,
      };
    }
  }

  try {
    fs.writeFileSync(file, JSON.stringify(data));
    return {
      message: data,
      isError: false,
    };
  } catch (error) {
    console.error('updateApiFileWithJson error:', error);
    return {
      error,
      isError: true,
    };
  }
};
