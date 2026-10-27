import { JsonEditor as Editor } from 'jsoneditor-react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import * as ace from 'brace';
import 'jsoneditor-react/es/editor.min.css';
import 'brace/mode/json';
import 'brace/theme/monokai';

import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Field,
  Flex,
  IconButton,
  Input,
  RadioGroup,
  Spacer,
  Stack,
} from '@chakra-ui/react';
import { useAtomValue } from 'jotai';
import { configStatusAtom } from '@/pages/Hospital/MockAdmin/states/configs/configAtom';
import { type ApiResponseContent } from '@/pages/Hospital/MockAdmin/types/apiResponse.type';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export interface ApiResponseForm extends ApiResponseContent {
  response: string;
}

interface MultipleEditorProps {
  onSave: (value: ApiResponseForm[]) => void;
  responseList: ApiResponseContent[];
}

const MultipleEditor = ({ onSave, responseList }: MultipleEditorProps) => {
  const configStatus = useAtomValue(configStatusAtom);
  const responseListDefault = useMemo(
    () =>
      responseList.map((res) => ({
        ...res,
        response: JSON.stringify(res.response),
      })),
    [responseList],
  );

  const [current, setCurrent] = useState(
    () => responseListDefault.find(({ isChecked }) => isChecked)?.id.toString() || '',
  );

  const { control, reset, handleSubmit } = useForm<{
    responses: ApiResponseForm[];
  }>({
    reValidateMode: 'onSubmit',
    defaultValues: {
      responses: responseListDefault,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: 'responses',
  });

  const handleCreateScenario = () => {
    const newId = Date.now();
    const scenario = {
      id: newId,
      label: `第${fields.length + 1}筆測試情境`,
      isChecked: false,
      response: JSON.stringify(configStatus.data?.api.default || {}),
    };
    append(scenario);
  };

  return (
    <RadioGroup.Root
      value={current}
      onValueChange={(e) => {
        setCurrent(e.value || '');
      }}
    >
      <Stack gap={5}>
        {fields.map((item, index) => (
          <Box key={item.id}>
            <Flex gap={3} alignItems="center" mb={2}>
              <Controller
                control={control}
                name={`responses.${index}.id`}
                render={({ field }) => {
                  return (
                    <RadioGroup.Item value={`${field.value}`} colorPalette="teal">
                      <RadioGroup.ItemHiddenInput />
                      <RadioGroup.ItemIndicator />
                    </RadioGroup.Item>
                  );
                }}
              />
              <Controller
                control={control}
                name={`responses.${index}.label`}
                render={({ field }) => <Input {...field} />}
              />
              {fields.length > 1 && (
                <IconButton
                  colorPalette="red"
                  onClick={() => remove(index)}
                  aria-label="delete scenario"
                >
                  <FontAwesomeIcon icon={faTrashCan} />
                </IconButton>
              )}
            </Flex>

            <Controller
              control={control}
              name={`responses.${index}.response`}
              rules={{
                validate: (content) => {
                  try {
                    JSON.parse(content);
                    return true;
                  } catch {
                    return 'JSON格式錯誤了啦';
                  }
                },
              }}
              render={({ field, fieldState }) => (
                <Field.Root invalid={fieldState.invalid}>
                  <Editor
                    // 資料處裡
                    value={JSON.parse(field.value)}
                    onChange={(res: unknown) => field.onChange(JSON.stringify(res))}
                    // 樣式設定
                    mode={Editor.modes.code}
                    ace={ace}
                    theme="ace/theme/monokai"
                    schema={{ height: '500px' }}
                    htmlElementProps={{
                      style: {
                        height: '500px',
                        marginBottom: '12px',
                        width: '100%',
                      },
                    }}
                  />
                  <Field.ErrorText>{fieldState.error?.message}</Field.ErrorText>
                </Field.Root>
              )}
            />
          </Box>
        ))}

        <Button alignSelf="self-start" colorPalette="green" onClick={handleCreateScenario}>
          新增情境
        </Button>

        <Flex>
          <Spacer />
          <Stack direction="row">
            <Button
              onClick={() => {
                reset();
                setCurrent(
                  responseListDefault.find(({ isChecked }) => isChecked)?.id.toString() || '',
                );
              }}
            >
              重製
            </Button>
            <Button
              colorPalette="blue"
              onClick={handleSubmit(({ responses }) =>
                onSave(
                  responses.map((res) => ({
                    ...res,
                    isChecked: res.id.toString() === current,
                  })),
                ),
              )}
            >
              儲存
            </Button>
          </Stack>
        </Flex>
      </Stack>
    </RadioGroup.Root>
  );
};

export default MultipleEditor;
