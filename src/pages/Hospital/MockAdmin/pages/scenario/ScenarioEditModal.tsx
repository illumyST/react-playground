import { getApiResponse, type ParamsType } from '@/pages/Hospital/MockAdmin/apis/apis';
import { routersStatusAtom } from '@/pages/Hospital/MockAdmin/states/routers/routerAtom';
import { updateScenarioAtom } from '@/pages/Hospital/MockAdmin/states/scenarios/scenarioAtom';
import {
  type ScenarioType,
  type UpdateScenarioRequestType,
} from '@/pages/Hospital/MockAdmin/types/scenario.type';
import { Box, Button, Dialog, Field, IconButton, NativeSelect } from '@chakra-ui/react';
import { useAtomValue } from 'jotai';
import { Fragment, useEffect, useMemo } from 'react';
import { Controller, FormProvider, useFieldArray, useForm, useFormContext } from 'react-hook-form';
import ReactSelect from 'react-select';
import { toaster } from '@/pages/Hospital/MockAdmin/components/ui/toasterStore';
import { faPlus, faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { type RouterApiType, type RouterArray } from '@/pages/Hospital/MockAdmin/types/router.type';
import { isPathRouter } from '@/pages/Hospital/MockAdmin/utils/tools';
import { useQuery } from '@tanstack/react-query';

type ScenarioFormType = {
  data: UpdateScenarioRequestType[];
};

interface SelectItemEditProps {
  idx: number;
  filenameOptions: RouterApiType[];
}

const SelectItemEdit = (props: SelectItemEditProps) => {
  const { idx, filenameOptions } = props;
  const { watch, control, setValue, resetField } = useFormContext<ScenarioFormType>();

  const [filename, status, responseId] = watch([
    `data.${idx}.filename`,
    `data.${idx}.current`,
    `data.${idx}.responseId`,
  ]);

  // statusOptions
  const statusOptions = ['default', 'success', 'noData', 'error', 'schema'];

  const url = filenameOptions.find((option) => option.filename === filename)?.url || '';
  const formattedURL = url.substring(1);

  const fileInfoStatus = useQuery({
    queryKey: ['filename_info', filename, status],
    queryFn: () =>
      getApiResponse({
        status,
        url: formattedURL,
      } as ParamsType)().then((res) => res as ResponseOptionsType[]),
    enabled: !!filename && !!status,
  });

  useEffect(() => {
    const value =
      (fileInfoStatus.data || []).find(({ id }) => responseId === id.toString())?.label || '';
    setValue(`data.${idx}.label`, value);
  }, [responseId]);

  return (
    <>
      <Controller
        control={control}
        name={`data.${idx}.current`}
        rules={{ required: true }}
        render={({ field, fieldState }) => {
          return (
            <Field.Root invalid={fieldState.invalid} mb={4}>
              <Field.Label>狀態</Field.Label>
              <NativeSelect.Root>
                <NativeSelect.Field
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    resetField(`data.${idx}.responseId`);
                  }}
                >
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </Field.Root>
          );
        }}
      />

      <Controller
        control={control}
        name={`data.${idx}.responseId`}
        rules={{ required: true }}
        render={({ field, fieldState }) => (
          <Field.Root invalid={fieldState.invalid} mb={4}>
            <Field.Label>測資</Field.Label>
            <NativeSelect.Root>
              <NativeSelect.Field
                {...field}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  setValue(
                    `data.${idx}.label`,
                    (fileInfoStatus.data || []).find(({ id }) => e.target.value === id.toString())
                      ?.label || '',
                  );
                }}
                placeholder="Select option"
              >
                {(fileInfoStatus.data || []).map((option) => {
                  return (
                    <option value={option.id.toString()} key={option.id.toString()}>
                      {option.label}
                    </option>
                  );
                })}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Field.Root>
        )}
      />
    </>
  );
};

type ResponseOptionsType = {
  id: number;
  label: string;
};

type ScenarioEditApiProps = {
  open: boolean;
  onClose: () => void;
  setOpen: (v: boolean) => void;
  item: ScenarioType | null;
};

