import { getHistoryApiResponse } from '@/pages/Hospital/MockAdmin/apis/rollback';
import RollbackSelect from '@/pages/Hospital/MockAdmin/components/RollbackSelect';
import { type RouterApiType } from '@/pages/Hospital/MockAdmin/types/router.type';
import {
  Card,
  Center,
  Heading,
  NativeSelect,
  Separator,
  Stack,
  Switch,
  Text,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { JsonEditor as Editor } from 'jsoneditor-react';
import * as ace from 'brace';
import 'jsoneditor-react/es/editor.min.css';
import 'brace/mode/json';
import 'brace/theme/monokai';
import { type ApiResponseContent } from '@/pages/Hospital/MockAdmin/types/apiResponse.type';
import { type Response } from '@/pages/Hospital/MockAdmin/types/serverResconse';
import { isResponseError, isResponseOk } from '@/pages/Hospital/MockAdmin/utils/response';

interface HistoryApiResponseFocusProps {
  data: ApiResponseContent[];
}

const HistoryApiResponseFocus = ({ data }: HistoryApiResponseFocusProps) => {
  const [focusId, setFocusId] = useState(data.at(0)?.id || '');

  const res = data.find(({ id }) => id === Number(focusId));

  return (
    <>
      <Stack gap={5} pos="sticky" top="40px">
        <NativeSelect.Root>
          <NativeSelect.Field value={focusId} onChange={(e) => setFocusId(e.target.value)}>
            <option value="">請選擇</option>
            {data.map((s) => (
              <option key={s.id.toString()} value={s.id.toString()}>
                {s.label || s.id}
              </option>
            ))}
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>

        {res && (
          <Editor
            key={res.id}
            // 資料處裡
            value={res.response}
            // 樣式設定
            mode={Editor.modes.code}
            ace={ace}
            theme="ace/theme/monokai"
            schema={{ height: '500px' }}
            htmlElementProps={{
              style: { height: '500px', marginBottom: '12px' },
            }}
          />
        )}
      </Stack>
    </>
  );
};

interface HistoryApiResponseListProps {
  data: ApiResponseContent[];
}

const HistoryApiResponseList = ({ data }: HistoryApiResponseListProps) => {
  return (
    <Stack gap={10}>
      {data.map(({ id, label, response }, index) => {
        return (
          <Stack key={`${id}_${index}_${label}`}>
            <Heading size="sm">{label}</Heading>
            <Editor
              // 資料處裡
              value={response}
              // 樣式設定
              mode={Editor.modes.code}
              ace={ace}
              theme="ace/theme/monokai"
              schema={{ height: '500px' }}
              htmlElementProps={{
                style: { height: '500px', marginBottom: '12px' },
              }}
            />
          </Stack>
        );
      })}
    </Stack>
  );
};

interface ApiHistoryControlProps {
  apiRoute: RouterApiType;
  parents: string[];
}

const ApiHistoryControl = ({ apiRoute, parents }: ApiHistoryControlProps) => {
  const [backupTarget, setBackupTarget] = useState<string>('');
  const [status, setStatus] = useState('');
  const [focusView, setFocusView] = useState(false);
  const apiRes = useQuery<Response<ApiResponseContent[], string>>({
    queryKey: [backupTarget, ...parents, apiRoute.filename, status],
    queryFn: () =>
      getHistoryApiResponse({
        headers: { 'Content-Type': 'application/json' },
        params: {
          status,
          history: backupTarget,
          parents,
          filename: apiRoute.filename,
        },
      }),
    enabled: !!status && !!backupTarget,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <Card.Root>
      <Card.Header mb={4}>
        <Stack>
          <Stack direction="row" alignSelf="flex-end">
            <Text>專注模式</Text>
            <Switch.Root checked={focusView} onCheckedChange={() => setFocusView((prev) => !prev)}>
              <Switch.HiddenInput />
              <Switch.Control />
            </Switch.Root>
          </Stack>
          <Stack>
            <Heading size="sm">備份檔案</Heading>
            <RollbackSelect value={backupTarget} onChange={setBackupTarget} />
          </Stack>
          <Stack w="full">
            <Heading size="sm">狀態</Heading>
            <NativeSelect.Root>
              <NativeSelect.Field value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">請選擇</option>
                {apiRoute.apis?.map((s) => (
                  <option value={s} key={s}>
                    {s}
                  </option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Stack>
        </Stack>
      </Card.Header>
      <Separator borderColor="gray.300" />
      <Card.Body>
        {apiRes.isError && (
          <Center>
            <Heading size="sm">未知的錯誤</Heading>
          </Center>
        )}
        {apiRes.isSuccess && isResponseError(apiRes.data) && (
          <Center>
            <Heading size="sm">{apiRes.data.message}</Heading>
          </Center>
        )}
        {apiRes.isSuccess &&
          isResponseOk(apiRes.data) &&
          (focusView ? (
            <HistoryApiResponseFocus key={status} data={apiRes.data.message} />
          ) : (
            <HistoryApiResponseList key={status} data={apiRes.data.message} />
          ))}
      </Card.Body>
    </Card.Root>
  );
};

export default ApiHistoryControl;
