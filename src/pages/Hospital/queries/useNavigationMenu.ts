import { useQuery } from '@tanstack/react-query';

import { HospitalPlatformAPI } from '@/pages/Hospital/api/HospitalPlatform/APIs';
import { getOrThrow } from '@/pages/Hospital/utils/effect/either';

export const useNavigationMenu = () =>
  useQuery({
    queryKey: HospitalPlatformAPI.getNavigationMenuKey(),
    queryFn: async () => getOrThrow(await HospitalPlatformAPI.fetchGetNavigationMenu()),
  });
