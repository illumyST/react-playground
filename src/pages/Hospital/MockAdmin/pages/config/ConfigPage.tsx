import { Box, Card, Flex, Heading, Tabs } from '@chakra-ui/react';

import AppConfig from '@/pages/Hospital/MockAdmin/pages/config/AppConfig';
import CryptoConfig from '@/pages/Hospital/MockAdmin/pages/config/CryptoConfig';
import ApiConfig from '@/pages/Hospital/MockAdmin/pages/config/ApiConfig';

const ConfigPage = () => {
  return (
    <Box>
      <Heading
        bgColor="#082f49"
        px={14}
        pt={4}
        pb={28}
        color="white"
        fontSize="base"
        textAlign="center"
      >
        設定
      </Heading>
      <Flex mt={-20} mx="auto" pb={20} maxW="1000px" minH="100vh" px={20} gap={10}>
        <Card.Root w="full">
          <Card.Body>
            <Tabs.Root defaultValue="0">
              <Tabs.List>
                <Tabs.Trigger value={'0'}>基本設定</Tabs.Trigger>
                <Tabs.Trigger value={'1'}>Crypto</Tabs.Trigger>
                <Tabs.Trigger value={'2'}>API</Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content value="0">
                <AppConfig />
              </Tabs.Content>
              <Tabs.Content value="1">
                <CryptoConfig />
              </Tabs.Content>
              <Tabs.Content value="2">
                <ApiConfig />
              </Tabs.Content>
            </Tabs.Root>
          </Card.Body>
        </Card.Root>
      </Flex>
    </Box>
  );
};

export default ConfigPage;
