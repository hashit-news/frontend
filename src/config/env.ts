const getEnv = (name: string, defaultVal: string): string => {
  const val = process.env[name] as string;

  return val || defaultVal;
};

const getIntEnv = (name: string, defaultVal: number): number => {
  const val = getEnv(name, '');

  if (!val) {
    return defaultVal;
  }

  return parseInt(val, 10);
};

const envConfig = {
  backendApiBaseUrl: getEnv('NEXT_PUBLIC_BACKEND_API_BASE_URL', 'http://localhost:8080'),
  ethAllowedChainId: getIntEnv('NEXT_PUBLIC_ETH_ALLOWED_CHAIN_ID', 3),
};

export default envConfig;
