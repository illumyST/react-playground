/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_ENABLE_MOCK: string; // 'true' | 'false'
  readonly VITE_FEATURE_EXPERIMENTAL_UI: string; // 'true' | 'false'
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
