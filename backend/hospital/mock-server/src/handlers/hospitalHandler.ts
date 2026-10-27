import { RequestHandler } from 'express';
import { getApiFileWithJson } from '../utils/api';
import { RouterApiType } from '../types/router';

const hospitalRouteByPath: Record<string, RouterApiType> = {
  '/hospital-api/auth/session': {
    id: 'HospitalAuthSession',
    title: 'Auth Session',
    url: '/hospital-api/auth/session',
    path: 'hospitalTechStarter',
    filename: 'HOSPITAL_AUTH_Session',
    current: 'success',
    apis: ['success', 'noData', 'error'],
    delayTime: 0,
    isCrypto: false,
    httpStatus: 200,
  },
  '/hospital-api/navigation/menu': {
    id: 'HospitalNavigationMenu',
    title: 'Navigation Menu',
    url: '/hospital-api/navigation/menu',
    path: 'hospitalTechStarter',
    filename: 'HOSPITAL_NAV_Menu',
    current: 'success',
    apis: ['success', 'noData', 'error'],
    delayTime: 0,
    isCrypto: false,
    httpStatus: 200,
  },
  '/hospital-api/care-station/snapshot': {
    id: 'HospitalCareStationSnapshot',
    title: 'Care Station Snapshot',
    url: '/hospital-api/care-station/snapshot',
    path: 'hospitalTechStarter',
    filename: 'HOSPITAL_CARE_StationSnapshot',
    current: 'success',
    apis: ['success', 'noData', 'error'],
    delayTime: 0,
    isCrypto: false,
    httpStatus: 200,
  },
  '/hospital-api/integrations/list': {
    id: 'HospitalIntegrationsList',
    title: 'Integrations List',
    url: '/hospital-api/integrations/list',
    path: 'hospitalTechStarter',
    filename: 'HOSPITAL_INTG_List',
    current: 'success',
    apis: ['success', 'noData', 'error'],
    delayTime: 0,
    isCrypto: false,
    httpStatus: 200,
  },
  '/hospital-api/stations/list': {
    id: 'HospitalStationsList',
    title: 'Stations List',
    url: '/hospital-api/stations/list',
    path: 'hospitalTechStarter',
    filename: 'HOSPITAL_STATION_List',
    current: 'success',
    apis: ['success', 'noData', 'error'],
    delayTime: 0,
    isCrypto: false,
    httpStatus: 200,
  },
  '/hospital-api/mock/scenarios': {
    id: 'HospitalMockScenarios',
    title: 'Mock Scenarios',
    url: '/hospital-api/mock/scenarios',
    path: 'hospitalTechStarter',
    filename: 'HOSPITAL_MOCK_Scenarios',
    current: 'success',
    apis: ['success', 'noData', 'error'],
    delayTime: 0,
    isCrypto: false,
    httpStatus: 200,
  },
  '/hospital-api/system/probe': {
    id: 'HospitalSystemProbe',
    title: 'System Probe',
    url: '/hospital-api/system/probe',
    path: 'hospitalTechStarter',
    filename: 'HOSPITAL_SYS_Probe',
    current: 'success',
    apis: ['success', 'noData', 'error'],
    delayTime: 0,
    isCrypto: false,
    httpStatus: 200,
  },
};

const getScenarioLabel = (req: Parameters<RequestHandler>[0]) => {
  const headerScenario = req.header('x-mock-scenario');
  const queryScenario = typeof req.query.scenario === 'string' ? req.query.scenario : undefined;

  return headerScenario || queryScenario || 'default';
};

const getStatus = (req: Parameters<RequestHandler>[0]) => {
  const queryStatus = typeof req.query.status === 'string' ? req.query.status : undefined;

  return queryStatus || 'success';
};

const replaceDynamicValues = (value: unknown): unknown => {
  if (value === '$datetime') {
    return new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString().replace('Z', '+08:00');
  }

  if (Array.isArray(value)) {
    return value.map((item) => replaceDynamicValues(item));
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, childValue]) => [key, replaceDynamicValues(childValue)]),
    );
  }

  return value;
};

export const hospitalApiHandler: RequestHandler = (req, res, next) => {
  const route = hospitalRouteByPath[req.path];

  if (!route) {
    return next();
  }

  if (req.query.status) {
    const status = req.query.status as string;
    const response = getApiFileWithJson(route, { status });
    return res.status(200).json(response);
  }

  const status = getStatus(req);
  const label = status === 'success' ? getScenarioLabel(req) : status;
  const response = getApiFileWithJson(
    route,
    status === route.current ? { label } : { status, label },
  );

  return res.status(route.httpStatus).json(replaceDynamicValues(response));
};
