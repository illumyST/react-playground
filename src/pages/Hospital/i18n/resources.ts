const zhTW = {
  common: {
    appName: 'Hospital Tech Starter',
    dashboard: '總覽儀表板',
    integrations: '整合元件',
    stickyTable: 'Sticky Table',
    settings: '設定',
    mockAdmin: 'Mock Admin',
    fallbackMessage: '畫面發生未預期錯誤。',
    backToDashboard: '回到儀表板',
    notFound: '找不到頁面',
  },
  dashboard: {
    title: '醫療站台總覽',
    subtitle: '透過 Query、generated API client 與 Jotai 檢視目前 shell mock 狀態。',
    stationHealth: '站台健康度',
    apiLatency: 'API 延遲',
    openAlerts: '開啟警示',
    queueDepth: '佇列深度',
    lastSync: '最後同步時間',
  },
  integrations: {
    title: '整合能力狀態',
  },
  stickyTable: {
    title: '跨欄位 Sticky Table',
    subtitle: '示範 sticky header 與 sticky first column 的長表格資料。',
    station: '照護站',
    owner: '負責單位',
    status: '狀態',
    capacity: '容量',
    latency: '延遲',
    sync: '同步時間',
    notes: '備註',
  },
  settings: {
    title: '系統設定',
    language: '語言',
    facility: '院區',
    description: '切換 shell 顯示上下文與 mock scenario。',
  },
};

export type HospitalTranslation = typeof zhTW;

const enUS: HospitalTranslation = {
  common: {
    appName: 'Hospital Tech Starter',
    dashboard: 'Dashboard',
    integrations: 'Integrations',
    stickyTable: 'Sticky Table',
    settings: 'Settings',
    mockAdmin: 'Mock Admin',
    fallbackMessage: 'An unexpected UI error was captured.',
    backToDashboard: 'Back to dashboard',
    notFound: 'Page not found',
  },
  dashboard: {
    title: 'Care Station Overview',
    subtitle: 'Inspect shell mock state through Query, generated API clients, and Jotai.',
    stationHealth: 'Station Health',
    apiLatency: 'API Latency',
    openAlerts: 'Open Alerts',
    queueDepth: 'Queue Depth',
    lastSync: 'Last Sync',
  },
  integrations: {
    title: 'Integration Status',
  },
  stickyTable: {
    title: 'Sticky Table',
    subtitle: 'Demonstrates sticky header and first-column behavior for long operational grids.',
    station: 'Station',
    owner: 'Owner',
    status: 'Status',
    capacity: 'Capacity',
    latency: 'Latency',
    sync: 'Sync Time',
    notes: 'Notes',
  },
  settings: {
    title: 'Settings',
    language: 'Language',
    facility: 'Facility',
    description: 'Switch shell display context and mock scenario.',
  },
};

export const hospitalResources = {
  'zh-TW': zhTW,
  'en-US': enUS,
} as const;

export type HospitalLanguage = keyof typeof hospitalResources;
