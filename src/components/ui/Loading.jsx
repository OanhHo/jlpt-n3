// 🔄 Loading Component

import React from 'react';

const LoadingSpinner = ({ size = 'medium', text = 'Đang tải...' }) => {
    const sizeClasses = {
        small: 'loading-small',
        medium: 'loading-medium',
        large: 'loading-large'
    };

    return (
        <div className="loading-container">
            <div className={`loading-spinner ${sizeClasses[size]}`}>
                <div className="spinner"></div>
            </div>
            {text && <p className="loading-text">{text}</p>}
        </div>
    );
};

export const LoadingCard = ({ count = 3 }) => {
    return (
        <div className="loading-cards">
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="loading-card">
                    <div className="loading-card-image"></div>
                    <div className="loading-card-content">
                        <div className="loading-line loading-line-title"></div>
                        <div className="loading-line loading-line-text"></div>
                        <div className="loading-line loading-line-text short"></div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export const LoadingTable = ({ rows = 5, cols = 4 }) => {
    return (
        <div className="loading-table">
            <div className="loading-table-header">
                {Array.from({ length: cols }).map((_, index) => (
                    <div key={index} className="loading-table-header-cell"></div>
                ))}
            </div>
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <div key={rowIndex} className="loading-table-row">
                    {Array.from({ length: cols }).map((_, colIndex) => (
                        <div key={colIndex} className="loading-table-cell"></div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default LoadingSpinner;