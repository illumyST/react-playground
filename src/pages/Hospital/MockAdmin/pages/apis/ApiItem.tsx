import { useCallback, useEffect, useMemo, useState } from 'react';
import { MOCK_ADMIN_BASE, MOCK_API_URL } from '@/pages/Hospital/MockAdmin/constants';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import { updateApiAtom } from '@/pages/Hospital/MockAdmin/states/routers/routerAtom';
import {
  Box,
  Button,
  Flex,
  Group,
  HStack,
  Icon,
  IconButton,
  Input,
  Link,
  NativeSelect,
  Spacer,
  Stack,
  Switch,
  Tag,
  Text,
} from '@chakra-ui/react';
import {
  faGlobe,
  faLink,
  faPenToSquare,
  faSpinner,
  faToggleOff,
} from '@fortawesome/free-solid-svg-icons';
import { faFile } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { type RouterApiType } from '@/pages/Hospital/MockAdmin/types/router.type';
import { getLastFragment } from '@/pages/Hospital/MockAdmin/utils/tools';
import { toaster } from '@/pages/Hospital/MockAdmin/components/ui/toasterStore';
import { debounce } from 'lodash/fp';
import { useApiEditContext } from './useApiEditContext';
import { pathJoin } from '@/pages/Hospital/MockAdmin/utils/path';

