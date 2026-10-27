import { deleteRouterAtom } from '@/pages/Hospital/MockAdmin/states/routers/routerAtom';
import {
  type RouterApiType,
  type RouterPathType,
} from '@/pages/Hospital/MockAdmin/types/router.type';
import { isPathRouter } from '@/pages/Hospital/MockAdmin/utils/tools';

import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Dialog, IconButton, Text, useDisclosure } from '@chakra-ui/react';
import { useAtomValue } from 'jotai';

type RouterCreateApiProps = {
  router: RouterApiType | RouterPathType<RouterApiType>;
  parentIds?: string[];
};

const RouterDeleteModal: React.FC<RouterCreateApiProps> = ({ parentIds, router }) => {
  const { open, onOpen, onClose, setOpen } = useDisclosure();
  const deleteRouter = useAtomValue(deleteRouterAtom);

  const onDelete = () => {
    deleteRouter.mutateAsync({ id: router.id, parents: parentIds || [] }).then(() => {
      onClose();
    });
  };

  return (
    <>
      <IconButton
        colorPalette="red"
        aria-label="delete"
        disabled={isPathRouter(router) && router.children?.length !== 0}
        onClick={onOpen}
        size="xs"
      >
        <FontAwesomeIcon icon={faTrashCan} />
      </IconButton>

      <Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.CloseTrigger />
            <Dialog.Header>
              <Dialog.Title>刪除層級</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Text>確定要刪除 ［{router.title}］ 嗎？</Text>
            </Dialog.Body>
            <Dialog.Footer>
              <Button variant="ghost" mr={3} size="sm" onClick={onClose}>
                取消刪除
              </Button>
              <Button colorPalette="red" size="sm" onClick={onDelete}>
                確認刪除
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </>
  );
};

export default RouterDeleteModal;
