type ScenarioDataType = {
  filename: string;
  current: string;
  responseId: string;
  label: string;
  id: string;
  isRunning?: boolean;
};

export type ScenarioItemType = {
  category: string;
  id: string;
  name: string;
  data: ScenarioDataType[];
};

export type ScenarioHandlerResponse = {
  result: ScenarioItemType[];
  isError?: boolean;
  message?: string;
};

export type ScenarioHandlerParams<T> = {
  items: ScenarioItemType[];
  data?: T;
  id?: string;
};
