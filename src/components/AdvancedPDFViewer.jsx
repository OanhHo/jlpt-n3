import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFViewer = ({ pdfUrl, title }) => {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
        setLoading(false);
    };

    const onDocumentLoadError = (error) => {
        setError(error.message);
        setLoading(false);
    };

    const goToPrevPage = () => {
        setPageNumber(page => Math.max(1, page - 1));
    };

    const goToNextPage = () => {
        setPageNumber(page => Math.min(numPages, page + 1));
    };

    const zoomIn = () => {
        setScale(scale => Math.min(3.0, scale + 0.2));
    };

    const zoomOut = () => {
        setScale(scale => Math.max(0.5, scale - 0.2));
    };

    const goToPage = (page) => {
        const pageNum = parseInt(page);
        if (pageNum >= 1 && pageNum <= numPages) {
            setPageNumber(pageNum);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading PDF...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center">
                    <span className="text-red-600 text-xl mr-3">❌</span>
                    <div>
                        <h3 className="text-red-900 font-semibold">Error Loading PDF</h3>
                        <p className="text-red-700 mt-1">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gray-50 border-b px-6 py-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>

                {/* Controls */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    {/* Navigation */}
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={goToPrevPage}
                            disabled={pageNumber <= 1}
                            className="px-3 py-2 rounded bg-blue-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors text-sm"
                        >
                            ← Prev
                        </button>

                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">Page</span>
                            <input
                                type="number"
                                min="1"
                                max={numPages}
                                value={pageNumber}
                                onChange={(e) => goToPage(e.target.value)}
                                className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                            />
                            <span className="text-sm text-gray-600">of {numPages}</span>
                        </div>

                        <button
                            onClick={goToNextPage}
                            disabled={pageNumber >= numPages}
                            className="px-3 py-2 rounded bg-blue-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors text-sm"
                        >
                            Next →
                        </button>
                    </div>

                    {/* Zoom Controls */}
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={zoomOut}
                            className="px-3 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors text-sm"
                        >
                            🔍-
                        </button>
                        <span className="text-sm text-gray-600 min-w-[4rem] text-center">
                            {Math.round(scale * 100)}%
                        </span>
                        <button
                            onClick={zoomIn}
                            className="px-3 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors text-sm"
                        >
                            🔍+
                        </button>
                    </div>

                    {/* Download */}
                    <a
                        href={pdfUrl}
                        download
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
                    >
                        📥 Download
                    </a>
                </div>
            </div>

            {/* PDF Content */}
            <div className="flex justify-center bg-gray-100 p-4 min-h-[600px]">
                <Document
                    file={pdfUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                    className="shadow-lg"
                >
                    <Page
                        pageNumber={pageNumber}
                        scale={scale}
                        className="border"
                    />
                </Document>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 border-t px-6 py-3">
                <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>📄 {title}</span>
                    <span>Page {pageNumber} of {numPages}</span>
                </div>
            </div>
        </div>
    );
};

export default PDFViewer;