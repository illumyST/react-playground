import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  CopilotRuntime,
  copilotRuntimeNodeHttpEndpoint,
  GoogleGenerativeAIAdapter,
} from '@copilotkit/runtime';
import dotenv from 'dotenv';

const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);
const repoRoot = path.resolve(currentDir, '..', '..', '..');
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';

// 與 Vite 相同：.local（不進版控，放 API key 等機密）優先於共用的 env 檔。
// dotenv 傳入多個 path 時，先讀到的值優先，且不覆寫既有的 process.env。
dotenv.config({
  path: [path.join(repoRoot, 'env', `${envFile}.local`), path.join(repoRoot, 'env', envFile)],
});

const geminiApiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY ?? process.env.GEMINI_API_KEY;

if (geminiApiKey) {
  process.env.GOOGLE_GENERATIVE_AI_API_KEY = geminiApiKey;
} else {
  throw new Error(
    'Missing GEMINI_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY in env/.env.development.local.',
  );
}

const runtime = new CopilotRuntime({
  remoteEndpoints: [
    {
      url: process.env.COPILOTKIT_BACKEND_URL ?? 'http://127.0.0.1:8000/copilotkit/',
    },
  ],
});

const handler = copilotRuntimeNodeHttpEndpoint({
  endpoint: '/copilotkit',
  runtime,
  serviceAdapter: new GoogleGenerativeAIAdapter({
    apiKey: geminiApiKey,
    model: process.env.COPILOTKIT_MODEL ?? 'gemini-2.5-flash',
  }),
});

const server = createServer((req, res) => handler(req, res));
const port = Number(process.env.COPILOTKIT_RUNTIME_PORT ?? 4000);

server.listen(port, () => {
  console.log(`Copilot runtime listening on http://127.0.0.1:${port}/copilotkit`);
});
