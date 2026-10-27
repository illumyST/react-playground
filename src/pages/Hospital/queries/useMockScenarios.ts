import { useQuery } from '@tanstack/react-query';

import { HospitalPlatformAPI } from '@/pages/Hospital/api/HospitalPlatform/APIs';
import { getOrThrow } from '@/pages/Hospital/utils/effect/either';

export const useMockScenarios = () =>
  useQuery({
    queryKey: HospitalPlatformAPI.getMockScenariosKey(),
    queryFn: async () => getOrThrow(await HospitalPlatformAPI.fetchGetMockScenarios()),
  });
