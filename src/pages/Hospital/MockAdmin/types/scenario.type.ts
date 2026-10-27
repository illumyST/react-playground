export type ScenarioType = {
  category: string;
  name: string;
  id: string;
  data: UpdateScenarioRequestType[];
};

export interface CreateScenarioRequestType {
  category: string;
  name: string;
}

export type UpdateScenarioRequestType = {
  filename: string;
  current: string;
  responseId: string;
  label: string;
  isRunning?: boolean;
};
