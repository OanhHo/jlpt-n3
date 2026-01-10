// 🪝 Custom Hooks cho API calls

import { useState, useEffect, useCallback } from 'react';
import { handleApiError } from '../services/api.js';

// Hook generic cho API calls
export const useApi = (apiFunction, dependencies = []) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async (...args) => {
        try {
            setLoading(true);
            setError(null);
            const result = await apiFunction(...args);
            setData(result);
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setLoading(false);
        }
    }, dependencies);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const refetch = useCallback((...args) => {
        return fetchData(...args);
    }, [fetchData]);

    return { data, loading, error, refetch };
};

// Hook cho Users API
export const useUsers = (params = {}) => {
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { usersApi } = require('../services');

    const fetchUsers = useCallback(async (newParams = {}) => {
        try {
            setLoading(true);
            setError(null);
            const result = await usersApi.getUsers({ ...params, ...newParams });
            setUsers(result.data);
            setPagination(result.pagination);
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setLoading(false);
        }
    }, [params]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    return { users, pagination, loading, error, refetch: fetchUsers };
};

// Hook cho Products API
export const useProducts = (params = {}) => {
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { productsApi } = require('../services');

    const fetchProducts = useCallback(async (newParams = {}) => {
        try {
            setLoading(true);
            setError(null);
            const result = await productsApi.getProducts({ ...params, ...newParams });
            setProducts(result.data);
            setPagination(result.pagination);
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setLoading(false);
        }
    }, [params]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return { products, pagination, loading, error, refetch: fetchProducts };
};

// Hook cho Posts API
export const usePosts = (params = {}) => {
    const [posts, setPosts] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { postsApi } = require('../services');

    const fetchPosts = useCallback(async (newParams = {}) => {
        try {
            setLoading(true);
            setError(null);
            const result = await postsApi.getPosts({ ...params, ...newParams });
            setPosts(result.data);
            setPagination(result.pagination);
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setLoading(false);
        }
    }, [params]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    return { posts, pagination, loading, error, refetch: fetchPosts };
};

// Hook cho single item (user, product, post)
export const useItem = (apiFunction, id) => {
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchItem = useCallback(async () => {
        if (!id) return;

        try {
            setLoading(true);
            setError(null);
            const result = await apiFunction(id);
            setItem(result);
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setLoading(false);
        }
    }, [apiFunction, id]);

    useEffect(() => {
        fetchItem();
    }, [fetchItem]);

    return { item, loading, error, refetch: fetchItem };
};

// Hook cho form submissions
export const useSubmit = (apiFunction) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const submit = useCallback(async (...args) => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(false);
            const result = await apiFunction(...args);
            setSuccess(true);
            return result;
        } catch (err) {
            setError(handleApiError(err));
            throw err;
        } finally {
            setLoading(false);
        }
    }, [apiFunction]);

    const reset = useCallback(() => {
        setError(null);
        setSuccess(false);
    }, []);

    return { submit, loading, error, success, reset };
};