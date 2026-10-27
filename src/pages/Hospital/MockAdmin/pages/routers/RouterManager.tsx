import {
  type RouterApiType,
  type RouterArray,
  type RouterPathType,
} from '@/pages/Hospital/MockAdmin/types/router.type';
import {
  Box,
  Breadcrumb,
  Button,
  Card,
  Flex,
  Heading,
  IconButton,
  Link,
  Spacer,
  Stack,
  Table,
  Text,
} from '@chakra-ui/react';
import { type PropsWithChildren, useMemo } from 'react';
import { isPathRouter } from '@/pages/Hospital/MockAdmin/utils/tools';
import RouterDeleteModal from './RouterDeleteModal';
import RouterCreateApiModal from './RouterCreateApiModal';
import RouterCreatePathModal from './RouterCreatePathModal';
import RouterEditApiModal from './RouterEditApiModal';
import RouterEditPathModal from './RouterEditPathModal';
import { useAtomValue } from 'jotai';
import LoadingCard from '@/pages/Hospital/MockAdmin/components/LoadingCard';
import {
  flattenRoutersMapAtom,
  routersStatusAtom,
} from '@/pages/Hospital/MockAdmin/states/routers/routerAtom';
import { last } from 'lodash/fp';
import { Link as ReactRouterLink, useNavigate, useParams } from 'react-router-dom';
import { faArrowLeft, faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MOCK_ADMIN_BASE } from '@/pages/Hospital/MockAdmin/constants';
const BASE_URL = `${MOCK_ADMIN_BASE}/routers`;

interface RouterRowProps {
  route: RouterApiType | RouterPathType<RouterApiType>;
  parentTitles?: string[];
  parentIds: string[];
  apiUrlSet: Set<string>;
  apiFileNameSet: Set<string>;
  routerIdSet: Set<string>;
  onNavigate: (path: string) => void;
}

const RouterRow = ({
  route,
  parentIds,
  parentTitles,
  apiUrlSet,
  apiFileNameSet,
  routerIdSet,
  onNavigate,
}: RouterRowProps) => {
  if (isPathRouter(route)) {
    return (
      <Table.Row>
        <Table.Cell w="50px">
          <RouterEditPathModal
            parentTitles={parentTitles}
            router={route}
            parentIds={parentIds}
            routerIdSet={routerIdSet}
          />
        </Table.Cell>
        <Table.Cell colSpan={2}>
          <Button
            as={Link}
            variant="plain"
            size="sm"
            onClick={() => onNavigate(route.id)}
            color="black"
          >
            {route.title || route.id}
          </Button>
        </Table.Cell>

        <Table.Cell w="50px">
          <RouterDeleteModal router={route} parentIds={parentIds} />
        </Table.Cell>
      </Table.Row>
    );
  }

  return (
    <Table.Row>
      <Table.Cell w="50px">
        <RouterEditApiModal
          parentTitles={parentTitles}
          router={route}
          parentIds={parentIds}
          apiFilenameSet={apiFileNameSet}
          apiUrlSet={apiUrlSet}
        />
      </Table.Cell>
      <Table.Cell>
        <Link asChild>
          <ReactRouterLink
            to={
              [`${MOCK_ADMIN_BASE}/apis`, ...parentIds.slice(0, 1)].join('/') +
              `?fileName=${route.filename}`
            }
          >
            {route.title} <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
          </ReactRouterLink>
        </Link>
      </Table.Cell>
      <Table.Cell>
        <Text>{route.url}</Text>
      </Table.Cell>
      <Table.Cell w="50px">
        <RouterDeleteModal router={route} parentIds={parentIds} />
      </Table.Cell>
    </Table.Row>
  );
};

interface RouterManagerProps {
  routes: RouterArray;
}

