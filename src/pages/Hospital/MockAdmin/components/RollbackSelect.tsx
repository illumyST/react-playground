import { NativeSelect, Stack } from '@chakra-ui/react';
import { useAtomValue } from 'jotai';
import { rollbackListQueryAtom } from '@/pages/Hospital/MockAdmin/states/rollback/rollbackAtoms';

interface RollbackSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const RollbackSelect = ({ value, onChange }: RollbackSelectProps) => {
  const rollbackListStatus = useAtomValue(rollbackListQueryAtom);

  return (
    <Stack direction="row">
      <NativeSelect.Root>
        <NativeSelect.Field value={value} placeholder="" onChange={(e) => onChange(e.target.value)}>
          <option value="">請選擇</option>
          {(rollbackListStatus.data?.content || []).map((name) => (
            <option value={name} key={name}>
              {name}
            </option>
          ))}
        </NativeSelect.Field>
        <NativeSelect.Indicator />
      </NativeSelect.Root>
    </Stack>
  );
};

export default RollbackSelect;
