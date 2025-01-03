/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly SECRET_BOOKMARKLETS_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