const ScenarioEditModal: React.FC<ScenarioEditApiProps> = ({ open, onClose, setOpen, item }) => {
  const updateScenario = useAtomValue(updateScenarioAtom);
  const methods = useForm<ScenarioFormType>({
    defaultValues: { data: [] },
  });

  const { control, handleSubmit, reset, resetField } = methods;
  const { fields, append, remove } = useFieldArray({ control, name: 'data' });

  // filenameOptions
  const apisStatus = useAtomValue(routersStatusAtom);

  const apisStatusData = apisStatus.data || [];

  const filenameOptions = useMemo(() => {
    const flattenOptions = (options: RouterArray): RouterApiType[] => {
      return options.reduce<RouterApiType[]>((acc, option) => {
        if (isPathRouter(option)) {
          // 遞迴處理 children
          return acc.concat(flattenOptions(option.children));
        }
        acc.push(option);
        return acc;
      }, []);
    };

    return flattenOptions(apisStatusData);
  }, [apisStatus.data]);

  const selectOption = useMemo(
    () =>
      filenameOptions.map(({ filename, title }) => ({
        label: `【${title}】${filename}`,
        value: filename,
      })),
    [filenameOptions],
  );

  useEffect(() => {
    if (open) {
      reset({ data: item?.data || [] });
    }
  }, [open]);

  const onSubmit = (data: ScenarioFormType) => {
    if (!item) return;
    const filteredData = data.data;

    updateScenario
      .mutateAsync({ ...item, data: filteredData })
      .then(onClose)
      .then(() =>
        toaster.create({
          title: '編輯成功',
          description: `已編輯【${item.category}】【${item.name}】`,
          type: 'success',
          closable: true,
        }),
      )
      .catch((err) =>
        toaster.create({
          title: '編輯失敗',
          description: `無法編輯【${item.category}】【${item.name}】${err}`,
          type: 'error',
          closable: true,
        }),
      );
  };

  return (
    <Dialog.Root size="lg" open={open} onOpenChange={(e) => setOpen(e.open)}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Dialog.CloseTrigger />
            <Dialog.Header>
              <Dialog.Title>編輯情境【{item?.name}】</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <FormProvider {...methods}>
                {fields.map((fieldItem, index) => {
                  return (
                    <Fragment key={fieldItem.id}>
                      <h4># {index + 1}</h4>
                      <Box
                        borderWidth="1px"
                        borderRadius="lg"
                        p={4}
                        mb={4}
                        boxShadow="sm"
                        position="relative"
                      >
                        <Controller
                          name={`data.${index}.filename`}
                          control={control}
                          render={({ field: { onChange, value } }) => (
                            <Field.Root mb={4}>
                              <Field.Label>檔案名稱</Field.Label>
                              <Box w="full">
                                <ReactSelect
                                  options={selectOption}
                                  value={selectOption.find((option) => option.value === value)}
                                  onChange={(newValue) => {
                                    onChange(newValue?.value);
                                    resetField(`data.${index}.responseId`);
                                  }}
                                  required
                                  isSearchable
                                />
                              </Box>
                            </Field.Root>
                          )}
                          rules={{ required: true }}
                        />
                        <SelectItemEdit idx={index} filenameOptions={filenameOptions} />

                        <IconButton
                          size="xs"
                          position="absolute"
                          right={0}
                          top={0}
                          m={2}
                          onClick={() => remove(index)}
                          colorPalette="red"
                        >
                          <FontAwesomeIcon icon={faX} />
                        </IconButton>
                      </Box>
                    </Fragment>
                  );
                })}
              </FormProvider>
              <IconButton
                type="button"
                size="sm"
                onClick={() =>
                  append({
                    filename: '',
                    current: 'default',
                    responseId: '',
                    label: '',
                  })
                }
                colorPalette="green"
              >
                <FontAwesomeIcon icon={faPlus} />
              </IconButton>
            </Dialog.Body>
            <Dialog.Footer>
              <Button variant="ghost" mr={3} size="sm" onClick={onClose}>
                取消
              </Button>
              <Button colorPalette="blue" size="sm" type="submit">
                儲存
              </Button>
            </Dialog.Footer>
          </form>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};

export default ScenarioEditModal;
