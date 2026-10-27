import { mockScenarioStorageKey } from './constant';

const getSearchScenario = () => new URLSearchParams(window.location.search).get('scenario');

export const getStoredMockScenario = () => window.localStorage.getItem(mockScenarioStorageKey);

export const setStoredMockScenario = (scenario: string) => {
  window.localStorage.setItem(mockScenarioStorageKey, scenario);
};

export const getResolvedMockScenario = (fallbackScenario?: string) =>
  getSearchScenario() || getStoredMockScenario() || fallbackScenario || 'default';

export const isScenarioPinnedByQuery = () => Boolean(getSearchScenario());
