import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';

const LessonStudy = () => {
    const { lessonId } = useParams();
    const [lesson, setLesson] = useState(null);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [progress, setProgress] = useState({});
    const [sessionStats, setSessionStats] = useState({
        studied: 0,
        correct: 0
    });

    useEffect(() => {
        loadLesson();
        loadProgress();
    }, [lessonId]);

    const loadLesson = async () => {
        try {
            const response = await fetch('/data/tu-vung-n3-fixed.json');
            const data = await response.json();

            // Find lesson by ID or index
            let foundLesson = null;
            if (data.lessons) {
                foundLesson = data.lessons.find(l => l.id === lessonId) ||
                    data.lessons[parseInt(lessonId.replace('lesson-', '')) - 1];
            }

            setLesson(foundLesson);
            console.log('Loaded fixed lesson:', foundLesson);
        } catch (error) {
            console.error('Error loading lesson:', error);
        }
    };

    const loadProgress = () => {
        const savedProgress = JSON.parse(localStorage.getItem('n3-lessons-progress') || '{}');
        setProgress(savedProgress[lessonId] || {});
    };

    const saveProgress = (wordId, wordProgress) => {
        const allProgress = JSON.parse(localStorage.getItem('n3-lessons-progress') || '{}');

        if (!allProgress[lessonId]) {
            allProgress[lessonId] = {};
        }

        allProgress[lessonId][wordId] = wordProgress;
        localStorage.setItem('n3-lessons-progress', JSON.stringify(allProgress));
        setProgress(allProgress[lessonId]);
    };

    const handleDifficultySelect = (difficulty) => {
        const currentWord = lesson.vocabulary[currentWordIndex];
        const wordProgress = {
            studied: true,
            difficulty: difficulty,
            lastStudied: Date.now(),
            reviewCount: (progress[currentWord.id]?.reviewCount || 0) + 1
        };

        saveProgress(currentWord.id, wordProgress);

        setSessionStats(prev => ({
            studied: prev.studied + 1,
            correct: difficulty !== 'hard' ? prev.correct + 1 : prev.correct
        }));

        nextWord();
    };

    const nextWord = () => {
        setShowAnswer(false);
        if (currentWordIndex < lesson.vocabulary.length - 1) {
            setCurrentWordIndex(currentWordIndex + 1);
        } else {
            // Lesson completed
            alert('🎉 Hoàn thành bài học!');
        }
    };

    const prevWord = () => {
        setShowAnswer(false);
        if (currentWordIndex > 0) {
            setCurrentWordIndex(currentWordIndex - 1);
        }
    };

    const playAudio = (text) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'ja-JP';
            utterance.rate = 0.8;
            speechSynthesis.speak(utterance);
        }
    };

    if (!lesson) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải bài học...</p>
                </div>
            </div>
        );
    }

    const currentWord = lesson.vocabulary[currentWordIndex];
    const wordProgress = progress[currentWord.id];
    const isWordStudied = wordProgress?.studied;

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                {/* Header */}
                <div className="bg-white shadow-sm border-b">
                    <div className="max-w-4xl mx-auto px-4 py-4">
                        <div className="flex items-center justify-between mb-4">
                            <Link
                                to="/vocabulary"
                                className="text-blue-600 hover:text-blue-700 flex items-center"
                            >
                                ← Về danh sách bài học
                            </Link>
                            <div className="text-right">
                                <div className="text-sm text-gray-500">
                                    📚 Đã học: {sessionStats.studied} | ✅ Đúng: {sessionStats.correct}
                                </div>
                            </div>
                        </div>

                        <h1 className="text-2xl font-bold text-gray-900 mb-2">{lesson.title}</h1>

                        {/* Progress Bar */}
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">
                                Từ {currentWordIndex + 1} / {lesson.vocabulary.length}
                            </span>
                            <span className="text-sm text-gray-600">
                                {Math.round(((currentWordIndex + 1) / lesson.vocabulary.length) * 100)}%
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${((currentWordIndex + 1) / lesson.vocabulary.length) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Word Card */}
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        {/* Word Front */}
                        <div className="p-8 text-center">
                            <div className="mb-6">
                                {isWordStudied && (
                                    <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mb-4">
                                        ✅ Đã học
                                    </span>
                                )}

                                <h2 className="text-5xl font-bold text-gray-900 mb-2">
                                    {currentWord.kanji}
                                </h2>
                                <h3 className="text-3xl text-blue-600 mb-2">
                                    {currentWord.hiragana}
                                </h3>
                                <p className="text-xl text-gray-600 mb-4">
                                    [{currentWord.pronunciation}]
                                </p>

                                <button
                                    className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg transition-colors"
                                    onClick={() => playAudio(currentWord.kanji)}
                                >
                                    🔊 Nghe phát âm
                                </button>
                            </div>

                            {!showAnswer && (
                                <button
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-all transform hover:scale-105"
                                    onClick={() => setShowAnswer(true)}
                                >
                                    👁️ Xem nghĩa
                                </button>
                            )}
                        </div>

                        {/* Word Back (Answer) */}
                        {showAnswer && (
                            <div className="border-t bg-gray-50 p-8">
                                <div className="text-center mb-6">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Nghĩa:</h3>
                                    <p className="text-2xl text-green-700 font-semibold mb-4">
                                        {currentWord.meaning}
                                    </p>

                                    {/* Kanji Information */}
                                    {currentWord.kanjiInfo && (
                                        <div className="bg-yellow-50 rounded-lg p-4 mb-4 text-left">
                                            <h4 className="text-lg font-semibold text-gray-900 mb-2">📝 Thông tin chữ Hán:</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                                <div><strong>Nghĩa:</strong> {currentWord.kanjiInfo.meaning}</div>
                                                <div><strong>Số nét:</strong> {currentWord.kanjiInfo.strokes || 'N/A'}</div>
                                                <div><strong>Âm ON:</strong> {currentWord.kanjiInfo.onyomi || 'N/A'}</div>
                                                <div><strong>Âm KUN:</strong> {currentWord.kanjiInfo.kunyomi || 'N/A'}</div>
                                                {currentWord.kanjiInfo.vietnamese && (
                                                    <div><strong>Âm Hán Việt:</strong> <span className="text-red-600 font-bold">{currentWord.kanjiInfo.vietnamese}</span></div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div className="bg-blue-50 rounded-lg p-4 mb-6">
                                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Ví dụ:</h4>
                                        <p className="text-gray-800 leading-relaxed">
                                            {currentWord.example}
                                        </p>
                                        <button
                                            className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
                                            onClick={() => playAudio(currentWord.example.split('(')[0])}
                                        >
                                            🔊 Nghe ví dụ
                                        </button>
                                    </div>
                                </div>

                                {/* Difficulty Selection */}
                                <div className="text-center">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                                        Độ khó của từ này với bạn:
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <button
                                            className="bg-red-100 hover:bg-red-200 text-red-700 p-4 rounded-lg transition-colors"
                                            onClick={() => handleDifficultySelect('hard')}
                                        >
                                            <div className="text-2xl mb-1">😰</div>
                                            <div className="font-semibold">Khó</div>
                                            <div className="text-sm">Xem lại sau 1 ngày</div>
                                        </button>
                                        <button
                                            className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 p-4 rounded-lg transition-colors"
                                            onClick={() => handleDifficultySelect('normal')}
                                        >
                                            <div className="text-2xl mb-1">🤔</div>
                                            <div className="font-semibold">Bình thường</div>
                                            <div className="text-sm">Xem lại sau 3 ngày</div>
                                        </button>
                                        <button
                                            className="bg-green-100 hover:bg-green-200 text-green-700 p-4 rounded-lg transition-colors"
                                            onClick={() => handleDifficultySelect('easy')}
                                        >
                                            <div className="text-2xl mb-1">😊</div>
                                            <div className="font-semibold">Dễ</div>
                                            <div className="text-sm">Xem lại sau 1 tuần</div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between items-center mt-6">
                        <button
                            className={`px-6 py-2 rounded-lg transition-colors ${currentWordIndex === 0
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                }`}
                            onClick={prevWord}
                            disabled={currentWordIndex === 0}
                        >
                            ← Từ trước
                        </button>

                        <span className="text-sm text-gray-600">
                            {currentWordIndex + 1} / {lesson.vocabulary.length}
                        </span>

                        <button
                            className={`px-6 py-2 rounded-lg transition-colors ${currentWordIndex === lesson.vocabulary.length - 1
                                ? 'bg-green-500 hover:bg-green-600 text-white'
                                : 'bg-blue-500 hover:bg-blue-600 text-white'
                                }`}
                            onClick={nextWord}
                        >
                            {currentWordIndex === lesson.vocabulary.length - 1 ? 'Hoàn thành' : 'Từ tiếp →'}
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default LessonStudy;