import React, { useState } from 'react';

function ProductsPage() {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const categories = [
        { id: 'all', name: 'Tất cả', icon: '📦' },
        { id: 'web', name: 'Web Apps', icon: '🌐' },
        { id: 'mobile', name: 'Mobile Apps', icon: '📱' },
        { id: 'ecommerce', name: 'E-commerce', icon: '🛒' },
        { id: 'tools', name: 'Tools', icon: '🔧' }
    ];

    const products = [
        {
            id: 1,
            name: "E-commerce Platform",
            category: "ecommerce",
            price: "2,999,000",
            image: "https://via.placeholder.com/300x200/FF5722/white?text=E-commerce",
            description: "Nền tảng bán hàng online hoàn chỉnh với quản lý kho, thanh toán, và analytics",
            features: ["Responsive Design", "Payment Gateway", "Admin Dashboard", "SEO Optimized"],
            rating: 4.8,
            reviews: 156
        },
        {
            id: 2,
            name: "React Dashboard",
            category: "web",
            price: "1,999,000",
            image: "https://via.placeholder.com/300x200/2196F3/white?text=Dashboard",
            description: "Dashboard admin với charts, tables, và real-time data visualization",
            features: ["Real-time Data", "Custom Charts", "User Management", "Dark Mode"],
            rating: 4.9,
            reviews: 203
        },
        {
            id: 3,
            name: "Mobile Food App",
            category: "mobile",
            price: "3,500,000",
            image: "https://via.placeholder.com/300x200/4CAF50/white?text=Food+App",
            description: "Ứng dụng đặt đồ ăn với GPS tracking, payment, và review system",
            features: ["GPS Tracking", "Push Notifications", "Multi-language", "Offline Mode"],
            rating: 4.7,
            reviews: 89
        },
        {
            id: 4,
            name: "Task Management Tool",
            category: "tools",
            price: "1,500,000",
            image: "https://via.placeholder.com/300x200/9C27B0/white?text=Task+Tool",
            description: "Công cụ quản lý công việc team với kanban board và time tracking",
            features: ["Kanban Board", "Time Tracking", "Team Collaboration", "Reports"],
            rating: 4.6,
            reviews: 134
        },
        {
            id: 5,
            name: "Learning Management System",
            category: "web",
            price: "4,999,000",
            image: "https://via.placeholder.com/300x200/FF9800/white?text=LMS",
            description: "Hệ thống quản lý học tập online với video streaming và quiz",
            features: ["Video Streaming", "Online Quiz", "Progress Tracking", "Certificates"],
            rating: 4.8,
            reviews: 267
        },
        {
            id: 6,
            name: "Chat Application",
            category: "mobile",
            price: "2,200,000",
            image: "https://via.placeholder.com/300x200/607D8B/white?text=Chat+App",
            description: "Ứng dụng chat realtime với voice call và file sharing",
            features: ["Real-time Chat", "Voice Call", "File Sharing", "End-to-end Encryption"],
            rating: 4.5,
            reviews: 178
        }
    ];

    const filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 5 - Math.ceil(rating);

        return (
            <div className="stars">
                {'⭐'.repeat(fullStars)}
                {hasHalfStar && '⭐'}
                {'☆'.repeat(emptyStars)}
                <span className="rating-number">({rating})</span>
            </div>
        );
    };

    return (
        <div className="products-page">
            {/* Products Hero */}
            <section className="products-hero">
                <div className="container">
                    <h1>Sản phẩm của chúng tôi</h1>
                    <p>Khám phá các giải pháp công nghệ hiện đại cho doanh nghiệp của bạn</p>
                </div>
            </section>

            {/* Search and Filter */}
            <section className="products-filter">
                <div className="container">
                    <div className="filter-bar">
                        <div className="search-box">
                            <input
                                type="text"
                                placeholder="Tìm kiếm sản phẩm..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                            <span className="search-icon">🔍</span>
                        </div>

                        <div className="category-filters">
                            {categories.map(category => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
                                >
                                    {category.icon} {category.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Grid */}
            <section className="products-grid-section">
                <div className="container">
                    <div className="products-header">
                        <h2>
                            {selectedCategory === 'all'
                                ? `Tất cả sản phẩm (${filteredProducts.length})`
                                : `${categories.find(c => c.id === selectedCategory)?.name} (${filteredProducts.length})`
                            }
                        </h2>
                    </div>

                    {filteredProducts.length === 0 ? (
                        <div className="no-products">
                            <p>Không tìm thấy sản phẩm nào phù hợp.</p>
                        </div>
                    ) : (
                        <div className="products-grid">
                            {filteredProducts.map(product => (
                                <div key={product.id} className="product-card">
                                    <div className="product-image">
                                        <img src={product.image} alt={product.name} />
                                        <div className="product-overlay">
                                            <button className="btn btn-primary">Xem chi tiết</button>
                                        </div>
                                    </div>

                                    <div className="product-content">
                                        <h3>{product.name}</h3>
                                        <p className="product-description">{product.description}</p>

                                        <div className="product-features">
                                            {product.features.slice(0, 3).map((feature, index) => (
                                                <span key={index} className="feature-tag">
                                                    {feature}
                                                </span>
                                            ))}
                                            {product.features.length > 3 && (
                                                <span className="feature-more">+{product.features.length - 3} more</span>
                                            )}
                                        </div>

                                        <div className="product-rating">
                                            {renderStars(product.rating)}
                                            <span className="reviews-count">({product.reviews} reviews)</span>
                                        </div>

                                        <div className="product-footer">
                                            <div className="product-price">
                                                {product.price} VNĐ
                                            </div>
                                            <div className="product-actions">
                                                <button className="btn btn-outline">Demo</button>
                                                <button className="btn btn-primary">Mua ngay</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Product Features */}
            <section className="product-features-section">
                <div className="container">
                    <h2>Tại sao chọn sản phẩm của chúng tôi?</h2>
                    <div className="features-grid">
                        <div className="feature-item">
                            <div className="feature-icon">🚀</div>
                            <h3>Performance cao</h3>
                            <p>Tối ưu hóa tốc độ và hiệu suất cho trải nghiệm người dùng tốt nhất</p>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">🔒</div>
                            <h3>Bảo mật tuyệt đối</h3>
                            <p>Áp dụng các tiêu chuẩn bảo mật cao nhất để bảo vệ dữ liệu</p>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">📱</div>
                            <h3>Responsive Design</h3>
                            <p>Hoạt động mượt mà trên mọi thiết bị từ mobile đến desktop</p>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">🛠️</div>
                            <h3>Hỗ trợ 24/7</h3>
                            <p>Đội ngũ kỹ thuật sẵn sàng hỗ trợ bạn mọi lúc mọi nơi</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="products-cta">
                <div className="container">
                    <h2>Cần tư vấn sản phẩm phù hợp?</h2>
                    <p>Liên hệ với chúng tôi để được tư vấn miễn phí và demo sản phẩm</p>
                    <div className="cta-buttons">
                        <button className="btn btn-primary">Tư vấn miễn phí</button>
                        <button className="btn btn-outline">Xem demo</button>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default ProductsPage;