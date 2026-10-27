import { type ApiResponseContent } from '@/pages/Hospital/MockAdmin/types/apiResponse.type';
import { type Response } from '@/pages/Hospital/MockAdmin/types/serverResconse';
import { clientGet } from '@/pages/Hospital/MockAdmin/utils/client';

interface RollbackList {
  content: string[];
}

export const getRollbackList = clientGet<RollbackList>('rollback/list');

export const getHistoryApiResponse = clientGet<Response<ApiResponseContent[], string>>(
  'rollback/history/apiResponse',
);
