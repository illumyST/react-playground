import { type ScenarioType } from '@/pages/Hospital/MockAdmin/types/scenario.type';
import { createContext, useContext } from 'react';

interface ScenarioContentContextType {
  handleRun: (item: ScenarioType) => void;
  handleEdit: (item: ScenarioType) => void;
  handleDelete: (item: ScenarioType) => void;
}

export const ScenarioControlContext = createContext<ScenarioContentContextType | undefined>(
  undefined,
);

export const useScenarioControlContext = () => {
  const ctx = useContext(ScenarioControlContext);

  if (!ctx) {
    throw new Error('no Provider on parent');
  }

  return ctx;
};
