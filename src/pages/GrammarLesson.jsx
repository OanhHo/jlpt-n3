import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const GrammarLesson = () => {
    const { lessonId } = useParams();
    const navigate = useNavigate();
    const [grammarData, setGrammarData] = useState(null);
    const [currentLesson, setCurrentLesson] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadGrammarData = async () => {
            try {
                const response = await fetch('/data/ngu-phap-n3.json');
                if (!response.ok) {
                    throw new Error('Failed to load grammar data');
                }
                const data = await response.json();
                setGrammarData(data);

                // Find the specific lesson
                // Note: lessonId from the URL is a string (e.g. "1") while
                // lesson.id in `ngu-phap-n3.json` is numeric (e.g. 1).
                // Compare as strings to avoid a type mismatch.
                const lesson = data.lessons.find(l => String(l.id) === String(lessonId));
                if (lesson) {
                    setCurrentLesson(lesson);
                } else {
                    setError('Lesson not found');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadGrammarData();
    }, [lessonId]);

    const getCurrentPattern = () => {
        return currentLesson?.grammar?.[currentIndex];
    };

    // Synthesize guidance for common grammar patterns when data is sparse.
    const synthesizeGrammar = (patternObj) => {
        if (!patternObj) return null;
        const p = patternObj.pattern || '';
        const meaning = patternObj.meaning || '';

        // Basic heuristics / handcrafted mapping for common patterns.
        const map = [
            {
                match: /始める/,
                when: 'Diễn tả bắt đầu một hành động hoặc trạng thái mới.',
                how: 'Dùng với động từ ở dạng ます (bỏ ます) + 始める để nói "bắt đầu làm gì". Ví dụ: 書き始める = bắt đầu viết.',
                formation: 'Vます (bỏ ます) + 始める',
                similar: ['～出す (bắt đầu đột ngột)', '～終わる (kết thúc)', '～続ける (tiếp tục)']
            },
            {
                match: /終わる/,
                when: 'Diễn tả hành động đã hoàn tất.',
                how: 'Dùng với dạng ます (bỏ ます) + 終わる để nói "làm xong việc gì".',
                formation: 'Vます (bỏ ます) + 終わる',
                similar: ['～始める (bắt đầu)', '～きる (làm xong toàn bộ)']
            },
            {
                match: /続ける/,
                when: 'Diễn tả hành động được tiếp tục kéo dài trong khoảng thời gian.',
                how: 'Dùng với dạng ます (bỏ ます) + 続ける để nói "tiếp tục làm gì".',
                formation: 'Vます (bỏ ます) + 続ける',
                similar: ['～ながら (vừa... vừa...)', '～終わる']
            },
            {
                match: /きる/,
                when: 'Diễn tả hành động được hoàn thành toàn bộ hoặc ở mức độ hoàn toàn.',
                how: 'Dùng với dạng ます (bỏ ます) + きる để nhấn mạnh tính hoàn tất hoặc tuyệt đối.',
                formation: 'Vます (bỏ ます) + きる',
                similar: ['～終わる', '～済む']
            },
            {
                match: /たて/,
                when: 'Diễn tả trạng thái "vừa mới" xảy ra.',
                how: 'Đứng sau danh từ/động từ ます-stem để nói "vừa mới ~" (ví dụ: 出来立て).',
                formation: 'N/ Vます-stem + たて',
                similar: ['～ばかり (vừa mới)']
            },
            {
                match: /ように|ようだ|みたい/,
                when: 'Diễn tả suy đoán hoặc so sánh (giống như).',
                how: 'Tùy dạng: 普通形 + そうだ (nghe nói), ようだ/みたい (giống như/như thể).',
                formation: '普通形 + ようだ / みたい (hoặc N + らしい)',
                similar: ['～らしい (có vẻ như)']
            }
        ];

        for (const item of map) {
            if (item.match.test(p)) {
                return {
                    when: item.when,
                    how: item.how,
                    similar: item.similar
                };
            }
        }

        // Fallback: make 'when' (khi dùng) come from meaning, and make 'how'
        // (cách dùng) give a usable structure or guidance derived from formation or the pattern.
        const generatedFormation = patternObj.formation || patternObj.pattern || 'Không có cấu trúc cụ thể trong dữ liệu.';
        const generatedHow = patternObj.formation
            ? patternObj.formation
            : patternObj.pattern
                ? `Sử dụng cấu trúc: ${patternObj.pattern}. Tham khảo ví dụ để hiểu cách dùng cụ thể.`
                : (meaning ? `Xem ý nghĩa: ${meaning}` : 'Không có hướng dẫn chi tiết; xem ví dụ.');

        return {
            when: meaning ? `Khi muốn diễn tả: ${meaning}` : 'Không có dữ liệu cụ thể; xem ví dụ để hiểu ngữ cảnh sử dụng.',
            how: generatedHow,
            formation: generatedFormation,
            similar: []
        };
    };

    const handleNext = () => {
        if (currentIndex < currentLesson.grammar.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setShowAnswer(false);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setShowAnswer(false);
        }
    };

    const handleShowAnswer = () => {
        setShowAnswer(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải bài học...</p>
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
                    <button
                        onClick={() => navigate('/grammar')}
                        className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                        Quay lại danh sách
                    </button>
                </div>
            </div>
        );
    }

    const currentPattern = getCurrentPattern();

    // Prepare display text with sensible fallbacks.
    const usageText = currentPattern
        ? (currentPattern.usage ?? currentPattern.meaning ?? (Array.isArray(currentPattern.examples) ? currentPattern.examples[0] : currentPattern.example ?? ''))
        : '';

    const exampleText = currentPattern
        ? (Array.isArray(currentPattern.examples) ? currentPattern.examples.join('\n\n') : (currentPattern.example ?? ''))
        : '';

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate('/grammar')}
                                className="text-purple-600 hover:text-purple-800 transition-colors"
                            >
                                ← Quay lại
                            </button>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">
                                    {currentLesson?.title}
                                </h1>
                                <p className="text-sm text-gray-500">
                                    {currentIndex + 1} / {currentLesson?.grammar?.length || 0}
                                </p>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="flex-1 max-w-md mx-8">
                            <div className="bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-gradient-to-r from-purple-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
                                    style={{
                                        width: `${((currentIndex + 1) / (currentLesson?.grammar?.length || 1)) * 100}%`
                                    }}
                                ></div>
                            </div>
                        </div>

                        <div className="text-sm text-gray-600">
                            {Math.round(((currentIndex + 1) / (currentLesson?.grammar?.length || 1)) * 100)}%
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                {currentPattern && (
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        {/* Pattern Display */}
                        <div className="text-center mb-8">
                            <div className="text-4xl font-bold text-purple-600 mb-4">
                                {currentPattern.pattern}
                            </div>
                            <div className="text-xl text-gray-600 mb-2">
                                {currentPattern.meaning}
                            </div>
                            <div className="text-sm text-purple-500 bg-purple-50 rounded-lg px-4 py-2 inline-block">
                                {currentPattern.formation || 'N3 Grammar Pattern'}
                            </div>
                        </div>

                        {/* Usage Section */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">📝 Cách sử dụng:</h3>
                            <div className="bg-blue-50 rounded-lg p-4">
                                <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                                    {usageText}
                                </p>
                            </div>
                        </div>

                        {/* Example Section */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">🔸 Ví dụ:</h3>
                            <div className="bg-green-50 rounded-lg p-4">
                                <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                                    {exampleText}
                                </p>
                            </div>
                        </div>

                        {/* Formation Details */}
                        {currentPattern.formation && (
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">🔧 Cấu tạo:</h3>
                                <div className="bg-yellow-50 rounded-lg p-4">
                                    <p className="text-gray-800 font-mono">
                                        {currentPattern.formation}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Notes */}
                        {currentPattern.notes && (
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">💡 Ghi chú:</h3>
                                <div className="bg-orange-50 rounded-lg p-4">
                                    <p className="text-gray-800 leading-relaxed">
                                        {currentPattern.notes}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Synthesized grammar details (revealed by Xem chi tiết) */}
                        {showAnswer && (() => {
                            const synth = synthesizeGrammar(currentPattern);
                            return (
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">📚 Tổng hợp ngữ pháp (tự động):</h3>
                                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                        <p className="text-gray-800 font-semibold">Khi dùng:</p>
                                        <p className="text-gray-700 mb-2">{synth?.when}</p>

                                        <p className="text-gray-800 font-semibold">Cách dùng:</p>
                                        <p className="text-gray-700 mb-2 whitespace-pre-line">{synth?.how}</p>

                                        {synth?.similar && synth.similar.length > 0 && (
                                            <>
                                                <p className="text-gray-800 font-semibold">Mẫu tương tự:</p>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {synth.similar.map((s, i) => (
                                                        <span key={i} className="text-sm bg-purple-100 text-purple-800 px-3 py-1 rounded-full">{s}</span>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })()}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                            <button
                                onClick={handlePrevious}
                                disabled={currentIndex === 0}
                                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${currentIndex === 0
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-gray-500 text-white hover:bg-gray-600'
                                    }`}
                            >
                                ← Trước
                            </button>

                            <div className="flex space-x-4">
                                <button
                                    onClick={() => setShowAnswer(!showAnswer)}
                                    className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-all duration-300"
                                >
                                    {showAnswer ? '🙈 Ẩn chi tiết' : '👁️ Xem chi tiết'}
                                </button>
                            </div>

                            <button
                                onClick={handleNext}
                                disabled={currentIndex === (currentLesson?.grammar?.length || 0) - 1}
                                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${currentIndex === (currentLesson?.grammar?.length || 0) - 1
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700'
                                    }`}
                            >
                                Tiếp →
                            </button>
                        </div>

                        {/* Completion Message */}
                        {currentIndex === (currentLesson?.grammar?.length || 0) - 1 && (
                            <div className="mt-8 text-center">
                                <div className="bg-green-50 rounded-lg p-6">
                                    <div className="text-2xl mb-2">🎉</div>
                                    <h3 className="text-lg font-semibold text-green-800 mb-2">
                                        Chúc mừng! Bạn đã hoàn thành bài học này.
                                    </h3>
                                    <p className="text-green-600 mb-4">
                                        Bạn đã học xong {currentLesson?.grammar?.length} mẫu ngữ pháp N3.
                                    </p>
                                    <button
                                        onClick={() => navigate('/grammar')}
                                        className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                                    >
                                        Quay lại danh sách bài học
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GrammarLesson;