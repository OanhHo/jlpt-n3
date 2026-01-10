// 📝 Posts API Service

import { apiCall, buildQueryString } from './api.js';

export const postsApi = {
    // Lấy danh sách posts
    getPosts: async (params = {}) => {
        const queryString = buildQueryString(params);
        const endpoint = queryString ? `/posts?${queryString}` : '/posts';
        return await apiCall(endpoint);
    },

    // Lấy post theo ID
    getPostById: async (id) => {
        return await apiCall(`/posts/${id}`);
    },

    // Search posts
    searchPosts: async (searchTerm, filters = {}) => {
        const params = {
            search: searchTerm,
            ...filters,
        };
        return await postsApi.getPosts(params);
    },

    // Lấy posts theo category
    getPostsByCategory: async (category, page = 1, limit = 10) => {
        return await postsApi.getPosts({ category, page, limit });
    },

    // Lấy posts theo author
    getPostsByAuthor: async (author, page = 1, limit = 10) => {
        return await postsApi.getPosts({ author, page, limit });
    },

    // Lấy latest posts
    getLatestPosts: async (limit = 5) => {
        return await postsApi.getPosts({ limit });
    },

    // Lấy all categories
    getCategories: async () => {
        const allPosts = await postsApi.getPosts({ limit: 1000 });
        const categories = [...new Set(allPosts.data.map(post => post.category))];
        return categories;
    },
};

export default postsApi;