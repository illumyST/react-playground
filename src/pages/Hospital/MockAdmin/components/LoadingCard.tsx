import { Card, Center, Spinner } from '@chakra-ui/react';

const LoadingCard = () => (
  <Card.Root w="full">
    <Card.Body>
      <Center>
        <Spinner color="blue.500" size="xl" />
      </Center>
    </Card.Body>
  </Card.Root>
);

export default LoadingCard;
