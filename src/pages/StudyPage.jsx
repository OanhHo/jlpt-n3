import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePDFParser } from '../hooks/usePDFParser';

const StudyPage = () => {
    const { pdfFile } = useParams();
    // Normalize pdfFile: route may pass 'meo-lam-de-n3.pdf' or 'meo-lam-de-n3'.
    const pdfFileName = pdfFile && pdfFile.toString().endsWith('.pdf') ? pdfFile : `${pdfFile}`;
    const pdfUrl = `/pdfs/${pdfFileName.endsWith('.pdf') ? pdfFileName : `${pdfFileName}.pdf`}`;
    const { loading, text, lessons, grammar } = usePDFParser(pdfUrl);

    // Configuration for different PDF types
    const pdfConfig = {
        'tong-hop-tu-vung-n3': {
            title: 'Tổng Hợp Từ Vựng N3',
            description: '1000+ essential vocabulary words categorized by topics',
            icon: '📚'
        },
        'tu-vung-thi-n3': {
            title: 'Từ Vựng Thi N3',
            description: 'High-frequency vocabulary for JLPT N3 exam',
            icon: '📖'
        },
        'tu-vung-thi-n3-1': {
            title: 'Từ Vựng Thi N3 (Part 1)',
            description: 'Essential vocabulary for JLPT N3 preparation',
            icon: '📕'
        },
        '200-cau-kho-nhat-n3': {
            title: '200 Câu Khó Nhất N3',
            description: 'Most challenging sentence patterns for N3',
            icon: '🔥'
        },
        'meo-lam-de-n3': {
            title: 'Mẹo Làm Đề N3',
            description: 'Strategic tips and techniques for JLPT N3 exam success',
            icon: '💡'
        }
    };

    const key = pdfFile ? pdfFile.replace(/\.pdf$/i, '') : '';
    const config = pdfConfig[key] || {
        title: pdfFile,
        description: 'Study material',
        icon: '📄'
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang đọc PDF và phân tích từ vựng...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Link
                                to="/"
                                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mr-4"
                            >
                                ← Back to Home
                            </Link>
                            <div className="flex items-center">
                                <span className="text-2xl mr-3">{config.icon}</span>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">{config.title}</h1>
                                    <p className="text-gray-600">{config.description}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-8">
                {/* PDF Viewer (embed the actual PDF file) */}
                <div className="bg-white rounded-lg shadow-sm border p-4 mb-8">
                    <h3 className="text-lg font-semibold mb-4">📘 Xem file PDF</h3>
                    <div className="w-full" style={{ minHeight: 400 }}>
                        {/* Use iframe as a simple PDF viewer; falls back to browser native PDF support */}
                        <iframe
                            title="PDF Viewer"
                            src={pdfUrl}
                            className="w-full h-[600px] border"
                        />
                    </div>
                </div>
                {/* Statistics */}
                <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                                {lessons.flat().length}
                            </div>
                            <div className="text-sm text-gray-600">Total Words</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{lessons.length}</div>
                            <div className="text-sm text-gray-600">Lessons</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">{grammar.length}</div>
                            <div className="text-sm text-gray-600">Grammar Items</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">30</div>
                            <div className="text-sm text-gray-600">Words/Lesson</div>
                        </div>
                    </div>
                </div>

                {/* Extracted Text Preview */}
                {text && (
                    <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
                        <h3 className="text-lg font-semibold mb-4">📄 Extracted Text Preview</h3>
                        <div className="bg-gray-50 p-4 rounded max-h-40 overflow-y-auto">
                            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                                {text.substring(0, 1000)}
                                {text.length > 1000 && '...'}
                            </pre>
                        </div>
                    </div>
                )}

                {/* Lessons */}
                {lessons.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
                        <h3 className="text-lg font-semibold mb-4">📚 Vocabulary Lessons</h3>
                        {lessons.map((lesson, index) => (
                            <div key={index} className="mb-6 p-4 bg-gray-50 rounded">
                                <h4 className="font-medium mb-3">
                                    Lesson {index + 1}: Words {index * 30 + 1}-{Math.min((index + 1) * 30, lessons.flat().length)}
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                    {lesson.slice(0, 10).map(item => ( // Show first 10 items only
                                        <div key={item.id} className="text-sm p-2 bg-white rounded border">
                                            {item.text}
                                        </div>
                                    ))}
                                    {lesson.length > 10 && (
                                        <div className="text-sm p-2 text-gray-500 italic">
                                            ...and {lesson.length - 10} more words
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Grammar */}
                {grammar.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <h3 className="text-lg font-semibold mb-4">📝 Grammar Items</h3>
                        <div className="space-y-2">
                            {grammar.slice(0, 10).map((item, index) => (
                                <div key={index} className="p-3 bg-gray-50 rounded">
                                    {item}
                                </div>
                            ))}
                            {grammar.length > 10 && (
                                <div className="text-sm text-gray-500 italic">
                                    ...and {grammar.length - 10} more grammar items
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* No Data */}
                {!loading && lessons.length === 0 && grammar.length === 0 && (
                    <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
                        <p className="text-gray-600">
                            Không thể phân tích được nội dung từ PDF này.
                            Có thể file PDF bị lỗi hoặc định dạng không được hỗ trợ.
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            Raw text length: {text.length} characters
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudyPage;