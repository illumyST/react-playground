import { useQuery } from '@tanstack/react-query';

import { HospitalPlatformAPI } from '@/pages/Hospital/api/HospitalPlatform/APIs';
import { getOrThrow } from '@/pages/Hospital/utils/effect/either';

export const useStationList = () =>
  useQuery({
    queryKey: HospitalPlatformAPI.getStationListKey(),
    queryFn: async () => getOrThrow(await HospitalPlatformAPI.fetchGetStationList()),
  });
