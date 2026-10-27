import { atomWithMutation, atomWithQuery } from 'jotai-tanstack-query';
import {
  createScenario,
  deleteScenario,
  getScenario,
  runScenario,
  updateScenario,
} from '@/pages/Hospital/MockAdmin/apis/scenarios';
import { routersStatusAtom } from '../routers/routerAtom';
import {
  type CreateScenarioRequestType,
  type ScenarioType,
} from '@/pages/Hospital/MockAdmin/types/scenario.type';

export const scenariosStatusAtom = atomWithQuery(() => ({
  queryKey: ['scenario/getScenarioList'],
  queryFn: async () => getScenario(),
}));

/**
 * Scenario - create
 */
export const createScenarioAtom = atomWithMutation((get) => ({
  mutationFn: async (data: CreateScenarioRequestType) => createScenario({ data }),
  onSuccess: (res) => {
    const data = res as { status: string; message: string };
    if (data['status'] === 'Error') {
      throw new Error(data['message']);
    }
    get(scenariosStatusAtom).refetch();
  },
}));

/**
 * Scenario - update include whole props
 */
export const updateScenarioAtom = atomWithMutation((get) => ({
  mutationFn: async ({ id, ...rest }: ScenarioType) => {
    return updateScenario(id)({ data: rest });
  },
  onSuccess: () => {
    get(scenariosStatusAtom).refetch();
  },
}));

/**
 * Scenario - delete
 */
export const deleteScenarioAtom = atomWithMutation((get) => ({
  mutationFn: async ({ id }: { id: string }) => {
    return deleteScenario(id)({ data: undefined });
  },
  onSuccess: () => {
    get(scenariosStatusAtom).refetch();
  },
}));

/**
 * Scenario - run
 */
export const runScenarioAtom = atomWithMutation((get) => ({
  mutationFn: async ({ id }: { id: string }) => {
    return runScenario(id)({ data: undefined });
  },
  onSuccess: (res) => {
    const data = res as { status: string; message: string };
    if (data['status'] === 'Error') {
      throw new Error(data['message']);
    }
    get(scenariosStatusAtom).refetch();
    get(routersStatusAtom).refetch();
  },
}));
