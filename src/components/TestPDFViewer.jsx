import React, { useState, useEffect } from 'react';

const TestPDFViewer = ({ pdfUrl, title }) => {
    const [fileExists, setFileExists] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const testFile = async () => {
            setLoading(true);
            try {
                // Test với fetch
                const response = await fetch(pdfUrl, { method: 'HEAD' });
                console.log('Fetch response:', response.status, response.statusText);
                setFileExists(response.ok);
            } catch (error) {
                console.error('Fetch error:', error);
                setFileExists(false);
            }
            setLoading(false);
        };

        testFile();
    }, [pdfUrl]);

    if (loading) {
        return (
            <div style={{ padding: '40px', textAlign: 'center' }}>
                <h3>🔍 Đang kiểm tra file PDF...</h3>
                <p>Path: {pdfUrl}</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            <h2>🧪 Test PDF Viewer</h2>
            <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', margin: '20px 0' }}>
                <p><strong>File Path:</strong> {pdfUrl}</p>
                <p><strong>Status:</strong> {fileExists ? '✅ File accessible' : '❌ File not accessible'}</p>
                <p><strong>Full URL:</strong> {window.location.origin + pdfUrl}</p>
            </div>

            {fileExists ? (
                <div>
                    <h3>✅ File tồn tại - Thử các cách xem:</h3>

                    {/* Method 1: Direct link */}
                    <div style={{ margin: '20px 0', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                        <h4>Method 1: Direct Link</h4>
                        <a
                            href={pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                background: '#007bff',
                                color: 'white',
                                padding: '10px 20px',
                                textDecoration: 'none',
                                borderRadius: '5px'
                            }}
                        >
                            🔗 Mở PDF trong tab mới
                        </a>
                    </div>

                    {/* Method 2: Iframe */}
                    <div style={{ margin: '20px 0', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                        <h4>Method 2: Iframe Embed</h4>
                        <iframe
                            src={pdfUrl}
                            width="100%"
                            height="500px"
                            style={{ border: '1px solid #ccc', borderRadius: '5px' }}
                            title={title}
                        >
                            <p>Browser không hỗ trợ iframe. <a href={pdfUrl}>Download PDF</a></p>
                        </iframe>
                    </div>

                    {/* Method 3: Object tag */}
                    <div style={{ margin: '20px 0', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                        <h4>Method 3: Object Tag</h4>
                        <object
                            data={pdfUrl}
                            type="application/pdf"
                            width="100%"
                            height="500px"
                            style={{ border: '1px solid #ccc', borderRadius: '5px' }}
                        >
                            <p>Browser không hỗ trợ object tag. <a href={pdfUrl}>Download PDF</a></p>
                        </object>
                    </div>
                </div>
            ) : (
                <div style={{ background: '#f8d7da', color: '#721c24', padding: '20px', borderRadius: '8px' }}>
                    <h3>❌ Không thể truy cập file</h3>
                    <p>Có thể do:</p>
                    <ul>
                        <li>File không tồn tại</li>
                        <li>Đường dẫn sai</li>
                        <li>Server không serve static files từ /public</li>
                        <li>CORS policy blocking</li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default TestPDFViewer;