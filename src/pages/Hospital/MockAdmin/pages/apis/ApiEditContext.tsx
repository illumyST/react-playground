import { apiParamsAtom } from '@/pages/Hospital/MockAdmin/states/apis/apiAtom';
import { type RouterApiType } from '@/pages/Hospital/MockAdmin/types/router.type';
import { useDisclosure } from '@chakra-ui/react';
import { useSetAtom } from 'jotai';
import { type PropsWithChildren, useMemo, useState } from 'react';
import ApiEditResponseModal from './ApiEditResponseModal';
import { ApiEditContext } from './useApiEditContext';

const ApiEditContextProvider = ({ children }: PropsWithChildren) => {
  const [editingResponse, setEditingResponse] = useState<{
    status: string;
    route: RouterApiType | undefined;
  }>({
    status: '',
    route: undefined,
  });
  const { open, onOpen, onClose, setOpen } = useDisclosure();
  const setApiParamsAtom = useSetAtom(apiParamsAtom);

  const onEdit = (status: string, route: RouterApiType) => {
    setApiParamsAtom({ status, url: route.url });
    setEditingResponse({ status, route });
    onOpen();
  };

  const ctx = useMemo(
    () => ({
      onEdit,
    }),
    [],
  );

  return (
    <>
      <ApiEditContext.Provider value={ctx}>{children}</ApiEditContext.Provider>
      <ApiEditResponseModal
        open={open}
        onClose={onClose}
        setOpen={setOpen}
        status={editingResponse.status}
        route={editingResponse.route}
      />
    </>
  );
};

export default ApiEditContextProvider;
