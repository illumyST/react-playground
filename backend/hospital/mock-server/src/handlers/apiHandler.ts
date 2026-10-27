import { RequestHandler } from 'express';
import { getApiFileWithJson, updateApiFileWithJson } from '../utils/api';
import { getConfigWithJson } from '../utils/config';
import { getRouters, getRouterWithUrl } from '../utils/router';
import { getCryptoContext } from '../utils/webCrypto/crypto';

const apiUrl = process.env.MOCK_API_URL || '';

const getByPath = (source: unknown, dotPath: string) => {
  if (!dotPath) {
    return source;
  }

  return dotPath.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }

    return undefined;
  }, source);
};

const setByPath = (source: unknown, dotPath: string, value: unknown) => {
  if (!dotPath || !source || typeof source !== 'object') {
    return source;
  }

  const clone = structuredClone(source as Record<string, unknown>);
  const keys = dotPath.split('.');
  let current: Record<string, unknown> = clone;

  keys.forEach((key, index) => {
    if (index === keys.length - 1) {
      current[key] = value;
      return;
    }

    const next = current[key];
    if (!next || typeof next !== 'object') {
      current[key] = {};
    }

    current = current[key] as Record<string, unknown>;
  });

  return clone;
};

const pickByPath = (source: unknown, dotPath: string) => {
  const value = getByPath(source, dotPath);
  return setByPath({}, dotPath, value);
};

export const publicKeyApiHandler: RequestHandler = async (req, res, next) => {
  const config = getConfigWithJson();
  const requestApiUrl = req.path.toUpperCase();
  const publicKeyApiUrl = `${apiUrl}${config.crypto?.publicKeyApi.url}`.toUpperCase();

  if (requestApiUrl !== publicKeyApiUrl) {
    return next();
  }

  const { publicKeyString } = await getCryptoContext();
  const publicKeyColumn = config.crypto?.publicKeyApi.publicKeyColumn || '';
  const publicKeyApiResponse = config.crypto?.publicKeyApi.response || {};
  const data = setByPath(publicKeyApiResponse, publicKeyColumn, publicKeyString);

  return res.status(200).json(data);
};

export const apiHandler: RequestHandler = async (req, res, next) => {
  const config = getConfigWithJson();
  const method = req.method;

  if (method !== 'GET' && method !== 'POST') {
    return next();
  }

  const requestApiUrl = req.path.toUpperCase();
  const status = req.query.status as string | undefined;
  const label = req.query.label as string | undefined;
  const id = req.query.id as string | undefined;
  const queryIsCrypto = req.query.isCrypto as string | undefined;
  const queryHttpStatus = req.query.httpStatus as string | undefined;
  const queryDelayTime = req.query.delayTime as string | undefined;

  const routers = getRouterWithUrl(getRouters());
  const router = routers.find((route) => requestApiUrl === `${apiUrl}${route.url}`.toUpperCase());

  if (!router) {
    return next();
  }

  const data = getApiFileWithJson(router, { status, label, id }) || {};
  const errorData = getApiFileWithJson(router, { status: 'error' }) || {};
  const delayTime = queryDelayTime ? Number.parseInt(queryDelayTime, 10) : (router.delayTime ?? 0);
  const httpStatus = queryHttpStatus
    ? Number.parseInt(queryHttpStatus, 10)
    : (router.httpStatus ?? 200);
  const shouldEncrypt =
    queryIsCrypto !== undefined ? queryIsCrypto === 'true' : Boolean(router.isCrypto);

  const projectPublicKey = config.crypto?.request.header.publicKey?.toLowerCase();
  const requestHeaderPublicKey =
    projectPublicKey && typeof req.headers[projectPublicKey] === 'string'
      ? (req.headers[projectPublicKey] as string)
      : undefined;
  const cryptoPublicKey = requestHeaderPublicKey?.toLowerCase();

  try {
    if (shouldEncrypt && cryptoPublicKey) {
      const needCryptoColumn = config.crypto?.response.needCryptoColumn || '';
      const responseCryptoColumn = config.crypto?.response.cryptoColumn || '';
      const responseData = needCryptoColumn ? getByPath(data, needCryptoColumn) : data;
      const { encryptFn } = await getCryptoContext();
      const encryptData = await encryptFn(JSON.stringify(responseData), cryptoPublicKey);
      const newData = setByPath(data, responseCryptoColumn, encryptData);
      const finalData = config.crypto?.response.replaceAll
        ? pickByPath(newData, responseCryptoColumn)
        : newData;

      return setTimeout(() => res.status(httpStatus).json(finalData), status ? 0 : delayTime);
    }
  } catch {
    return setTimeout(() => res.status(httpStatus).json(errorData), status ? 0 : delayTime);
  }

  return setTimeout(() => res.status(httpStatus).json(data), status ? 0 : delayTime);
};

export const updateApiResponseHandler: RequestHandler = (req, res, next) => {
  const { route, status, content } = req.body;
  const { message, isError, error } = updateApiFileWithJson(route, status, content);

  if (isError) {
    return next(error);
  }

  return res.status(200).json({
    response: message,
    route,
    message: '更新成功',
  });
};
