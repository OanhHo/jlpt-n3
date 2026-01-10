// 📊 Statistics API Service

import { apiCall } from './api.js';

export const statsApi = {
    // Lấy thống kê tổng quan
    getStats: async () => {
        return await apiCall('/stats');
    },

    // Health check
    healthCheck: async () => {
        return await apiCall('/health');
    },
};

export default statsApi;