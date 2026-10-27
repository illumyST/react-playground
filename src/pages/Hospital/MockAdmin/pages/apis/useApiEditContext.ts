import { type RouterApiType } from '@/pages/Hospital/MockAdmin/types/router.type';
import { createContext, useContext } from 'react';

interface ApiEditContextType {
  onEdit: (status: string, route: RouterApiType) => void;
}

export const ApiEditContext = createContext<ApiEditContextType | undefined>(undefined);

export const useApiEditContext = () => {
  const res = useContext(ApiEditContext);

  if (!res) {
    throw new Error('no provider in parent');
  }

  return res;
};
