// 📚 REACT LEARNING HUB - Trang chủ học ReactJS

import React, { useState } from 'react';
import JSXExample from './JSXExample';
import ComponentsAndProps from './ComponentsAndProps';
import UseStateExample from './UseStateExample';
import EventHandlingExample from './EventHandlingExample';

function LearningHub() {
    const [activeLesson, setActiveLesson] = useState('overview');

    const lessons = [
        { id: 'overview', title: '📋 Tổng quan', icon: '📋' },
        { id: 'jsx', title: '📝 JSX Syntax', icon: '📝' },
        { id: 'components', title: '🧩 Components & Props', icon: '🧩' },
        { id: 'state', title: '🔄 useState Hook', icon: '🔄' },
        { id: 'events', title: '⚡ Event Handling', icon: '⚡' }
    ];

    const renderLesson = () => {
        switch (activeLesson) {
            case 'jsx':
                return <JSXExample />;
            case 'components':
                return <ComponentsAndProps />;
            case 'state':
                return <UseStateExample />;
            case 'events':
                return <EventHandlingExample />;
            default:
                return <Overview />;
        }
    };

    return (
        <div className="learning-hub">
            {/* NAVIGATION */}
            <nav className="lesson-nav">
                <h1>🎓 React Learning Hub</h1>
                <div className="nav-buttons">
                    {lessons.map(lesson => (
                        <button
                            key={lesson.id}
                            onClick={() => setActiveLesson(lesson.id)}
                            className={activeLesson === lesson.id ? 'active' : ''}
                        >
                            {lesson.icon} {lesson.title}
                        </button>
                    ))}
                </div>
            </nav>

            {/* CONTENT */}
            <main className="lesson-content">
                {renderLesson()}
            </main>
        </div>
    );
}

// COMPONENT TỔNG QUAN
function Overview() {
    return (
        <div className="overview">
            <h2>🎯 Chào mừng đến với React Learning Hub!</h2>

            <div className="intro">
                <p>
                    Đây là bộ tài liệu học ReactJS từ cơ bản đến nâng cao.
                    Mỗi lesson bao gồm lý thuyết, ví dụ thực tế và code demo.
                </p>
            </div>

            <div className="roadmap">
                <h3>🗺️ Lộ trình học ReactJS</h3>

                <div className="roadmap-item">
                    <h4>📝 1. JSX Syntax</h4>
                    <ul>
                        <li>Hiểu về JSX là gì</li>
                        <li>Cách nhúng JavaScript vào JSX</li>
                        <li>Conditional rendering</li>
                        <li>Render lists với map()</li>
                        <li>JSX attributes và styling</li>
                    </ul>
                </div>

                <div className="roadmap-item">
                    <h4>🧩 2. Components & Props</h4>
                    <ul>
                        <li>Tạo functional components</li>
                        <li>Truyền props giữa components</li>
                        <li>Props validation</li>
                        <li>Component composition</li>
                        <li>Render props pattern</li>
                    </ul>
                </div>

                <div className="roadmap-item">
                    <h4>🔄 3. useState Hook</h4>
                    <ul>
                        <li>Quản lý state trong functional components</li>
                        <li>State với primitive types</li>
                        <li>State với objects và arrays</li>
                        <li>State updates và re-rendering</li>
                        <li>Best practices cho state management</li>
                    </ul>
                </div>

                <div className="roadmap-item">
                    <h4>⚡ 4. Event Handling</h4>
                    <ul>
                        <li>Xử lý click, keyboard, mouse events</li>
                        <li>Form handling và validation</li>
                        <li>Event object và SyntheticEvent</li>
                        <li>preventDefault() và stopPropagation()</li>
                        <li>Event delegation</li>
                    </ul>
                </div>
            </div>

            <div className="tips">
                <h3>💡 Tips học ReactJS hiệu quả</h3>
                <ul>
                    <li>🔥 <strong>Practice coding:</strong> Thực hành code thường xuyên</li>
                    <li>📖 <strong>Read documentation:</strong> Đọc official React docs</li>
                    <li>🛠️ <strong>Build projects:</strong> Làm các project thực tế</li>
                    <li>🤝 <strong>Join community:</strong> Tham gia cộng đồng React Vietnam</li>
                    <li>📺 <strong>Watch tutorials:</strong> Xem video tutorials</li>
                    <li>❓ <strong>Ask questions:</strong> Đặt câu hỏi khi gặp khó khăn</li>
                </ul>
            </div>

            <div className="resources">
                <h3>📚 Tài liệu tham khảo</h3>
                <ul>
                    <li><a href="https://react.dev/" target="_blank" rel="noopener noreferrer">
                        Official React Documentation
                    </a></li>
                    <li><a href="https://reactjs.org/tutorial/tutorial.html" target="_blank" rel="noopener noreferrer">
                        React Tutorial - Tic Tac Toe
                    </a></li>
                    <li><a href="https://create-react-app.dev/" target="_blank" rel="noopener noreferrer">
                        Create React App
                    </a></li>
                    <li><a href="https://vitejs.dev/" target="_blank" rel="noopener noreferrer">
                        Vite - Build Tool
                    </a></li>
                </ul>
            </div>

            <div className="getting-started">
                <h3>🚀 Bắt đầu học</h3>
                <p>
                    Hãy click vào các lesson ở menu trên để bắt đầu học ReactJS!
                    Khuyến nghị học theo thứ tự từ JSX Syntax → Components & Props → useState → Event Handling.
                </p>
            </div>
        </div>
    );
}

export default LearningHub;