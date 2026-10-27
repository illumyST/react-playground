import { getApiResponse } from '@/pages/Hospital/MockAdmin/apis/apis';
import { updateApiResponseAtom } from '@/pages/Hospital/MockAdmin/states/apis/apiAtom';
import { type RouterApiType } from '@/pages/Hospital/MockAdmin/types/router.type';
import {
  Box,
  Card,
  Center,
  Flex,
  Heading,
  NativeSelect,
  Separator,
  Spacer,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import { useState } from 'react';
import MultipleEditor, { type ApiResponseForm } from './MultipleEditor';
import { type ApiResponseContent } from '@/pages/Hospital/MockAdmin/types/apiResponse.type';
import { toaster } from '@/pages/Hospital/MockAdmin/components/ui/toasterStore';

interface ApiEditStatusContentProps {
  apiRoute: RouterApiType;
  status: string;
}

const ApiEditStatusContent = ({ apiRoute, status }: ApiEditStatusContentProps) => {
  const apiResponseStatus = useQuery({
    queryKey: [apiRoute.url, status],
    queryFn: () => getApiResponse({ url: apiRoute.url.substring(1), status: status })(),
    enabled: !!status,
  });
  const [refreshKey, setRefreshKey] = useState(0);

  const updateApiResponse = useAtomValue(updateApiResponseAtom);

  const handleSave = (responses: ApiResponseForm[]) => {
    updateApiResponse
      .mutateAsync({
        route: apiRoute,
        status,
        content: responses.map((res) => ({
          ...res,
          response: JSON.parse(res.response),
        })),
      })
      .then(() =>
        toaster.create({
          title: '儲存成功',
          description: `已儲存【${apiRoute.title}】為【${status}】`,
          type: 'success',
          closable: true,
        }),
      )
      .then(() =>
        apiResponseStatus
          .refetch({ throwOnError: true })
          .then(() => setRefreshKey((prev) => prev + 1)),
      )
      .catch(() =>
        toaster.create({
          title: '儲存失敗',
          description: `無法儲存【${apiRoute.title}】`,
          type: 'error',
          closable: true,
        }),
      );
  };

  if (apiResponseStatus.isLoading) {
    return (
      <Center my={20}>
        <Spinner />
      </Center>
    );
  }

  if (apiResponseStatus.isError) {
    return <Text>Error</Text>;
  }

  return (
    <Stack gap={5}>
      <Box border="2px solid" borderColor="red.300" rounded="md" p={4} bgColor="red.50">
        <Text color="red.600">修改完請記得按儲存 ❗</Text>
        <Text color="red.600">在按儲存前重置，會回復到未編輯時的所有資訊</Text>
      </Box>
      <MultipleEditor
        key={refreshKey}
        onSave={handleSave}
        responseList={(apiResponseStatus.data || []) as ApiResponseContent[]}
      />
    </Stack>
  );
};

interface ApiEditMainControlProps {
  apiRoute: RouterApiType;
}

const ApiEditMainControl = ({ apiRoute }: ApiEditMainControlProps) => {
  const [editStatus, setEditStatus] = useState(apiRoute.apis?.at(0) || '');

  return (
    <Card.Root>
      <Card.Header mb={4}>
        <Flex alignItems="center">
          <Heading size="sm">{apiRoute.title}</Heading>
          <Heading size="sm">{apiRoute.filename}</Heading>
          <Spacer />
          <NativeSelect.Root variant="subtle" w="200px">
            <NativeSelect.Field value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
              <option value="">請選擇</option>

              {apiRoute.apis?.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </Flex>
      </Card.Header>
      <Separator borderColor="gray.300" />
      <Card.Body>
        {editStatus && (
          <ApiEditStatusContent key={editStatus} apiRoute={apiRoute} status={editStatus} />
        )}
      </Card.Body>
    </Card.Root>
  );
};

export default ApiEditMainControl;
