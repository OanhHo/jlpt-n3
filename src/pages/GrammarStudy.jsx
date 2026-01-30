import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const GrammarStudy = () => {
    const [grammarData, setGrammarData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadGrammarData = async () => {
            try {
                const response = await fetch('/data/ngu-phap-n3.json');
                if (!response.ok) {
                    throw new Error('Failed to load grammar data');
                }
                const data = await response.json();
                setGrammarData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadGrammarData();
    }, []);

    const handleLessonClick = (lessonId) => {
        navigate(`/grammar/${lessonId}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải dữ liệu ngữ pháp...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-xl mb-4">❌</div>
                    <p className="text-red-600">Lỗi: {error}</p>
                </div>
            </div>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
                {/* Header */}

                {/* Header */}
                <div className="bg-white shadow-sm">
                    <div className="max-w-6xl mx-auto px-4 py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    📚 Ngữ pháp JLPT N3
                                </h1>
                                <p className="text-gray-600 mt-2">
                                    Tổng hợp các mẫu ngữ pháp quan trọng cho kỳ thi JLPT N3
                                </p>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                            <div className="bg-purple-50 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-purple-600">
                                    {grammarData?.totalGrammar || 0}
                                </div>
                                <div className="text-sm text-gray-500">mẫu ngữ pháp</div>
                            </div>
                            <div className="bg-indigo-50 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-indigo-600">
                                    {grammarData?.totalLessons || 0}
                                </div>
                                <div className="text-sm text-gray-500">bài học</div>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                    {grammarData?.statistics?.patternsPerLesson || 0}
                                </div>
                                <div className="text-sm text-gray-500">mẫu/bài</div>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-green-600">
                                    {grammarData?.level || 'N3'}
                                </div>
                                <div className="text-sm text-gray-500">cấp độ</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grammar Lessons Grid */}
                <div className="max-w-6xl mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {grammarData?.lessons?.map((lesson, index) => (
                            <div
                                key={lesson.id}
                                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden"
                                onClick={() => handleLessonClick(lesson.id)}
                            >
                                {/* Lesson Header */}
                                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="text-2xl font-bold">
                                            {String(index + 1).padStart(2, '0')}
                                        </div>
                                        <div className="bg-white/20 rounded-full px-3 py-1 text-sm">
                                            {lesson.grammarCount} mẫu
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-semibold mt-2 group-hover:text-purple-100 transition-colors">
                                        {lesson.title}
                                    </h3>
                                    <p className="text-purple-100 text-sm mt-1">
                                        {lesson.description}
                                    </p>
                                </div>

                                {/* Lesson Content Preview */}
                                <div className="p-6">
                                    <div className="space-y-3">
                                        {lesson.grammar?.slice(0, 3).map((pattern, patternIndex) => (
                                            <div key={pattern.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-semibold">
                                                        {patternIndex + 1}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-gray-900">
                                                            {pattern.pattern}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {pattern.meaning}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-purple-500">
                                                    →
                                                </div>
                                            </div>
                                        ))}
                                        {lesson.grammar?.length > 3 && (
                                            <div className="text-center text-sm text-gray-400 py-2">
                                                + {lesson.grammar.length - 3} mẫu khác...
                                            </div>
                                        )}
                                    </div>

                                    {/* Study Button */}
                                    <div className="mt-6">
                                        <button className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-3 rounded-lg font-medium hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 group-hover:shadow-md">
                                            🎯 Bắt đầu học
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Statistics Section */}
                {grammarData?.statistics && (
                    <div className="max-w-6xl mx-auto px-4 py-6">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-lg font-semibold mb-4">📊 Thống kê học tập</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                <div>
                                    <div className="text-2xl font-bold text-purple-600">
                                        {grammarData.statistics.totalExamples}
                                    </div>
                                    <div className="text-sm text-gray-500">Ví dụ</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-indigo-600">
                                        {grammarData.statistics.patternsPerLesson}
                                    </div>
                                    <div className="text-sm text-gray-500">Mẫu/bài</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-blue-600">
                                        {grammarData.statistics.avgExamplesPerPattern}
                                    </div>
                                    <div className="text-sm text-gray-500">VD/mẫu</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-green-600">
                                        100%
                                    </div>
                                    <div className="text-sm text-gray-500">Độ chính xác</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default GrammarStudy;