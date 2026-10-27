import {
  apiResponseAtom,
  updateApiResponseAtom,
} from '@/pages/Hospital/MockAdmin/states/apis/apiAtom';
import { type RouterApiType } from '@/pages/Hospital/MockAdmin/types/router.type';
import { Button, Center, Dialog, Flex, Link, Spinner, Text } from '@chakra-ui/react';
import { useAtomValue } from 'jotai';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import MultiEditors from './MultiEditors';
import { toaster } from '@/pages/Hospital/MockAdmin/components/ui/toasterStore';
import { configStatusAtom } from '@/pages/Hospital/MockAdmin/states/configs/configAtom';

import { MOCK_API_URL as apiUrl } from '@/pages/Hospital/MockAdmin/constants';

interface EditorFormProps {
  route: RouterApiType;
  status: string;
  response: unknown;
  onClose: () => void;
}

const EditorForm: React.FC<EditorFormProps> = ({ route, status, response, onClose }) => {
  const { handleSubmit, formState, control, getValues, setValue } = useForm({
    defaultValues: {
      response: JSON.stringify(response, undefined, 2),
    },
  });
  const updateApiResponse = useAtomValue(updateApiResponseAtom);
  const configStatus = useAtomValue(configStatusAtom);

  // 新增測試情境：建立新的場景物件並追加至清單
  const handleCreateScenario = () => {
    const currentValue = getValues('response');
    const scenarios = JSON.parse(currentValue);
    const newId = Date.now();
    const scenario = {
      id: newId,
      label: `第${scenarios.length + 1}筆測試情境`,
      isChecked: false,
      response: configStatus.data?.api.default || {},
    };
    const newData = [...scenarios, scenario];
    setValue('response', JSON.stringify(newData), { shouldDirty: true });
  };

  const onSubmit: SubmitHandler<{ response: string }> = ({ response }) => {
    updateApiResponse
      .mutateAsync({ route, status, content: JSON.parse(response) })
      .then(onClose)
      .then(() =>
        toaster.create({
          title: '更新成功',
          description: `已更新【${route.title}】為【${status}】`,
          type: 'success',
          closable: true,
        }),
      )
      .catch(() =>
        toaster.create({
          title: '更新失敗',
          description: `無法更新【${route.title}】`,
          type: 'error',
          closable: true,
        }),
      );
  };

  return (
    <Flex direction="column" as="form" h="full" onSubmit={handleSubmit(onSubmit)}>
      <Dialog.Header flexDirection="column">
        <Dialog.Title>
          [編輯] {route.title} ({status})
        </Dialog.Title>
        {status === 'schema' && (
          <Link href={`${apiUrl}${route.url}`} target="_blank">
            {route.url} 預覽結果(下拉選單:選schema){' '}
          </Link>
        )}
        {status !== 'schema' && <Text>{route.url}</Text>}
      </Dialog.Header>
      <Dialog.CloseTrigger />
      <Dialog.Body flex="1" pt={0}>
        <Controller
          name="response"
          control={control}
          rules={{
            required: true,
            validate: () => {
              try {
                JSON.parse(getValues('response'));
                return true;
              } catch {
                return 'JSON格式錯誤了啦';
              }
            },
          }}
          render={({ field: { value, onChange } }) => (
            <MultiEditors value={value} onChange={onChange} />
          )}
        />
      </Dialog.Body>
      <Dialog.Footer>
        <Button variant="solid" colorPalette="green" onClick={handleCreateScenario} mr="auto">
          新增情境
        </Button>
        <Button mr={3} variant="ghost" onClick={onClose}>
          取消
        </Button>
        <Button type="submit" colorPalette="blue" disabled={!formState.isDirty}>
          確認
        </Button>
      </Dialog.Footer>
    </Flex>
  );
};

const ApiEditResponseContent = ({
  status,
  route,
  onClose,
}: {
  status: string;
  route: RouterApiType;
  onClose: () => void;
}) => {
  const apiResponse = useAtomValue(apiResponseAtom);

  return (
    <>
      {apiResponse.isLoading && (
        <>
          <Dialog.CloseTrigger />
          <Dialog.Header>
            <Dialog.Title>編輯{status}內容</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <Center py={9}>
              <Spinner />
            </Center>
          </Dialog.Body>
        </>
      )}
      {apiResponse.isError && (
        <>
          <Dialog.CloseTrigger />
          <Dialog.Header>
            <Dialog.Title>編輯{status}內容</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <Center py={9}>
              <Text>發生錯誤</Text>
            </Center>
          </Dialog.Body>
        </>
      )}
      {apiResponse.isSuccess && apiResponse.data ? (
        <EditorForm route={route} status={status} response={apiResponse.data} onClose={onClose} />
      ) : null}
    </>
  );
};

interface ApiEditResponseModalProps {
  status: string;
  route: RouterApiType | undefined;
  open: boolean;
  setOpen: (v: boolean) => void;
  onClose: () => void;
}

const ApiEditResponseModal = ({
  status,
  route,
  open,
  setOpen,
  onClose,
}: ApiEditResponseModalProps) => {
  return (
    <Dialog.Root
      size="xl"
      scrollBehavior="inside"
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
    >
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content h="full">
          {route && <ApiEditResponseContent status={status} onClose={onClose} route={route} />}
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};

export default ApiEditResponseModal;
