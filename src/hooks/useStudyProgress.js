import { useState, useEffect } from 'react';

const normalizePdfId = (pdfFile) => {
    if (!pdfFile) return 'default';
    if (typeof pdfFile === 'string') {
        try {
            // remove query string / fragment
            const noQuery = pdfFile.split('?')[0].split('#')[0];
            // take last segment
            const parts = noQuery.split('/').filter(Boolean);
            return parts.length ? parts[parts.length - 1] : noQuery;
        } catch (e) {
            return pdfFile;
        }
    }

    // if it's an object, try common fields
    if (typeof pdfFile === 'object') {
        return pdfFile.id || pdfFile.name || 'default';
    }

    return String(pdfFile);
};

export const useStudyProgress = (pdfFile) => {
    const [progress, setProgress] = useState({
        wordsLearned: 0,
        totalWords: 0,
        lessonsCompleted: 0,
        totalLessons: 0,
        currentLesson: 0,
        studyStreak: 0,
        lastStudyDate: null,
        learnedWords: new Set(),
        difficultWords: new Set()
    });

    const storageKey = `study-progress-${normalizePdfId(pdfFile)}`;

    // Load progress from localStorage
    useEffect(() => {
        const savedProgress = localStorage.getItem(storageKey);
        if (savedProgress) {
            try {
                const parsed = JSON.parse(savedProgress);
                setProgress({
                    ...parsed,
                    learnedWords: new Set(parsed.learnedWords || []),
                    difficultWords: new Set(parsed.difficultWords || [])
                });
            } catch (error) {
                console.error('Error loading progress:', error);
            }
        }
    }, [storageKey]);

    // Save progress (store in state). Actual persistence to localStorage is handled by an effect (autosave).
    const saveProgress = (newProgress) => {
        setProgress(newProgress);
    };

    // Autosave: persist progress to localStorage whenever it changes
    useEffect(() => {
        try {
            const progressToSave = {
                ...progress,
                learnedWords: Array.from(progress.learnedWords || []),
                difficultWords: Array.from(progress.difficultWords || [])
            };
            localStorage.setItem(storageKey, JSON.stringify(progressToSave));
        } catch (err) {
            console.error('Error saving progress to localStorage:', err);
        }
    }, [progress, storageKey]);

    // Mark word as learned
    const markWordAsLearned = (wordId) => {
        setProgress(prev => {
            const newLearnedWords = new Set(prev.learnedWords);
            if (newLearnedWords.has(wordId)) newLearnedWords.delete(wordId);
            else newLearnedWords.add(wordId);

            return {
                ...prev,
                learnedWords: newLearnedWords,
                wordsLearned: newLearnedWords.size,
                lastStudyDate: new Date().toISOString()
            };
        });
    };

    // Mark word as difficult
    const markWordAsDifficult = (wordId) => {
        setProgress(prev => {
            const newDifficultWords = new Set(prev.difficultWords);
            if (newDifficultWords.has(wordId)) newDifficultWords.delete(wordId);
            else newDifficultWords.add(wordId);

            return {
                ...prev,
                difficultWords: newDifficultWords,
                lastStudyDate: new Date().toISOString()
            };
        });
    };

    // Update lesson progress
    const updateLessonProgress = (lessonIndex, totalLessons) => {
        setProgress(prev => ({
            ...prev,
            currentLesson: lessonIndex,
            totalLessons: totalLessons,
            lastStudyDate: new Date().toISOString()
        }));
    };

    // Initialize total words
    const initializeTotalWords = (totalWords, totalLessons) => {
        setProgress(prev => ({
            ...prev,
            totalWords: totalWords,
            totalLessons: totalLessons
        }));
    };

    // Calculate study streak
    const updateStudyStreak = () => {
        setProgress(prev => {
            const today = new Date().toDateString();
            const lastStudy = prev.lastStudyDate ? new Date(prev.lastStudyDate).toDateString() : null;

            if (lastStudy === today) {
                return prev; // no change
            }

            let newStreak = prev.studyStreak;
            if (lastStudy === new Date(Date.now() - 86400000).toDateString()) {
                newStreak = newStreak + 1;
            } else {
                newStreak = 1;
            }

            return {
                ...prev,
                studyStreak: newStreak,
                lastStudyDate: new Date().toISOString()
            };
        });
    };

    // Get completion percentage
    const getCompletionPercentage = () => {
        if (progress.totalWords === 0) return 0;
        return Math.round((progress.wordsLearned / progress.totalWords) * 100);
    };

    // Check if word is learned
    const isWordLearned = (wordId) => {
        return progress.learnedWords.has(wordId);
    };

    // Check if word is marked as difficult
    const isWordDifficult = (wordId) => {
        return progress.difficultWords.has(wordId);
    };

    return {
        progress,
        markWordAsLearned,
        markWordAsDifficult,
        updateLessonProgress,
        initializeTotalWords,
        updateStudyStreak,
        getCompletionPercentage,
        isWordLearned,
        isWordDifficult
    };
};