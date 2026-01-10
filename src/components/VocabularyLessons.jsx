import React, { useState } from 'react';
import SearchAndFilter from './SearchAndFilter';

const VocabularyCard = ({ word, index, onPlayAudio }) => {
    const [isLearned, setIsLearned] = useState(false);
    const [isDifficult, setIsDifficult] = useState(false);

    return (
        <div className={`vocab-card mb-4 ${isLearned ? 'border-green-500 bg-green-50' : ''}`}>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center mb-2">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full mr-3">
                            #{index + 1}
                        </span>
                        <div className="kanji">{word.kanji}</div>
                        <button
                            onClick={() => onPlayAudio(word.pronunciation || word.hiragana)}
                            className="ml-3 p-1 text-blue-600 hover:text-blue-800 transition-colors"
                            title="Play pronunciation"
                        >
                            🔊
                        </button>
                        {isLearned && (
                            <span className="ml-2 text-green-600" title="Learned">✅</span>
                        )}
                        {isDifficult && (
                            <span className="ml-2 text-red-600" title="Difficult">⚠️</span>
                        )}
                    </div>

                    <div className="hiragana mb-2">{word.hiragana}</div>

                    <div className="meaning mb-3">{word.meaning}</div>

                    {word.example && (
                        <div className="example">
                            <strong>Example:</strong> {word.example}
                        </div>
                    )}
                </div>

                <div className="ml-4 flex flex-col space-y-2">
                    <button
                        onClick={() => setIsLearned(!isLearned)}
                        className={`px-3 py-1 text-xs rounded-full transition-colors ${isLearned
                                ? 'bg-green-200 text-green-800 hover:bg-green-300'
                                : 'bg-green-100 text-green-800 hover:bg-green-200'
                            }`}
                    >
                        {isLearned ? '✓ Learned' : '📚 Learn'}
                    </button>
                    <button
                        onClick={() => setIsDifficult(!isDifficult)}
                        className={`px-3 py-1 text-xs rounded-full transition-colors ${isDifficult
                                ? 'bg-red-200 text-red-800 hover:bg-red-300'
                                : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                            }`}
                    >
                        {isDifficult ? '⚠️ Difficult' : '📝 Mark Hard'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const GrammarCard = ({ grammar, index }) => {
    return (
        <div className="grammar-card mb-4">
            <div className="flex items-start">
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full mr-3">
                    Grammar #{index + 1}
                </span>
                <div className="flex-1">
                    <div className="text-lg font-bold text-gray-900 mb-2">{grammar.pattern}</div>
                    {grammar.explanation && (
                        <div className="text-gray-700 mb-2">{grammar.explanation}</div>
                    )}
                    {grammar.examples && grammar.examples.length > 0 && (
                        <div className="text-sm text-gray-600">
                            <strong>Examples:</strong>
                            <ul className="list-disc list-inside mt-1">
                                {grammar.examples.map((example, i) => (
                                    <li key={i}>{example}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const VocabularyLessons = ({ lessons, grammar, searchTerm, onSearch }) => {
    const [currentLesson, setCurrentLesson] = useState(0);
    const [viewMode, setViewMode] = useState('vocabulary');
    const [filterMode, setFilterMode] = useState('all');

    // Text-to-speech for pronunciation
    const playAudio = (text) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'ja-JP';
            utterance.rate = 0.8;
            speechSynthesis.speak(utterance);
        }
    };

    // Filter lessons based on search term
    const filteredLessons = lessons.filter(lesson => {
        if (!searchTerm.trim()) return true;
        return lesson.vocabulary.some(word =>
            word.kanji.includes(searchTerm) ||
            word.hiragana.includes(searchTerm) ||
            word.meaning.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const filteredGrammar = grammar.filter(item => {
        if (!searchTerm.trim()) return true;
        return item.pattern.includes(searchTerm) ||
            (item.explanation && item.explanation.toLowerCase().includes(searchTerm.toLowerCase()));
    });

    const getCurrentData = () => {
        if (viewMode === 'vocabulary') {
            return filteredLessons[currentLesson] || null;
        } else {
            return { grammar: filteredGrammar };
        }
    };

    const currentData = getCurrentData();

    if (!lessons.length && !grammar.length) {
        return (
            <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-4">No vocabulary or grammar data available</div>
                <div className="text-gray-400">Please check if the PDF was parsed correctly</div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-3xl font-bold text-gray-900">
                        📚 Vocabulary & Grammar Study
                    </h1>

                    {/* View Mode Toggle */}
                    <div className="flex bg-gray-200 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('vocabulary')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'vocabulary'
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            📖 Vocabulary ({lessons.length} lessons)
                        </button>
                        <button
                            onClick={() => setViewMode('grammar')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'grammar'
                                    ? 'bg-white text-green-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            📝 Grammar ({grammar.length} items)
                        </button>
                    </div>
                </div>

                {/* Search */}
                <SearchAndFilter
                    searchTerm={searchTerm}
                    onSearch={onSearch}
                    onFilter={setFilterMode}
                    activeFilter={filterMode}
                    placeholder="Search by kanji, hiragana, or meaning..."
                />

                {/* Lesson Navigation (for vocabulary mode) */}
                {viewMode === 'vocabulary' && filteredLessons.length > 1 && (
                    <div className="flex items-center justify-between mb-6 p-4 bg-blue-50 rounded-lg">
                        <button
                            onClick={() => setCurrentLesson(Math.max(0, currentLesson - 1))}
                            disabled={currentLesson === 0}
                            className="btn-primary disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            ← Previous Lesson
                        </button>

                        <div className="text-center">
                            <div className="text-sm text-gray-600 mb-1">
                                Lesson {currentLesson + 1} of {filteredLessons.length}
                            </div>
                            <div className="font-semibold text-gray-900">
                                {currentData?.title || 'Vocabulary Lesson'}
                            </div>
                        </div>

                        <button
                            onClick={() => setCurrentLesson(Math.min(filteredLessons.length - 1, currentLesson + 1))}
                            disabled={currentLesson === filteredLessons.length - 1}
                            className="btn-primary disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            Next Lesson →
                        </button>
                    </div>
                )}
            </div>

            {/* Content */}
            {viewMode === 'vocabulary' && currentData ? (
                <div>
                    <div className="mb-6 text-center">
                        <div className="text-sm text-gray-600 mb-2">
                            {currentData.vocabulary.length} words in this lesson
                        </div>
                    </div>

                    <div className="space-y-4">
                        {currentData.vocabulary.map((word, index) => (
                            <VocabularyCard
                                key={`${currentLesson}-${index}`}
                                word={word}
                                index={index}
                                onPlayAudio={playAudio}
                            />
                        ))}
                    </div>
                </div>
            ) : viewMode === 'grammar' && filteredGrammar.length > 0 ? (
                <div>
                    <div className="mb-6 text-center">
                        <div className="text-sm text-gray-600">
                            {filteredGrammar.length} grammar patterns
                        </div>
                    </div>

                    <div className="space-y-4">
                        {filteredGrammar.map((item, index) => (
                            <GrammarCard
                                key={index}
                                grammar={item}
                                index={index}
                            />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="text-gray-500 text-lg mb-4">
                        {searchTerm ? 'No results found' : 'No data available'}
                    </div>
                    {searchTerm && (
                        <button
                            onClick={() => onSearch('')}
                            className="btn-secondary"
                        >
                            Clear Search
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default VocabularyLessons;