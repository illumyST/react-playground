import React, { useEffect, useMemo, useState } from 'react';
import { useCopilotChat } from '@copilotkit/react-core';
import { Role, TextMessage } from '@copilotkit/runtime-client-gql';
import { Button, Input } from '@/components';
import { getMessageText, hasMessageRole } from '../utils/chatMessages';

// 簡化版表單欄位定義（schema）
type FieldKey =
  | 'company'
  | 'location'
  | 'purpose'
  | 'flightCost'
  | 'lodgingCost'
  | 'startDate'
  | 'endDate'
  | 'attachments';

type FieldDef = {
  key: FieldKey;
  label: string;
  type: 'string' | 'number' | 'date' | 'enum' | 'file';
  required?: boolean;
};

const SCHEMA: FieldDef[] = [
  { key: 'company', label: '公司/單位', type: 'string', required: true },
  { key: 'location', label: '地點', type: 'string', required: true },
  { key: 'purpose', label: '目的/活動性質', type: 'string', required: true },
  { key: 'flightCost', label: '機票費用', type: 'number' },
  { key: 'lodgingCost', label: '住宿費用', type: 'number' },
  { key: 'startDate', label: '開始日期', type: 'date', required: true },
  { key: 'endDate', label: '結束日期', type: 'date', required: true },
  { key: 'attachments', label: '附件（檔名）', type: 'string' },
];

type FormState = Partial<Record<FieldKey, string | number>>;

const initialState: FormState = {};

