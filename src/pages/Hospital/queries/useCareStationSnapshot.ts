import { useQuery } from '@tanstack/react-query';

import { HospitalPlatformAPI } from '@/pages/Hospital/api/HospitalPlatform/APIs';
import { getOrThrow } from '@/pages/Hospital/utils/effect/either';

export const useCareStationSnapshot = () =>
  useQuery({
    queryKey: HospitalPlatformAPI.getCareStationSnapshotKey(),
    queryFn: async () => getOrThrow(await HospitalPlatformAPI.fetchGetCareStationSnapshot()),
  });
