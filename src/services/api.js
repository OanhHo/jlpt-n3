// 🌐 API Configuration và Base Service

const API_BASE_URL = 'http://localhost:5000/api';

// API Configuration
const apiConfig = {
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds
};

// Get JWT token from localStorage
const getAuthToken = () => {
    return localStorage.getItem('token');
};

// Generic API call function
export const apiCall = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;

    // Add Authorization header if token exists
    const token = getAuthToken();
    const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

    const config = {
        ...apiConfig,
        ...options,
        headers: {
            ...apiConfig.headers,
            ...authHeaders,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(url, config);

        // Kiểm tra response status
        if (!response.ok) {
            const errorData = await response.json().catch(() => null);

            // Handle 401 Unauthorized - redirect to login
            if (response.status === 401) {
                // Clear invalid token
                localStorage.removeItem('token');
                localStorage.removeItem('user');

                // Dispatch event để AuthContext biết user đã logout
                window.dispatchEvent(new Event('auth-logout'));
            }

            throw new Error(errorData?.error || `HTTP Error: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`API Error [${endpoint}]:`, error);
        throw error;
    }
};

// Helper function để build query string
export const buildQueryString = (params) => {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            query.append(key, value.toString());
        }
    });

    return query.toString();
};

// Helper function để handle API errors
export const handleApiError = (error) => {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
        return 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.';
    }

    if (error.message.includes('timeout')) {
        return 'Yêu cầu bị timeout. Vui lòng thử lại.';
    }

    return error.message || 'Có lỗi xảy ra. Vui lòng thử lại.';
};

export default {
    apiCall,
    buildQueryString,
    handleApiError,
    API_BASE_URL,
};