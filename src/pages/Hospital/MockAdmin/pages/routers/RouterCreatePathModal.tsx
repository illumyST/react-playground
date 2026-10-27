import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { Button, Dialog, Field, Input, Spacer, Stack, useDisclosure } from '@chakra-ui/react';
import { useAtomValue } from 'jotai';
import { createRouterAtom } from '@/pages/Hospital/MockAdmin/states/routers/routerAtom';

type CreateFormInputs = {
  id: string;
  title: string;
  parentId: string;
};

type RouterCreatePathProps = {
  parentId?: string;
  parentTitles?: string[];
  parentIds?: string[];
  routerIdSet: Set<string>;
};

const RouterCreatePathModal: React.FC<RouterCreatePathProps> = ({
  parentId,
  parentTitles,
  parentIds,
  routerIdSet,
}) => {
  const { handleSubmit, control, reset } = useForm<CreateFormInputs>({
    defaultValues: { parentId, id: '', title: '' },
  });
  const createRouter = useAtomValue(createRouterAtom);

  const { open, onOpen, onClose, setOpen } = useDisclosure();

  const onSubmit: SubmitHandler<CreateFormInputs> = ({ id, title }) => {
    createRouter.mutateAsync({ id, title, parents: parentIds || [] }).then(() => {
      onClose();
      reset();
    });
  };

  return (
    <>
      <Button variant="solid" colorPalette="teal" onClick={onOpen} size="sm">
        新增層級
      </Button>

      <Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Dialog.CloseTrigger />
              <Dialog.Header>
                <Dialog.Title>新增層級</Dialog.Title>
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
                    render={({ field, fieldState }) => (
                      <Field.Root invalid={fieldState.invalid}>
                        <Field.Label>層級名稱︰</Field.Label>
                        <Input size="sm" placeholder="請輸入層級名稱" {...field} />
                      </Field.Root>
                    )}
                  />
                </Stack>
              </Dialog.Body>
              <Dialog.Footer>
                <Button size="sm" onClick={() => reset()}>
                  清空
                </Button>
                <Spacer />
                <Button variant="subtle" mr={3} colorPalette="red" size="sm" onClick={onClose}>
                  取消
                </Button>
                <Button type="submit" colorPalette="blue" size="sm">
                  新增
                </Button>
              </Dialog.Footer>
            </form>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </>
  );
};

export default RouterCreatePathModal;
