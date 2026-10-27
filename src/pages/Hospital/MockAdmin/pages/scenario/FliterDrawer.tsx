import {
  Button,
  Checkbox,
  CheckboxGroup,
  CloseButton,
  Drawer,
  DrawerFooter,
  Flex,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';

interface FilterDrawerProps {
  allCategories: string[];
  selectedCategories: string[];
  onChangeSelected: React.Dispatch<React.SetStateAction<string[]>>;
}

const FilterDrawer = ({
  allCategories,
  selectedCategories,
  onChangeSelected,
}: FilterDrawerProps) => {
  const { open, onOpen, setOpen } = useDisclosure();

  return (
    <>
      <Button size="sm" onClick={() => onOpen()} variant="subtle">
        篩選
      </Button>
      <Drawer.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.CloseTrigger>
              <CloseButton size="sm" />
            </Drawer.CloseTrigger>
            <Drawer.Header></Drawer.Header>
            <Drawer.Body>
              <Flex my={8}>
                <Checkbox.Root
                  colorPalette="green"
                  checked={allCategories.length === selectedCategories.length}
                  onCheckedChange={() =>
                    allCategories.length === selectedCategories.length
                      ? onChangeSelected([])
                      : onChangeSelected(allCategories)
                  }
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Control />
                  <Checkbox.Label>全選</Checkbox.Label>
                </Checkbox.Root>
              </Flex>
              <CheckboxGroup
                value={selectedCategories}
                onValueChange={(e) => onChangeSelected(e.map((i) => i.toString()))}
              >
                <Stack gap={4}>
                  {allCategories.map((category) => (
                    <Checkbox.Root colorPalette="blue" key={category} value={category}>
                      <Checkbox.HiddenInput />
                      <Checkbox.Control />
                      <Checkbox.Label>{category}</Checkbox.Label>
                    </Checkbox.Root>
                  ))}
                </Stack>
              </CheckboxGroup>
            </Drawer.Body>
            <DrawerFooter></DrawerFooter>
          </Drawer.Content>
        </Drawer.Positioner>
      </Drawer.Root>
    </>
  );
};

export default FilterDrawer;
