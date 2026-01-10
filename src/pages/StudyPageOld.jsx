import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePDFParser } from '../hooks/usePDFParser';
import AdvancedPDFViewer from '../components/AdvancedPDFViewer';
import VocabularyLessons from '../components/VocabularyLessons';

const StudyPage = () => {
    const { pdfFile } = useParams();
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);

    const pdfUrl = `/pdfs/${pdfFile}.pdf`;
    const { loading, text, lessons, grammar } = usePDFParser(pdfUrl);

    // Configuration for different PDF types
    const pdfConfig = {
        'tong-hop-tu-vung-n3': {
            title: 'Tổng Hợp Từ Vựng N3',
            description: '1000+ essential vocabulary words categorized by topics',
            type: 'vocabulary',
            icon: '📚'
        },
        'tu-vung-thi-n3': {
            title: 'Từ Vựng Hay Gặp Trong Đề Thi N3',
            description: 'Most frequently appearing words in JLPT N3 exams',
            type: 'vocabulary',
            icon: '⭐'
        },
        'tu-vung-thi-n3-1': {
            title: 'Từ Vựng Hay Gặp Trong Đề Thi N3 (Part 2)',
            description: 'Additional high-frequency vocabulary from N3 exams',
            type: 'vocabulary',
            icon: '🎯'
        },
        '200-cau-kho-nhat-n3': {
            title: '200 Câu Khó Nhất N3',
            description: 'The most challenging 200 questions from JLPT N3',
            type: 'pdf',
            icon: '🔥'
        },
        'meo-lam-de-n3': {
            title: 'Mẹo Làm Đề N3',
            description: 'Strategic tips and techniques for JLPT N3 exam success',
            type: 'pdf',
            icon: '💡'
        }
    };

    const config = pdfConfig[pdfFile] || {
        title: pdfFile,
        description: 'Study material',
        type: 'pdf',
        icon: '📄'
    };

    const pdfUrl = `/pdfs/${pdfFile}.pdf`;

    useEffect(() => {
        const loadStudyMaterial = async () => {
            if (config.type === 'vocabulary') {
                try {
                    setError(null);
                    const parsedData = await parseVocabularyFromPDF(pdfUrl, pdfFile);

                    if (parsedData) {
                        setStudyData(parsedData);
                    } else {
                        setError('Failed to parse vocabulary from PDF');
                    }
                } catch (err) {
                    setError(`Error loading study material: ${err.message}`);
                }
            }
        };

        loadStudyMaterial();
    }, [pdfFile, config.type, extractTextFromPDF, parseVocabularyLessons, pdfUrl]);

    // Filter data based on search term
    const getFilteredData = () => {
        if (!studyData || !searchTerm.trim()) return studyData;

        const filteredLessons = searchVocabulary(studyData.lessons, searchTerm);

        return {
            ...studyData,
            lessons: filteredLessons
        };
    };

    const filteredData = getFilteredData();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Link
                                to="/"
                                className="mr-4 p-2 text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                ← Back to Home
                            </Link>
                            <div>
                                <div className="flex items-center mb-2">
                                    <span className="text-2xl mr-3">{config.icon}</span>
                                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                        {config.title}
                                    </h1>
                                </div>
                                <p className="text-gray-600">{config.description}</p>
                            </div>
                        </div>

                        {/* Study Mode Badge */}
                        <div className={`px-4 py-2 rounded-full text-sm font-medium ${config.type === 'vocabulary'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                            }`}>
                            {config.type === 'vocabulary' ? '📖 Auto-parsed Lessons' : '📄 PDF Viewer'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-8">
                {config.type === 'vocabulary' ? (
                    // Vocabulary Mode
                    <div>
                        {pdfLoading && (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                <span className="ml-3 text-gray-600">Processing PDF and extracting vocabulary...</span>
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
                                <div className="flex items-center">
                                    <span className="text-red-600 text-xl mr-3">❌</span>
                                    <div>
                                        <h3 className="text-red-900 font-semibold">Error Processing PDF</h3>
                                        <p className="text-red-700 mt-1">{error}</p>
                                        <div className="mt-3 text-sm text-red-600">
                                            <p>This might happen if:</p>
                                            <ul className="list-disc list-inside mt-1">
                                                <li>The PDF file is not accessible</li>
                                                <li>The PDF format is not supported</li>
                                                <li>The vocabulary format doesn't match expected patterns</li>
                                            </ul>
                                        </div>
                                        <button
                                            onClick={() => window.location.reload()}
                                            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                                        >
                                            Retry
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {filteredData && !pdfLoading && (
                            <div>
                                {/* Study Statistics */}
                                <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-blue-600">
                                                {filteredData.totalVocabulary}
                                            </div>
                                            <div className="text-sm text-gray-600">Total Words</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-green-600">
                                                {filteredData.totalLessons}
                                            </div>
                                            <div className="text-sm text-gray-600">Lessons</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-purple-600">
                                                {filteredData.grammar ? filteredData.grammar.length : 0}
                                            </div>
                                            <div className="text-sm text-gray-600">Grammar Items</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-orange-600">30</div>
                                            <div className="text-sm text-gray-600">Words/Lesson</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Vocabulary Lessons Component */}
                                <VocabularyLessons
                                    lessons={filteredData.lessons}
                                    grammar={filteredData.grammar || []}
                                    searchTerm={searchTerm}
                                    onSearch={setSearchTerm}
                                />
                            </div>
                        )}
                    </div>
                ) : (
                    // PDF Viewer Mode
                    <div>
                        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                        📄 Direct PDF Study Mode
                                    </h2>
                                    <p className="text-gray-600">
                                        View and interact with the original PDF document with full controls.
                                    </p>
                                </div>
                                <a
                                    href={pdfUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-secondary"
                                >
                                    🔗 Open in New Tab
                                </a>
                            </div>
                        </div>

                        <AdvancedPDFViewer
                            pdfUrl={pdfUrl}
                            title={config.title}
                        />
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer className="bg-white border-t mt-12">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                        <div>
                            📚 JLPT N3 Study Center - Built with React & Tailwind CSS
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link to="/" className="hover:text-gray-900 transition-colors">
                                Home
                            </Link>
                            <span>•</span>
                            <span>Study Mode: {config.type === 'vocabulary' ? 'Auto-parsed' : 'PDF Viewer'}</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default StudyPage;