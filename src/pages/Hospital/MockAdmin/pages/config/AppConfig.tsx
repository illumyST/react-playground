import { useAtomValue } from 'jotai';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { Button, Center, Field, Input, Separator } from '@chakra-ui/react';
import {
  configStatusAtom,
  updateConfigAtom,
} from '@/pages/Hospital/MockAdmin/states/configs/configAtom';
import { type ConfigType } from '@/pages/Hospital/MockAdmin/types/config.type';
import { pick } from 'lodash/fp';
import LoadingCard from '@/pages/Hospital/MockAdmin/components/LoadingCard';
import { toaster } from '@/pages/Hospital/MockAdmin/components/ui/toasterStore';

type FormValues = Pick<ConfigType, 'projectName'>;

const AppConfig = () => {
  const configStatus = useAtomValue(configStatusAtom);
  const updateConfig = useAtomValue(updateConfigAtom);

  const defaultFormData = pick(['projectName'])(configStatus.data);

  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: defaultFormData,
    mode: 'all',
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const updateData = { ...configStatus.data, ...data } as ConfigType;

    updateConfig
      .mutateAsync(updateData)
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
      <Field.Root my={5} required disabled={configStatus.isLoading}>
        <Field.Label>專案名稱</Field.Label>
        <Input
          type="text"
          {...register('projectName', {
            required: '基本設定 > 專案名稱為必填項目',
          })}
        />
        <Field.HelperText>We&apos;ll never share your email.</Field.HelperText>
      </Field.Root>

      <Separator my={5} />

      <Center>
        <Button type="submit" variant="solid" colorPalette="green">
          更新
        </Button>
      </Center>
    </form>
  );
};

export default AppConfig;