const RouterManager = (props: RouterManagerProps) => {
  const { routes } = props;
  const { '*': splat } = useParams();
  const navigate = useNavigate();
  const { apiRouteMap, pathRouteMap } = useAtomValue(flattenRoutersMapAtom);

  const path = useMemo(() => (splat ? splat.split('/') : []), [splat]);

  const { apiUrlSet, apiFileNameSet, routerIdSet } = useMemo(() => {
    const apiUrlSet = new Set<string>();
    const apiFileNameSet = new Set<string>();

    const routerIdSet = new Set<string>(Array.from(pathRouteMap.values(), ({ id }) => id));

    for (const apiRoute of apiRouteMap.values()) {
      apiUrlSet.add(apiRoute.url);
      apiFileNameSet.add(apiRoute.filename);
    }

    return { apiUrlSet, apiFileNameSet, routerIdSet };
  }, [apiRouteMap, pathRouteMap]);

  const { matchRoutersList, pathInfo } = useMemo(() => {
    if (path.length === 0) {
      return { pathInfo: [], matchRoutersList: routes };
    }

    let currentLevel: RouterArray | undefined = routes;

    const pathInfo: RouterPathType<RouterApiType>[] = [];

    for (const p of path) {
      const route: RouterApiType | RouterPathType<RouterApiType> | undefined = currentLevel?.find(
        ({ id }) => id === p,
      );
      if (route && isPathRouter(route)) {
        pathInfo.push(route);
        currentLevel = route?.children;
      } else {
        currentLevel = undefined;
      }
    }

    return { pathInfo, matchRoutersList: currentLevel };
  }, [routes, path]);

  const parentInfo = last(pathInfo);
  const parentId = parentInfo?.id;
  const parentTitle = parentInfo?.title || 'Root';
  const parentTitles = pathInfo.map(({ title }) => title);
  const parentIds = pathInfo.map(({ id }) => id);

  const handleNavigatePath = (id: string) => {
    navigate([BASE_URL, ...path, id].filter((s) => !!s).join('/'));
  };

  const handleBack = () => {
    const newPath = [BASE_URL, ...path.slice(0, Math.max(path.length - 1, 0))]
      .filter((s) => !!s)
      .join('/');
    navigate(newPath);
  };

  if (matchRoutersList === undefined) {
    return (
      <Card.Root>
        <Card.Body>
          <Stack align="center" gap={10}>
            <Heading size="lg">找不到路由</Heading>
            <Button colorPalette="blue" onClick={() => navigate(BASE_URL)}>
              回首頁
            </Button>
          </Stack>
        </Card.Body>
      </Card.Root>
    );
  }

  return (
    <Card.Root>
      <Card.Header>
        <Stack direction="row" gap={5} align="center">
          <IconButton
            aria-label="arrow-left"
            colorPalette="blue"
            rounded="full"
            disabled={path.length === 0}
            size="sm"
            onClick={handleBack}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </IconButton>

          {pathInfo.length > 0 && (
            <Breadcrumb.Root fontWeight="medium" fontSize="sm">
              <Breadcrumb.List>
                <Breadcrumb.Item>
                  <Breadcrumb.Link as="button" onClick={() => navigate(BASE_URL)}>
                    Root
                  </Breadcrumb.Link>
                </Breadcrumb.Item>
                {pathInfo.map((p, index) => {
                  return (
                    <>
                      <Breadcrumb.Separator />
                      <Breadcrumb.Item key={p.id}>
                        <Breadcrumb.Link
                          as="button"
                          onClick={() =>
                            navigate(
                              [BASE_URL, ...pathInfo.slice(0, index + 1).map(({ id }) => id)].join(
                                '/',
                              ),
                            )
                          }
                        >
                          {p.title}
                        </Breadcrumb.Link>
                      </Breadcrumb.Item>
                    </>
                  );
                })}
              </Breadcrumb.List>
            </Breadcrumb.Root>
          )}
        </Stack>
      </Card.Header>
      <Card.Body>
        <Flex align="center" mb={8}>
          <Heading fontWeight="bold" fontSize="lg">
            {parentTitle}
          </Heading>
          <Spacer />
          <Stack direction="row">
            <RouterCreatePathModal
              routerIdSet={routerIdSet}
              parentId={parentId}
              parentTitles={parentTitles}
              parentIds={parentIds}
            />
            <RouterCreateApiModal
              apiFilenameSet={apiFileNameSet}
              apiUrlSet={apiUrlSet}
              parentId={parentId}
              parentTitles={parentTitles}
              parentIds={parentIds}
            />
          </Stack>
        </Flex>

        <Table.Root size="md">
          <Table.Body>
            {matchRoutersList.map((route) => (
              <RouterRow
                key={route.id}
                route={route}
                apiFileNameSet={apiFileNameSet}
                apiUrlSet={apiUrlSet}
                routerIdSet={routerIdSet}
                parentIds={parentIds}
                parentTitles={parentTitles}
                onNavigate={handleNavigatePath}
              />
            ))}
          </Table.Body>
        </Table.Root>
      </Card.Body>
    </Card.Root>
  );
};

const RouterManagerApiContainer = () => {
  const routersStatus = useAtomValue(routersStatusAtom);
  const routerData = routersStatus.data;

  if (routersStatus.isLoading) {
    return <LoadingCard />;
  }

  if (routersStatus.isError) {
    return null;
  }

  return <RouterManager routes={routerData || []} />;
};

const RouterManagerContainer = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Box bgColor="#082f49" p={4} pb="112px" color="white">
        <Heading px={{ base: 4, md: 10 }} fontSize="md">
          Router 管理
        </Heading>
      </Box>
      <Box px={{ base: 4, md: 10 }} mt={-20} mx="auto" w="full">
        <Box w="full" overflow="hidden" mb="6" px="4">
          {children}
        </Box>
      </Box>
    </>
  );
};

export default function RouterWrap() {
  return (
    <RouterManagerContainer>
      <RouterManagerApiContainer />
    </RouterManagerContainer>
  );
}
