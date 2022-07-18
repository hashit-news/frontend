import { BackendApiClient } from './swagger/BackendApiClient';

const api = new BackendApiClient({
  BASE: process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL,
  CREDENTIALS: 'include',
});

export default api;
