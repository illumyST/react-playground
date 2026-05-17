// Centralized environment accessor & lightweight validation

const bool = (value: string | undefined, fallback = false) => value === 'true' ? true : value === 'false' ? false : fallback;

export const ENV = {
  APP_NAME: import.meta.env.VITE_APP_NAME ?? 'App',
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  ENABLE_MOCK: bool(import.meta.env.VITE_ENABLE_MOCK, false),
  FEATURE_EXPERIMENTAL_UI: bool(import.meta.env.VITE_FEATURE_EXPERIMENTAL_UI, false),
} as const;

export function assertEnv() {
  if (!ENV.API_BASE_URL) {
    // Fail fast in production build/runtime
    if (import.meta.env.PROD) {
      throw new Error('[env] VITE_API_BASE_URL is missing');
    }
    console.warn('[env] VITE_API_BASE_URL is empty (development)');
  }
}

// Optionally call assertEnv() early in main.tsx
