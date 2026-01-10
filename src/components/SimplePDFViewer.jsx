import React, { useState, useEffect } from 'react';

const SimplePDFViewer = ({ pdfUrl, title }) => {
    const [pdfExists, setPdfExists] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkPDFExists = async () => {
            try {
                setLoading(true);
                const response = await fetch(pdfUrl, { method: 'HEAD' });
                if (response.ok) {
                    setPdfExists(true);
                    setError(null);
                } else {
                    throw new Error(`File not found: ${response.status}`);
                }
            } catch (err) {
                console.error('PDF check error:', err);
                setError(`File PDF không tồn tại: ${pdfUrl}`);
                setPdfExists(false);
            } finally {
                setLoading(false);
            }
        };

        if (pdfUrl) {
            checkPDFExists();
        }
    }, [pdfUrl]);

    if (loading) {
        return (
            <div className="pdf-viewer">
                <div className="pdf-loading">
                    <div className="loading-spinner">📚</div>
                    <p>Đang kiểm tra file PDF...</p>
                </div>
            </div>
        );
    }

    if (error || !pdfExists) {
        return (
            <div className="pdf-viewer">
                <div className="pdf-error">
                    <div className="error-icon">❌</div>
                    <h3>Không thể tải file PDF</h3>
                    <p>{error}</p>
                    <div className="error-details">
                        <p><strong>Đường dẫn:</strong> {pdfUrl}</p>
                        <p><strong>Giải pháp:</strong></p>
                        <ul>
                            <li>Kiểm tra file có tồn tại trong thư mục /public/pdfs/</li>
                            <li>Đảm bảo tên file đúng chính tả</li>
                            <li>Refresh lại trang</li>
                        </ul>
                    </div>
                    <button onClick={() => window.location.reload()} className="retry-btn">
                        🔄 Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="pdf-viewer">
            <div className="pdf-header">
                <h2>📄 {title}</h2>
                <p>File PDF đã được tìm thấy. Đang sử dụng trình xem PDF đơn giản.</p>
            </div>

            <div className="pdf-content">
                <div className="pdf-embed-container">
                    <iframe
                        src={pdfUrl}
                        width="100%"
                        height="1200px"
                        style={{
                            border: 'none',
                            borderRadius: '8px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                            minHeight: '80vh'
                        }}
                        title={title}
                    >
                        <p>
                            Trình duyệt không hỗ trợ xem PDF trực tiếp.
                            <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                                Click here to download PDF
                            </a>
                        </p>
                    </iframe>
                </div>
            </div>

            <div className="pdf-actions">
                <div className="action-buttons">
                    <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="action-btn"
                    >
                        🔗 Mở trong tab mới
                    </a>
                    <a
                        href={pdfUrl}
                        download
                        className="action-btn"
                    >
                        📥 Tải xuống
                    </a>
                </div>
            </div>
        </div>
    );
};

export default SimplePDFViewer;