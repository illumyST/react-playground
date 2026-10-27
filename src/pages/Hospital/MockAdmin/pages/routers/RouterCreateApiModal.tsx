import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { Button, Dialog, Field, Input, Spacer, Stack, useDisclosure } from '@chakra-ui/react';
import { useAtomValue } from 'jotai';
import { createApiRouterAtom } from '@/pages/Hospital/MockAdmin/states/routers/routerAtom';
import { formatUrl } from '@/pages/Hospital/MockAdmin/utils/tools';

type CreateFormInputs = {
  parentId: string;
  title: string;
  url: string;
  filename: string;
};

type RouterCreateApiProps = {
  parentId?: string;
  parentTitles?: string[];
  parentIds?: string[];
  apiUrlSet: Set<string>;
  apiFilenameSet: Set<string>;
};

const RouterCreateApiModal: React.FC<RouterCreateApiProps> = ({
  parentId,
  parentTitles,
  parentIds,
  apiUrlSet,
  apiFilenameSet,
}) => {
  const { control, handleSubmit, reset } = useForm<CreateFormInputs>({
    defaultValues: { parentId, title: '', filename: '', url: '' },
  });
  const createApiRouter = useAtomValue(createApiRouterAtom);

  const { open, onOpen, onClose, setOpen } = useDisclosure();

  const onSubmit: SubmitHandler<CreateFormInputs> = ({ url, title, filename }) => {
    createApiRouter
      .mutateAsync({
        url: formatUrl(url),
        title,
        filename,
        parents: parentIds || [],
      })
      .then(() => {
        onClose();
        reset();
      });
  };

  return (
    <>
      <Button onClick={onOpen} size="sm">
        新增API
      </Button>

      <Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Dialog.CloseTrigger />
              <Dialog.Header>
                <Dialog.Title>新增API</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Stack gap={5}>
                  <Field.Root>
                    <Field.Label>父層層級</Field.Label>
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
                    name="title"
                    rules={{ required: true }}
                    render={({ field, fieldState }) => (
                      <Field.Root required invalid={fieldState.invalid}>
                        <Field.Label>API 名稱</Field.Label>
                        <Input size="sm" placeholder="請輸入 API 名稱" {...field} />
                      </Field.Root>
                    )}
                  />

                  <Controller
                    control={control}
                    name="url"
                    rules={{
                      required: true,
                      pattern: {
                        value: /^(\/(_|\w)+)+$/i,
                        message: '請填寫正確格式',
                      },
                      validate: (value: string) => {
                        if (apiUrlSet.has(value)) {
                          return '有相同 URL 路徑，請重新命名';
                        }
                        return true;
                      },
                    }}
                    render={({ field, fieldState }) => (
                      <Field.Root required invalid={fieldState.invalid}>
                        <Field.Label>API Url</Field.Label>
                        <Input size="sm" placeholder="請輸入 API Url" {...field} />
                        <Field.HelperText color="orange.400">
                          格式為: /{'${API路徑}'}，開頭有/，結尾無/
                        </Field.HelperText>
                        <Field.ErrorText>{fieldState.error?.message}</Field.ErrorText>
                      </Field.Root>
                    )}
                  />
                  <Controller
                    control={control}
                    name="filename"
                    rules={{
                      required: true,
                      pattern: {
                        value: /^\w+(_\w+)*$/i,
                        message: '僅能包含英數、底線，開頭結尾不能為底線',
                      },
                      validate: (value: string) => {
                        if (apiFilenameSet.has(value)) {
                          return '有相同檔案名稱，請重新命名';
                        }

                        return true;
                      },
                    }}
                    render={({ field, fieldState }) => (
                      <Field.Root required invalid={fieldState.invalid}>
                        <Field.Label>API File Name</Field.Label>
                        <Input size="sm" placeholder="請輸入 API 檔案名稱" {...field} />
                        <Field.ErrorText>{fieldState.error?.message}</Field.ErrorText>
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
                <Button variant="subtle" colorPalette="red" size="sm" mr={3} onClick={onClose}>
                  取消
                </Button>
                <Button colorPalette="teal" type="submit" size="sm">
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

export default RouterCreateApiModal;
