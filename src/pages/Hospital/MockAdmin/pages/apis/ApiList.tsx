import { memo, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import {
  flattenRoutersMapAtom,
  routersStatusAtom,
} from '@/pages/Hospital/MockAdmin/states/routers/routerAtom';
import { Box, Card, Center, Flex, Heading, IconButton, Separator } from '@chakra-ui/react';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LoadingCard from '@/pages/Hospital/MockAdmin/components/LoadingCard';
import { TocNavbar } from './TocNavbar';
import {
  type RouterApiType,
  type RouterPathType,
} from '@/pages/Hospital/MockAdmin/types/router.type';
import { isPathRouter } from '@/pages/Hospital/MockAdmin/utils/tools';
import ApiEditContextProvider from './ApiEditContext';
import ApiItem from './ApiItem';

const ApiItemMemo = memo(ApiItem, (prevProps, nextProps) => {
  return (
    prevProps.route.delayTime === nextProps.route.delayTime &&
    prevProps.route.httpStatus === nextProps.route.httpStatus &&
    prevProps.route.isCrypto === nextProps.route.isCrypto &&
    prevProps.route.current === nextProps.route.current
  );
});

const ApiBox = ({
  route,
  level = 0,
  parentIds,
}: {
  route: RouterPathType<RouterApiType> | RouterApiType;
  level: number;
  parentIds: string[];
}) => {
  if (isPathRouter(route)) {
    const titleFontSize = () => {
      switch (level) {
        case 0:
          return 'xl';
        case 1:
          return 'lg';
        case 2:
          return 'md';
        default:
          return 'sm';
      }
    };

    const isRootLevel = level === 0;

    return (
      <>
        <Box mb={4}>
          <Heading
            px={4}
            py={3}
            color={isRootLevel ? 'gray.700' : 'blue.700'}
            fontSize={titleFontSize()}
            borderBottomWidth={isRootLevel ? '1px' : undefined}
            borderColor="gray.300"
            bgColor="white"
            position={isRootLevel ? 'sticky' : undefined}
            zIndex="10"
            top={0}
          >
            {level > 0 && '- '}
            {route.title}
          </Heading>

          {route.children.map((subRoute) => (
            <ApiBox
              key={`${subRoute.id}`}
              route={subRoute}
              level={level + 1}
              parentIds={[...parentIds, route.id]}
            />
          ))}
        </Box>
        {isRootLevel && <Separator my={8} />}
      </>
    );
  }

  return <ApiItemMemo route={route} />;
};

const RenderApiList = ({
  apiRoutes,
}: {
  apiRoutes: (RouterPathType<RouterApiType> | RouterApiType)[];
}) => {
  if (apiRoutes.length === 0) {
    return (
      <Center my="250px">
        <Heading>找不到對應的路由 ☠</Heading>
      </Center>
    );
  }
  return (
    <>
      {apiRoutes.map((route) => {
        return <ApiBox route={route} level={0} parentIds={[]} key={route.id} />;
      })}
    </>
  );
};

const ApiList = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const apisStatus = useAtomValue(routersStatusAtom);
  const { apiRouteMap } = useAtomValue(flattenRoutersMapAtom);

  const fileName = searchParams.get('fileName');

  const apiLists = useMemo(() => {
    const data = apisStatus.data || [];

    const list = id ? data.filter((data) => data.id === id) : data;

    if (fileName) {
      const apiRoutes = Array.from(apiRouteMap.values()).filter(
        (apiRoute) => apiRoute.filename === fileName,
      );

      return [...apiRoutes];
    }

    return list;
  }, [id, apisStatus.data, fileName]);

  return (
    <>
      <Box p={4} pb="112px" bgColor="#082f49">
        <Heading px={{ base: 4, md: 10 }} fontSize="sm" color="white">
          API 模擬
        </Heading>
      </Box>
      <Flex mt={-20} mx="auto" w="full" px={{ base: 4, md: 10 }} gap={10}>
        <Card.Root w="full">
          {fileName && (
            <Card.Header>
              <Card.Title>
                <IconButton
                  variant="subtle"
                  rounded="full"
                  aria-label="back"
                  onClick={() => navigate(-1)}
                >
                  <FontAwesomeIcon icon={faAngleLeft} />
                </IconButton>
              </Card.Title>
            </Card.Header>
          )}
          <Card.Body>
            {apisStatus.isLoading ? (
              <LoadingCard />
            ) : (
              <ApiEditContextProvider>
                <RenderApiList apiRoutes={apiLists} />
              </ApiEditContextProvider>
            )}
          </Card.Body>
        </Card.Root>
        <TocNavbar apiLists={apiLists} />
      </Flex>
    </>
  );
};

export default ApiList;
