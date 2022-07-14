import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [sveltekit()],
  server: {
    port: parseInt(process.env.VITE_APP_PORT || '3000', 10) ?? 3000,
  },
};

export default config;
