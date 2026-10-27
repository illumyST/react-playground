import { Box, Container, Heading, Link, Text, VStack } from '@chakra-ui/react';
import { CodeBlock, obsidian } from 'react-code-blocks';
import data from '../../examples.json';

type CardItemProps = {
  title: string;
  url?: string;
  urlTitle?: string;
  desc?: string;
  options?: object;
  example: object;
  result: object;
};

const CardItem = ({ url, urlTitle, title, desc, example, result, options }: CardItemProps) => {
  return (
    <Box bg="white" p={5} shadow="md" borderRadius="md" mb={4}>
      <VStack align="start" gap={4}>
        <Heading size="md">
          {url ? (
            <Link href={url} color="teal.500">
              {urlTitle}
            </Link>
          ) : null}
          - {title}
        </Heading>
        {desc && <Text fontSize="md">{desc}</Text>}
        {options && (
          <Box w="full">
            <Text fontSize="lg" mb={2}>
              Option 可選參數說明:
            </Text>
            <CodeBlock
              text={JSON.stringify(options, null, 4)}
              language="json"
              showLineNumbers
              theme={obsidian}
            />
          </Box>
        )}
        <Box w="full">
          <Text fontSize="lg" mb={2}>
            Example:
          </Text>
          <CodeBlock
            text={JSON.stringify(example, null, 4)}
            language="javascript"
            showLineNumbers
            theme={obsidian}
          />
        </Box>
        <Box w="full">
          <Text fontSize="lg" mb={2}>
            Result:
          </Text>
          <CodeBlock
            text={JSON.stringify(result, null, 4)}
            language="javascript"
            showLineNumbers
            theme={obsidian}
          />
        </Box>
      </VStack>
    </Box>
  );
};

const ExamplePage = () => {
  return (
    <>
      <Box bg="gray.800" p={4} pb={28} color="white">
        <Container maxW="container.lg">
          <Heading size="sm">API Schema Example</Heading>
        </Container>
      </Box>
      <Container maxW="container.lg" mt={-20} p={4}>
        <Box bg="white" shadow="md" borderRadius="md" p={4}>
          <Heading size="md" borderBottom="1px" borderColor="gray.200" pb={2} mb={4}>
            Api Schema 產生 Json 用法說明
          </Heading>
          {data.map((item) => (
            <CardItem key={item.title} {...item} />
          ))}
        </Box>
      </Container>
    </>
  );
};

export default ExamplePage;
