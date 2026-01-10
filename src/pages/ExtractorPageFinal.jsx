import React, { useState } from 'react';
import { usePDFParser } from '../hooks/usePDFParser';

const ExtractorPage = () => {
    const [selectedPDF, setSelectedPDF] = useState('');
    const [extractedData, setExtractedData] = useState(null);
    const [isExtracting, setIsExtracting] = useState(false);
    const [savedFiles, setSavedFiles] = useState([]);

    console.log('🔍 ExtractorPage rendered');

    const pdfFiles = [
        { id: 'tong-hop-tu-vung-n3', name: 'Tổng Hợp Từ Vựng N3' },
        { id: 'tu-vung-thi-n3', name: 'Từ Vựng Thi N3' },
        { id: 'tu-vung-thi-n3-1', name: 'Từ Vựng Thi N3 (Part 1)' },
        { id: '200-cau-kho-nhat-n3', name: '200 Câu Khó Nhất N3' },
        { id: 'meo-lam-de-n3', name: 'Mẹo Làm Đề N3' }
    ];

    const pdfUrl = selectedPDF ? `/pdfs/${selectedPDF}.pdf` : null;
    const { loading, text, lessons, grammar } = usePDFParser(pdfUrl);

    const handleExtract = async () => {
        if (!selectedPDF || loading) return;
        setIsExtracting(true);

        try {
            const data = {
                fileName: selectedPDF,
                extractedAt: new Date().toISOString(),
                metadata: {
                    totalCharacters: text.length,
                    totalLessons: lessons.length,
                    totalGrammarItems: grammar.length,
                    totalVocabulary: lessons.flat().length
                },
                rawText: text,
                lessons: lessons.map((lesson, index) => ({
                    id: 'lesson-' + (index + 1),
                    title: 'Lesson ' + (index + 1) + ': Words ' + (index * 30 + 1) + '-' + Math.min((index + 1) * 30, lessons.flat().length),
                    items: lesson,
                    wordCount: lesson.length
                })),
                grammar: grammar.map((item, index) => ({
                    id: 'grammar-' + (index + 1),
                    content: item
                }))
            };

            setExtractedData(data);
            console.log('✅ Data extracted and ready!');

        } catch (error) {
            console.error('❌ Extraction failed:', error);
        } finally {
            setIsExtracting(false);
        }
    };

    const generateCodeFiles = () => {
        if (!extractedData) return;

        const varName = extractedData.fileName.replace(/-/g, '_');
        const jsContent = '// Auto-generated from PDF: ' + extractedData.fileName + '\n' +
            '// Extracted at: ' + extractedData.extractedAt + '\n\n' +
            'export const ' + varName + '_data = ' + JSON.stringify(extractedData, null, 2) + ';\n\n' +
            'export default ' + varName + '_data;\n';

        const jsonContent = JSON.stringify(extractedData, null, 2);
        const jsFileName = extractedData.fileName + '-data.js';
        const jsonFileName = extractedData.fileName + '-data.json';

        setSavedFiles([...savedFiles, { jsFileName, jsonFileName, jsContent, jsonContent }]);

        if (navigator.clipboard) {
            navigator.clipboard.writeText(jsContent).then(() => {
                alert('JS content copied to clipboard! Save as: src/data/' + jsFileName);
            });
        }
    };

    const copyToClipboard = (content, type) => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(content).then(() => {
                alert(type + ' content copied to clipboard!');
            });
        }
    };

    return (
        <>
            <style>{`
                .extractor-container {
                    min-height: 100vh;
                    background-color: #f0f0f0;
                    padding: 20px;
                    font-family: Arial, sans-serif;
                }
                .extractor-container * {
                    color: #000000 !important;
                }
                .extractor-main {
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .extractor-title {
                    font-size: 32px;
                    font-weight: bold;
                    color: #000000 !important;
                    margin-bottom: 30px;
                    text-align: center;
                }
                .extractor-card {
                    background-color: white;
                    border-radius: 10px;
                    padding: 20px;
                    margin-bottom: 20px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                .extractor-section-title {
                    font-size: 24px;
                    color: #000000 !important;
                    margin-bottom: 15px;
                }
                .extractor-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 15px;
                }
                .extractor-pdf-button {
                    padding: 15px;
                    border-radius: 8px;
                    border: 2px solid #ddd;
                    background-color: white;
                    cursor: pointer;
                    text-align: left;
                }
                .extractor-pdf-button.selected {
                    border-color: #007bff;
                    background-color: #e3f2fd;
                }
                .extractor-pdf-name {
                    font-weight: bold;
                    color: #000000 !important;
                    font-size: 16px;
                }
                .extractor-pdf-file {
                    color: #666666 !important;
                    font-size: 14px;
                    margin-top: 5px;
                }
                .extractor-loading {
                    text-align: center;
                    color: #000000 !important;
                    font-size: 16px;
                }
                .extractor-stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 15px;
                    margin-bottom: 20px;
                }
                .extractor-stat-box {
                    text-align: center;
                    padding: 15px;
                    background-color: #f8f9fa;
                    border-radius: 8px;
                }
                .extractor-stat-number {
                    font-size: 24px;
                    font-weight: bold;
                }
                .extractor-stat-label {
                    color: #666666 !important;
                    font-size: 14px;
                }
                .extractor-button {
                    padding: 12px 24px;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 16px;
                    margin-right: 10px;
                    color: white !important;
                }
                .extractor-button-primary {
                    background-color: #007bff;
                }
                .extractor-button-success {
                    background-color: #28a745;
                }
                .extractor-button:disabled {
                    background-color: #ccc;
                    cursor: default;
                }
                .extractor-code-box {
                    background-color: #f8f9fa;
                    padding: 15px;
                    border-radius: 6px;
                    max-height: 200px;
                    overflow: auto;
                    font-family: monospace;
                    font-size: 12px;
                    color: #000000 !important;
                }
                .extractor-instructions {
                    background-color: #e3f2fd;
                    border: 2px solid #2196f3;
                    border-radius: 10px;
                    padding: 20px;
                }
                .extractor-instructions h3 {
                    color: #1976d2 !important;
                    margin-bottom: 15px;
                }
                .extractor-instructions ol {
                    color: #1976d2 !important;
                    padding-left: 20px;
                }
            `}</style>

            <div className="extractor-container">
                <div className="extractor-main">
                    <h1 className="extractor-title">
                        📄 PDF to Code Extractor
                    </h1>

                    {/* PDF Selection */}
                    <div className="extractor-card">
                        <h2 className="extractor-section-title">Select PDF File</h2>
                        <div className="extractor-grid">
                            {pdfFiles.map(pdf => (
                                <button
                                    key={pdf.id}
                                    onClick={() => setSelectedPDF(pdf.id)}
                                    className={`extractor-pdf-button ${selectedPDF === pdf.id ? 'selected' : ''}`}
                                >
                                    <div className="extractor-pdf-name">{pdf.name}</div>
                                    <div className="extractor-pdf-file">{pdf.id}.pdf</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Loading Status */}
                    {selectedPDF && loading && (
                        <div className="extractor-card">
                            <div className="extractor-loading">
                                🔄 Đang đọc và phân tích PDF...
                            </div>
                        </div>
                    )}

                    {/* Extraction Results */}
                    {selectedPDF && !loading && text && (
                        <div className="extractor-card">
                            <h2 className="extractor-section-title">📊 Extraction Results</h2>

                            <div className="extractor-stats-grid">
                                <div className="extractor-stat-box">
                                    <div className="extractor-stat-number" style={{ color: '#007bff !important' }}>
                                        {text.length}
                                    </div>
                                    <div className="extractor-stat-label">Total Characters</div>
                                </div>
                                <div className="extractor-stat-box">
                                    <div className="extractor-stat-number" style={{ color: '#28a745 !important' }}>
                                        {lessons.length}
                                    </div>
                                    <div className="extractor-stat-label">Lessons</div>
                                </div>
                                <div className="extractor-stat-box">
                                    <div className="extractor-stat-number" style={{ color: '#6f42c1 !important' }}>
                                        {lessons.flat().length}
                                    </div>
                                    <div className="extractor-stat-label">Vocabulary Items</div>
                                </div>
                                <div className="extractor-stat-box">
                                    <div className="extractor-stat-number" style={{ color: '#fd7e14 !important' }}>
                                        {grammar.length}
                                    </div>
                                    <div className="extractor-stat-label">Grammar Items</div>
                                </div>
                            </div>

                            <div>
                                <button
                                    onClick={handleExtract}
                                    disabled={isExtracting}
                                    className="extractor-button extractor-button-primary"
                                >
                                    {isExtracting ? 'Extracting...' : '🔄 Extract Data'}
                                </button>

                                {extractedData && (
                                    <button
                                        onClick={generateCodeFiles}
                                        className="extractor-button extractor-button-success"
                                    >
                                        💾 Generate Code Files
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Generated Files */}
                    {savedFiles.length > 0 && (
                        <div>
                            {savedFiles.map((file, index) => (
                                <div key={index} className="extractor-card">
                                    <h3 className="extractor-section-title">📁 Generated Files</h3>

                                    {/* JavaScript File */}
                                    <div style={{ marginBottom: '20px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                            <h4 style={{ color: '#000000 !important', margin: 0 }}>📄 {file.jsFileName}</h4>
                                            <button
                                                onClick={() => copyToClipboard(file.jsContent, 'JavaScript')}
                                                className="extractor-button extractor-button-primary"
                                                style={{ padding: '8px 16px', fontSize: '14px' }}
                                            >
                                                📋 Copy JS
                                            </button>
                                        </div>
                                        <div className="extractor-code-box">
                                            <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                                                {file.jsContent.substring(0, 500)}...
                                            </pre>
                                        </div>
                                        <p style={{ color: '#666666 !important', fontSize: '14px', marginTop: '10px' }}>
                                            💡 <strong>Usage:</strong> Save as <code>src/data/{file.jsFileName}</code>
                                        </p>
                                    </div>

                                    {/* JSON File */}
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                            <h4 style={{ color: '#000000 !important', margin: 0 }}>📄 {file.jsonFileName}</h4>
                                            <button
                                                onClick={() => copyToClipboard(file.jsonContent, 'JSON')}
                                                className="extractor-button extractor-button-success"
                                                style={{ padding: '8px 16px', fontSize: '14px' }}
                                            >
                                                📋 Copy JSON
                                            </button>
                                        </div>
                                        <div className="extractor-code-box">
                                            <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                                                {file.jsonContent.substring(0, 500)}...
                                            </pre>
                                        </div>
                                        <p style={{ color: '#666666 !important', fontSize: '14px', marginTop: '10px' }}>
                                            💡 <strong>Usage:</strong> Save as <code>src/data/{file.jsonFileName}</code>
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Instructions */}
                    <div className="extractor-instructions">
                        <h3>📋 Instructions</h3>
                        <ol>
                            <li>Select a PDF file above</li>
                            <li>Wait for extraction to complete</li>
                            <li>Click "🔄 Extract Data" to process content</li>
                            <li>Click "💾 Generate Code Files" to create JS/JSON</li>
                            <li>Copy the code from the textboxes</li>
                            <li>Create new files in <code>src/data/</code> directory</li>
                            <li>Import and use in your React components!</li>
                        </ol>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ExtractorPage;