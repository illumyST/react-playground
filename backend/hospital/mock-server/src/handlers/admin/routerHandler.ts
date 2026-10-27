import { RequestHandler } from 'express';
import {
  createRoute,
  deleteRouter,
  getRouters,
  updateRouter,
  updateRoutersJson,
} from '../../utils/router';

export const readAdminRouterHandler: RequestHandler = (_req, res) => {
  res.status(200).json(getRouters());
};

export const readAdminSingleRouterHandler: RequestHandler = (_req, res) => {
  res.status(200).json({
    message: 'Not implemented',
  });
};

export const createAdminRouterHandler: RequestHandler = (req, res) => {
  const { parents, ...data } = req.body;
  const routers = getRouters();
  const { result, isError, message } = createRoute({ items: routers, parents, data });

  if (!isError) {
    updateRoutersJson(JSON.stringify(result));
  }

  return res.status(200).json({
    status: isError ? 'Error' : 'OK',
    message,
  });
};

export const updateAdminRouterHandler: RequestHandler = (req, res) => {
  const { parents, updateId, ...data } = req.body;
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const routers = getRouters();
  const { result, isError, message } = updateRouter({
    items: routers,
    parents,
    data: { id: updateId, ...data },
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

export const deleteAdminRouterHandler: RequestHandler = (req, res) => {
  const { parents } = req.body;
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const routers = getRouters();
  const { result, isError, message } = deleteRouter({ items: routers, parents, id });

  if (!isError) {
    updateRoutersJson(JSON.stringify(result));
  }

  return res.status(200).json({
    status: isError ? 'Error' : 'OK',
    message,
  });
};
