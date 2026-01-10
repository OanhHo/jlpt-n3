import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const VocabularyStudy = () => {
    const [vocabularyData, setVocabularyData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [progress, setProgress] = useState({});

    useEffect(() => {
        loadVocabularyData();
        loadProgress();
    }, []);

    const loadVocabularyData = async () => {
        try {
            setLoading(true);
            const response = await fetch('/data/tu-vung-n3-fixed.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setVocabularyData(data);
            console.log('Loaded fixed vocabulary data:', data);
        } catch (error) {
            console.error('Error loading vocabulary:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const loadProgress = () => {
        const savedProgress = localStorage.getItem('n3-vocabulary-progress');
        if (savedProgress) {
            setProgress(JSON.parse(savedProgress));
        }
    };

    const getLessonProgress = (lessonId) => {
        return progress[lessonId] || { studied: 0, completed: false };
    };

    const getProgressPercentage = (lesson) => {
        const lessonProgress = getLessonProgress(lesson.id);
        return lesson.vocabularyCount > 0
            ? Math.round((lessonProgress.studied / lesson.vocabularyCount) * 100)
            : 0;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải từ vựng...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
                <div className="text-center bg-white rounded-lg shadow-lg p-8 max-w-md">
                    <div className="text-4xl mb-4">❌</div>
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Lỗi tải dữ liệu</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Navigation Header */}
            <nav className="bg-white shadow-lg">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-2">
                            <span className="text-2xl">🎌</span>
                            <h1 className="text-xl font-bold text-gray-900">JLPT N3 Center</h1>
                        </div>

                        <div className="hidden md:flex items-center space-x-6">
                            <Link
                                to="/"
                                className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
                            >
                                🏠 Trang chủ
                            </Link>
                            <span className="text-blue-600 font-medium border-b-2 border-blue-600 pb-1">
                                📝 Từ vựng
                            </span>
                            <Link
                                to="/grammar"
                                className="text-gray-600 hover:text-purple-600 transition-colors font-medium"
                            >
                                📚 Ngữ pháp
                            </Link>
                            <Link
                                to="/dashboard"
                                className="text-gray-600 hover:text-green-600 transition-colors font-medium"
                            >
                                📊 Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-6xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                � Từ vựng JLPT N3
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Tổng hợp từ vựng quan trọng cho kỳ thi JLPT N3
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-blue-600">
                                {vocabularyData?.totalVocabulary || 0}
                            </div>
                            <div className="text-sm text-gray-500">từ vựng</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistics */}
            {vocabularyData?.statistics && (
                <div className="max-w-6xl mx-auto px-4 py-6">
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <h3 className="text-lg font-semibold mb-4">📊 Thống kê dữ liệu</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                            <div>
                                <div className="text-2xl font-bold text-blue-600">
                                    {vocabularyData.statistics.validEntries}
                                </div>
                                <div className="text-sm text-gray-500">Từ hợp lệ</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-green-600">
                                    {vocabularyData.statistics.entriesWithKanji}
                                </div>
                                <div className="text-sm text-gray-500">Có Kanji</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-purple-600">
                                    {vocabularyData.statistics.entriesWithHiragana}
                                </div>
                                <div className="text-sm text-gray-500">Có Hiragana</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-orange-600">
                                    {vocabularyData.statistics.averageCompleteness}
                                </div>
                                <div className="text-sm text-gray-500">Độ đầy đủ TB</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Lessons Grid */}
            <div className="max-w-6xl mx-auto px-4 pb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">📖 Danh sách bài học</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {vocabularyData?.lessons?.map((lesson, index) => {
                        const progressPercent = getProgressPercentage(lesson);
                        const lessonProgress = getLessonProgress(lesson.id);

                        return (
                            <Link
                                key={lesson.id}
                                to={`/vocabulary/${lesson.id}`}
                                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-blue-300 overflow-hidden group"
                            >
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold mr-3">
                                                {index + 1}
                                            </div>
                                            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                Bài {index + 1}
                                            </h3>
                                        </div>
                                        {lessonProgress.completed && (
                                            <div className="text-green-500 text-xl">✅</div>
                                        )}
                                    </div>

                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                        {lesson.description}
                                    </p>

                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-medium text-gray-500">
                                            {lesson.vocabularyCount} từ vựng
                                        </span>
                                        <span className="text-sm font-medium text-blue-600">
                                            {progressPercent}% hoàn thành
                                        </span>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${progressPercent}%` }}
                                        ></div>
                                    </div>

                                    <div className="mt-4 flex items-center text-sm text-gray-500">
                                        <span className="mr-4">
                                            📝 {lessonProgress.studied}/{lesson.vocabularyCount}
                                        </span>
                                        {lessonProgress.studied > 0 && (
                                            <span className="text-green-600">
                                                🎯 Đã học
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="fixed bottom-6 right-6">
                <div className="flex flex-col gap-3">
                    <Link
                        to="/vocabulary/lesson-001"
                        className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                        title="Bắt đầu học"
                    >
                        ▶️
                    </Link>
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="bg-gray-600 text-white p-4 rounded-full shadow-lg hover:bg-gray-700 transition-colors"
                        title="Lên đầu trang"
                    >
                        ⬆️
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VocabularyStudy;