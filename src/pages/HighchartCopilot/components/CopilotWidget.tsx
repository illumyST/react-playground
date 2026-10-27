import React, { useEffect, useRef, useState } from 'react';
import type { RangeStats } from '@/types/highchartCopilot';
import { useCopilotChat } from '@copilotkit/react-core';
import { Role, TextMessage } from '@copilotkit/runtime-client-gql';
import { Button } from '@/components';
import { getMessageText, hasMessageRole } from '../utils/chatMessages';

// Icons
const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const SendIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

const RobotIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="10" rx="2"></rect>
    <circle cx="12" cy="5" r="2"></circle>
    <path d="M12 7v4"></path>
    <line x1="8" y1="16" x2="8" y2="16"></line>
    <line x1="16" y1="16" x2="16" y2="16"></line>
  </svg>
);

const ChartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="mr-1"
  >
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    <line x1="8" x2="8" y1="17" y2="12" />
    <line x1="12" x2="12" y1="17" y2="10" />
    <line x1="16" x2="16" y1="17" y2="7" />
    <line x1="3" x2="21" y1="21" y2="21" />
  </svg>
);

interface CopilotWidgetProps {
  selectionStats: RangeStats | null;
}

const CopilotWidget: React.FC<CopilotWidgetProps> = ({ selectionStats }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localInput, setLocalInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chat = useCopilotChat({ id: 'asset-analyst-chat' });
  const { visibleMessages, appendMessage, isLoading } = chat;
  const messages = visibleMessages ?? [];

  const [dynamicSuggestions, setDynamicSuggestions] = useState<string[]>([]);

  const buildSuggestions = (stats: RangeStats | null) => {
    const dir = stats ? (stats.delta >= 0 ? '上漲' : '下跌') : '走勢';
    return [
      `解釋此區間為何${dir}？列三點原因`,
      '未來一週情境與關鍵價位',
      '這段資料還缺少哪些背景資訊',
    ];
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(scrollToBottom, [messages, isLoading]);

  useEffect(() => {
    if (messages.length > 0) {
      const lastMsg: any = messages[messages.length - 1];
      if (hasMessageRole(lastMsg, Role.Assistant)) {
        setDynamicSuggestions(extractFollowUps(getMessageText(lastMsg.content)));
      }
    }
  }, [messages]);

  const lastStatsRef = useRef<RangeStats | null>(null);

  useEffect(() => {
    if (selectionStats && selectionStats !== lastStatsRef.current && appendMessage) {
      lastStatsRef.current = selectionStats;
      setIsOpen(true);

      const systemPrompt = `請以繁體中文回覆以下內容，遵循以下要求：
1.僅就數據本身進行事實性解讀，不提供任何投資、買賣或資產配置建議
2.回答要簡短精準，直接點出核心重點
3.使用純文字格式，不使用任何 markdown 語法
4.可說明潛在風險來源，但不得評論「是否適合投資」或「應如何操作」
5.在回答最後提供三個與資料背景或數據品質相關的後續追問問題，每題約8到15字，格式以「您還可以問：」開頭，後以序號列點回覆，如：「1. 該標的物性質為何？」

`;
      const prompt = `${systemPrompt}分析此區間（請精簡條列）：
      日期: ${selectionStats.startDate} 至 ${selectionStats.endDate}
      起始: ${selectionStats.startValue}
      結束: ${selectionStats.endValue}
      最高: ${selectionStats.maxValue}
      最低: ${selectionStats.minValue}
      變動: ${selectionStats.delta} (${selectionStats.deltaPercent.toFixed(2)}%)
      
      請總結走勢、風險與值得進一步確認的資料面向。`;

      appendMessage(
        new TextMessage({
          role: Role.User,
          content: prompt,
        }),
      );
    }
  }, [selectionStats, appendMessage]);

  const handleSend = () => {
    if (!localInput.trim() || !appendMessage) return;
    appendMessage(
      new TextMessage({
        role: Role.User,
        content: localInput,
      }),
    );
    setLocalInput('');
  };

  return (
    <div className="fixed bottom-2xl right-2xl z-50 flex flex-col items-end pointer-events-none">
      <div
        className={`
          pointer-events-auto flex h-[500px] w-[380px] origin-bottom-right flex-col overflow-hidden rounded-[16px] border border-outline-2 bg-surface-1 shadow-light-down-2 transition-all duration-300 ease-in-out
          ${
            isOpen
              ? 'scale-100 opacity-100 translate-y-0'
              : 'scale-95 opacity-0 translate-y-10 pointer-events-none h-0 w-0'
          }
        `}
      >
        <div className="relative flex items-center justify-between border-b border-outline-2 bg-surface-2 p-md">
          <div className="flex items-center gap-sm">
            <div className="rounded-lg bg-primary-container p-[6px] text-primary-hover">
              <RobotIcon />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-on-surface">Copilot 資產助理</h3>
              <p className="text-xs text-on-surface-variant">Powered by CopilotKit</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="rounded-full p-[6px] text-on-surface-variant transition-colors hover:bg-surface-3 hover:text-on-surface"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="flex-1 space-y-md overflow-y-auto bg-surface-2/60 p-md">
          {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center px-lg text-center text-sm text-on-surface-variant">
              <div className="mb-2 opacity-50">
                <RobotIcon />
              </div>
              <p>
                請在左側圖表選取任意區間
                <br />
                Copilot 將為您分析
              </p>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div
              key={msg.id}
              className={`flex ${hasMessageRole(msg, Role.User) ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`
                  max-w-[90%] rounded-[16px] px-lg py-md text-sm leading-relaxed
                  ${
                    hasMessageRole(msg, Role.User)
                      ? 'rounded-br-none bg-primary-hover text-white'
                      : 'rounded-bl-none border border-outline-2 bg-surface-1 text-on-surface shadow-light-down-1'
                  }
                `}
              >
                {hasMessageRole(msg, Role.Assistant) && (
                  <div className="mb-2 flex items-center border-b border-outline-2 pb-1 text-xs font-bold text-primary-hover">
                    <ChartIcon /> 分析報告
                  </div>
                )}
                <div className="whitespace-pre-wrap font-sans">
                  {stripFollowUps(
                    getMessageText('content' in msg ? msg.content : undefined).replace(
                      /^請以繁體中文.*性質為何？」\s+/s,
                      '',
                    ),
                  ) || '...'}
                </div>

                {hasMessageRole(msg, Role.Assistant) &&
                  idx === messages.length - 1 &&
                  !isLoading && (
                    <div className="mt-md flex flex-wrap gap-sm">
                      {(dynamicSuggestions.length > 0
                        ? dynamicSuggestions
                        : buildSuggestions(selectionStats || null)
                      ).map((s, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() =>
                            appendMessage
                              ? void appendMessage(new TextMessage({ role: Role.User, content: s }))
                              : undefined
                          }
                          className="rounded-full border border-outline-2 bg-surface-2 px-md py-xs text-xs text-on-surface transition-colors hover:bg-surface-3"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-sm rounded-[16px] rounded-bl-none border border-outline-2 bg-surface-1 px-lg py-md shadow-light-down-1">
                <div className="h-[6px] w-[6px] animate-bounce rounded-full bg-primary"></div>
                <div
                  className="h-[6px] w-[6px] animate-bounce rounded-full bg-primary"
                  style={{ animationDelay: '0.2s' }}
                ></div>
                <div
                  className="h-[6px] w-[6px] animate-bounce rounded-full bg-primary"
                  style={{ animationDelay: '0.4s' }}
                ></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-outline-2 bg-surface-1 p-md">
          <div className="flex items-center gap-sm rounded-full bg-surface-2 px-md py-sm transition-all focus-within:ring-2 focus-within:ring-primary-container">
            <input
              type="text"
              className="flex-1 border-none bg-transparent text-sm text-on-surface outline-none placeholder:text-on-surface-variant"
              placeholder="輸入訊息..."
              value={localInput}
              onChange={(e) => setLocalInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={isLoading}
            />
            <Button
              type="button"
              onClick={handleSend}
              disabled={isLoading || !localInput.trim()}
              className="min-w-0 rounded-full px-sm py-xs"
              size="small"
            >
              <SendIcon />
            </Button>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          pointer-events-auto mt-lg flex h-[56px] w-[56px] items-center justify-center rounded-full bg-primary-hover text-white shadow-light-down-2 transition-all duration-300 hover:bg-primary-active
          ${isOpen ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}
        `}
      >
        <RobotIcon />
      </button>
    </div>
  );
};

export default CopilotWidget;

// ====== 輔助：從助理回覆解析「後續追問」（符合提示詞格式） ======
function extractFollowUps(text: string): string[] {
  const maxLen = 3;
  const t = (text || '').trim();
  if (!t) return [];

  const anchor = '您還可以問';
  const anchorIdx = t.lastIndexOf(anchor);
  let items: string[] = [];

  if (anchorIdx !== -1) {
    const after = t
      .slice(anchorIdx)
      .replace(/^.*?[：:]\s*/u, '')
      .trim();

    const re = /(?:^|[\n\r])\s*\d+[\.、\)]\s*([^\n\r]+)/gu;
    let m: RegExpExecArray | null;
    while ((m = re.exec(after)) && items.length < maxLen) {
      const normalized = normalizeItem(m[1]);
      if (normalized) items.push(normalized);
    }

    if (items.length === 0) {
      items = splitCandidates(after);
    }
  } else {
    const tail = t.slice(Math.max(0, t.length - 800));
    items = splitCandidates(tail);
  }

  const uniq: string[] = [];
  for (const s of items) {
    const cleaned = normalizeItem(s);
    if (cleaned) {
      if (!uniq.includes(cleaned)) uniq.push(cleaned);
      if (uniq.length >= maxLen) break;
    }
  }
  return uniq;
}

function normalizeItem(s: string): string | null {
  const q = (s || '')
    .trim()
    .replace(/^[\s\-•\d\.、\)]+/u, '')
    .replace(/[。；;]+$/u, '')
    .trim();
  if (!q) return null;
  const len = [...q].length;
  if (len < 5) return null;
  return q;
}

function splitCandidates(text: string): string[] {
  return (text || '')
    .split(/\n|。|；|;|、/u)
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && /[？?]$/.test(s));
}

function stripFollowUps(text: string): string {
  const t = (text || '').trim();
  if (!t) return '';
  const anchor = '您還可以問';
  const idx = t.lastIndexOf(anchor);
  if (idx === -1) return t;
  return t
    .slice(0, idx)
    .replace(/[\n\r]+$/u, '')
    .trim();
}
