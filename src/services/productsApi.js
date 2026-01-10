// 🛍️ Products API Service

import { apiCall, buildQueryString } from './api.js';

export const productsApi = {
    // Lấy danh sách products
    getProducts: async (params = {}) => {
        const queryString = buildQueryString(params);
        const endpoint = queryString ? `/products?${queryString}` : '/products';
        return await apiCall(endpoint);
    },

    // Lấy product theo ID
    getProductById: async (id) => {
        return await apiCall(`/products/${id}`);
    },

    // Tạo product mới
    createProduct: async (productData) => {
        return await apiCall('/products', {
            method: 'POST',
            body: JSON.stringify(productData),
        });
    },

    // Search products
    searchProducts: async (searchTerm, filters = {}) => {
        const params = {
            search: searchTerm,
            ...filters,
        };
        return await productsApi.getProducts(params);
    },

    // Lấy products theo category
    getProductsByCategory: async (category, page = 1, limit = 10) => {
        return await productsApi.getProducts({ category, page, limit });
    },

    // Lấy products theo price range
    getProductsByPriceRange: async (minPrice, maxPrice, page = 1, limit = 10) => {
        return await productsApi.getProducts({ minPrice, maxPrice, page, limit });
    },

    // Lấy all categories
    getCategories: async () => {
        const allProducts = await productsApi.getProducts({ limit: 1000 });
        const categories = [...new Set(allProducts.data.map(product => product.category))];
        return categories;
    },
};

export default productsApi;