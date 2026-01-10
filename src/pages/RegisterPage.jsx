// 📝 Register Page với form validation

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AuthPages.css';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

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

        if (!formData.name.trim()) {
            newErrors.name = 'Tên là bắt buộc';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Tên phải có ít nhất 2 ký tự';
        }

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

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Store token in localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                // Show success message
                alert(`Đăng ký thành công! Chào mừng ${data.user.name}`);

                // Redirect to dashboard or home
                navigate('/');
            } else {
                // Handle server errors
                if (data.errors) {
                    setErrors(data.errors);
                } else {
                    setErrors({ submit: data.error || 'Đăng ký thất bại' });
                }
            }
        } catch (error) {
            console.error('Register error:', error);
            setErrors({ submit: 'Lỗi kết nối server. Vui lòng thử lại!' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>📝 Đăng Ký</h1>
                    <p>Tạo tài khoản mới để bắt đầu!</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {/* Name Field */}
                    <div className="form-group">
                        <label htmlFor="name">👤 Họ và tên</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={errors.name ? 'error' : ''}
                            placeholder="Nhập họ và tên"
                            disabled={loading}
                        />
                        {errors.name && <div className="error-message">{errors.name}</div>}
                    </div>

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
                            placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
                            disabled={loading}
                        />
                        {errors.password && <div className="error-message">{errors.password}</div>}
                    </div>

                    {/* Confirm Password Field */}
                    <div className="form-group">
                        <label htmlFor="confirmPassword">🔒 Xác nhận mật khẩu</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={errors.confirmPassword ? 'error' : ''}
                            placeholder="Nhập lại mật khẩu"
                            disabled={loading}
                        />
                        {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
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
                        {loading ? '⏳ Đang đăng ký...' : '🚀 Đăng Ký'}
                    </button>
                </form>

                {/* Links */}
                <div className="auth-links">
                    <p>
                        Đã có tài khoản? {' '}
                        <Link to="/login" className="auth-link">
                            Đăng nhập ngay
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

export default RegisterPage;