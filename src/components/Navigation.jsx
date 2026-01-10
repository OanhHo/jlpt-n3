import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navigation() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const navItems = [
        { path: '/', label: 'Trang chủ', icon: '🏠' },
        { path: '/japanese/tong-hop-tu-vung', label: 'Tổng hợp từ vựng N3', icon: '�' },
        { path: '/japanese/tu-vung-thi-n3', label: 'Từ vựng hay gặp', icon: '⭐' },
        { path: '/japanese/grammar-patterns', label: 'Ngữ pháp N3', icon: '�' },
        { path: '/japanese/meo-lam-de', label: 'Mẹo làm đề N3', icon: '💡' },
        { path: '/japanese/200-cau-kho', label: '200 câu khó nhất', icon: '�' }
    ];

    const isActive = (path) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(path);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <nav className="navbar">
            <div className="nav-container">
                {/* Logo */}
                <Link to="/" className="nav-logo" onClick={closeMenu}>
                    <span className="logo-icon">🎌</span>
                    <span className="logo-text">JLPT N3</span>
                </Link>

                {/* Desktop Menu */}
                <div className="nav-menu">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                            onClick={closeMenu}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-text">{item.label}</span>
                        </Link>
                    ))}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className={`mobile-menu-btn ${isMenuOpen ? 'open' : ''}`}
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                >
                    <span className="hamburger-line"></span>
                    <span className="hamburger-line"></span>
                    <span className="hamburger-line"></span>
                </button>

                {/* Mobile Menu */}
                <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
                    <div className="mobile-menu-content">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`mobile-nav-link ${isActive(item.path) ? 'active' : ''}`}
                                onClick={closeMenu}
                            >
                                <span className="nav-icon">{item.icon}</span>
                                <span className="nav-text">{item.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                {isMenuOpen && (
                    <div className="mobile-menu-overlay" onClick={closeMenu}></div>
                )}
            </div>
        </nav>
    );
}

export default Navigation;