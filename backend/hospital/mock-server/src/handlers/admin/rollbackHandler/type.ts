type RollBackAllApiStatusData = {
  backupFolder: string;
  parents: string[];
  fileName: string;
};

type RollBackAllApiStatusEvent = {
  type: 'api';
  data: RollBackAllApiStatusData;
};

type RollBackApiStatusData = {
  backupFolder: string;
  parents: string[];
  fileName: string;
  status: string;
  id?: string | undefined;
};

type RollBackApiStatusEvent = {
  type: 'api-status';
  data: RollBackApiStatusData;
};

export type RollbackEvent = RollBackAllApiStatusEvent | RollBackApiStatusEvent;
