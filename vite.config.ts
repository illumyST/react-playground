import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';
import path from 'node:path';

// Audio VAD 頁面所需的 Silero 模型與 ONNX Runtime WASM，直接取自 node_modules，以 /vad/ 路徑提供
// onnxruntime-web 已 alias 為純 WASM build，只需非 jsep 版的 wasm（jsep 版 29MB 超過 Cloudflare 單檔 25MiB 上限）
const VAD_ASSETS: Record<string, string> = {
  'silero_vad_legacy.onnx': 'node_modules/@ricky0123/vad-web/dist/silero_vad_legacy.onnx',
  'ort-wasm-simd-threaded.mjs': 'node_modules/onnxruntime-web/dist/ort-wasm-simd-threaded.mjs',
  'ort-wasm-simd-threaded.wasm': 'node_modules/onnxruntime-web/dist/ort-wasm-simd-threaded.wasm',
};

const VAD_CONTENT_TYPES: Record<string, string> = {
  '.mjs': 'text/javascript',
  '.wasm': 'application/wasm',
  '.onnx': 'application/octet-stream',
};

function vadAssets(): Plugin {
  return {
    name: 'vad-assets',
    // 開發環境：攔截 /vad/ 請求直接串流檔案，避免 Vite 對 .mjs 做轉換
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const fileName = req.url?.split('?')[0].match(/^\/vad\/(.+)$/)?.[1];
        const source = fileName && VAD_ASSETS[fileName];
        if (!source) return next();

        res.setHeader('Content-Type', VAD_CONTENT_TYPES[path.extname(fileName)]);
        res.setHeader('Cache-Control', 'no-cache');
        fs.createReadStream(path.resolve(__dirname, source)).pipe(res);
      });
    },
    // 建置：將檔案輸出至 dist/vad/
    generateBundle() {
      for (const [fileName, source] of Object.entries(VAD_ASSETS)) {
        this.emitFile({
          type: 'asset',
          fileName: `vad/${fileName}`,
          source: fs.readFileSync(path.resolve(__dirname, source)),
        });
      }
    },
  };
}

// public/docusaurus 是以 baseUrl /docusaurus/ 建置的靜態輸出，部署在子路徑時改寫為 {base}docusaurus/
function docusaurusBase(base: string): Plugin {
  let outDir = 'dist';
  return {
    name: 'docusaurus-base',
    apply: 'build',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      if (base === '/') return;
      const walk = (dir: string): string[] =>
        fs
          .readdirSync(dir, { withFileTypes: true })
          .flatMap((entry) =>
            entry.isDirectory() ? walk(path.join(dir, entry.name)) : [path.join(dir, entry.name)],
          );
      for (const file of walk(path.join(outDir, 'docusaurus'))) {
        if (!/\.(html|js|css|xml|json)$/.test(file)) continue;
        const content = fs.readFileSync(file, 'utf8');
        fs.writeFileSync(file, content.replaceAll('/docusaurus/', `${base}docusaurus/`));
      }
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname, 'env'), '');
  process.env = Object.assign(process.env, env);
  const runtimePort = env.COPILOTKIT_RUNTIME_PORT ?? '4000';
  const hospitalMockTarget = env.HOSPITAL_MOCK_SERVER_TARGET ?? 'http://127.0.0.1:5005';
  // 部署在子路徑時設定，例如 Cloudflare 的 /project/
  const base = env.BASE_PATH ?? '/';

  return {
    base,
    plugins: [react(), tailwindcss(), vadAssets(), docusaurusBase(base)],
    envDir: 'env',
    server: {
      proxy: {
        '/copilotkit': {
          target: `http://127.0.0.1:${runtimePort}`,
          changeOrigin: true,
          secure: false,
        },
        '/hospital-api': {
          target: hospitalMockTarget,
          changeOrigin: true,
        },
        '/mock-api': {
          target: hospitalMockTarget,
          changeOrigin: true,
        },
      },
    },
    resolve: {
      alias: [
        { find: '@', replacement: path.resolve(__dirname, 'src') },
        // @ricky0123/vad-web 只用到 WASM backend，改用不含 WebGPU 的 build 以縮小 wasm 檔
        { find: /^onnxruntime-web$/, replacement: 'onnxruntime-web/wasm' },
      ],
    },
  };
});
