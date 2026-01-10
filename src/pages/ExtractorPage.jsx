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

        // Create JS module content
        const jsContent = '// Auto-generated from PDF: ' + extractedData.fileName + '\n' +
            '// Extracted at: ' + extractedData.extractedAt + '\n\n' +
            'export const ' + varName + '_data = ' + JSON.stringify(extractedData, null, 2) + ';\n\n' +
            'export default ' + varName + '_data;\n';

        // Create JSON content
        const jsonContent = JSON.stringify(extractedData, null, 2);

        const jsFileName = extractedData.fileName + '-data.js';
        const jsonFileName = extractedData.fileName + '-data.json';

        setSavedFiles([...savedFiles, { jsFileName, jsonFileName, jsContent, jsonContent }]);

        // Copy JS to clipboard
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
        <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '2rem' }}>
            <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '2rem' }}>
                    📄 PDF to Code Extractor
                </h1>

                {/* PDF Selection */}
                <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', padding: '1.5rem', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Select PDF File</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                        {pdfFiles.map(pdf => (
                            <button
                                key={pdf.id}
                                onClick={() => setSelectedPDF(pdf.id)}
                                style={{
                                    padding: '1rem',
                                    borderRadius: '0.5rem',
                                    border: '2px solid',
                                    borderColor: selectedPDF === pdf.id ? '#3b82f6' : '#e5e7eb',
                                    backgroundColor: selectedPDF === pdf.id ? '#eff6ff' : 'white',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <div style={{ fontWeight: '500' }}>{pdf.name}</div>
                                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{pdf.id}.pdf</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Loading Status */}
                {selectedPDF && loading && (
                    <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
                        <div className="flex items-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
                            <span className="text-gray-600">Đang đọc và phân tích PDF...</span>
                        </div>
                    </div>
                )}

                {/* Extraction Results */}
                {selectedPDF && !loading && text && (
                    <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
                        <h2 className="text-xl font-semibold mb-4">📊 Extraction Results</h2>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="text-center p-4 bg-gray-50 rounded">
                                <div className="text-2xl font-bold text-blue-600">{text.length}</div>
                                <div className="text-sm text-gray-600">Total Characters</div>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded">
                                <div className="text-2xl font-bold text-green-600">{lessons.length}</div>
                                <div className="text-sm text-gray-600">Lessons</div>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded">
                                <div className="text-2xl font-bold text-purple-600">{lessons.flat().length}</div>
                                <div className="text-sm text-gray-600">Vocabulary Items</div>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded">
                                <div className="text-2xl font-bold text-orange-600">{grammar.length}</div>
                                <div className="text-sm text-gray-600">Grammar Items</div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={handleExtract}
                                disabled={isExtracting}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                            >
                                {isExtracting ? 'Extracting...' : '🔄 Extract Data'}
                            </button>

                            {extractedData && (
                                <button
                                    onClick={generateCodeFiles}
                                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    💾 Generate Code Files
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Generated Files */}
                {savedFiles.length > 0 && (
                    <div className="space-y-6">
                        {savedFiles.map((file, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
                                <h3 className="text-lg font-semibold mb-4">📁 Generated Files</h3>

                                {/* JavaScript File */}
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-medium text-gray-900">📄 {file.jsFileName}</h4>
                                        <button
                                            onClick={() => copyToClipboard(file.jsContent, 'JavaScript')}
                                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm hover:bg-blue-200"
                                        >
                                            📋 Copy JS
                                        </button>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded max-h-40 overflow-y-auto">
                                        <pre className="text-xs text-gray-700">
                                            {file.jsContent.substring(0, 500)}...
                                        </pre>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-2">
                                        💡 <strong>Usage:</strong> Save as <code>src/data/{file.jsFileName}</code> then import with:
                                        <br />
                                        <code className="bg-gray-100 px-2 py-1 rounded">
                                            import data from './data/{file.jsFileName}'
                                        </code>
                                    </p>
                                </div>

                                {/* JSON File */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-medium text-gray-900">📄 {file.jsonFileName}</h4>
                                        <button
                                            onClick={() => copyToClipboard(file.jsonContent, 'JSON')}
                                            className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm hover:bg-green-200"
                                        >
                                            📋 Copy JSON
                                        </button>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded max-h-40 overflow-y-auto">
                                        <pre className="text-xs text-gray-700">
                                            {file.jsonContent.substring(0, 500)}...
                                        </pre>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-2">
                                        💡 <strong>Usage:</strong> Save as <code>src/data/{file.jsonFileName}</code>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Instructions */}
                <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mt-8">
                    <h3 className="text-lg font-medium text-blue-900 mb-2">📋 Instructions</h3>
                    <ol className="list-decimal list-inside text-blue-800 space-y-1">
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