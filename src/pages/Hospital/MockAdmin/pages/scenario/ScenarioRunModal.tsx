import { runScenarioAtom } from '@/pages/Hospital/MockAdmin/states/scenarios/scenarioAtom';
import { type ScenarioType } from '@/pages/Hospital/MockAdmin/types/scenario.type';
import { Button, Dialog, Portal, Text } from '@chakra-ui/react';
import { useAtomValue } from 'jotai';
import { toaster } from '@/pages/Hospital/MockAdmin/components/ui/toasterStore';

type ScenarioRunApiProps = {
  open: boolean;
  setOpen: (v: boolean) => void;
  onClose: () => void;
  item: ScenarioType | null;
};

const ScenarioRunModal: React.FC<ScenarioRunApiProps> = ({ open, setOpen, onClose, item }) => {
  const runScenario = useAtomValue(runScenarioAtom);

  const onRun = () => {
    if (!item) return;
    runScenario
      .mutateAsync({ id: item.id })
      .then(onClose)
      .then(() =>
        toaster.create({
          title: '執行成功',
          description: `已執行【${item.category}】【${item.name}】`,
          type: 'success',
          closable: true,
        }),
      )
      .catch((err) =>
        toaster.create({
          title: '執行失敗',
          description: `無法執行【${item.category}】【${item.name}】${err}`,
          type: 'error',
          closable: true,
        }),
      );
  };

  return (
    <Dialog.Root open={open} onOpenChange={({ open }) => setOpen(open)}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            {item && (
              <>
                <Dialog.Header>執行情境</Dialog.Header>
                <Dialog.Body>
                  <Text>
                    確定要執行 ［{item.category}］ ［{item.name}］ 嗎？
                  </Text>
                </Dialog.Body>
                <Dialog.Footer>
                  <Button variant="ghost" mr={3} size="sm" onClick={onClose}>
                    取消
                  </Button>
                  <Button colorPalette="blue" size="sm" onClick={onRun}>
                    執行
                  </Button>
                </Dialog.Footer>
              </>
            )}
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default ScenarioRunModal;
