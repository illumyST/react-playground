import {
  Box,
  Button,
  Card,
  Circle,
  Flex,
  Heading,
  IconButton,
  Link,
  Spacer,
  Stack,
  Table,
  Tag,
  Text,
} from '@chakra-ui/react';
import ScenarioCreateModal from './ScenarioCreateModal';
import { useAtomValue } from 'jotai';
import {
  createScenarioAtom,
  updateScenarioAtom,
} from '@/pages/Hospital/MockAdmin/states/scenarios/scenarioAtom';
import { type ScenarioType } from '@/pages/Hospital/MockAdmin/types/scenario.type';
import { TocNavbar } from './TocNavbar';
import EditableText from './EditableText';
import { faCopy, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FilterDrawer from './FliterDrawer';
import { useState } from 'react';
import { MOCK_ADMIN_BASE } from '@/pages/Hospital/MockAdmin/constants';
import { Link as RouterLink } from 'react-router-dom';
import { toaster } from '@/pages/Hospital/MockAdmin/components/ui/toasterStore';
import { Tooltip } from '@/pages/Hospital/MockAdmin/components/ui/tooltip';
import { useScenarioControlContext } from './useScenarioControlContext';

interface ScenarioContentProps {
  data: ScenarioType[];
}

const ScenarioContent = ({ data }: ScenarioContentProps) => {
  const updateScenario = useAtomValue(updateScenarioAtom);
  const createScenario = useAtomValue(createScenarioAtom);
  const { handleEdit, handleRun, handleDelete } = useScenarioControlContext();

  // 獲取不重複的 category 作為 options
  const uniqueCategories = Array.from(new Set(data?.map((item) => item.category)));
  const [selectedCategories, setSelectedCategories] = useState(uniqueCategories);

  if (!data) {
    return;
  }

  const statusStyle = (status: string) => {
    switch (status) {
      case 'success':
        return 'green';
      case 'noData':
        return 'yellow';
      case 'error':
        return 'red';
      case 'schema':
        return 'blue';
      default:
        return 'gray';
    }
  };

  // 根據 category 分組
  const groupedData = data.reduce<Record<string, ScenarioType[]>>((acc, item) => {
    (acc[item.category] = acc[item.category] || []).push(item);
    return acc;
  }, {});

  const handleSubmit = (name: string, item: ScenarioType) => {
    updateScenario
      .mutateAsync({ ...item, name })
      .then(() =>
        toaster.create({
          title: '編輯成功',
          description: `已編輯【${item.category}】【${name}】`,
          type: 'success',
          closable: true,
        }),
      )
      .catch((err) =>
        toaster.create({
          title: '編輯失敗',
          description: `無法編輯【${item.category}】【${name}】${err}`,
          type: 'error',
          closable: true,
        }),
      );
  };

  const handleCopy = (item: ScenarioType) => {
    createScenario
      .mutateAsync({ ...item, name: `${item.name}_複製` })
      .then(() =>
        toaster.create({
          title: '新增成功',
          description: `已新增【${item.category}】【${item.name} 複製】`,
          type: 'success',
          closable: true,
        }),
      )
      .catch((err) =>
        toaster.create({
          title: '新增失敗',
          description: `無法新增【${item.category}】【${item.name} 複製】${err}`,
          type: 'error',
          closable: true,
        }),
      );
  };

  return (
    <Box>
      <Box bgColor="#082f49" px={14} pt={4} pb={28} color="white">
        <Heading>複合情境切換</Heading>
      </Box>
      <Flex mt={-20} mx="auto" px={{ base: 4, md: 10 }} gap={10}>
        <Card.Root>
          <Card.Header>
            <Flex>
              {/* 新增情境 */}
              <ScenarioCreateModal options={uniqueCategories} />
              <Spacer />
              <FilterDrawer
                allCategories={uniqueCategories}
                selectedCategories={selectedCategories}
                onChangeSelected={setSelectedCategories}
              />
            </Flex>
          </Card.Header>
          <Card.Body>
            {/* 情境列表 */}
            <Box my={4} p={3}>
              {Object.entries(groupedData)
                .filter(([category]) => selectedCategories.includes(category))
                .map(([category, items]) => (
                  <Box key={category} id={category} mb={6}>
                    <Heading size="md">{category}</Heading>

                    <Table.Root size="sm">
                      <Table.Body>
                        {items.map((item) => (
                          <Table.Row key={item.id}>
                            <Table.Cell width="45px">
                              <Tooltip content="click to copy">
                                <IconButton
                                  aria-label="click to copy"
                                  onClick={() => handleCopy(item)}
                                  size="sm"
                                  variant="subtle"
                                >
                                  <FontAwesomeIcon icon={faCopy} />
                                </IconButton>
                              </Tooltip>
                            </Table.Cell>
                            <Table.Cell>
                              <Flex alignItems="center">
                                <Circle
                                  size="10px"
                                  backgroundColor={
                                    item.data?.every((data) => data.isRunning) ? 'green' : 'red'
                                  }
                                />
                                <EditableText
                                  value={item.name}
                                  onSubmit={(value) => handleSubmit(value, item)}
                                />
                              </Flex>
                            </Table.Cell>
                            <Table.Cell>
                              {item.data?.map((data) => (
                                <Box key={data.filename} mb={1}>
                                  <Flex alignItems="center" gap={1}>
                                    {/* 燈號 */}
                                    <Circle
                                      size="10px"
                                      backgroundColor={data.isRunning ? 'green' : 'red'}
                                    />
                                    <Link asChild>
                                      <RouterLink
                                        to={`${MOCK_ADMIN_BASE}/apis?fileName=${data.filename}`}
                                      >{`【${data.filename}】`}</RouterLink>
                                    </Link>
                                    <Tag.Root
                                      size="sm"
                                      variant="solid"
                                      minW="auto"
                                      colorPalette={statusStyle(data.current)}
                                    >
                                      <Tag.Label>{data.current}</Tag.Label>
                                    </Tag.Root>
                                    <Text>{`${data.label}`}</Text>
                                  </Flex>
                                </Box>
                              ))}
                            </Table.Cell>
                            <Table.Cell width="180px">
                              <Stack direction="row">
                                {/* 執行 */}
                                <Button
                                  onClick={() => handleRun(item)}
                                  colorPalette="green"
                                  size="sm"
                                  disabled={!item.data?.length}
                                >
                                  執行
                                </Button>

                                {/* 編輯 */}
                                <IconButton
                                  colorPalette="blue"
                                  size="sm"
                                  aria-label="edit"
                                  onClick={() => handleEdit(item)}
                                >
                                  <FontAwesomeIcon icon={faPenToSquare} />
                                </IconButton>

                                {/* 刪除 */}
                                <IconButton
                                  colorPalette="red"
                                  size="sm"
                                  aria-label="edit"
                                  onClick={() => handleDelete(item)}
                                >
                                  <FontAwesomeIcon icon={faTrashCan} />
                                </IconButton>
                              </Stack>
                            </Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table.Root>
                  </Box>
                ))}
            </Box>
          </Card.Body>
        </Card.Root>
        <TocNavbar lists={selectedCategories} />
      </Flex>
    </Box>
  );
};

export default ScenarioContent;
