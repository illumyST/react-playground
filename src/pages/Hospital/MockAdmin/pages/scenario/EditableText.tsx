import { Editable } from '@chakra-ui/react';
import { Tooltip } from '@/pages/Hospital/MockAdmin/components/ui/tooltip';

export const EditableText = ({
  value,
  onSubmit,
}: {
  value: string;
  onSubmit?: (newValue: string) => void;
}) => {
  return (
    <Editable.Root
      size="sm"
      defaultValue={value}
      activationMode="click"
      display="flex"
      gap={2}
      alignItems="center"
      onValueCommit={({ value: committedValue }) => {
        if (committedValue !== value) {
          onSubmit?.(committedValue);
        }
      }}
    >
      <Tooltip content="Click to edit">
        <Editable.Preview py={2} px={4} />
      </Tooltip>
      <Editable.Input></Editable.Input>
    </Editable.Root>
  );
};

export default EditableText;
