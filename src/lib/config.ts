const config = {
  app: {
    port: import.meta.env.VITE_APP_PORT,
  },
  api: {
    baseUrl: import.meta.env.VITE_HASHIT_BACKEND_API_BASE_PATH,
  },
};

export default config;
