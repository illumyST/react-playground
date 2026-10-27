import { getApiEncryptedResponse } from '@/pages/Hospital/MockAdmin/apis/apis';
import {
  Box,
  Button,
  Card,
  Field,
  Flex,
  Heading,
  Input,
  Separator,
  Textarea,
} from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

type FormType = {
  route: string;
  publicKey: string;
};
const CryptoPage = () => {
  const [form, setForm] = useState({
    route: '',
    publicKey: '',
  });

  const { data, isPending, error, mutate } = useMutation({
    mutationFn: ({ route, publicKey }: FormType) =>
      getApiEncryptedResponse(route)({ data: { publicKey } }),
  });

  const handleSubmit = () => {
    mutate(form);
  };

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
        🦄🌈✨👋測試加解密🦄🌈✨👋
      </Heading>
      <Flex mt={-20} mx="auto" pb={20} maxW="1000px" h="100vh" px={20} gap={10}>
        <Card.Root w="full">
          <Card.Body>
            <Field.Root my={5} required disabled={isPending}>
              <Field.Label>請輸入要呼叫的 API</Field.Label>
              <Input
                type="text"
                value={form.route}
                // 去除開頭的 /
                onChange={(e) =>
                  setForm({
                    ...form,
                    route: e.target.value.replace(/^[/\s]+/, ''),
                  })
                }
              />
            </Field.Root>
            <Field.Root my={5} required disabled={isPending}>
              <Field.Label>請輸入 Public key</Field.Label>
              <Input
                type="text"
                value={form.publicKey}
                onChange={(e) => setForm({ ...form, publicKey: e.target.value })}
              />
            </Field.Root>

            <Button type="submit" variant="solid" colorPalette="green" onClick={handleSubmit}>
              取得加密內容
            </Button>
            <Separator my={10} />
            <Box my={4}>
              <Textarea readOnly placeholder="加密後的資料" value={JSON.stringify(data || error)} />
            </Box>
          </Card.Body>
        </Card.Root>
      </Flex>
    </Box>
  );
};

export default CryptoPage;
