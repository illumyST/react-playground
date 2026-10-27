import { flattenRoutersMapAtom } from '@/pages/Hospital/MockAdmin/states/routers/routerAtom';
import { Box, Heading, SimpleGrid } from '@chakra-ui/react';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import ApiEditMainControl from './ApiEditControl';
import ApiHistoryControl from './ApiHistoryControl';

const ApiEditMainContent = () => {
  const { '*': splat } = useParams();
  const { apiRouteMap } = useAtomValue(flattenRoutersMapAtom);

  const { parents, path } = useMemo(() => {
    const path = splat ? splat.split('/') : [];

    return {
      path,
      parents: path.slice(0, -1),
    };
  }, [splat]);

  const apiRoute = useMemo(() => {
    return apiRouteMap.get(path.join('/'));
  }, [path, apiRouteMap]);

  if (apiRoute === undefined) {
    return null;
  }

  return (
    <SimpleGrid columns={2} gap={5}>
      <ApiEditMainControl apiRoute={apiRoute} />
      <ApiHistoryControl apiRoute={apiRoute} parents={parents} />
    </SimpleGrid>
  );
};

const ApiEditPage = () => {
  return (
    <>
      <Box p={4} pb={28} bgColor="cyan.900">
        <Heading color="white" px={{ base: 4, md: 10 }} fontSize="sm">
          API 模擬
        </Heading>
      </Box>
      <Box mt={-20} px={{ base: 4, md: 10 }}>
        <ApiEditMainContent />
      </Box>
    </>
  );
};

export default ApiEditPage;
