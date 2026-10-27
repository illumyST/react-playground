import {
  type CreateScenarioRequestType,
  type ScenarioType,
} from '@/pages/Hospital/MockAdmin/types/scenario.type';
import { clientGet, clientPost } from '@/pages/Hospital/MockAdmin/utils/client';

export const getScenario = clientGet<ScenarioType[]>('scenario');

/**
 * Scenario - create
 */
export const createScenario = clientPost<CreateScenarioRequestType>('scenario/create');

/**
 * Scenario - update
 */
export const updateScenario = (id: string) =>
  clientPost<Omit<ScenarioType, 'id'>>(`scenario/${id}/update`);

/**
 * Scenario - delete
 */
export const deleteScenario = (id: string) => clientPost<void>(`scenario/${id}/delete`);

/**
 * Scenario - run
 */
export const runScenario = (id: string) => clientPost<void>(`scenario/${id}/run`);
