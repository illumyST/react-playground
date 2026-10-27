import { type ScenarioType } from '@/pages/Hospital/MockAdmin/types/scenario.type';
import { useDisclosure } from '@chakra-ui/react';
import { type PropsWithChildren, useMemo, useState } from 'react';
import ScenarioRunModal from './ScenarioRunModal';
import ScenarioEditModal from './ScenarioEditModal';
import ScenarioDeleteModal from './ScenarioDeleteModal';
import { ScenarioControlContext } from './useScenarioControlContext';

const ScenarioControlProvider = ({ children }: PropsWithChildren) => {
  const [runItem, setRunItem] = useState<ScenarioType | null>(null);
  const runScenarioModalControl = useDisclosure();

  const [editItem, setEditItem] = useState<ScenarioType | null>(null);
  const editScenarioModalControl = useDisclosure();

  const [deleteItem, setDeleteItem] = useState<ScenarioType | null>(null);
  const deleteScenarioModalControl = useDisclosure();

  const handleRun = (item: ScenarioType) => {
    runScenarioModalControl.onOpen();
    setRunItem(item);
  };

  const handleEdit = (item: ScenarioType) => {
    editScenarioModalControl.onOpen();
    setEditItem(item);
  };

  const handleDelete = (item: ScenarioType) => {
    deleteScenarioModalControl.onOpen();
    setDeleteItem(item);
  };

  const ctx = useMemo(
    () => ({
      handleRun,
      handleEdit,
      handleDelete,
    }),
    [],
  );

  return (
    <>
      <ScenarioControlContext.Provider value={ctx}>{children}</ScenarioControlContext.Provider>
      <ScenarioRunModal
        item={runItem}
        open={runScenarioModalControl.open}
        onClose={runScenarioModalControl.onClose}
        setOpen={runScenarioModalControl.setOpen}
      />
      <ScenarioEditModal
        item={editItem}
        open={editScenarioModalControl.open}
        setOpen={editScenarioModalControl.setOpen}
        onClose={editScenarioModalControl.onClose}
      />
      <ScenarioDeleteModal
        item={deleteItem}
        open={deleteScenarioModalControl.open}
        setOpen={deleteScenarioModalControl.setOpen}
        onClose={deleteScenarioModalControl.onClose}
      />
    </>
  );
};

export default ScenarioControlProvider;
