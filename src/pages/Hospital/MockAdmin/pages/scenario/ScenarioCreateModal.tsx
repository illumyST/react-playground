import { Button, Dialog, Field, Input, NativeSelect, useDisclosure } from '@chakra-ui/react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { useAtomValue } from 'jotai';
import { createScenarioAtom } from '@/pages/Hospital/MockAdmin/states/scenarios/scenarioAtom';
import { toaster } from '@/pages/Hospital/MockAdmin/components/ui/toasterStore';

type CreateFormInputs = {
  categoryCode: string;
  newCategoryName: string;
  name: string;
};

const ScenarioCreateModal = ({ options }: { options: string[] }) => {
  const { register, handleSubmit, watch, reset, control } = useForm<CreateFormInputs>();
  const createScenario = useAtomValue(createScenarioAtom);
  const { open, onOpen, onClose, setOpen } = useDisclosure();
  const selectedCategory = watch('categoryCode', 'custom');

  const handleOpen = () => {
    reset();
    onOpen();
  };

  const onSubmit: SubmitHandler<CreateFormInputs> = ({ newCategoryName, name }) => {
    const category = selectedCategory === 'custom' ? newCategoryName : selectedCategory;
    createScenario
      .mutateAsync({ category, name })
      .then(onClose)
      .then(() =>
        toaster.create({
          title: '新增成功',
          description: `已新增【${category}】【${name}】`,
          type: 'success',
          closable: true,
        }),
      )
      .catch((err) =>
        toaster.create({
          title: '新增失敗',
          description: `無法新增【${category}】【${name}】${err}`,
          type: 'error',
          closable: true,
        }),
      );
  };

  return (
    <>
      <Button onClick={handleOpen} size="sm" variant="subtle">
        新增情境
      </Button>

      <Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Dialog.CloseTrigger />
              <Dialog.Header>
                <Dialog.Title>新增情境</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Field.Root mb={4}>
                  <Field.Label>類別</Field.Label>
                  <Controller
                    control={control}
                    name="categoryCode"
                    render={({ field }) => {
                      return (
                        <NativeSelect.Root>
                          <NativeSelect.Field {...field}>
                            <option value="custom">自定義</option>
                            {options.map((item) => (
                              <option value={item} key={item}>
                                {item}
                              </option>
                            ))}
                          </NativeSelect.Field>
                          <NativeSelect.Indicator />
                        </NativeSelect.Root>
                      );
                    }}
                  />
                </Field.Root>

                {selectedCategory === 'custom' && (
                  <Field.Root mb={4}>
                    <Field.Label>自定義類別</Field.Label>
                    <Input
                      placeholder="請輸入自定義類別"
                      {...register('newCategoryName', {
                        required: selectedCategory === 'custom',
                      })}
                    />
                  </Field.Root>
                )}

                <Field.Root mb={4}>
                  <Field.Label>情境名稱</Field.Label>
                  <Input placeholder="請輸入情境名稱" {...register('name', { required: true })} />
                </Field.Root>
              </Dialog.Body>
              <Dialog.Footer>
                <Button variant="ghost" mr={3} onClick={onClose}>
                  取消
                </Button>
                <Button type="submit" colorPalette="blue" size="sm">
                  新增
                </Button>
              </Dialog.Footer>
            </form>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </>
  );
};

export default ScenarioCreateModal;
