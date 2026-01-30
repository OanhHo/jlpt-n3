import { useState, useEffect } from 'react';

export default function ReadingPracticePage() {
  const [selectedWords, setSelectedWords] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [hoveredWord, setHoveredWord] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

  // Sample data - replace with real data
  const [passage, setPassage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/reading-n3.json')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setPassage(data[0]); // Load first passage for now
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load reading data", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let interval;
    if (isTimerRunning && !hasSubmitted) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, hasSubmitted]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleWordClick = (word, event) => {
    const rect = event.target.getBoundingClientRect();
    setPopupPosition({
      x: rect.left + window.scrollX,
      y: rect.bottom + window.scrollY + 5
    });
    setHoveredWord(word);
  };

  const handleAnswerSelect = (questionId, optionId) => {
    if (!hasSubmitted) {
      setSelectedAnswer(prev => ({
        ...prev,
        [questionId]: optionId
      }));
    }
  };

  const handleSubmit = () => {
    setHasSubmitted(true);
    setIsTimerRunning(false);
  };

  const handleReset = () => {
    setSelectedAnswer({});
    setHasSubmitted(false);
    setTimeElapsed(0);
    setIsTimerRunning(true);
    setHoveredWord(null);
  };

  const correctCount = passage.questions.filter(
    q => selectedAnswer[q.id] === q.correctAnswer
  ).length;

  const renderTextWithVocabulary = (text) => {
    const parts = [];
    let lastIndex = 0;

    // Create a sorted copy of vocabulary by position in text
    const sortedVocab = [...passage.vocabulary].sort((a, b) => {
      const aIndex = text.indexOf(a.word);
      const bIndex = text.indexOf(b.word);
      return aIndex - bIndex;
    });

    sortedVocab.forEach((vocab) => {
      const index = text.indexOf(vocab.word, lastIndex);
      if (index !== -1) {
        // Add text before the vocabulary word
        if (index > lastIndex) {
          parts.push(
            <span key={`text-${lastIndex}`}>
              {text.substring(lastIndex, index)}
            </span>
          );
        }

        // Add the vocabulary word as clickable
        parts.push(
          <span
            key={`vocab-${index}`}
            onClick={(e) => handleWordClick(vocab, e)}
            className="text-indigo-600 font-semibold cursor-pointer hover:text-indigo-700 hover:underline decoration-2 decoration-indigo-400 underline-offset-2 transition-colors relative"
          >
            {vocab.word}
          </span>
        );

        lastIndex = index + vocab.word.length;
      }
    });

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(
        <span key={`text-${lastIndex}`}>
          {text.substring(lastIndex)}
        </span>
      );
    }

    return parts;
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!passage) return <div className="p-10 text-center">Không có dữ liệu bài đọc.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header with Timer */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-800">読解練習</h1>
                <p className="text-sm text-gray-500">Reading Practice</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-mono text-lg font-semibold text-gray-700">
                  {formatTime(timeElapsed)}
                </span>
              </div>

              {hasSubmitted && (
                <div className="bg-gradient-to-r from-green-100 to-emerald-100 px-4 py-2 rounded-lg">
                  <span className="font-bold text-green-700">
                    {correctCount} / {passage.questions.length} 正解
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Reading Passage */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2 font-japanese">
                  {passage.title}
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
              </div>

              <div className="prose prose-lg max-w-none">
                {passage.content.split('\n\n').map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-gray-800 leading-relaxed mb-4 text-lg font-japanese"
                  >
                    {renderTextWithVocabulary(paragraph)}
                  </p>
                ))}
              </div>

              {/* Vocabulary Popup */}
              {hoveredWord && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setHoveredWord(null)}
                  />
                  <div
                    className="fixed z-30 bg-white rounded-lg shadow-2xl p-4 border-2 border-indigo-200 animate-fadeIn"
                    style={{
                      left: `${popupPosition.x}px`,
                      top: `${popupPosition.y}px`,
                      maxWidth: '300px'
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-bold text-gray-800 font-japanese">
                            {hoveredWord.word}
                          </span>
                          {hoveredWord.reading && (
                            <span className="text-sm text-gray-500 font-japanese">
                              ({hoveredWord.reading})
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mt-1">
                          {hoveredWord.meaning}
                        </p>
                      </div>
                      <button
                        onClick={() => setHoveredWord(null)}
                        className="text-gray-400 hover:text-gray-600 ml-2"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Tip Box */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
              <div className="flex gap-3">
                <svg className="w-6 h-6 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">ヒント：</span>
                  青い単語をクリックすると意味が表示されます。
                </p>
              </div>
            </div>
          </div>

          {/* Questions Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                問題
              </h3>

              <div className="space-y-6">
                {passage.questions.map((question, qIndex) => (
                  <div key={question.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <p className="font-semibold text-gray-800 mb-3 text-sm font-japanese">
                      {qIndex + 1}. {question.question}
                    </p>

                    <div className="space-y-2">
                      {question.options.map((option) => {
                        const isSelected = selectedAnswer[question.id] === option.id;
                        const isCorrect = option.id === question.correctAnswer;
                        const showResult = hasSubmitted;

                        return (
                          <button
                            key={option.id}
                            onClick={() => handleAnswerSelect(question.id, option.id)}
                            disabled={hasSubmitted}
                            className={`w-full p-3 rounded-lg border text-left text-sm transition-all ${showResult && isCorrect
                                ? 'border-green-500 bg-green-50'
                                : showResult && isSelected && !isCorrect
                                  ? 'border-red-500 bg-red-50'
                                  : isSelected
                                    ? 'border-green-500 bg-green-50'
                                    : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                              } ${hasSubmitted ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                          >
                            <div className="flex items-center gap-2">
                              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${showResult && isCorrect
                                  ? 'bg-green-500 text-white'
                                  : showResult && isSelected && !isCorrect
                                    ? 'bg-red-500 text-white'
                                    : isSelected
                                      ? 'bg-green-500 text-white'
                                      : 'bg-gray-100 text-gray-600'
                                }`}>
                                {option.id.toUpperCase()}
                              </span>
                              <span className="font-japanese">{option.text}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                {!hasSubmitted ? (
                  <button
                    onClick={handleSubmit}
                    disabled={Object.keys(selectedAnswer).length !== passage.questions.length}
                    className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02]"
                  >
                    答えを確認
                  </button>
                ) : (
                  <button
                    onClick={handleReset}
                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all transform hover:scale-[1.02]"
                  >
                    やり直す
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