const ApiItem = ({ route }: { route: RouterApiType }) => {
  const [editRouteState, setEditRouteState] = useState({
    delayTime: route.delayTime.toString(),
    httpStatus: route.httpStatus?.toString() || '200',
    isCrypto: route.isCrypto,
  });

  const updateApi = useAtomValue(updateApiAtom);
  const { onEdit } = useApiEditContext();
  const navigate = useNavigate();
  const parentIds = route.path.split(/[/|\\]/);

  useEffect(() => {
    setEditRouteState({
      delayTime: route.delayTime.toString(),
      httpStatus: route.httpStatus?.toString() || '200',
      isCrypto: route.isCrypto,
    });
  }, [route]);

  const onUpdateStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value !== route.current) {
      updateApi
        .mutateAsync({
          ...route,
          id: route.id,
          current: value,
          parents: parentIds,
        })
        .then(() =>
          toaster.create({
            title: '更新成功',
            description: `已更新【${route.title}】 狀態為【${value}】`,
            type: 'success',
            closable: true,
          }),
        );
    }
  };

  const onUpdateCrypto = useCallback(
    debounce(500, (value: boolean) => {
      if (value !== route.isCrypto) {
        updateApi
          .mutateAsync({
            ...route,
            id: route.id,
            isCrypto: value,
            parents: parentIds,
          })
          .then(() =>
            toaster.create({
              title: '更新成功',
              description: `已更新【${route.title}】 狀態為【${value}】`,
              type: 'success',
              closable: true,
            }),
          );
      }
    }),
    [route],
  );

  const onUpdateDelayTime = useCallback(
    debounce(500, (delayTime: string) => {
      updateApi
        .mutateAsync({
          id: route.id,
          delayTime: parseInt(delayTime),
          parents: parentIds,
        })
        .then(() =>
          toaster.create({
            title: '更新成功',
            description: `已更新【${route.title}】API 延遲時間為 ${delayTime} 毫秒`,
            type: 'success',
            closable: true,
          }),
        );
    }),
    [route],
  );

  const onUpdateHttpStatus = useCallback(
    debounce(500, (httpStatus: string) => {
      updateApi
        .mutateAsync({
          id: route.id,
          httpStatus: parseInt(httpStatus),
          parents: parentIds,
        })
        .then(() =>
          toaster.create({
            title: '更新成功',
            description: `已更新【${route.title}】API Http Status 為 ${httpStatus}`,
            type: 'success',
            closable: true,
          }),
        );
    }),
    [route],
  );

  const statusStyle = (status: string) => {
    switch (status) {
      case 'success':
        return 'green';
      case 'noData':
        return 'yellow';
      case 'error':
        return 'red';
      case 'schema':
        return 'blue';
      default:
        return 'gray';
    }
  };

  const fullApiUrl = useMemo(() => {
    const value = MOCK_API_URL;
    const hostURL = URL.canParse(value) ? new URL(value) : new URL(value, window.origin);

    return new URL(pathJoin([hostURL.pathname, route.url]), hostURL.origin);
  }, [route.url]);

  return (
    <>
      <Box my={4} borderColor="gray.300" bgColor="white" fontSize="xs" p={3}>
        {/* Title */}
        <Stack direction="row" id={getLastFragment(route)} align="center" mb={4}>
          <Tag.Root size="lg" variant="solid" colorPalette="teal">
            <Tag.Label>{route.title}</Tag.Label>
          </Tag.Root>
          <Tag.Root size="lg" variant="solid" colorPalette={statusStyle(route.current)}>
            <Tag.Label>{route.current}</Tag.Label>
          </Tag.Root>
          <Spacer />
          <IconButton
            size="sm"
            variant="subtle"
            onClick={() => {
              navigate(`${MOCK_ADMIN_BASE}/api/edit/${parentIds.join('/')}/${route.filename}`);
            }}
            aria-label="edit page"
          >
            <FontAwesomeIcon icon={faPenToSquare} />
          </IconButton>
        </Stack>

        <Stack gap={4}>
          {/* 網址 */}
          <Flex>
            <Flex as="label" w="120px" color="gray.500" align="center">
              <Icon mr={2} w="15px">
                <FontAwesomeIcon icon={faLink} />
              </Icon>
              API路徑
            </Flex>
            <Link
              variant="underline"
              colorPalette="blackAlpha"
              aria-label={fullApiUrl.href}
              href={fullApiUrl.href}
              target="_blank"
              rel="noopener noreferrer"
              fontWeight="bold"
            >
              {route.url}
            </Link>
          </Flex>

          {/* 檔案名稱 */}
          <Flex>
            <Flex as="label" w="120px" color="gray.500" align="center">
              <Icon mr={2} w="15px">
                <FontAwesomeIcon icon={faFile} />
              </Icon>
              檔案名稱
            </Flex>
            <Link asChild>
              <RouterLink to={`${MOCK_ADMIN_BASE}/apis?fileName=${route.filename}`}>
                <Text fontWeight="bold">{route.filename}</Text>
              </RouterLink>
            </Link>
          </Flex>

          {/* 延遲時間 */}
          <Flex>
            <Flex as="label" w="120px" color="gray.500" align="center">
              <Icon mr={2} w="15px">
                <FontAwesomeIcon icon={faSpinner} />
              </Icon>
              <Text>延遲時間(毫秒)</Text>
            </Flex>

            <Box>
              <Group attached w="200px">
                <Input
                  placeholder="輸入希望 Loading 的時間"
                  value={editRouteState.delayTime}
                  size="sm"
                  onChange={(e) =>
                    setEditRouteState((prev) => ({
                      ...prev,
                      delayTime: e.target.value,
                    }))
                  }
                />
                <Button
                  size="sm"
                  w="86px"
                  colorPalette="blue"
                  onClick={() => onUpdateDelayTime(editRouteState.delayTime)}
                >
                  修改時間
                </Button>
              </Group>
            </Box>
          </Flex>

          {/* Http Status */}
          <Flex>
            <Flex as="label" w="120px" color="gray.500" align="center">
              <Icon mr={2} w="15px">
                <FontAwesomeIcon icon={faGlobe} />
              </Icon>
              <Text>Http Status</Text>
            </Flex>

            <Box>
              <Group w="200px" attached>
                <Input
                  placeholder="輸入 Http Status"
                  value={editRouteState.httpStatus}
                  onChange={(e) =>
                    setEditRouteState((prev) => ({
                      ...prev,
                      httpStatus: e.target.value,
                    }))
                  }
                  size="sm"
                />
                <Button
                  w="86px"
                  size="sm"
                  colorPalette="teal"
                  onClick={() => onUpdateHttpStatus(editRouteState.httpStatus)}
                >
                  修改
                </Button>
              </Group>
            </Box>
          </Flex>

          {/* 狀態 */}
          <Flex>
            <Flex as="label" w="120px" color="gray.500" align="center">
              <Icon mr={2} w="15px">
                <FontAwesomeIcon icon={faToggleOff} />
              </Icon>
              <Text>選擇狀態</Text>
            </Flex>

            <Box>
              <NativeSelect.Root size="sm">
                <NativeSelect.Field
                  placeholder="Select option"
                  defaultValue={route.current}
                  onChange={onUpdateStatus}
                >
                  {route.apis?.map((status: string, key: number) => (
                    <option key={key} value={status}>
                      {status}
                    </option>
                  ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </Box>
          </Flex>

          {/* 是否需要加密 */}
          <Flex>
            <Flex as="label" w="120px" color="gray.500" align="center">
              <Icon mr={2} w="15px">
                <FontAwesomeIcon icon={faToggleOff} />
              </Icon>
              <Text>API 加密</Text>
            </Flex>

            <Box>
              <Switch.Root
                size="sm"
                colorPalette="green"
                checked={editRouteState.isCrypto}
                onCheckedChange={({ checked }) => {
                  setEditRouteState((prev) => ({ ...prev, isCrypto: checked }));
                  onUpdateCrypto(checked);
                }}
              >
                <Switch.HiddenInput />
                <Switch.Control>
                  <Switch.Thumb />
                </Switch.Control>
                <Switch.Label />
              </Switch.Root>
            </Box>
          </Flex>

          <HStack gap={2}>
            {route.apis?.map((status: string, key: number) => (
              <Button
                key={key}
                size="xs"
                onClick={() => onEdit(status, route)}
                className="p-4"
                colorPalette={statusStyle(status)}
              >
                編輯 {status} 內容
              </Button>
            ))}
          </HStack>
        </Stack>
      </Box>
    </>
  );
};

export default ApiItem;