const FormAssistantTab: React.FC = () => {
  const [form, setForm] = useState<FormState>(initialState);
  const [draft, setDraft] = useState('');
  const [assistantText, setAssistantText] = useState('');
  const [missing, setMissing] = useState<FieldKey[]>([]);

  const chat = useCopilotChat({
    id: 'form-assistant-chat',
  });

  const { visibleMessages, appendMessage, isLoading } = chat;

  const requiredKeys = useMemo(() => SCHEMA.filter((f) => f.required).map((f) => f.key), []);

  const updateField = (key: FieldKey, value: string) => {
    const def = SCHEMA.find((d) => d.key === key);
    if (!def) return;
    let parsed: string | number = value;
    if (def.type === 'number') {
      const n = Number(value.replace(/[^0-9.\-]/g, ''));
      parsed = Number.isFinite(n) ? n : (form[key] as number) || 0;
    }
    setForm((prev) => ({ ...prev, [key]: parsed }));
  };

  const checkMissing = (state: FormState) => {
    const m = requiredKeys.filter((k) => !state[k]);
    setMissing(m);
  };

  const applyAIResult = (text: string) => {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return;
    try {
      const obj = JSON.parse(match[0]) as Record<string, any>;
      const next: FormState = { ...form };
      for (const def of SCHEMA) {
        const v = obj[def.key];
        if (typeof v !== 'undefined' && v !== null) {
          next[def.key] = v;
        }
      }
      setForm(next);
    } catch {
      // 非 JSON，忽略
    }
  };

  useEffect(() => {
    checkMissing(form);
  }, [form, requiredKeys]);

  useEffect(() => {
    if (visibleMessages && visibleMessages.length > 0) {
      const lastMsg: any = visibleMessages[visibleMessages.length - 1];
      if (hasMessageRole(lastMsg, Role.Assistant)) {
        const content = getMessageText(lastMsg.content);
        setAssistantText(content);
      }
    }
  }, [visibleMessages]);

  useEffect(() => {
    if (!isLoading && visibleMessages && visibleMessages.length > 0) {
      const lastMsg: any = visibleMessages[visibleMessages.length - 1];
      if (hasMessageRole(lastMsg, Role.Assistant)) {
        applyAIResult(getMessageText(lastMsg.content));
      }
    }
  }, [isLoading, visibleMessages]);

  const requestStructuredFill = (nl: string) => {
    if (!nl.trim()) return;
    setAssistantText('');

    const prompt = `你是表單助理。請依下列欄位定義將使用者輸入轉為 JSON：\n\n欄位：${SCHEMA.map(
      (f) => `${f.key}(${f.type}${f.required ? ',必填' : ''})`,
    ).join(
      ', ',
    )}\n\n請只輸出 JSON 結構（不含多餘說明），缺少或不確定的欄位請保留空字串。\n使用者輸入：\n${nl}`;

    if (!appendMessage) {
      console.error('CopilotKit appendMessage function missing');
      return;
    }

    appendMessage(
      new TextMessage({
        role: Role.User,
        content: prompt,
      }),
    );
  };

  const requestFormReview = (question: string) => {
    if (!question.trim() || !appendMessage) return;

    appendMessage(
      new TextMessage({
        role: Role.User,
        content: `請使用繁體中文，根據目前表單資料回答下列問題。若資料不足，先指出缺漏欄位，再給簡短建議。\n\n目前表單：${JSON.stringify(form)}\n\n問題：${question}`,
      }),
    );
  };

  return (
    <div className="flex flex-col gap-lg text-left">
      <section className="rounded-2xl border border-outline-2 bg-surface-1 p-lg shadow-light-down-1">
        <h2 className="title-sm">Travel Request Form</h2>
        <p className="mt-xs text-sm text-on-surface-variant">
          先手動編輯欄位，或用自然語言讓 Copilot 轉成表單資料；右側也可直接詢問缺漏與一致性問題。
        </p>
      </section>

      <main className="grid grid-cols-1 gap-lg md:grid-cols-3">
        <section className="rounded-2xl border border-outline-2 bg-surface-1 p-lg shadow-light-down-1 md:col-span-2">
          <div className="grid grid-cols-1 gap-md md:grid-cols-2">
            {SCHEMA.map((f) => (
              <div key={f.key}>
                <label className="mb-xs block text-xs font-medium text-on-surface-variant">
                  {f.label} {f.required && <span className="text-red-500">*</span>}
                </label>
                <Input
                  type={f.type === 'number' ? 'text' : f.type === 'date' ? 'date' : 'text'}
                  value={(form[f.key] as any) ?? ''}
                  onChange={(e) => updateField(f.key, e.target.value)}
                  className={
                    missing.includes(f.key)
                      ? 'border-red-400 bg-red-50 focus-visible:ring-red-400'
                      : ''
                  }
                  placeholder={`請輸入${f.label}`}
                />
              </div>
            ))}
          </div>
          <div className="mt-md rounded-xl bg-surface-2 px-md py-sm text-xs text-on-surface-variant">
            必填欄位缺漏：
            {missing.length
              ? SCHEMA.filter((field) => missing.includes(field.key))
                  .map((field) => field.label)
                  .join('、')
              : '無'}
          </div>
        </section>

        <aside className="flex flex-col rounded-2xl border border-outline-2 bg-surface-1 p-lg shadow-light-down-1">
          <label className="mb-xs block text-xs font-medium text-on-surface-variant">
            用自然語言描述需求
          </label>
          <textarea
            rows={4}
            className="w-full rounded-xl border border-outline bg-surface-1 px-md py-sm text-sm text-on-surface outline-none transition-colors placeholder:text-on-surface-variant focus-visible:ring-2 focus-visible:ring-primary"
            placeholder="例如：我在 3/20 去東京參加 React Conf，機票約 15000，住宿 3 晚約 12000"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                requestStructuredFill(draft);
              }
            }}
          />
          <div className="mt-md flex flex-wrap gap-sm">
            <Button
              type="button"
              size="small"
              isLoading={isLoading}
              onClick={() => requestStructuredFill(draft)}
            >
              {isLoading ? '分析中…' : 'AI 協助填寫'}
            </Button>
            <Button
              type="button"
              variant="outlined"
              size="small"
              onClick={() => {
                setDraft('');
                setAssistantText('');
              }}
            >
              清空輸入
            </Button>
          </div>
          <div className="mt-lg text-xs text-on-surface-variant">
            AI 回覆（若為 JSON 將自動套用到表單）：
          </div>
          <div className="mt-sm max-h-[300px] flex-1 overflow-auto rounded-xl border border-outline-2 bg-surface-2 p-md text-sm whitespace-pre-wrap text-on-surface">
            {assistantText || '(尚無回覆)'}
          </div>
          <div className="mt-lg flex flex-wrap gap-sm">
            {['檢查缺漏欄位', '費用是否合理', '活動性質是否一致'].map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => requestFormReview(s)}
                className="rounded-full border border-outline-2 bg-surface-2 px-md py-xs text-xs text-on-surface transition-colors hover:bg-surface-3"
              >
                {s}
              </button>
            ))}
          </div>
        </aside>
      </main>
    </div>
  );
};

export default FormAssistantTab;
