import { Box, Center, Heading, Spinner } from '@chakra-ui/react';

import { useAtomValue } from 'jotai';
import { scenariosStatusAtom } from '@/pages/Hospital/MockAdmin/states/scenarios/scenarioAtom';
import ScenarioContent from './ScenarioContent';
import ScenarioControlProvider from './ScenarioControlContext';

const ScenarioPage = () => {
  const scenarioStatus = useAtomValue(scenariosStatusAtom);

  if (scenarioStatus.isLoading) {
    return (
      <Box w="full" h="100dvh">
        <Center h="full">
          <Spinner size="lg" />
        </Center>
      </Box>
    );
  }
  if (scenarioStatus.isError) {
    return (
      <Box w="full" h="100dvh">
        <Center h="full">
          <Heading>Error !!</Heading>
        </Center>
      </Box>
    );
  }

  return (
    <ScenarioControlProvider>
      <ScenarioContent data={scenarioStatus.data || []} />
    </ScenarioControlProvider>
  );
};

export default ScenarioPage;
