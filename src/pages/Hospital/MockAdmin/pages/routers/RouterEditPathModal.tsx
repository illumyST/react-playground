import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import {
  Button,
  Dialog,
  Field,
  IconButton,
  Input,
  Spacer,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { type RouterPathType } from '@/pages/Hospital/MockAdmin/types/router.type';
import { useAtomValue } from 'jotai';
import { updateRouterAtom } from '@/pages/Hospital/MockAdmin/states/routers/routerAtom';

type EditFormInputs = {
  id: string;
  title: string;
  parentId: string;
};

type RouterCreatePathProps = {
  parentId?: string;
  parentTitles?: string[];
  router: RouterPathType<unknown>;
  parentIds?: string[];
  routerIdSet: Set<string>;
};

const RouterEditPathModal: React.FC<RouterCreatePathProps> = ({
  parentId,
  parentTitles,
  router,
  parentIds,
  routerIdSet,
}) => {
  const { handleSubmit, control, reset } = useForm<EditFormInputs>({
    defaultValues: { parentId, id: router.id, title: router.title },
  });

  const updateRouter = useAtomValue(updateRouterAtom);

  const { open, onOpen, onClose, setOpen } = useDisclosure();

  const onSubmit: SubmitHandler<EditFormInputs> = ({ id: updateId, title }) =>
    updateRouter
      .mutateAsync({ id: router.id, updateId, title, parents: parentIds || [] })
      .then(() => {
        onClose();
        reset();
      });

  return (
    <>
      <IconButton variant="subtle" aria-label="edit-path" onClick={onOpen} size="xs">
        <FontAwesomeIcon icon={faPenToSquare} />
      </IconButton>

      <Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Dialog.CloseTrigger />
              <Dialog.Header>
                <Dialog.Title>編輯層級</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Stack gap={5}>
                  <Field.Root>
                    <Field.Label>父層層級︰</Field.Label>
                    <Input
                      name="parentTitle"
                      size="sm"
                      defaultValue={
                        `${parentTitles?.map((title) => `${title}`).join(' > ')}` || '-'
                      }
                      readOnly
                    />
                  </Field.Root>
                  <Controller
                    control={control}
                    name="id"
                    rules={{
                      required: true,
                      validate: (value: string) => {
                        if (value === router.id) {
                          return true;
                        }

                        if (routerIdSet.has(value)) {
                          return '有相同 id 名稱，請重新命名';
                        }

                        return true;
                      },
                    }}
                    render={({ field, fieldState }) => (
                      <Field.Root invalid={fieldState.invalid}>
                        <Field.Label>層級ID︰</Field.Label>
                        <Input size="sm" placeholder="請輸入層級ID" {...field} />
                      </Field.Root>
                    )}
                  />

                  <Controller
                    control={control}
                    name="title"
                    rules={{
                      required: true,
                    }}
                    render={({ field, fieldState }) => (
                      <Field.Root invalid={fieldState.invalid}>
                        <Text>層級名稱︰</Text>
                        <Input size="sm" placeholder="請輸入層級名稱" {...field} />
                      </Field.Root>
                    )}
                  />
                </Stack>
              </Dialog.Body>
              <Dialog.Footer>
                <Button size="sm" onClick={() => reset()}>
                  重製
                </Button>
                <Spacer />
                <Button variant="ghost" mr={3} size="sm" onClick={onClose}>
                  取消
                </Button>
                <Button type="submit" colorPalette="teal" size="sm">
                  修改
                </Button>
              </Dialog.Footer>
            </form>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </>
  );
};

export default RouterEditPathModal;
