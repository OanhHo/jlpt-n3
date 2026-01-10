import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from './components/HomeScreen';
import StudyPage from './pages/StudyPage';
import ExtractorPage from './pages/ExtractorPageFinal';
import TestPage from './pages/TestPage';
import VocabularyStudy from './pages/VocabularyStudy';
import LessonStudy from './pages/LessonStudy';
import GrammarStudy from './pages/GrammarStudy';
import GrammarLesson from './pages/GrammarLesson';
import JapaneseDashboard from './pages/JapaneseDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/study/:pdfFile" element={<StudyPage />} />
        <Route path="/vocabulary" element={<VocabularyStudy />} />
        <Route path="/vocabulary/:lessonId" element={<LessonStudy />} />
        <Route path="/grammar" element={<GrammarStudy />} />
        <Route path="/grammar/:lessonId" element={<GrammarLesson />} />
        <Route path="/dashboard" element={<JapaneseDashboard />} />
        <Route path="/extractor" element={<ExtractorPage />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

// 404 Not Found Page
function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-6">🔍</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404 - Page Not Found</h1>
        <p className="text-gray-600 mb-8 max-w-md">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/" className="btn-primary">
            🏠 Back to Home
          </a>
          <a href="/study/tong-hop-tu-vung-n3" className="btn-secondary">
            📚 Start Studying
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;
