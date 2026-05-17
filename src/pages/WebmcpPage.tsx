import { useState, useEffect } from 'react';
import { Button } from '@/components';

/* ─── Declarative Tab ─── */

const Declarative = (): React.ReactNode => {
  const [logs, setLogs] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isAgent = (e.nativeEvent as any).agentInvoked;
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name');
    const gender = formData.get('gender');
    const occupation = formData.get('occupation');

    setLogs((prev) => [
      ...prev,
      `[${isAgent ? '🤖 Agent' : '🧑 User'}] 提交個人資料 - 姓名: ${name}, 性別: ${gender}, 職業: ${occupation}`,
    ]);
  };

  return (
    <div className="max-w-[576px] rounded-lg border border-outline-2 bg-surface-1 p-2xl shadow-light-down-3">
      <h2 className="title-lg mb-lg">Declarative API (個人資料表單)</h2>
      <ul className="mb-lg list-disc space-y-xs pl-xl text-sm text-on-surface-variant">
        <li>使用標準 HTML 表單宣告 Tool 等待 Agent 填寫。設定 <code>toolautosubmit</code> 屬性，當 Agent 填寫完畢會自動送出。</li>
        <li>Agent 操作期間會對應觸發 <code>:tool-form-active</code> 和 <code>:tool-submit-active</code> CSS</li>
      </ul>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-xl rounded-lg border border-outline-2 bg-surface-3 p-xl"
        {...{
          toolname: 'fill_personal_profile',
          tooldescription: 'Fill in user personal profile including name, gender, and occupation',
          toolautosubmit: 'true',
        }}
      >
        <div className="flex flex-col gap-xs">
          <label htmlFor="name" className="text-sm font-bold text-on-surface">姓名</label>
          <input
            id="name" type="text" name="name" required
            className="rounded-md border border-outline-2 bg-surface-1 px-md py-sm outline-none focus:border-steel-500"
            placeholder="請輸入姓名"
            {...{ toolparamtitle: 'User Name', toolparamdescription: 'The real full name of the user' }}
          />
        </div>

        <div className="flex flex-col gap-xs">
          <span className="text-sm font-bold text-on-surface">性別</span>
          <div
            className="flex items-center gap-xl rounded-md border border-outline-2 bg-surface-1 px-md py-sm"
            {...{ toolparamtitle: 'User Gender', toolparamdescription: 'The gender identity of the user' }}
          >
            <label className="flex cursor-pointer items-center gap-sm text-sm">
              <input type="radio" name="gender" value="Male" required className="accent-steel-500 cursor-pointer" /> 男
            </label>
            <label className="flex cursor-pointer items-center gap-sm text-sm">
              <input type="radio" name="gender" value="Female" required className="accent-steel-500 cursor-pointer" /> 女
            </label>
            <label className="flex cursor-pointer items-center gap-sm text-sm">
              <input type="radio" name="gender" value="Other" required className="accent-steel-500 cursor-pointer" /> 其他
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-xs">
          <label htmlFor="occupation" className="text-sm font-bold text-on-surface">職業</label>
          <select
            id="occupation" name="occupation" required
            className="rounded-md border border-outline-2 bg-surface-1 px-md py-sm outline-none focus:border-steel-500"
            {...{ toolparamtitle: 'User Occupation', toolparamdescription: 'Currently working profession of the user' }}
          >
            <option value="">請選擇職業...</option>
            <option value="Engineer">工程師</option>
            <option value="Designer">設計師</option>
            <option value="Manager">專案經理</option>
          </select>
        </div>

        <Button type="submit" className="mt-sm">Submit</Button>
        <Button type="reset" variant="outlined">Reset</Button>
      </form>

      {logs.length > 0 && (
        <div className="mt-2xl rounded-md border border-outline-2 bg-surface-3 p-lg">
          <h3 className="mb-sm text-sm font-bold">Execution Logs:</h3>
          <ul className="list-disc space-y-xs pl-xl font-mono text-sm text-on-surface-variant">
            {logs.map((log, i) => <li key={i}>{log}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
};

/* ─── Imperative Tab ─── */

const Imperative = (): React.ReactNode => {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const nav = window.navigator as any;
    if (!nav.modelContext) return;

    nav.modelContext.registerTool({
      name: 'addTodo',
      description: 'Add a new item to the todo list via Imperative API',
      inputSchema: { type: 'object', properties: { text: { type: 'string' } } },
      annotations: { readOnlyHint: 'true' },
      execute: ({ text }: { text: string }) => {
        setLogs((prev) => [...prev, `Added todo: ${text}`]);
        return { content: [{ type: 'text', text: `Added todo: ${text}` }] };
      },
    });

    return () => nav.modelContext.unregisterTool?.('addTodo');
  }, []);

  return (
    <div className="max-w-[576px] rounded-lg border border-outline-2 bg-surface-1 p-2xl shadow-light-down-3">
      <h2 className="title-lg mb-lg">Imperative API</h2>
      <ul className="mb-lg list-disc space-y-xs pl-xl text-sm text-on-surface-variant">
        <li>切換到此 Tab 時，已自動透過 <code>navigator.modelContext.registerTool</code> 註冊了 <code>addTodo</code> Tool。</li>
        <li>切換離開時會呼叫 <code>unregisterTool</code> 清除註冊。</li>
      </ul>
      <div className="min-h-[120px] rounded-md border border-outline-2 bg-surface-3 p-lg">
        <h3 className="mb-sm text-sm font-bold">Tool Output:</h3>
        {logs.length === 0 ? (
          <p className="text-sm italic text-on-surface-variant">No tools executed yet</p>
        ) : (
          <ul className="list-disc space-y-xs pl-xl font-mono text-sm text-on-surface-variant">
            {logs.map((log, i) => <li key={i}>{log}</li>)}
          </ul>
        )}
      </div>
    </div>
  );
};

/* ─── WebMCP Page ─── */

const WebmcpPage = (): React.ReactNode => {
  const [activeTab, setActiveTab] = useState<'declarative' | 'imperative'>('declarative');

  return (
    <div className="flex w-full min-h-main flex-col space-y-lg">
      <style>{`
        form:tool-form-active {
          outline: 4px solid var(--color-steel-500);
          border-radius: 0.75rem;
          transition: outline 0.2s ease-in-out;
        }
        button:tool-submit-active {
          color: white !important;
          background-color: var(--color-rose-500) !important;
          transform: scale(0.95);
          transition: all 0.2s ease-in-out;
        }
      `}</style>

      <div>
        <h1 className="title-2xl mb-sm">WebMCP Examples</h1>
        <p className="text-on-surface-variant">切換 Tab 時，只會註冊該 Tab 的 Tool 供 Agent 使用。</p>
      </div>

      <div className="flex space-x-sm border-b border-outline-2">
        <button
          onClick={() => setActiveTab('declarative')}
          className={`px-lg py-sm font-bold transition-colors ${
            activeTab === 'declarative'
              ? 'border-b-2 border-steel-500 text-steel-500'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Declarative API
        </button>
        <button
          onClick={() => setActiveTab('imperative')}
          className={`px-lg py-sm font-bold transition-colors ${
            activeTab === 'imperative'
              ? 'border-b-2 border-steel-500 text-steel-500'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Imperative API
        </button>
      </div>

      <div className="flex-1">
        {activeTab === 'declarative' && <Declarative />}
        {activeTab === 'imperative' && <Imperative />}
      </div>
    </div>
  );
};

export default WebmcpPage;
