import { RequestHandler } from 'express';
import { ScenarioItemType } from '../../types/scenario';
import {
  deleteScenario,
  getScenarios,
  handleCreateScenario,
  handleGetScenario,
  reorderScenario,
  runScenario,
  updateScenario,
  updateScenarioJson,
} from '../../utils/scenario';

export const readScenarioHandler: RequestHandler = (_req, res) => {
  const scenarios = getScenarios() as ScenarioItemType[];
  const { result } = handleGetScenario({ items: scenarios });
  res.status(200).json(result);
};

export const createScenarioHandler: RequestHandler = (req, res) => {
  const scenarios = getScenarios();
  const { result, isError, message } = handleCreateScenario({ items: scenarios, data: req.body });

  if (!isError) {
    updateScenarioJson(JSON.stringify(result));
  }

  return res.status(200).json({
    status: isError ? 'Error' : 'OK',
    message,
  });
};

export const updateScenarioHandler: RequestHandler = (req, res) => {
  const scenarios = getScenarios();
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const { result, isError, message } = updateScenario({
    items: scenarios,
    data: req.body,
    id,
  });

  if (!isError) {
    updateScenarioJson(JSON.stringify(result));
  }

  return res.status(200).json({
    status: isError ? 'Error' : 'OK',
    message,
  });
};

export const deleteScenarioHandler: RequestHandler = (req, res) => {
  const scenarios = getScenarios();
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const { result, isError, message } = deleteScenario({ items: scenarios, id });

  if (!isError) {
    updateScenarioJson(JSON.stringify(result));
  }

  return res.status(200).json({
    status: isError ? 'Error' : 'OK',
    message,
  });
};

export const reorderScenarioHandler: RequestHandler = (req, res) => {
  const scenarios = getScenarios();
  const { result, isError, message } = reorderScenario({ items: scenarios, data: req.body });

  if (!isError) {
    updateScenarioJson(JSON.stringify(result));
  }

  return res.status(200).json({
    status: isError ? 'Error' : 'OK',
    message,
  });
};

export const runScenarioHandler: RequestHandler = (req, res) => {
  const scenarios = getScenarios();
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const { isError, message } = runScenario({ items: scenarios, id });

  return res.status(200).json({
    status: isError ? 'Error' : 'OK',
    message,
  });
};
