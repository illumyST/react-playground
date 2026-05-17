import { useState, useRef, useCallback } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import Clipboard from 'clipboard';
import { useEffect } from 'react';
import { Button, Input } from '@/components';

type Inputs = {
  participant: string;
  gnumber: number;
};

type GroupData = Array<string[]>;

const shuffle = (array: string[]): string[] =>
  [...array].sort(() => Math.random() - 0.5);

const genCopyStr = (group: GroupData = []): string =>
  group.map((g, i) => `第${i + 1}組：${g.join(',')}`).join('; ');

/* ─── Draggable Result ─── */

interface ResultProps {
  groupProp: GroupData;
}

const Result = ({ groupProp }: ResultProps): React.ReactNode => {
  const [group, setGroup] = useState(groupProp);
  const [copyStr, setCopyStr] = useState(genCopyStr(groupProp));

  // 原生 Drag & Drop state
  const dragItem = useRef<{ groupIdx: number; itemIdx: number } | null>(null);
  const dragOverItem = useRef<{ groupIdx: number; itemIdx: number } | null>(null);

  useEffect(() => {
    const clipboard = new Clipboard('.copy-to-clipboard');
    return () => clipboard.destroy();
  }, []);

  // 同步外部 prop 更新
  useEffect(() => {
    setGroup(groupProp);
    setCopyStr(genCopyStr(groupProp));
  }, [groupProp]);

  const handleDragStart = useCallback(
    (groupIdx: number, itemIdx: number) => {
      dragItem.current = { groupIdx, itemIdx };
    },
    [],
  );

  const handleDragEnter = useCallback(
    (groupIdx: number, itemIdx: number) => {
      dragOverItem.current = { groupIdx, itemIdx };
    },
    [],
  );

  const handleDragEnd = useCallback(() => {
    if (!dragItem.current || !dragOverItem.current) return;

    const { groupIdx: srcGroup, itemIdx: srcIdx } = dragItem.current;
    const { groupIdx: destGroup, itemIdx: destIdx } = dragOverItem.current;

    const newGroup = group.map((g) => [...g]);
    const [removed] = newGroup[srcGroup].splice(srcIdx, 1);
    newGroup[destGroup].splice(destIdx, 0, removed);

    setGroup(newGroup);
    setCopyStr(genCopyStr(newGroup));
    dragItem.current = null;
    dragOverItem.current = null;
  }, [group]);

  return (
    <>
      <h2 className="title-lg mb-lg">Result</h2>
      <div className="mb-lg flex flex-wrap gap-lg">
        {group.map((members, gIdx) => (
          <div
            key={gIdx}
            className="min-w-[140px] flex-1 overflow-hidden rounded-md bg-surface-4 text-base"
            onDragOver={(e) => {
              e.preventDefault();
              /* 允許 drop 到空組 */
              if (members.length === 0) {
                dragOverItem.current = { groupIdx: gIdx, itemIdx: 0 };
              }
            }}
            onDrop={handleDragEnd}
          >
            <div className="bg-surface-5 p-sm text-center font-bold">
              第{gIdx + 1}組
            </div>
            <div className="flex flex-col gap-md p-lg text-center text-on-surface">
              {members.map((name, mIdx) => (
                <div
                  key={name}
                  draggable
                  onDragStart={() => handleDragStart(gIdx, mIdx)}
                  onDragEnter={() => handleDragEnter(gIdx, mIdx)}
                  onDragEnd={handleDragEnd}
                  className="cursor-grab rounded-md bg-surface-1 p-md text-base shadow-light-down-3 transition-colors active:cursor-grabbing active:bg-steel-500 active:text-white"
                >
                  {name}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Button
        type="button"
        className="copy-to-clipboard"
        data-clipboard-text={copyStr}
        onClick={() => console.log(group)}
      >
        Copy Result
      </Button>
    </>
  );
};

/* ─── Grouping Page ─── */

const GroupingPage = (): React.ReactNode => {
  const { register, handleSubmit, reset } = useForm<Inputs>();
  const [group, setGroup] = useState<GroupData>([]);

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    // 整理參加者資料
    const participants = shuffle(
      data.participant.split(/\s*,\s*/).filter((item) => item !== ''),
    );

    // 建立組別
    const newGroup = Array.from({ length: +data.gnumber }, (): string[] => []);

    // 分配參加者到各組
    while (participants.length) {
      for (let i = 0; i < newGroup.length; i++) {
        const cur = participants.splice(0, 1);
        if (cur.length === 0) break;
        newGroup[i].push(...cur);
      }
    }

    setGroup(newGroup);
  };

  const onReset = () => {
    reset();
    setGroup([]);
  };

  return (
    <div className="space-y-xl">
      <h1 className="title-2xl">Grouping Tool</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-lg">
        <Input
          id="participant"
          type="text"
          placeholder="請輸入參加者（以逗號分隔）"
          inputSize="large"
          {...register('participant', { required: false })}
        />
        <Input
          id="gnumber"
          type="number"
          placeholder="請輸入組別數量"
          inputSize="large"
          {...register('gnumber', { required: false })}
        />
        <div className="flex gap-lg">
          <Button type="submit">分組</Button>
          <Button type="reset" variant="outlined" onClick={onReset}>
            重新分組
          </Button>
        </div>
      </form>

      {group.length > 0 && <Result groupProp={group} />}
    </div>
  );
};

export default GroupingPage;
