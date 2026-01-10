// 👥 Users API Service

import { apiCall, buildQueryString } from './api.js';

export const usersApi = {
    // Lấy danh sách users
    getUsers: async (params = {}) => {
        const queryString = buildQueryString(params);
        const endpoint = queryString ? `/users?${queryString}` : '/users';
        return await apiCall(endpoint);
    },

    // Lấy user theo ID
    getUserById: async (id) => {
        return await apiCall(`/users/${id}`);
    },

    // Tạo user mới
    createUser: async (userData) => {
        return await apiCall('/users', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    },

    // Cập nhật user
    updateUser: async (id, userData) => {
        return await apiCall(`/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(userData),
        });
    },

    // Xóa user
    deleteUser: async (id) => {
        return await apiCall(`/users/${id}`, {
            method: 'DELETE',
        });
    },

    // Search users
    searchUsers: async (searchTerm, filters = {}) => {
        const params = {
            search: searchTerm,
            ...filters,
        };
        return await usersApi.getUsers(params);
    },

    // Lấy users theo role
    getUsersByRole: async (role, page = 1, limit = 10) => {
        return await usersApi.getUsers({ role, page, limit });
    },
};

export default usersApi;