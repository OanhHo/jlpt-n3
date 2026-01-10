import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const LessonSelector = ({ dataSource = 'tu-vung-lessons' }) => {
    const [lessons, setLessons] = useState([]);
    const [progress, setProgress] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadLessons();
        loadProgress();
    }, [dataSource]);

    const loadLessons = async () => {
        try {
            const response = await fetch(`/data/${dataSource}.json`);
            const data = await response.json();
            setLessons(data);
        } catch (error) {
            console.error('Error loading lessons:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadProgress = () => {
        // Try multiple keys for backward compatibility. Different pages previously used
        // different localStorage keys (e.g. 'n3-lessons-progress'). Prefer dataSource-specific key,
        // but fall back to known alternatives.
        const candidateKeys = [
            `n3-${dataSource}-progress`,
            'n3-lessons-progress',
            'n3-vocabulary-progress',
            'n3-progress'
        ];

        let savedProgress = {};
        for (const key of candidateKeys) {
            const item = localStorage.getItem(key);
            if (item) {
                try {
                    const parsed = JSON.parse(item);
                    // If parsed is an object and not empty, use it
                    if (parsed && Object.keys(parsed).length > 0) {
                        savedProgress = parsed;
                        break;
                    }
                } catch (e) {
                    console.warn('Failed to parse progress from', key, e);
                }
            }
        }

        setProgress(savedProgress);
    };

    const calculateLessonProgress = (lessonId) => {
        const lessonProgress = progress[lessonId];
        if (!lessonProgress) return 0;

        // Find the lesson to get real total word count; fallback to 30 if not found
        const lessonObj = lessons.find(l => l.id === lessonId);
        const totalWords = lessonObj ? (lessonObj.vocabulary?.length || 30) : 30;

        const studiedWords = Object.keys(lessonProgress).filter(
            wordId => lessonProgress[wordId]?.studied
        ).length;

        return Math.round((studiedWords / totalWords) * 100);
    };

    const getLessonStatus = (lessonId) => {
        const progressPercent = calculateLessonProgress(lessonId);
        if (progressPercent === 0) return 'not-started';
        if (progressPercent === 100) return 'completed';
        return 'in-progress';
    };

    if (loading) {
        return (
            <div className="lesson-selector loading">
                <div className="loading-spinner">📚</div>
                <p>Đang tải danh sách bài học...</p>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="lesson-selector">
                <div className="selector-header">
                    <h1>📚 Từ Vựng Thi N3 - Học Theo Bài</h1>
                    <p>Mỗi bài 30 từ vựng xuất hiện nhiều nhất trong đề thi N3</p>

                    <div className="overall-stats">
                        <div className="stat-item">
                            <span className="stat-number">
                                {lessons.reduce((total, lesson) => {
                                    const progressPercent = calculateLessonProgress(lesson.id);
                                    return total + (progressPercent === 100 ? 1 : 0);
                                }, 0)}
                            </span>
                            <span className="stat-label">Bài đã hoàn thành</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">{lessons.length}</span>
                            <span className="stat-label">Tổng số bài</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">
                                {lessons.reduce((total, lesson) => total + lesson.vocabulary.length, 0)}
                            </span>
                            <span className="stat-label">Tổng từ vựng</span>
                        </div>
                    </div>
                </div>

                <div className="lessons-grid">
                    {lessons.map((lesson, index) => {
                        const progressPercent = calculateLessonProgress(lesson.id);
                        const status = getLessonStatus(lesson.id);

                        return (
                            <div key={lesson.id} className={`lesson-card ${status}`}>
                                <div className="lesson-number">
                                    Bài {index + 1}
                                </div>

                                <div className="lesson-content">
                                    <h3>{lesson.title}</h3>
                                    <p>{lesson.description}</p>

                                    <div className="lesson-meta">
                                        <div className="meta-item">
                                            <span className="meta-icon">⏱️</span>
                                            <span>{lesson.estimatedTime}</span>
                                        </div>
                                        <div className="meta-item">
                                            <span className="meta-icon">📝</span>
                                            <span>{lesson.vocabulary.length} từ</span>
                                        </div>
                                        <div className="meta-item">
                                            <span className="meta-icon">⭐</span>
                                            <span>{lesson.difficulty}</span>
                                        </div>
                                    </div>

                                    <div className="progress-section">
                                        <div className="progress-bar">
                                            <div
                                                className="progress-fill"
                                                style={{ width: `${progressPercent}%` }}
                                            ></div>
                                        </div>
                                        <span className="progress-text">{progressPercent}% hoàn thành</span>
                                    </div>
                                </div>

                                <div className="lesson-actions">
                                    <Link
                                        to={`/japanese/lesson/${lesson.id}`}
                                        className="action-btn primary"
                                    >
                                        {status === 'not-started' && '🚀 Bắt đầu học'}
                                        {status === 'in-progress' && '📖 Tiếp tục học'}
                                        {status === 'completed' && '🔄 Ôn tập'}
                                    </Link>

                                    {status !== 'not-started' && (
                                        <Link
                                            to={`/japanese/lesson/${lesson.id}/quiz`}
                                            className="action-btn secondary"
                                        >
                                            🎯 Kiểm tra
                                        </Link>
                                    )}
                                </div>

                                <div className={`status-badge ${status}`}>
                                    {status === 'not-started' && '⭕ Chưa học'}
                                    {status === 'in-progress' && '🔄 Đang học'}
                                    {status === 'completed' && '✅ Hoàn thành'}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="study-tips">
                    <h3>💡 Mẹo học hiệu quả:</h3>
                    <div className="tips-grid">
                        <div className="tip-item">
                            <span className="tip-icon">🎯</span>
                            <span>Học 1 bài mỗi ngày (30 từ)</span>
                        </div>
                        <div className="tip-item">
                            <span className="tip-icon">🔄</span>
                            <span>Ôn tập bài cũ trước khi học bài mới</span>
                        </div>
                        <div className="tip-item">
                            <span className="tip-icon">🎧</span>
                            <span>Nghe phát âm và lặp lại nhiều lần</span>
                        </div>
                        <div className="tip-item">
                            <span className="tip-icon">📝</span>
                            <span>Viết câu ví dụ với từ mới học</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LessonSelector;