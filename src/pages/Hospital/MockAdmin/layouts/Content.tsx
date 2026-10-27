import { Outlet } from 'react-router-dom';
import { Box } from '@chakra-ui/react';

const Content = () => {
  return (
    <Box bgColor="gray.100" flex="1" minW={0}>
      <Outlet />
    </Box>
  );
};

export default Content;
