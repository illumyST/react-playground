import { JsonEditor as Editor } from 'jsoneditor-react';
import * as ace from 'brace';
import 'jsoneditor-react/es/editor.min.css';
import 'brace/mode/json';
import 'brace/theme/monokai';

import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Input,
  InputGroup,
  RadioGroup,
  Text,
} from '@chakra-ui/react';

import {
  faCheck,
  faCopy,
  faEdit,
  faEye,
  faEyeSlash,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useEffect, useRef, useState } from 'react';

type MockDataResp = {
  id: number;
  label: string;
  isChecked: boolean;
  response: unknown;
};
const MultiEditors = (props: { value: string; onChange: (v: string) => void }) => {
  const { value, onChange } = props;

  const scenarios: MockDataResp[] = JSON.parse(value);
  const defaultRadio = scenarios.find((scenario) => scenario.isChecked)?.id || 0;

  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [expandedEditors, setExpandedEditors] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const prevLengthRef = useRef(scenarios.length);
  // 手動管理 input ref，以便在新建場景時自動聚焦標籤標題輸入框
  const inputRefs = useRef<Map<number, HTMLInputElement>>(new Map());

  const setInputRef = useCallback((id: number, el: HTMLInputElement | null) => {
    if (el) {
      inputRefs.current.set(id, el);
    } else {
      inputRefs.current.delete(id);
    }
  }, []);

  // 檢測新增情境並更新狀態
  useEffect(() => {
    if (scenarios.length > prevLengthRef.current) {
      const newScenario = scenarios[scenarios.length - 1];
      // 自動展開新情境的編輯器
      setExpandedEditors((prev) => new Set([...prev, newScenario.id]));

      setTimeout(() => {
        document.getElementById(newScenario.id.toString())?.scrollIntoView({ block: 'center' });
      });
    }
    prevLengthRef.current = scenarios.length;
  }, [scenarios.length]);

  const handleCopyId = (id: number) => () => {
    navigator.clipboard.writeText(String(id));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const toggleEditor = (id: number) => {
    setExpandedEditors((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const expandAll = () => {
    const allIds = scenarios.map((s) => s.id);
    setExpandedEditors(new Set(allIds));
  };

  const collapseAll = () => {
    setExpandedEditors(new Set());
  };

  // 切換情境
  const handleRadioChange = (value: number) => {
    const newData = scenarios.map((scenario) => ({
      ...scenario,
      isChecked: scenario.id === value,
    }));
    onChange(JSON.stringify(newData));
  };
  // 更新情境說明
  const handleLabelChange = (scenario: MockDataResp, value: string) => {
    const newData = scenarios.map((scene) => {
      if (scene.id === scenario.id) {
        return {
          ...scene,
          label: value,
        };
      }
      return scene;
    });
    onChange(JSON.stringify(newData));
  };
  // 刪除情境
  const handleDelete = (id: number) => {
    const newData = scenarios.filter((scenario) => scenario.id !== id);
    if (newData.length === 1) {
      handleRadioChange(newData[0].id);
      newData[0].isChecked = true;
    }
    onChange(JSON.stringify(newData));
  };
  // 複製情境
  const handleDuplicateScenario = (scenario: MockDataResp) => {
    const newId = Date.now();
    const duplicatedScenario = {
      ...scenario,
      id: newId,
      label: `${scenario.label} (副本)`,
      isChecked: false,
    };
    const newData = [...scenarios, duplicatedScenario];
    onChange(JSON.stringify(newData));
  };
  // 編輯情境
  const handleEditor = (id: number) => (json: unknown) => {
    const newData = scenarios.map((scenario) => {
      if (scenario.id !== id) return scenario;
      return {
        ...scenario,
        response: json,
      };
    });
    onChange(JSON.stringify(newData));
  };

  // 過濾場景
  const filteredScenarios = scenarios.filter((scenario) =>
    scenario.label.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
      {/* 搜索功能 */}
      <Box pos="sticky" top={0} zIndex={10} bg="white" py={2}>
        <InputGroup my={4}>
          <Input
            placeholder="搜索場景..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            bg="white"
          />
        </InputGroup>

        <Flex justifyContent="space-between" alignItems="center">
          <HStack gap={4}>
            <Badge colorPalette="gray" size="lg">
              共 {scenarios.length} 個場景
            </Badge>
          </HStack>

          <HStack gap={4}>
            <Button size="sm" onClick={expandAll} variant="outline" colorPalette="gray">
              <FontAwesomeIcon icon={faEye} />
              <Text ml={2}>展開編輯</Text>
            </Button>
            <Button size="sm" onClick={collapseAll} variant="outline" colorPalette="gray">
              <FontAwesomeIcon icon={faEyeSlash} />
              <Text ml={2}>關閉編輯</Text>
            </Button>
          </HStack>
        </Flex>
      </Box>

      <RadioGroup.Root
        value={`${defaultRadio}`}
        onValueChange={(e) => handleRadioChange(parseInt(e.value || '', 10))}
      >
        {filteredScenarios.map((scenario) => {
          const originalIndex = scenarios.findIndex((s) => s.id === scenario.id);
          const expanded = expandedEditors.has(scenario.id);
          return (
            <Box
              key={`${scenario.id}`}
              mb={3}
              p={2}
              borderRadius="md"
              bg={scenario.isChecked ? 'green.50' : 'gray.50'}
              borderWidth="2px"
              borderColor={scenario.isChecked ? 'green.400' : 'transparent'}
            >
              {/* 主要資訊區 */}
              <Flex
                id={`${scenario.id}`}
                gap={4}
                alignItems="center"
                justifyContent="space-between"
                mb={expanded ? 2 : 0}
              >
                <HStack gap={4} flex="1">
                  <IconButton
                    onClick={() => handleRadioChange(scenario.id)}
                    colorPalette={scenario.isChecked ? 'green' : 'gray'}
                    variant={scenario.isChecked ? 'solid' : 'subtle'}
                    rounded="full"
                    fontWeight="bold"
                    aria-label="activate scenario"
                    title="設為啟用"
                    size="sm"
                  >
                    {scenario.isChecked ? <FontAwesomeIcon icon={faCheck} /> : originalIndex + 1}
                  </IconButton>

                  <Input
                    ref={(el) => setInputRef(scenario.id, el)}
                    value={scenario.label}
                    onChange={(e) => handleLabelChange(scenario, e.target.value)}
                    maxWidth={{ base: '100%', md: '400px' }}
                    fontWeight={scenario.isChecked ? 'bold' : 'normal'}
                    bg="white"
                    borderColor={scenario.isChecked ? 'green.400' : 'gray.300'}
                    borderWidth="2px"
                    fontSize="md"
                    width={'250px'}
                  />
                  <Badge
                    colorPalette="orange"
                    size="lg"
                    px={3}
                    cursor="pointer"
                    onClick={handleCopyId(scenario.id)}
                    title="點擊複製 ID"
                    variant={copiedId === scenario.id ? 'solid' : 'subtle'}
                    flexShrink={0}
                  >
                    {copiedId === scenario.id ? '已複製!' : `ID: ${scenario.id}`}
                  </Badge>
                </HStack>

                {/* 次要操作區 */}
                <HStack gap={3} flexShrink={0} ml="auto">
                  <IconButton
                    onClick={() => handleDelete(scenario.id)}
                    colorPalette="red"
                    variant="ghost"
                    aria-label="delete scenario"
                    title="刪除"
                  >
                    <FontAwesomeIcon icon={faTrashCan} />
                  </IconButton>
                  <IconButton
                    onClick={() => toggleEditor(scenario.id)}
                    colorPalette="blue"
                    variant={expandedEditors.has(scenario.id) ? 'solid' : 'ghost'}
                    aria-label="toggle editor"
                    title={expandedEditors.has(scenario.id) ? '關閉編輯' : '展開編輯'}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDuplicateScenario(scenario)}
                    colorPalette="blue"
                    variant="ghost"
                    aria-label="duplicate scenario"
                    title="複製此場景"
                  >
                    <FontAwesomeIcon icon={faCopy} />
                  </IconButton>
                </HStack>
              </Flex>

              {/* 編輯測資 */}
              {expanded && (
                <Editor
                  // 資料處裡
                  value={scenario.response}
                  onChange={handleEditor(scenario.id)}
                  // 樣式設定
                  mode={Editor.modes.code}
                  ace={ace}
                  theme="ace/theme/monokai"
                  schema={{ height: '500px' }}
                  htmlElementProps={{
                    style: { height: '500px', marginBottom: '12px' },
                  }}
                />
              )}
            </Box>
          );
        })}
      </RadioGroup.Root>
    </>
  );
};

export default MultiEditors;
