import { useAtomValue } from 'jotai';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { JsonEditor as Editor } from 'jsoneditor-react';
import * as ace from 'brace';
import 'jsoneditor-react/es/editor.min.css';
import 'brace/mode/json';
import 'brace/theme/monokai';
import { Button, Center, Field, Heading, Separator } from '@chakra-ui/react';
import {
  configStatusAtom,
  updateConfigAtom,
} from '@/pages/Hospital/MockAdmin/states/configs/configAtom';
import { type ConfigApiType, type ConfigType } from '@/pages/Hospital/MockAdmin/types/config.type';
import LoadingCard from '@/pages/Hospital/MockAdmin/components/LoadingCard';
import { toaster } from '@/pages/Hospital/MockAdmin/components/ui/toasterStore';

type FormValues = ConfigType;

const ApiConfig = () => {
  const configStatus = useAtomValue(configStatusAtom);
  const updateConfig = useAtomValue(updateConfigAtom);

  const apiConfigData = configStatus.data?.api || ({} as ConfigApiType);

  const { handleSubmit, setValue } = useForm<FormValues>({
    defaultValues: configStatus.data as ConfigType,
    mode: 'all',
  });

  const handleEditor =
    (type: 'default' | 'success' | 'noData' | 'error' | 'schema') => (data: unknown) => {
      setValue(`api.${type}`, data);
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
      <Heading as="h6" size="md" mt="6" p={3} bgColor="#f1f1f1" borderRadius="lg">
        預設 API Default
      </Heading>

      <Field.Root my={5} required disabled={configStatus.isLoading}>
        <Field.Label>Default Response</Field.Label>
        <Editor
          // 資料處裡
          value={apiConfigData.default}
          onChange={handleEditor('default')}
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

      <Separator py={5} />

      <Heading as="h6" size="md" mt="6" p={3} bgColor="#f1f1f1" borderRadius="lg">
        預設 API Success
      </Heading>

      <Field.Root my={5} required disabled={configStatus.isLoading}>
        <Field.Label>Success Response</Field.Label>
        <Editor
          // 資料處裡
          value={apiConfigData.success}
          onChange={handleEditor('success')}
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

      <Separator py={5} />

      <Heading as="h6" size="md" mt="6" p={3} bgColor="#f1f1f1" borderRadius="lg">
        預設 API NoData
      </Heading>

      <Field.Root my={5} required disabled={configStatus.isLoading}>
        <Field.Label>NoData Response</Field.Label>
        <Editor
          // 資料處裡
          value={apiConfigData.noData}
          onChange={handleEditor('noData')}
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

      <Separator py={5} />

      <Heading as="h6" size="md" mt="6" p={3} bgColor="#f1f1f1" borderRadius="lg">
        預設 API Error
      </Heading>

      <Field.Root my={5} required disabled={configStatus.isLoading}>
        <Field.Label>Error Response</Field.Label>
        <Editor
          // 資料處裡
          value={apiConfigData.error}
          onChange={handleEditor('error')}
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

      <Separator py={5} />

      <Heading as="h6" size="md" mt="6" p={3} bgColor="#f1f1f1" borderRadius="lg">
        預設 API Schema
      </Heading>

      <Field.Root my={5} required disabled={configStatus.isLoading}>
        <Field.Label>Schema Response</Field.Label>
        <Editor
          // 資料處裡
          value={apiConfigData.schema}
          onChange={handleEditor('schema')}
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

      <Separator py={5} />

      <Center>
        <Button type="submit" variant="solid" colorPalette="green">
          更新
        </Button>
      </Center>
    </form>
  );
};

export default ApiConfig;
