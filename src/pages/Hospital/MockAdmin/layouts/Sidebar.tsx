import { useAtomValue } from 'jotai';
import { NavLink, Link as RouterLink } from 'react-router-dom';
import { routersStatusAtom } from '@/pages/Hospital/MockAdmin/states/routers/routerAtom';
import { faBarsStaggered, faList, faTable } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Heading, Link, Separator, Stack, Text, VStack } from '@chakra-ui/react';
import { configStatusAtom } from '@/pages/Hospital/MockAdmin/states/configs/configAtom';
import { MOCK_ADMIN_BASE } from '@/pages/Hospital/MockAdmin/constants';

const Sidebar = () => {
  const routersStatus = useAtomValue(routersStatusAtom);
  const routers = routersStatus.data || [];

  const configStatus = useAtomValue(configStatusAtom);

  return (
    <Box
      as="aside"
      position="sticky"
      top={0}
      alignSelf="flex-start"
      flexShrink={0}
      w="240px"
      maxH="calc(100dvh - 48px)"
      bg="white"
      borderRightWidth="1px"
      borderColor="gray.200"
      aria-label="Mock admin sidebar"
    >
      <Box maxH="calc(100dvh - 48px)" overflowY="auto" px={6} py={4}>
        <Link mb={5} py={4} asChild>
          <RouterLink to={MOCK_ADMIN_BASE}>
            <Text fontSize="md" whiteSpace="nowrap" fontWeight="bold">
              {configStatus.data?.projectName || ''} 模擬 API
            </Text>
          </RouterLink>
        </Link>

        <Separator />

        <VStack
          as="ul"
          spaceY={4}
          fontSize="sm"
          fontWeight="bold"
          color="teal.900"
          separator={<Separator borderColor="gray.200" />}
          align="stretch"
        >
          <Box>
            <Heading fontSize="sm" minW="full" py={4}>
              Config
            </Heading>
            <Link asChild focusRing="none">
              <NavLink to={`${MOCK_ADMIN_BASE}/configs`}>
                {({ isActive }) => (
                  <>
                    <Text>🦄</Text>
                    <Text ml={3} whiteSpace="nowrap" color={isActive ? 'teal.600' : undefined}>
                      系統設定
                    </Text>
                  </>
                )}
              </NavLink>
            </Link>
          </Box>

          <Stack spaceY={4}>
            <Heading fontSize="sm">Admin Router Pages</Heading>
            <Link asChild focusRing="none">
              <NavLink to={`${MOCK_ADMIN_BASE}/routers`}>
                {({ isActive }) => (
                  <>
                    <FontAwesomeIcon icon={faList} />
                    <Text ml={3} whiteSpace="nowrap" color={isActive ? 'teal.600' : undefined}>
                      Router 管理
                    </Text>
                  </>
                )}
              </NavLink>
            </Link>
          </Stack>

          <Stack spaceY={4}>
            <Heading fontSize="sm">Scenario Switch Pages</Heading>
            <Link asChild focusRing="none">
              <NavLink to={`${MOCK_ADMIN_BASE}/scenario`}>
                {({ isActive }) => (
                  <>
                    <FontAwesomeIcon icon={faList} />
                    <Text ml={3} whiteSpace="nowrap" color={isActive ? 'teal.600' : undefined}>
                      複合情境切換
                    </Text>
                  </>
                )}
              </NavLink>
            </Link>
          </Stack>

          <Stack gap={2}>
            <Heading fontSize="sm" py={4} minW="full">
              Admin Api Pages
            </Heading>
            <Link asChild mb={4} focusRing="none" color="green.700">
              <NavLink to={MOCK_ADMIN_BASE} end>
                <FontAwesomeIcon icon={faBarsStaggered} />
                <Text as="span" ml={2} whiteSpace="nowrap">
                  Overview
                </Text>
              </NavLink>
            </Link>

            <Stack as="ul" spaceY={4}>
              {routersStatus.isSuccess &&
                routers.map((router) => (
                  <Box ml={3} as="li" key={router.id}>
                    <Link asChild focusRing="none">
                      <NavLink to={`${MOCK_ADMIN_BASE}/apis/${router.id}`}>
                        {({ isActive }) => (
                          <Text whiteSpace="nowrap" color={isActive ? 'teal.600' : undefined}>
                            {router.title}
                          </Text>
                        )}
                      </NavLink>
                    </Link>
                  </Box>
                ))}
            </Stack>

            <Link asChild mt={4} focusRing="none" color="cyan.700">
              <NavLink to={`${MOCK_ADMIN_BASE}/apis`} end>
                <FontAwesomeIcon icon={faTable} />
                <Text as="span" ml={3} whiteSpace="nowrap">
                  全部 API
                </Text>
              </NavLink>
            </Link>
          </Stack>
        </VStack>
        <Separator mt={6} />
        <Link asChild>
          <RouterLink to={`${MOCK_ADMIN_BASE}/examples`}>
            <Text as="span" py={4} mb={5} fontWeight="bold" whiteSpace="nowrap">
              Api Schema Example
            </Text>
          </RouterLink>
        </Link>
      </Box>
    </Box>
  );
};

export default Sidebar;
