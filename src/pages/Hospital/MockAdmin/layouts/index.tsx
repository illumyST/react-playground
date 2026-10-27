import { ChakraProvider, Flex } from '@chakra-ui/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/pages/Hospital/MockAdmin/components/ui/toaster';
import queryClient from '@/pages/Hospital/MockAdmin/queryClient';
import { MOCK_ADMIN_SCOPE_CLASS, system } from '@/pages/Hospital/MockAdmin/theme';
import Sidebar from './Sidebar';
import Content from './Content';

// ChakraProvider 只包在 /hospital/mock-admin 範圍內，搭配 theme 的 scope class 隔離樣式。
const Layouts = () => {
  return (
    <ChakraProvider value={system}>
      <QueryClientProvider client={queryClient}>
        <Flex
          className={MOCK_ADMIN_SCOPE_CLASS}
          borderWidth="1px"
          borderColor="gray.200"
          borderRadius="md"
          overflow="hidden"
          minH="calc(100dvh - 48px)"
        >
          <Sidebar />
          <Content />
        </Flex>
        <Toaster />
      </QueryClientProvider>
    </ChakraProvider>
  );
};

export default Layouts;
