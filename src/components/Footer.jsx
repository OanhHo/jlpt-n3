import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        company: [
            { label: 'Về chúng tôi', path: '/about' },
            { label: 'Đội ngũ', path: '/about#team' },
            { label: 'Tuyển dụng', path: '/careers' },
            { label: 'Tin tức', path: '/news' }
        ],
        services: [
            { label: 'Web Development', path: '/products?category=web' },
            { label: 'Mobile Apps', path: '/products?category=mobile' },
            { label: 'E-commerce', path: '/products?category=ecommerce' },
            { label: 'Consulting', path: '/services/consulting' }
        ],
        support: [
            { label: 'Trung tâm hỗ trợ', path: '/support' },
            { label: 'Tài liệu', path: '/docs' },
            { label: 'FAQ', path: '/faq' },
            { label: 'Liên hệ', path: '/contact' }
        ],
        legal: [
            { label: 'Điều khoản sử dụng', path: '/terms' },
            { label: 'Chính sách bảo mật', path: '/privacy' },
            { label: 'Cookie Policy', path: '/cookies' },
            { label: 'GDPR', path: '/gdpr' }
        ]
    };

    const socialLinks = [
        { name: 'Facebook', icon: '📘', url: 'https://facebook.com' },
        { name: 'Twitter', icon: '🐦', url: 'https://twitter.com' },
        { name: 'LinkedIn', icon: '💼', url: 'https://linkedin.com' },
        { name: 'GitHub', icon: '🐙', url: 'https://github.com' },
        { name: 'YouTube', icon: '📺', url: 'https://youtube.com' }
    ];

    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="container">
                    {/* Footer Main */}
                    <div className="footer-main">
                        {/* Company Info */}
                        <div className="footer-section company-info">
                            <Link to="/" className="footer-logo">
                                <span className="logo-icon">⚛️</span>
                                <span className="logo-text">ReactApp</span>
                            </Link>
                            <p className="company-description">
                                Chúng tôi tạo ra những sản phẩm web và mobile hiện đại,
                                giúp doanh nghiệp chuyển đổi số thành công.
                            </p>
                            <div className="contact-info">
                                <div className="contact-item">
                                    <span className="contact-icon">📍</span>
                                    <span>123 Nguyễn Văn Linh, Q.7, TP.HCM</span>
                                </div>
                                <div className="contact-item">
                                    <span className="contact-icon">📞</span>
                                    <span>+84 123 456 789</span>
                                </div>
                                <div className="contact-item">
                                    <span className="contact-icon">✉️</span>
                                    <span>hello@reactapp.com</span>
                                </div>
                            </div>
                        </div>

                        {/* Links Sections */}
                        <div className="footer-section">
                            <h4>Công ty</h4>
                            <ul className="footer-links">
                                {footerLinks.company.map((link, index) => (
                                    <li key={index}>
                                        <Link to={link.path}>{link.label}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="footer-section">
                            <h4>Dịch vụ</h4>
                            <ul className="footer-links">
                                {footerLinks.services.map((link, index) => (
                                    <li key={index}>
                                        <Link to={link.path}>{link.label}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="footer-section">
                            <h4>Hỗ trợ</h4>
                            <ul className="footer-links">
                                {footerLinks.support.map((link, index) => (
                                    <li key={index}>
                                        <Link to={link.path}>{link.label}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Newsletter */}
                        <div className="footer-section newsletter">
                            <h4>Đăng ký nhận tin</h4>
                            <p>Nhận thông tin mới nhất về các sản phẩm và dịch vụ của chúng tôi</p>
                            <form className="newsletter-form">
                                <div className="newsletter-input">
                                    <input
                                        type="email"
                                        placeholder="Nhập email của bạn"
                                        className="newsletter-email"
                                    />
                                    <button type="submit" className="newsletter-btn">
                                        📧
                                    </button>
                                </div>
                            </form>

                            {/* Social Links */}
                            <div className="social-section">
                                <h5>Theo dõi chúng tôi</h5>
                                <div className="social-links">
                                    {socialLinks.map((social, index) => (
                                        <a
                                            key={index}
                                            href={social.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="social-link"
                                            title={social.name}
                                        >
                                            {social.icon}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Bottom */}
                    <div className="footer-bottom">
                        <div className="footer-bottom-content">
                            <div className="copyright">
                                <p>&copy; {currentYear} ReactApp. Tất cả quyền được bảo lưu.</p>
                            </div>

                            <div className="footer-bottom-links">
                                {footerLinks.legal.map((link, index) => (
                                    <Link key={index} to={link.path} className="footer-bottom-link">
                                        {link.label}
                                    </Link>
                                ))}
                            </div>

                            <div className="footer-badges">
                                <div className="badge">
                                    <span>🔒</span>
                                    <span>SSL Secured</span>
                                </div>
                                <div className="badge">
                                    <span>✅</span>
                                    <span>ISO 27001</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;