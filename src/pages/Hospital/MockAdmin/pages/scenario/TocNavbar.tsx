import { Box, Flex, Link, List, Separator } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';

export const TocNavbar = ({ lists }: { lists: string[] }) => {
  const location = useLocation();
  if (lists.length === 0) {
    return null;
  }

  const hash = location.hash;

  const activeStyle = {
    bgColor: 'teal.600',
    fontWeight: 'bold',
    color: 'white',
    borderRadius: 'md',
  };

  const getStyle = (id: string) => {
    const isActive = decodeURI(hash).replace('#', '') === id;

    return isActive ? activeStyle : {};
  };

  return (
    <Box
      bgColor="white"
      borderRadius="md"
      width={'20%'}
      flexShrink={0}
      display={{ base: 'none', xl: 'block' }}
      position="sticky"
      px={5}
      py={6}
      top={10}
      right={0}
      fontSize="sm"
      alignSelf="start"
      maxHeight="calc(100vh - 8rem)"
      overflowY="auto"
    >
      <Flex justify="space-between">類別索引 (✺ω✺)</Flex>
      <Separator my={3} />
      <List.Root variant="plain">
        {lists.map((item) => (
          <List.Item key={item} my={1}>
            <List.Indicator>🍌</List.Indicator>
            <Link
              href={`#${item}`}
              px={2}
              display="block"
              _hover={activeStyle}
              {...getStyle(item)}
              title={item}
            >
              {item}
            </Link>
          </List.Item>
        ))}
      </List.Root>
    </Box>
  );
};
