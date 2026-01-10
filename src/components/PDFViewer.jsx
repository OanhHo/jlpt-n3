import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Configure PDF.js worker with local fallback
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url,
).toString();

const PDFViewer = ({ pdfUrl, title }) => {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [file, setFile] = useState(null);

    useEffect(() => {
        // Try to load the PDF file
        const loadFile = async () => {
            try {
                setLoading(true);
                setError(null);

                // Check if file exists
                const response = await fetch(pdfUrl, {
                    method: 'HEAD',
                    mode: 'cors'
                });

                if (response.ok) {
                    setFile(pdfUrl);
                } else {
                    throw new Error(`File not found: ${pdfUrl}`);
                }
            } catch (err) {
                console.error('PDF loading error:', err);
                setError(`Không thể tải file PDF: ${pdfUrl}. Vui lòng kiểm tra file có tồn tại không.`);
                setLoading(false);
            }
        };

        if (pdfUrl) {
            loadFile();
        }
    }, [pdfUrl]);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
        setLoading(false);
        setError(null);
    };

    const onDocumentLoadError = (error) => {
        setError('Không thể tải file PDF. Vui lòng kiểm tra lại file.');
        setLoading(false);
        console.error('PDF Load Error:', error);
    };

    const goToPrevPage = () => {
        setPageNumber(prevPage => Math.max(prevPage - 1, 1));
    };

    const goToNextPage = () => {
        setPageNumber(prevPage => Math.min(prevPage + 1, numPages));
    };

    const zoomIn = () => {
        setScale(prevScale => Math.min(prevScale + 0.2, 3.0));
    };

    const zoomOut = () => {
        setScale(prevScale => Math.max(prevScale - 0.2, 0.5));
    };

    const resetZoom = () => {
        setScale(1.0);
    };

    return (
        <div className="pdf-viewer">
            <div className="pdf-header">
                <h2>📄 {title}</h2>

                {/* PDF Controls */}
                <div className="pdf-controls">
                    <div className="page-controls">
                        <button
                            onClick={goToPrevPage}
                            disabled={pageNumber <= 1}
                            className="control-btn"
                        >
                            ← Trang trước
                        </button>
                        <span className="page-info">
                            Trang {pageNumber} / {numPages || '?'}
                        </span>
                        <button
                            onClick={goToNextPage}
                            disabled={pageNumber >= numPages}
                            className="control-btn"
                        >
                            Trang sau →
                        </button>
                    </div>

                    <div className="zoom-controls">
                        <button onClick={zoomOut} className="control-btn">🔍-</button>
                        <span className="zoom-info">{Math.round(scale * 100)}%</span>
                        <button onClick={zoomIn} className="control-btn">🔍+</button>
                        <button onClick={resetZoom} className="control-btn">Reset</button>
                    </div>
                </div>
            </div>

            {/* PDF Content */}
            <div className="pdf-content">
                {loading && (
                    <div className="pdf-loading">
                        <div className="loading-spinner">📚</div>
                        <p>Đang tải PDF...</p>
                    </div>
                )}

                {error && (
                    <div className="pdf-error">
                        <div className="error-icon">❌</div>
                        <p>{error}</p>
                        <button onClick={() => window.location.reload()} className="retry-btn">
                            Thử lại
                        </button>
                    </div>
                )}

                {!error && file && (
                    <Document
                        file={file}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={onDocumentLoadError}
                        className="pdf-document"
                        options={{
                            cMapUrl: 'cmaps/',
                            cMapPacked: true,
                        }}
                    >
                        <Page
                            pageNumber={pageNumber}
                            scale={scale}
                            className="pdf-page"
                        />
                    </Document>
                )}
            </div>

            {/* Quick Navigation */}
            <div className="pdf-quick-nav">
                <div className="quick-nav-title">⚡ Điều hướng nhanh:</div>
                <div className="quick-nav-buttons">
                    <button onClick={() => setPageNumber(1)} className="quick-btn">
                        Đầu tài liệu
                    </button>
                    <button onClick={() => setPageNumber(Math.ceil(numPages / 2))} className="quick-btn">
                        Giữa tài liệu
                    </button>
                    <button onClick={() => setPageNumber(numPages)} className="quick-btn">
                        Cuối tài liệu
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PDFViewer;