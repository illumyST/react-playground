import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  Center,
  createTreeCollection,
  Field,
  Flex,
  Heading,
  IconButton,
  NativeSelect,
  SimpleGrid,
  Stack,
  Text,
  TreeView,
} from '@chakra-ui/react';
import LoadingCard from '@/pages/Hospital/MockAdmin/components/LoadingCard';
import { useAtomValue } from 'jotai';
import {
  flattenRoutersMapAtom,
  routersStatusAtom,
} from '@/pages/Hospital/MockAdmin/states/routers/routerAtom';
import ApiEditContextProvider from './ApiEditContext';
import {
  type RouterApiType,
  type RouterArray,
  type RouterPathType,
} from '@/pages/Hospital/MockAdmin/types/router.type';
import { isPathRouter } from '@/pages/Hospital/MockAdmin/utils/tools';
import {
  faAngleDown,
  faAngleRight,
  faArrowDown,
  faArrowUp,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import ApiItem from './ApiItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Array, Match, Option, pipe } from 'effect';

const ApiTreeViewRoot = ({
  data,
  showApiInfo,
  setShowApiInfo,
  setApiInfo,
  selectedApi,
}: {
  data: RouterArray;
  showApiInfo: 'name' | 'filename' | 'path';
  setShowApiInfo: (value: 'name' | 'filename' | 'path') => void;
  selectedApi: string;
  setApiInfo: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const collection = useMemo(
    () =>
      createTreeCollection<RouterPathType<RouterApiType>>({
        nodeToValue: (node) => node.id,
        nodeToString: (node) => node.title,
        rootNode: {
          id: 'ROOT',
          title: '',
          children: data,
        },
      }),
    [data],
  );

  const [expandedValue, setExpandedValue] = useState<string[]>([]);

  return (
    <Box pos="relative">
      <TreeView.Root
        collection={collection}
        expandedValue={expandedValue}
        onExpandedChange={(e) => setExpandedValue(e.expandedValue)}
      >
        <TreeView.Label pos="sticky" top={0} bgColor="white" pt={10} zIndex={10}>
          <Field.Root>
            <Field.Label>顯示 API 資訊</Field.Label>
            <NativeSelect.Root>
              <NativeSelect.Field
                value={showApiInfo}
                onChange={(e) =>
                  setShowApiInfo(e.currentTarget.value as 'name' | 'filename' | 'path')
                }
              >
                <option value="name">API 名稱</option>
                <option value="filename">API 檔名</option>
                <option value="path">API 路徑</option>
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Field.Root>
          <Stack direction="row" mt={4} justify="flex-end">
            <Button
              size="sm"
              colorPalette="green"
              onClick={() => {
                if (expandedValue.length > 0) {
                  setExpandedValue([]);
                } else {
                  setExpandedValue(collection.getBranchValues());
                }
              }}
            >
              {expandedValue.length > 0 ? '全部收起' : '全部展開'}
            </Button>
            <IconButton
              size="sm"
              variant="subtle"
              disabled={!selectedApi}
              onClick={() => {
                document
                  .getElementById(selectedApi)
                  ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
              aria-label="edit page"
            >
              <FontAwesomeIcon icon={faArrowDown} />
            </IconButton>
          </Stack>
        </TreeView.Label>
        <TreeView.Tree>
          <TreeView.Node<RouterPathType<RouterApiType> | RouterApiType>
            indentGuide={<TreeView.BranchIndentGuide />}
            render={({ node, nodeState }) => {
              if (isPathRouter(node)) {
                return (
                  <TreeView.BranchControl color="teal.800">
                    <FontAwesomeIcon icon={nodeState.expanded ? faAngleDown : faAngleRight} />
                    <TreeView.BranchText fontSize="md" fontWeight="bold">
                      {node.title}
                    </TreeView.BranchText>
                  </TreeView.BranchControl>
                );
              }

              const value = Match.value(showApiInfo).pipe(
                Match.when('name', () => node.title),
                Match.when('filename', () => node.filename),
                Match.when('path', () => node.url),
                Match.exhaustive,
              );

              const fullPath = pipe(
                Array.init(nodeState.valuePath),
                Option.getOrElse(() => []),
                Array.append(node.filename),
                Array.join('/'),
              );

              return (
                <TreeView.Item
                  onClick={() => {
                    setApiInfo(fullPath);
                  }}
                >
                  <TreeView.ItemText w="full" id={fullPath}>
                    <Text ml={2}>{value}</Text>
                  </TreeView.ItemText>

                  {selectedApi === fullPath && <FontAwesomeIcon icon={faCheck} />}
                </TreeView.Item>
              );
            }}
          />
        </TreeView.Tree>
      </TreeView.Root>
      <Flex justify="flex-end" pos="sticky" bottom={0} py={4}>
        <IconButton
          size="sm"
          variant="subtle"
          pos="sticky"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          aria-label="edit page"
        >
          <FontAwesomeIcon icon={faArrowUp} />
        </IconButton>
      </Flex>
    </Box>
  );
};

const ApiSearchPage = () => {
  const apisStatus = useAtomValue(routersStatusAtom);

  const { apiRouteMap } = useAtomValue(flattenRoutersMapAtom);

  const [showApiInfo, setShowApiInfo] = useState<'name' | 'filename' | 'path'>('name');

  const [selectedApi, setSelectedApi] = useState<string>('');

  const apiList = useMemo(() => {
    if (apisStatus.isSuccess && apisStatus.data) {
      return apisStatus.data;
    }
    return [];
  }, [apisStatus]);

  const apiItem = useMemo(() => {
    const findApi = apiRouteMap.get(selectedApi);
    if (findApi) {
      return findApi;
    }
    return undefined;
  }, [apiRouteMap, selectedApi]);

  return (
    <>
      <Box p={4} pb="112px" bgColor="#082f49">
        <Heading px={{ base: 4, md: 10 }} fontSize="sm" color="white">
          API 模擬
        </Heading>
      </Box>
      <Flex mt={-20} mx="auto" w="full" h="full" px={{ base: 4, md: 10 }} gap={10}>
        <Card.Root w="full" h="full">
          <Card.Body h="full">
            {apisStatus.isLoading ? (
              <LoadingCard />
            ) : (
              <ApiEditContextProvider>
                <SimpleGrid columns={{ base: 1, lg: 2 }} gap={4}>
                  <ApiTreeViewRoot
                    selectedApi={selectedApi}
                    data={apiList}
                    showApiInfo={showApiInfo}
                    setShowApiInfo={setShowApiInfo}
                    setApiInfo={setSelectedApi}
                  />

                  <Box>
                    <Box pos="sticky" top={10}>
                      {apiItem ? (
                        <ApiItem route={apiItem} />
                      ) : (
                        <Center>
                          <Text>請選擇 API</Text>
                        </Center>
                      )}
                    </Box>
                  </Box>
                </SimpleGrid>
              </ApiEditContextProvider>
            )}
          </Card.Body>
        </Card.Root>
      </Flex>
    </>
  );
};

export default ApiSearchPage;
