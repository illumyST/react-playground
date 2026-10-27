import { useQuery } from '@tanstack/react-query';

import { HospitalPlatformAPI } from '@/pages/Hospital/api/HospitalPlatform/APIs';
import { getOrThrow } from '@/pages/Hospital/utils/effect/either';

export const useAuthSession = () =>
  useQuery({
    queryKey: HospitalPlatformAPI.getAuthSessionKey(),
    queryFn: async () => getOrThrow(await HospitalPlatformAPI.fetchGetAuthSession()),
  });
