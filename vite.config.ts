import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname, 'env'), '');
  process.env = Object.assign(process.env, env);
  const runtimePort = env.COPILOTKIT_RUNTIME_PORT ?? '4000';

  return {
    plugins: [react(), tailwindcss()],
    envDir: 'env',
    server: {
      proxy: {
        '/copilotkit': {
          target: `http://127.0.0.1:${runtimePort}`,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  };
});
