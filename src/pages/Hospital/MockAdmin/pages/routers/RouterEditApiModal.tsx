import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import {
  Button,
  Dialog,
  Field,
  IconButton,
  Input,
  Spacer,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';

import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { type RouterApiType } from '@/pages/Hospital/MockAdmin/types/router.type';
import { useAtomValue } from 'jotai';
import { updateApiAtom } from '@/pages/Hospital/MockAdmin/states/routers/routerAtom';
import { formatUrl } from '@/pages/Hospital/MockAdmin/utils/tools';

type EditFormInputs = {
  parents: string[];
  id: string;
  title: string;
  filename: string;
  url: string;
};

type RouterCreateApiProps = {
  parentIds: string[];
  parentTitles?: string[];
  router: RouterApiType;
  apiUrlSet: Set<string>;
  apiFilenameSet: Set<string>;
};

const RouterEditApiModal: React.FC<RouterCreateApiProps> = ({
  parentIds,
  parentTitles,
  router,
  apiUrlSet,
  apiFilenameSet,
}) => {
  const { handleSubmit, control, reset } = useForm<EditFormInputs>({
    defaultValues: {
      parents: parentIds,
      id: router.id,
      title: router.title,
      filename: router.filename,
      url: router.url,
    },
  });
  const updateApiRouter = useAtomValue(updateApiAtom);

  const { open, onOpen, onClose, setOpen } = useDisclosure();

  const onSubmit: SubmitHandler<EditFormInputs> = (data) => {
    updateApiRouter.mutateAsync({ ...data, url: formatUrl(data.url) }).then(() => {
      onClose();
      reset();
    });
  };

  return (
    <>
      <IconButton variant="subtle" aria-label="edit-api" onClick={onOpen} size="xs">
        <FontAwesomeIcon icon={faPenToSquare} />
      </IconButton>

      <Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Dialog.CloseTrigger />
              <Dialog.Header>
                <Dialog.Title>編輯API</Dialog.Title>
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
                    name="title"
                    rules={{ required: true }}
                    render={({ field, fieldState }) => (
                      <Field.Root required invalid={fieldState.invalid}>
                        <Field.Label>API名稱</Field.Label>
                        <Input size="sm" placeholder="請輸入API名稱" {...field} />
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
                        if (value === router.url) {
                          return true;
                        }

                        if (apiUrlSet.has(value)) {
                          return '有相同 URL 路徑，請重新命名';
                        }
                        return true;
                      },
                    }}
                    render={({ field, fieldState }) => (
                      <Field.Root required invalid={fieldState.invalid}>
                        <Field.Label>API Url</Field.Label>
                        <Input size="sm" placeholder="請輸入API Url" {...field} />
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
                        if (value === router.filename) {
                          return true;
                        }

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
                <Button variant="ghost" mr={3} onClick={onClose}>
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

export default RouterEditApiModal;
