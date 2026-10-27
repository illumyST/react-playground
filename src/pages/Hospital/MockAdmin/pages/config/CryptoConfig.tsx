import { useAtomValue } from 'jotai';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { JsonEditor as Editor } from 'jsoneditor-react';
import * as ace from 'brace';
import 'jsoneditor-react/es/editor.min.css';
import 'brace/mode/json';
import 'brace/theme/monokai';
import {
  Box,
  Button,
  Center,
  Field,
  Heading,
  Input,
  Separator,
  Stack,
  Switch,
} from '@chakra-ui/react';
import {
  configStatusAtom,
  updateConfigAtom,
} from '@/pages/Hospital/MockAdmin/states/configs/configAtom';
import {
  type ConfigCryptoType,
  type ConfigType,
} from '@/pages/Hospital/MockAdmin/types/config.type';
import LoadingCard from '@/pages/Hospital/MockAdmin/components/LoadingCard';
import { toaster } from '@/pages/Hospital/MockAdmin/components/ui/toasterStore';

type FormValues = ConfigType;

const CryptoConfig = () => {
  const configStatus = useAtomValue(configStatusAtom);
  const updateConfig = useAtomValue(updateConfigAtom);

  const cryptoData = configStatus.data?.crypto || ({} as ConfigCryptoType);

  const { register, handleSubmit, setValue, control } = useForm<FormValues>({
    defaultValues: configStatus.data as ConfigType,
    mode: 'all',
  });

  const handleEditor = (data: FormValues['crypto']['publicKeyApi']['response']) => {
    setValue('crypto.publicKeyApi.response', data);
  };

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    updateConfig
      .mutateAsync(data)
      .then(() =>
        toaster.create({
          title: '更新成功',
          description: `已更新`,
          type: 'success',
          closable: true,
        }),
      )
      .catch(() =>
        toaster.create({
          title: '更新失敗',
          description: `無法更新`,
          type: 'error',
          closable: true,
        }),
      );
  };

  if (configStatus.isError) return null;

  if (configStatus.isLoading) return <LoadingCard />;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Heading as="h6" size="md" my="6" p={3} bgColor="#f1f1f1" borderRadius="lg">
        加密設定
      </Heading>

      <Stack spaceY={4}>
        <Field.Root required disabled={configStatus.isLoading}>
          <Field.Label>NamedCurve</Field.Label>
          <Input
            type="text"
            {...register('crypto.namedCurve', {
              required: 'Crypto > namedCurve為必填項目',
            })}
          />
          <Field.HelperText>☺ 此欄位是指定演算化的曲線名稱 「P-384 | P-256」</Field.HelperText>
        </Field.Root>

        <Field.Root required disabled={configStatus.isLoading}>
          <Field.Label>Request Header PublicKey Name</Field.Label>
          <Input
            type="text"
            {...register('crypto.request.header.publicKey', {
              required: '此欄為必填項目',
            })}
          />
          <Field.HelperText>☺ 設定專案需要被加密的 API 所需的 Request Header</Field.HelperText>
        </Field.Root>

        <Field.Root required disabled={configStatus.isLoading}>
          <Field.Label>Request Header Version Name</Field.Label>
          <Input
            type="text"
            {...register('crypto.request.header.version', {
              required: '此欄為必填項目',
            })}
          />
          <Field.HelperText>☺ 設定專案需要被加密的 API 所需的 Request Header</Field.HelperText>
        </Field.Root>

        <Field.Root disabled={configStatus.isLoading}>
          <Field.Label>Crypto API Response 需要被加密的指定欄位</Field.Label>
          <Input type="text" {...register('crypto.response.needCryptoColumn')} />
          <Field.HelperText>
            ☺ 設定專案需要被加密的 API 需要被加密的回傳欄位，可使用巢狀表示 e.g
            &quot;tranrs&quot;，空值為所有都要被加密
          </Field.HelperText>
        </Field.Root>

        <Field.Root required disabled={configStatus.isLoading}>
          <Field.Label>Crypto API Response 指定回傳欄位</Field.Label>
          <Input
            type="text"
            {...register('crypto.response.cryptoColumn', {
              required: '此欄為必填項目',
            })}
          />
          <Field.HelperText>
            ☺ 設定專案需要被加密的 API 加密後回傳欄位，可使用巢狀表示 e.g &quot;body.content&quot;
          </Field.HelperText>
        </Field.Root>

        <Controller
          control={control}
          name={'crypto.response.replaceAll'}
          render={({ field, fieldState }) => {
            return (
              <Field.Root my={5} disabled={configStatus.isLoading} invalid={fieldState.invalid}>
                <Field.Label>是否只顯示 Response 指定回傳欄位</Field.Label>
                <Switch.Root
                  colorPalette="green"
                  size="sm"
                  checked={field.value}
                  name={field.name}
                  onCheckedChange={({ checked }) => field.onChange(checked)}
                >
                  <Switch.HiddenInput onBlur={field.onBlur} />
                  <Switch.Control>
                    <Switch.Thumb />
                  </Switch.Control>
                  <Switch.Label />
                </Switch.Root>

                <Field.HelperText>
                  ☺ 設定開啟後，會將只顯示 Response 指定回傳欄位，否則只會針對指定的欄位做取代
                </Field.HelperText>
              </Field.Root>
            );
          }}
        />
      </Stack>

      <Separator my={6} />

      <Heading as="h6" size="md" my="6" p={3} bgColor="#f1f1f1" borderRadius="lg">
        PublicKey API 設定
      </Heading>

      <Stack spaceY={4}>
        <Field.Root required disabled={configStatus.isLoading}>
          <Field.Label>PublicKey API 網址</Field.Label>
          <Input
            type="text"
            {...register('crypto.publicKeyApi.url', {
              required: '此欄為必填項目',
            })}
          />
          <Field.HelperText>
            ☺ 與後端取得 PublicKey 的 API，例如︰/api/Auth/GetCathayPublicKey
          </Field.HelperText>
        </Field.Root>

        <Field.Root required disabled={configStatus.isLoading}>
          <Field.Label>PublicKey Response 指定欄位</Field.Label>
          <Input
            type="text"
            {...register('crypto.publicKeyApi.publicKeyColumn', {
              required: '此欄為必填項目',
            })}
          />
          <Field.HelperText>
            ☺ 此欄位是根據以下
            <Box as="span" color="orange" fontWeight="bold">
              「PublicKey Response 下行」
            </Box>
            的key為主，可使用巢狀表示 e.g &quot;tranrs.publicKey&quot;
          </Field.HelperText>
        </Field.Root>

        <Field.Root required disabled={configStatus.isLoading}>
          <Field.Label>PublicKey Response 下行</Field.Label>
          <Editor
            // 資料處裡
            value={cryptoData.publicKeyApi?.response}
            onChange={handleEditor}
            // 樣式設定
            mode={Editor.modes.code}
            ace={ace}
            theme="ace/theme/monokai"
            schema={{ height: '300px' }}
            htmlElementProps={{
              style: { height: '300px', marginBottom: '12px', width: '100%' },
            }}
          />
        </Field.Root>
      </Stack>

      <Separator my={6} />

      <Center>
        <Button type="submit" variant="solid" colorPalette="green">
          更新
        </Button>
      </Center>
    </form>
  );
};

export default CryptoConfig;
