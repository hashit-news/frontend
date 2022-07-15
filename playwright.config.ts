import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  webServer: {
    command: 'yarn build && yarn preview',
    port: parseInt(process.env.VITE_PREVIEW_PORT || '3001', 10) ?? 3001,
  },
};

export default config;
