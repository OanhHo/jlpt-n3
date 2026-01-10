// 🔐 Login Page với form validation

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './AuthPages.css';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Redirect if already logged in
    useEffect(() => {
        if (isAuthenticated()) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = 'Email là bắt buộc';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        if (!formData.password) {
            newErrors.password = 'Mật khẩu là bắt buộc';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        setErrors({});

        try {
            const result = await login(formData.email, formData.password);

            if (result.success) {
                // Show success message
                alert(`Đăng nhập thành công! Chào mừng ${result.data.user.name}`);

                // Redirect to dashboard
                navigate('/dashboard');
            } else {
                setErrors({ submit: result.error || 'Đăng nhập thất bại' });
            }
        } catch (error) {
            console.error('Login error:', error);
            setErrors({ submit: 'Lỗi kết nối server. Vui lòng thử lại!' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>🔐 Đăng Nhập</h1>
                    <p>Chào mừng bạn quay trở lại!</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {/* Email Field */}
                    <div className="form-group">
                        <label htmlFor="email">📧 Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={errors.email ? 'error' : ''}
                            placeholder="Nhập email của bạn"
                            disabled={loading}
                        />
                        {errors.email && <div className="error-message">{errors.email}</div>}
                    </div>

                    {/* Password Field */}
                    <div className="form-group">
                        <label htmlFor="password">🔒 Mật khẩu</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={errors.password ? 'error' : ''}
                            placeholder="Nhập mật khẩu"
                            disabled={loading}
                        />
                        {errors.password && <div className="error-message">{errors.password}</div>}
                    </div>

                    {/* Submit Error */}
                    {errors.submit && (
                        <div className="error-message submit-error">{errors.submit}</div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading ? '⏳ Đang đăng nhập...' : '🚀 Đăng Nhập'}
                    </button>
                </form>

                {/* Demo Account Info */}
                <div className="demo-info">
                    <h3>🎯 Tài khoản demo:</h3>
                    <div className="demo-accounts">
                        <div>
                            <strong>Admin:</strong> admin@example.com / admin123
                        </div>
                        <div>
                            <strong>User:</strong> an@example.com / user123
                        </div>
                    </div>
                </div>

                {/* Links */}
                <div className="auth-links">
                    <p>
                        Chưa có tài khoản? {' '}
                        <Link to="/register" className="auth-link">
                            Đăng ký ngay
                        </Link>
                    </p>
                    <Link to="/" className="auth-link">
                        ← Về trang chủ
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;