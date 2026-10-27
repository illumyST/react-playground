import express from 'express';
// import dotenv from 'dotenv';
import {
  createAdminApiHandler,
  createAdminRouterHandler,
  deleteAdminRouterHandler,
  getBackupList,
  getHistoryApiStatus,
  hospitalApiHandler,
  readAdminApiHandler,
  readAdminRouterHandler,
  readAdminSingleRouterHandler,
  updateAdminApiHandler,
  updateAdminRouterHandler,
  updateApiResponseHandler,
} from './handlers';
import { getAdminConfigHandler, updateAdminConfigHandler } from './handlers/admin/configHandler';
import {
  createScenarioHandler,
  deleteScenarioHandler,
  readScenarioHandler,
  reorderScenarioHandler,
  runScenarioHandler,
  updateScenarioHandler,
} from './handlers/admin/scenarioHandler';

// Config
// dotenv.config();
const router = express.Router();

const apiUrl = process.env.MOCK_API_URL || '';

/**
 * =========================
 * Hospital Tech Starter
 * =========================
 */
router.get('/hospital-api/auth/session', hospitalApiHandler);
router.post('/hospital-api/auth/session', hospitalApiHandler);
router.get('/hospital-api/navigation/menu', hospitalApiHandler);
router.post('/hospital-api/navigation/menu', hospitalApiHandler);
router.get('/hospital-api/care-station/snapshot', hospitalApiHandler);
router.post('/hospital-api/care-station/snapshot', hospitalApiHandler);
router.get('/hospital-api/integrations/list', hospitalApiHandler);
router.post('/hospital-api/integrations/list', hospitalApiHandler);
router.get('/hospital-api/stations/list', hospitalApiHandler);
router.post('/hospital-api/stations/list', hospitalApiHandler);
router.get('/hospital-api/mock/scenarios', hospitalApiHandler);
router.post('/hospital-api/mock/scenarios', hospitalApiHandler);
router.get('/hospital-api/system/probe', hospitalApiHandler);
router.post('/hospital-api/system/probe', hospitalApiHandler);

// Api Response Update
router.post(`${apiUrl}/api/response/update`, updateApiResponseHandler);

/**
 * =========================
 * Admin Router
 * =========================
 */
// Admin Get Routers
router.get(`${apiUrl}/router`, readAdminRouterHandler);
// Admin Get Router
router.get(`${apiUrl}/router/:id`, readAdminSingleRouterHandler);
// Admin Create Router
router.post(`${apiUrl}/router/create`, createAdminRouterHandler);
// Admin Update Router
router.post(`${apiUrl}/router/:id/update`, updateAdminRouterHandler);
// Admin delete router
router.post(`${apiUrl}/router/:id/delete`, deleteAdminRouterHandler);

/**
 * =========================
 * Admin API
 * =========================
 */
// Admin Get Apis
router.get(`${apiUrl}/api`, readAdminApiHandler);
// Admin Create Api
router.post(`${apiUrl}/api/create`, createAdminApiHandler);
// Admin Update Api
router.post(`${apiUrl}/api/:id/update`, updateAdminApiHandler);

/**
 * =========================
 * Scenario
 * =========================
 */
// Get Scenario
router.get(`${apiUrl}/scenario`, readScenarioHandler);
// Create Scenario
router.post(`${apiUrl}/scenario/create`, createScenarioHandler);
// Update Scenario
router.post(`${apiUrl}/scenario/:id/update`, updateScenarioHandler);
// Delete Scenario
router.post(`${apiUrl}/scenario/:id/delete`, deleteScenarioHandler);
// Reorder Scenario
router.post(`${apiUrl}/scenario/reorder`, reorderScenarioHandler);
// Run Scenario
router.post(`${apiUrl}/scenario/:id/run`, runScenarioHandler);

/**
 * =========================
 * Rollback
 * =========================
 */
router.get(`${apiUrl}/rollback/list`, getBackupList);
router.get(`${apiUrl}/rollback/history/apiResponse`, getHistoryApiStatus);

/**
 * =========================
 * Admin Config
 * =========================
 */
router.get(`${apiUrl}/config`, getAdminConfigHandler);

// Config Sync
router.post(`${apiUrl}/config`, updateAdminConfigHandler);

export default router;
