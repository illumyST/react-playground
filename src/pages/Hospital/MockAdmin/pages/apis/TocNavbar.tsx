import {
  type RouterApiType,
  type RouterPathType,
} from '@/pages/Hospital/MockAdmin/types/router.type';
import { getLastFragment, isApiRouter } from '@/pages/Hospital/MockAdmin/utils/tools';
import { Box, Flex, Link, List, Separator, Switch } from '@chakra-ui/react';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

const generateText = (api: RouterApiType) => ({
  text: `${api.title}`,
  id: getLastFragment(api),
  keyId: api.url,
});

const getApiLists = (
  lists: (RouterPathType<RouterApiType> | RouterApiType)[],
): { text: string; id: string; keyId: string }[] => {
  return lists
    .map((item) => {
      if (isApiRouter(item)) {
        return generateText(item);
      }

      return getApiLists(item.children);
    })
    .flat();
};

export const TocNavbar = ({
  apiLists,
}: {
  apiLists: (RouterPathType<RouterApiType> | RouterApiType)[];
}) => {
  const [showIdOrName, setShowIdOrName] = useState(false);
  const location = useLocation();
  if (apiLists.length === 0) {
    return null;
  }
  const lists = getApiLists(apiLists);

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
      width="1/4"
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
      <Flex justify="space-between">
        顯示 API 名稱或 ID (✺ω✺)
        <Switch.Root
          colorPalette="cyan"
          onCheckedChange={({ checked }) => setShowIdOrName(checked)}
          checked={showIdOrName}
        >
          <Switch.HiddenInput />
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
        </Switch.Root>
      </Flex>
      <Separator my={3} />
      <List.Root variant="plain">
        {lists.map((item) => {
          return (
            <List.Item key={item.keyId} my={1}>
              <List.Indicator>🍌</List.Indicator>
              <Link
                href={`#${item.id}`}
                px={2}
                display="block"
                _hover={activeStyle}
                {...getStyle(item.id)}
                title={showIdOrName ? item.text : item.id}
              >
                {showIdOrName ? item.id : item.text}
              </Link>
            </List.Item>
          );
        })}
      </List.Root>
    </Box>
  );
};
