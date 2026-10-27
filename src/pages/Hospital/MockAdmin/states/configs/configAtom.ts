import { getConfig, updateConfig } from '@/pages/Hospital/MockAdmin/apis/apis';
import { type ConfigType } from '@/pages/Hospital/MockAdmin/types/config.type';
import { atomWithMutation, atomWithQuery } from 'jotai-tanstack-query';

export const configStatusAtom = atomWithQuery(() => ({
  queryKey: ['config/getConfig'],
  queryFn: async () => getConfig(),
}));

export const updateConfigAtom = atomWithMutation((get) => ({
  mutationFn: async (data: ConfigType) => updateConfig({ data }),
  onSuccess: () => {
    get(configStatusAtom).refetch();
  },
}));
