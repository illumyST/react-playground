/** Mock Admin 在 playground 中的路由前綴（掛在 /hospital 底下） */
export const MOCK_ADMIN_BASE = '/hospital/mock-admin';

/** Mock server 的 admin API 與動態 mock API 前綴，對應 backend/hospital/mock-server 的 MOCK_API_URL */
export const MOCK_API_URL = import.meta.env.VITE_MOCK_ADMIN_API_URL || '/mock-api';
