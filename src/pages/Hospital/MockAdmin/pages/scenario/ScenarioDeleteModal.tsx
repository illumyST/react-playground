import { deleteScenarioAtom } from '@/pages/Hospital/MockAdmin/states/scenarios/scenarioAtom';
import { type ScenarioType } from '@/pages/Hospital/MockAdmin/types/scenario.type';
import { Button, Dialog, Text } from '@chakra-ui/react';
import { useAtomValue } from 'jotai';
import { toaster } from '@/pages/Hospital/MockAdmin/components/ui/toasterStore';

type ScenarioCreateApiProps = {
  item: ScenarioType | null;
  open: boolean;
  onClose: () => void;
  setOpen: (v: boolean) => void;
  renderAction?: (action: () => void) => React.ReactNode;
};

const ScenarioDeleteModal: React.FC<ScenarioCreateApiProps> = ({
  open,
  onClose,
  setOpen,
  item,
}) => {
  const deleteScenario = useAtomValue(deleteScenarioAtom);

  const onDelete = () => {
    if (!item) return;
    deleteScenario
      .mutateAsync({ id: item.id })
      .then(onClose)
      .then(() =>
        toaster.create({
          title: '刪除成功',
          description: `已刪除【${item.category}】【${item.name}】`,
          type: 'success',
          closable: true,
        }),
      )
      .catch((err) =>
        toaster.create({
          title: '刪除失敗',
          description: `無法刪除【${item.category}】【${item.name}】${err}`,
          type: 'error',
          closable: true,
        }),
      );
  };

  return (
    <Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.CloseTrigger />
          <Dialog.Header>
            <Dialog.Title>刪除情境</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <Text>
              確定要刪除 ［{item?.category}］ ［{item?.name}］ 嗎？
            </Text>
          </Dialog.Body>
          <Dialog.Footer>
            <Button variant="ghost" mr={3} size="sm" onClick={onClose}>
              取消刪除
            </Button>
            <Button colorPalette="blue" size="sm" onClick={onDelete}>
              確認刪除
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};

export default ScenarioDeleteModal;
