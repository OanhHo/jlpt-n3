import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <h1>Chào mừng đến với Website ReactJS</h1>
                    <p className="hero-subtitle">
                        Dự án mẫu multi-page với React Router, Components, và Modern UI
                    </p>
                    <div className="hero-buttons">
                        <Link to="/products" className="btn btn-primary">
                            Xem sản phẩm
                        </Link>
                        <Link to="/about" className="btn btn-secondary">
                            Tìm hiểu thêm
                        </Link>
                    </div>
                </div>
                <div className="hero-image">
                    <img
                        src="https://via.placeholder.com/500x300/4CAF50/white?text=React+Multi+Page"
                        alt="React Multi Page"
                    />
                </div>
            </section>

            {/* Features Section */}
            <section className="features">
                <div className="container">
                    <h2>Tính năng nổi bật</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">🚀</div>
                            <h3>React Router</h3>
                            <p>Navigation mượt mà giữa các trang với React Router DOM</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🎨</div>
                            <h3>Modern UI</h3>
                            <p>Giao diện đẹp mắt, responsive trên mọi thiết bị</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">⚡</div>
                            <h3>Fast Performance</h3>
                            <p>Tối ưu hóa performance với React Hooks và best practices</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🔧</div>
                            <h3>Reusable Components</h3>
                            <p>Components tái sử dụng, dễ maintain và scale</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats">
                <div className="container">
                    <h2>Thống kê website</h2>
                    <div className="stats-grid">
                        <div className="stat-item">
                            <div className="stat-number">1000+</div>
                            <div className="stat-label">Người dùng</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">50+</div>
                            <div className="stat-label">Sản phẩm</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">99%</div>
                            <div className="stat-label">Hài lòng</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">24/7</div>
                            <div className="stat-label">Hỗ trợ</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta">
                <div className="container">
                    <h2>Sẵn sàng bắt đầu?</h2>
                    <p>Liên hệ với chúng tôi để được tư vấn miễn phí</p>
                    <Link to="/contact" className="btn btn-primary btn-large">
                        Liên hệ ngay
                    </Link>
                </div>
            </section>
        </div>
    );
}

export default HomePage;