// ❌ Error Handling Components

import React from 'react';

const ErrorMessage = ({
    error,
    title = 'Đã có lỗi xảy ra',
    showRetry = true,
    onRetry,
    type = 'error'
}) => {
    const typeClasses = {
        error: 'error-message error',
        warning: 'error-message warning',
        info: 'error-message info'
    };

    return (
        <div className={typeClasses[type]}>
            <div className="error-icon">
                {type === 'error' && '❌'}
                {type === 'warning' && '⚠️'}
                {type === 'info' && 'ℹ️'}
            </div>
            <div className="error-content">
                <h3>{title}</h3>
                <p>{error}</p>
                {showRetry && onRetry && (
                    <button onClick={onRetry} className="retry-button">
                        🔄 Thử lại
                    </button>
                )}
            </div>
        </div>
    );
};

export const NetworkError = ({ onRetry }) => {
    return (
        <ErrorMessage
            error="Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng và thử lại."
            title="Lỗi kết nối"
            onRetry={onRetry}
            type="warning"
        />
    );
};

export const NotFoundError = ({ message = 'Không tìm thấy dữ liệu yêu cầu.' }) => {
    return (
        <ErrorMessage
            error={message}
            title="Không tìm thấy"
            showRetry={false}
            type="info"
        />
    );
};

export const ServerError = ({ onRetry }) => {
    return (
        <ErrorMessage
            error="Server đang gặp sự cố. Vui lòng thử lại sau ít phút."
            title="Lỗi server"
            onRetry={onRetry}
            type="error"
        />
    );
};

// Error Boundary Component
export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error Boundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <ErrorMessage
                    error="Đã có lỗi không mong muốn xảy ra. Vui lòng tải lại trang."
                    title="Ứng dụng gặp lỗi"
                    onRetry={() => window.location.reload()}
                />
            );
        }

        return this.props.children;
    }
}

export default ErrorMessage;