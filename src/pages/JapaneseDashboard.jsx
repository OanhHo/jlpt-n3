import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './japanese-dashboard.css';
import Layout from '../components/Layout';

const JapaneseDashboard = () => {
    const [stats, setStats] = useState({
        vocabularyMastered: 0,
        grammarMastered: 0,
        totalVocab: 0,
        totalGrammar: 0,
        streakDays: 0,
        todayStudied: 0,
        targetDate: '2025-11-28' // Thi N3 trong 1 tháng
    });

    const [todayGoals, setTodayGoals] = useState({
        newVocab: 20,
        reviewVocab: 30,
        newGrammar: 3,
        readingTime: 30,
        listeningTime: 20
    });

    useEffect(() => {
        loadProgress();
        loadVocabularyCount();
        loadGrammarCount();
    }, []);

    const loadProgress = () => {
        const savedProgress = localStorage.getItem('n3-progress');
        if (savedProgress) {
            const progress = JSON.parse(savedProgress);
            const vocabMastered = Object.values(progress.vocabulary || {}).filter(v => v.mastered).length;
            const grammarMastered = Object.values(progress.grammar || {}).filter(g => g.mastered).length;

            setStats(prev => ({
                ...prev,
                vocabularyMastered: vocabMastered,
                grammarMastered: grammarMastered,
                streakDays: progress.stats?.streakDays || 0,
                todayStudied: progress.stats?.todayStudied || 0
            }));
        }
    };

    const loadVocabularyCount = async () => {
        try {
            const response = await fetch('/data/vocabulary.json');
            const vocab = await response.json();
            setStats(prev => ({ ...prev, totalVocab: vocab.length }));
        } catch (error) {
            console.error('Error loading vocabulary:', error);
        }
    };

    const loadGrammarCount = async () => {
        try {
            const response = await fetch('/data/grammar.json');
            const grammar = await response.json();
            setStats(prev => ({ ...prev, totalGrammar: grammar.length }));
        } catch (error) {
            console.error('Error loading grammar:', error);
        }
    };

    const calculateDaysLeft = () => {
        const target = new Date(stats.targetDate);
        const today = new Date();
        const diffTime = target - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const calculateReadinessScore = () => {
        const vocabScore = (stats.vocabularyMastered / Math.max(stats.totalVocab, 1)) * 0.4;
        const grammarScore = (stats.grammarMastered / Math.max(stats.totalGrammar, 1)) * 0.4;
        const consistencyScore = Math.min(stats.streakDays / 30, 1) * 0.2;
        return Math.round((vocabScore + grammarScore + consistencyScore) * 100);
    };

    const daysLeft = calculateDaysLeft();
    const readinessScore = calculateReadinessScore();

    return (
        <Layout>
            <div className="container j-dashboard-root">
                <div className="japanese-dashboard">
                    {/* Header */}
                    <div className="dashboard-header">
                        <h1>🎌 JLPT N3 Preparation</h1>
                        <div className="exam-countdown">
                            <span className="countdown-number">{daysLeft}</span>
                            <span className="countdown-text">days until exam</span>
                        </div>
                    </div>

                    {/* Readiness Score */}
                    <div className="readiness-card">
                        <h2>📊 Readiness Score</h2>
                        <div className="score-circle">
                            <div className={`circle-progress score-${readinessScore >= 70 ? 'good' : readinessScore >= 50 ? 'medium' : 'low'}`}>
                                <span className="score-number">{readinessScore}%</span>
                            </div>
                        </div>
                        <div className="readiness-status">
                            {readinessScore >= 70 && <span className="status good">✅ On Track!</span>}
                            {readinessScore >= 50 && readinessScore < 70 && <span className="status medium">⚠️ Need More Practice</span>}
                            {readinessScore < 50 && <span className="status low">🔥 Intensive Study Needed</span>}
                        </div>
                    </div>

                    {/* Progress Overview */}
                    <div className="progress-grid">
                        <div className="progress-card">
                            <h3>📚 Vocabulary</h3>
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{ width: `${(stats.vocabularyMastered / Math.max(stats.totalVocab, 1)) * 100}%` }}
                                ></div>
                            </div>
                            <p>{stats.vocabularyMastered} / {stats.totalVocab} mastered</p>
                        </div>

                        <div className="progress-card">
                            <h3>📖 Grammar</h3>
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{ width: `${(stats.grammarMastered / Math.max(stats.totalGrammar, 1)) * 100}%` }}
                                ></div>
                            </div>
                            <p>{stats.grammarMastered} / {stats.totalGrammar} mastered</p>
                        </div>

                        <div className="progress-card">
                            <h3>🔥 Streak</h3>
                            <div className="streak-display">
                                <span className="streak-number">{stats.streakDays}</span>
                                <span className="streak-text">days</span>
                            </div>
                        </div>

                        <div className="progress-card">
                            <h3>⏰ Today</h3>
                            <div className="today-time">
                                <span className="time-number">{stats.todayStudied}</span>
                                <span className="time-text">minutes</span>
                            </div>
                        </div>
                    </div>

                    {/* Study Actions */}
                    <div className="study-actions">
                        <h2>🎯 Study Now</h2>
                        <div className="action-grid">
                            <Link to="/japanese/vocabulary" className="action-card vocab">
                                <div className="action-icon">📚</div>
                                <h3>Vocabulary Flash Cards</h3>
                                <p>Review and learn new words</p>
                                <div className="action-meta">20 new • 30 review</div>
                            </Link>

                            <Link to="/japanese/grammar" className="action-card grammar">
                                <div className="action-icon">📖</div>
                                <h3>Grammar Patterns</h3>
                                <p>Master N3 grammar points</p>
                                <div className="action-meta">3 new patterns</div>
                            </Link>

                            <Link to="/japanese/quiz" className="action-card quiz">
                                <div className="action-icon">🎮</div>
                                <h3>Quick Quiz</h3>
                                <p>Test your knowledge</p>
                                <div className="action-meta">Mixed practice</div>
                            </Link>

                            <Link to="/japanese/reading" className="action-card reading">
                                <div className="action-icon">📰</div>
                                <h3>Reading Practice</h3>
                                <p>Improve comprehension</p>
                                <div className="action-meta">30 min goal</div>
                            </Link>
                        </div>
                    </div>

                    {/* N3 Comprehensive Materials */}
                    <div className="comprehensive-materials">
                        <h2>📋 N3 Comprehensive Study Materials</h2>
                        <div className="materials-grid">
                            <Link to="/japanese/tong-hop-tu-vung" className="material-card comprehensive">
                                <div className="material-icon">📚</div>
                                <h3>Tổng Hợp Từ Vựng N3</h3>
                                <p>1000+ từ vựng thiết yếu với PDF đi kèm</p>
                                <div className="material-meta">🎯 Complete collection</div>
                            </Link>

                            <Link to="/japanese/tu-vung-thi-n3" className="material-card exam-focused">
                                <div className="material-icon">🎯</div>
                                <h3>Từ Vựng Hay Gặp Ở Đề Thi</h3>
                                <p>300 từ xuất hiện nhiều nhất trong đề thi</p>
                                <div className="material-meta">⭐ High frequency</div>
                            </Link>

                            <Link to="/japanese/meo-lam-de" className="material-card strategy">
                                <div className="material-icon">🧠</div>
                                <h3>Mẹo Làm Đề N3</h3>
                                <p>Chiến thuật và kỹ thuật làm bài hiệu quả</p>
                                <div className="material-meta">🚀 Pro tips</div>
                            </Link>

                            <Link to="/japanese/200-cau-kho" className="material-card challenge">
                                <div className="material-icon">🔥</div>
                                <h3>200 Câu N3 Khó Nhất</h3>
                                <p>Thử thách bản thân với những câu khó nhất</p>
                                <div className="material-meta">💪 Expert level</div>
                            </Link>
                        </div>
                    </div>

                    {/* Today's Goals */}
                    <div className="daily-goals">
                        <h2>📋 Today's Goals</h2>
                        <div className="goals-list">
                            <div className="goal-item">
                                <span className="goal-icon">📚</span>
                                <span className="goal-text">Learn {todayGoals.newVocab} new vocabulary</span>
                                <span className="goal-status">0/{todayGoals.newVocab}</span>
                            </div>
                            <div className="goal-item">
                                <span className="goal-icon">🔄</span>
                                <span className="goal-text">Review {todayGoals.reviewVocab} words</span>
                                <span className="goal-status">0/{todayGoals.reviewVocab}</span>
                            </div>
                            <div className="goal-item">
                                <span className="goal-icon">📖</span>
                                <span className="goal-text">Study {todayGoals.newGrammar} grammar patterns</span>
                                <span className="goal-status">0/{todayGoals.newGrammar}</span>
                            </div>
                            <div className="goal-item">
                                <span className="goal-icon">📰</span>
                                <span className="goal-text">Read for {todayGoals.readingTime} minutes</span>
                                <span className="goal-status">0/{todayGoals.readingTime}</span>
                            </div>
                            <div className="goal-item">
                                <span className="goal-icon">🎧</span>
                                <span className="goal-text">Listen for {todayGoals.listeningTime} minutes</span>
                                <span className="goal-status">0/{todayGoals.listeningTime}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default JapaneseDashboard;