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
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f0f0f0',
            padding: '20px',
            fontFamily: 'Arial, sans-serif',
            color: '#000000 !important'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <h1 style={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    color: '#000000 !important',
                    marginBottom: '30px',
                    textAlign: 'center'
                }}>
                    📄 PDF to Code Extractor
                </h1>

                {/* PDF Selection */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '10px',
                    padding: '20px',
                    marginBottom: '20px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}>
                    <h2 style={{ fontSize: '24px', color: '#000000 !important', marginBottom: '15px' }}>
                        Select PDF File
                    </h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '15px'
                    }}>
                        {pdfFiles.map(pdf => (
                            <button
                                key={pdf.id}
                                onClick={() => setSelectedPDF(pdf.id)}
                                style={{
                                    padding: '15px',
                                    borderRadius: '8px',
                                    border: selectedPDF === pdf.id ? '3px solid #007bff' : '2px solid #ddd',
                                    backgroundColor: selectedPDF === pdf.id ? '#e3f2fd' : 'white',
                                    cursor: 'pointer',
                                    textAlign: 'left'
                                }}
                            >
                                <div style={{ fontWeight: 'bold', color: '#000000 !important', fontSize: '16px' }}>
                                    {pdf.name}
                                </div>
                                <div style={{ color: '#666666 !important', fontSize: '14px', marginTop: '5px' }}>
                                    {pdf.id}.pdf
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Loading Status */}
                {selectedPDF && loading && (
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '10px',
                        padding: '20px',
                        marginBottom: '20px',
                        textAlign: 'center'
                    }}>
                        <div style={{ color: '#333', fontSize: '16px' }}>
                            🔄 Đang đọc và phân tích PDF...
                        </div>
                    </div>
                )}

                {/* Extraction Results */}
                {selectedPDF && !loading && text && (
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '10px',
                        padding: '20px',
                        marginBottom: '20px'
                    }}>
                        <h2 style={{ fontSize: '24px', color: '#333', marginBottom: '15px' }}>
                            📊 Extraction Results
                        </h2>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '15px',
                            marginBottom: '20px'
                        }}>
                            <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>
                                    {text.length}
                                </div>
                                <div style={{ color: '#666', fontSize: '14px' }}>Total Characters</div>
                            </div>
                            <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
                                    {lessons.length}
                                </div>
                                <div style={{ color: '#666', fontSize: '14px' }}>Lessons</div>
                            </div>
                            <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#6f42c1' }}>
                                    {lessons.flat().length}
                                </div>
                                <div style={{ color: '#666', fontSize: '14px' }}>Vocabulary Items</div>
                            </div>
                            <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fd7e14' }}>
                                    {grammar.length}
                                </div>
                                <div style={{ color: '#666', fontSize: '14px' }}>Grammar Items</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                onClick={handleExtract}
                                disabled={isExtracting}
                                style={{
                                    padding: '12px 24px',
                                    backgroundColor: isExtracting ? '#ccc' : '#007bff',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: isExtracting ? 'default' : 'pointer',
                                    fontSize: '16px'
                                }}
                            >
                                {isExtracting ? 'Extracting...' : '🔄 Extract Data'}
                            </button>

                            {extractedData && (
                                <button
                                    onClick={generateCodeFiles}
                                    style={{
                                        padding: '12px 24px',
                                        backgroundColor: '#28a745',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontSize: '16px'
                                    }}
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
                            <div key={index} style={{
                                backgroundColor: 'white',
                                borderRadius: '10px',
                                padding: '20px',
                                marginBottom: '20px'
                            }}>
                                <h3 style={{ fontSize: '20px', color: '#333', marginBottom: '15px' }}>
                                    📁 Generated Files
                                </h3>

                                {/* JavaScript File */}
                                <div style={{ marginBottom: '20px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                        <h4 style={{ color: '#333', margin: 0 }}>📄 {file.jsFileName}</h4>
                                        <button
                                            onClick={() => copyToClipboard(file.jsContent, 'JavaScript')}
                                            style={{
                                                padding: '8px 16px',
                                                backgroundColor: '#007bff',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            📋 Copy JS
                                        </button>
                                    </div>
                                    <div style={{
                                        backgroundColor: '#f8f9fa',
                                        padding: '15px',
                                        borderRadius: '6px',
                                        maxHeight: '200px',
                                        overflow: 'auto',
                                        fontFamily: 'monospace',
                                        fontSize: '12px',
                                        color: '#333'
                                    }}>
                                        <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                                            {file.jsContent.substring(0, 500)}...
                                        </pre>
                                    </div>
                                    <p style={{ color: '#666', fontSize: '14px', marginTop: '10px' }}>
                                        💡 <strong>Usage:</strong> Save as <code>src/data/{file.jsFileName}</code>
                                    </p>
                                </div>

                                {/* JSON File */}
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                        <h4 style={{ color: '#333', margin: 0 }}>📄 {file.jsonFileName}</h4>
                                        <button
                                            onClick={() => copyToClipboard(file.jsonContent, 'JSON')}
                                            style={{
                                                padding: '8px 16px',
                                                backgroundColor: '#28a745',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            📋 Copy JSON
                                        </button>
                                    </div>
                                    <div style={{
                                        backgroundColor: '#f8f9fa',
                                        padding: '15px',
                                        borderRadius: '6px',
                                        maxHeight: '200px',
                                        overflow: 'auto',
                                        fontFamily: 'monospace',
                                        fontSize: '12px',
                                        color: '#333'
                                    }}>
                                        <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                                            {file.jsonContent.substring(0, 500)}...
                                        </pre>
                                    </div>
                                    <p style={{ color: '#666', fontSize: '14px', marginTop: '10px' }}>
                                        💡 <strong>Usage:</strong> Save as <code>src/data/{file.jsonFileName}</code>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Instructions */}
                <div style={{
                    backgroundColor: '#e3f2fd',
                    border: '2px solid #2196f3',
                    borderRadius: '10px',
                    padding: '20px'
                }}>
                    <h3 style={{ color: '#1976d2', marginBottom: '15px' }}>📋 Instructions</h3>
                    <ol style={{ color: '#1976d2', paddingLeft: '20px' }}>
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
    );
};

export default ExtractorPage;