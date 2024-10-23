/// <reference types="vite/types/importMeta.d.ts" />

interface ImportMetaEnv {
  readonly VITE_YOUR_URL: string;
  readonly VITE_REALM: string;
  readonly VITE_CLIENT_ID: string;
  readonly VITE_OPEN_AI_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
