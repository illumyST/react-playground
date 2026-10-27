import { RequestHandler } from 'express';
import {
  createApiRouter,
  getRouters,
  getRouterWithUrl,
  updateApiRouter,
  updateRoutersJson,
} from '../../utils/router';

export const readAdminApiHandler: RequestHandler = (_req, res) => {
  res.status(200).json(getRouterWithUrl(getRouters()));
};

export const createAdminApiHandler: RequestHandler = (req, res) => {
  const { parents, ...data } = req.body;
  const routers = getRouters();
  const { result, isError, message } = createApiRouter({ items: routers, parents, data });

  if (!isError) {
    updateRoutersJson(JSON.stringify(result));
  }

  return res.status(200).json({
    status: isError ? 'Error' : 'OK',
    message,
  });
};

export const updateAdminApiHandler: RequestHandler = (req, res) => {
  const { parents, ...data } = req.body;
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const routers = getRouters();
  const { result, isError, message } = updateApiRouter({
    items: routers,
    parents,
    data,
    id,
  });

  if (!isError) {
    updateRoutersJson(JSON.stringify(result));
  }

  return res.status(200).json({
    status: isError ? 'Error' : 'OK',
    message,
  });
};
