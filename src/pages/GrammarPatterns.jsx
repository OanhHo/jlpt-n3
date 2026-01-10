import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const GrammarPatterns = () => {
    const [patterns, setPatterns] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [studyMode, setStudyMode] = useState('all');
    const [progress, setProgress] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadGrammarPatterns();
        loadProgress();
    }, []);

    const loadGrammarPatterns = async () => {
        try {
            const response = await fetch('/data/n3-grammar-patterns.json');
            const data = await response.json();
            setPatterns(data);
        } catch (error) {
            console.error('Error loading grammar patterns:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadProgress = () => {
        const savedProgress = JSON.parse(localStorage.getItem('n3-grammar-progress') || '{}');
        setProgress(savedProgress);
    };

    const saveProgress = (patternId, patternProgress) => {
        const newProgress = {
            ...progress,
            [patternId]: patternProgress
        };
        localStorage.setItem('n3-grammar-progress', JSON.stringify(newProgress));
        setProgress(newProgress);
    };

    const handleDifficultySelect = (difficulty) => {
        const currentPattern = patterns[currentIndex];

        const patternProgress = {
            studied: true,
            difficulty: difficulty,
            lastStudied: new Date().toISOString(),
            reviewCount: (progress[currentPattern.id]?.reviewCount || 0) + 1
        };

        saveProgress(currentPattern.id, patternProgress);
        nextPattern();
    };

    const nextPattern = () => {
        if (currentIndex < patterns.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setCurrentIndex(0); // Wrap around
        }
        setShowAnswer(false);
    };

    const previousPattern = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        } else {
            setCurrentIndex(patterns.length - 1); // Wrap around
        }
        setShowAnswer(false);
    };

    const playAudio = (text) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'ja-JP';
            utterance.rate = 0.8;
            speechSynthesis.speak(utterance);
        }
    };

    if (loading) {
        return (
            <div className="container">
                <div className="grammar-loading">
                    <div className="loading-spinner">📖</div>
                    <p>Đang tải ngữ pháp N3...</p>
                </div>
            </div>
        );
    }

    if (patterns.length === 0) {
        return (
            <div className="container">
                <div className="no-patterns">
                    <h2>Không tìm thấy ngữ pháp</h2>
                </div>
            </div>
        );
    }

    const currentPattern = patterns[currentIndex];
    const patternProgress = progress[currentPattern.id];
    const studiedCount = Object.keys(progress).filter(id => progress[id]?.studied).length;

    return (
        <div className="container">
            <div className="grammar-patterns">
                {/* Header */}
                <div className="grammar-header">
                    <div className="header-nav">
                        <Link to="/japanese/tu-vung-thi-n3" className="back-btn">
                            ← Về danh sách
                        </Link>
                        <h1>📖 Ngữ Pháp N3 Cần Chú Ý</h1>
                    </div>

                    <div className="grammar-stats">
                        <div className="stat-item">
                            <span>Pattern {currentIndex + 1}/{patterns.length}</span>
                        </div>
                        <div className="stat-item">
                            <span>📚 Đã học: {studiedCount}</span>
                        </div>
                        <div className="stat-item">
                            <span>⭐ Tần suất: {currentPattern.frequency}%</span>
                        </div>
                    </div>

                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${((currentIndex + 1) / patterns.length) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Pattern Card */}
                <div className="pattern-card">
                    <div className="pattern-front">
                        <div className="pattern-main">
                            <h2 className="pattern-text">{currentPattern.pattern}</h2>
                            <h3 className="pattern-meaning">{currentPattern.meaning}</h3>
                            <p className="pattern-vietnamese">{currentPattern.vietnamese}</p>

                            <div className="pattern-meta">
                                <span className="level">Level: {currentPattern.level}</span>
                                <span className="frequency">Tần suất: {currentPattern.frequency}%</span>
                                {patternProgress?.studied && <span className="studied-badge">✅ Đã học</span>}
                            </div>

                            <button
                                className="audio-btn"
                                onClick={() => playAudio(currentPattern.pattern)}
                            >
                                🔊 Nghe phát âm
                            </button>
                        </div>

                        {!showAnswer && (
                            <button
                                className="show-answer-btn"
                                onClick={() => setShowAnswer(true)}
                            >
                                👁️ Xem chi tiết
                            </button>
                        )}
                    </div>

                    {showAnswer && (
                        <div className="pattern-back">
                            {/* Usage */}
                            <div className="usage-section">
                                <h4>📝 Cách sử dụng:</h4>
                                <p>{currentPattern.usage}</p>
                            </div>

                            {/* Structure */}
                            <div className="structure-section">
                                <h4>🔧 Cấu trúc:</h4>
                                <div className="formation-list">
                                    {currentPattern.structure.formation.map((form, index) => (
                                        <div key={index} className="formation-item">
                                            {form}
                                        </div>
                                    ))}
                                </div>
                                <p className="structure-notes">{currentPattern.structure.notes}</p>
                            </div>

                            {/* Examples */}
                            <div className="examples-section">
                                <h4>💡 Ví dụ:</h4>
                                {currentPattern.examples.map((example, index) => (
                                    <div key={index} className="example-item">
                                        <div className="example-jp">
                                            {example.jp}
                                            <button
                                                className="example-audio"
                                                onClick={() => playAudio(example.jp)}
                                            >
                                                🔊
                                            </button>
                                        </div>
                                        <div className="example-vi">{example.vi}</div>
                                        <div className="example-en">{example.en}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Similar Patterns */}
                            <div className="similar-section">
                                <h4>🔄 Ngữ pháp tương tự:</h4>
                                <div className="similar-list">
                                    {currentPattern.similar_patterns.map((similar, index) => (
                                        <span key={index} className="similar-item">{similar}</span>
                                    ))}
                                </div>
                            </div>

                            {/* Common Mistakes */}
                            <div className="mistakes-section">
                                <h4>⚠️ Lỗi thường gặp:</h4>
                                {currentPattern.common_mistakes.map((mistake, index) => (
                                    <div key={index} className="mistake-item">
                                        <div className="wrong">❌ {mistake.wrong}</div>
                                        <div className="correct">✅ {mistake.correct}</div>
                                        <div className="explanation">{mistake.explanation}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Difficulty Selection */}
                            <div className="difficulty-selection">
                                <h4>Độ khó của pattern này với bạn:</h4>
                                <div className="difficulty-buttons">
                                    <button
                                        className="diff-btn hard"
                                        onClick={() => handleDifficultySelect('hard')}
                                    >
                                        😰 Khó<br />
                                        <small>Xem lại sau 1 ngày</small>
                                    </button>
                                    <button
                                        className="diff-btn normal"
                                        onClick={() => handleDifficultySelect('normal')}
                                    >
                                        🤔 Bình thường<br />
                                        <small>Xem lại sau 3 ngày</small>
                                    </button>
                                    <button
                                        className="diff-btn easy"
                                        onClick={() => handleDifficultySelect('easy')}
                                    >
                                        😊 Dễ<br />
                                        <small>Xem lại sau 1 tuần</small>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <div className="pattern-navigation">
                    <button
                        className="nav-btn prev"
                        onClick={previousPattern}
                    >
                        ← Pattern trước
                    </button>

                    <div className="nav-center">
                        {!showAnswer ? (
                            <button
                                className="action-btn show"
                                onClick={() => setShowAnswer(true)}
                            >
                                👁️ Xem chi tiết
                            </button>
                        ) : (
                            <button
                                className="action-btn skip"
                                onClick={nextPattern}
                            >
                                ⏭️ Pattern tiếp theo
                            </button>
                        )}
                    </div>

                    <button
                        className="nav-btn next"
                        onClick={nextPattern}
                    >
                        Pattern sau →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GrammarPatterns;