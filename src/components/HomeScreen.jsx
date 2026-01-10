import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const PDFCard = ({ title, description, pdfFile, icon, color = "blue", linkType = "study" }) => {
    const colorClasses = {
        blue: "border-blue-500 hover:border-blue-600",
        green: "border-green-500 hover:border-green-600",
        purple: "border-purple-500 hover:border-purple-600",
        red: "border-red-500 hover:border-red-600",
        yellow: "border-yellow-500 hover:border-yellow-600"
    };

    // Determine the correct route based on type
    const getRoute = () => {
        if (title.includes("Vocabulary") || title.includes("JLPT N3 Vocabulary")) {
            return "/vocabulary";
        }
        return `/study/${encodeURIComponent(pdfFile)}`;
    };

    return (
        <Link
            to={getRoute()}
            className={`block bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 hover:scale-105 card`}
            style={{ color: '#000000', borderLeft: `6px solid var(--primary)` }}
        >
            <div className="flex items-center mb-4">
                <div className={`text-2xl mr-3 text-${color}-600`}>
                    {icon}
                </div>
                <h3 className="text-xl font-semibold" style={{ color: '#000000' }}>
                    {title}
                </h3>
            </div>
            <p className="text-sm leading-relaxed muted" style={{ color: '#374151' }}>
                {description}
            </p>
        </Link>
    );
};

const HomeScreen = () => {
    const navigate = useNavigate();
    // Only include PDFs that exist in `public/pdfs` to avoid dead links.
    const pdfFiles = [
        {
            title: "200 Câu Khó Nhất N3",
            description: "Most challenging sentence patterns for N3.",
            pdfFile: "200-cau-kho-nhat-n3.pdf",
            icon: "�",
            color: "yellow"
        },
        {
            title: "Mẹo Làm Đề N3",
            description: "Strategic tips and techniques for JLPT N3 exam success.",
            pdfFile: "meo-lam-de-n3.pdf",
            icon: "�",
            color: "blue"
        },
        {
            title: "Tổng Hợp Từ Vựng N3",
            description: "1000+ essential vocabulary words categorized by topics.",
            pdfFile: "tong-hop-tu-vung-n3.pdf",
            icon: "📚",
            color: "green"
        },
        {
            title: "Từ Vựng Thi N3",
            description: "Essential vocabulary for JLPT N3 exam.",
            pdfFile: "tu-vung-thi-n3.pdf",
            icon: "�",
            color: "purple"
        },
        {
            title: "Từ Vựng Thi N3 (Part 1)",
            description: "Part 1 of vocabulary pack.",
            pdfFile: "tu-vung-thi-n3-1.pdf",
            icon: "�",
            color: "purple"
        }
    ];

    const grammarFiles = pdfFiles.filter(file =>
        file.pdfFile.includes('grammar') || file.pdfFile.includes('ngu-phap')
    );

    const vocabularyFiles = pdfFiles.filter(file =>
        file.pdfFile.includes('vocabulary')
    );

    const readingFiles = pdfFiles.filter(file =>
        file.pdfFile.includes('reading')
    );

    const listeningFiles = pdfFiles.filter(file =>
        file.pdfFile.includes('listening')
    );

    const practiceFiles = pdfFiles.filter(file =>
        file.pdfFile.includes('200-cau') || file.pdfFile.includes('meo-lam')
    );

    // Check which pdf files actually exist under /pdfs. If a file is missing,
    // we won't render its card (prevents showing dead links like the user reported).
    const [availableMap, setAvailableMap] = useState({});
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        let mounted = true;

        const checkFiles = async () => {
            const entries = await Promise.all(pdfFiles.map(async (f) => {
                const url = `/pdfs/${encodeURIComponent(f.pdfFile)}`;
                try {
                    // Prefer HEAD to avoid downloading whole file; fall back to GET if HEAD not allowed.
                    const res = await fetch(url, { method: 'HEAD' });
                    if (mounted) return [f.pdfFile, res.ok];
                    return [f.pdfFile, false];
                } catch (err) {
                    try {
                        const res2 = await fetch(url, { method: 'GET' });
                        if (mounted) return [f.pdfFile, res2.ok];
                        return [f.pdfFile, false];
                    } catch (e) {
                        return [f.pdfFile, false];
                    }
                }
            }));

            if (!mounted) return;
            const map = Object.fromEntries(entries);
            setAvailableMap(map);
            setChecked(true);
        };

        checkFiles();

        return () => { mounted = false; };
    }, []);

    // Helper to filter original file groups by availability
    const filterAvailable = (files) => files.filter(f => availableMap[f.pdfFile]);

    const grammarFilesAvailable = filterAvailable(grammarFiles);
    const vocabularyFilesAvailable = filterAvailable(vocabularyFiles);
    const readingFilesAvailable = filterAvailable(readingFiles);
    const listeningFilesAvailable = filterAvailable(listeningFiles);
    const practiceFilesAvailable = filterAvailable(practiceFiles);

    return (
        <div className="min-h-screen bg-gray-50" style={{ color: '#000000' }}>
            <style>{`
                .home-screen * {
                    color: #000000 !important;
                }
                .home-screen .text-white, .home-screen .text-white * {
                    color: #ffffff !important;
                }
                .home-screen .text-blue-600 {
                    color: #2563eb !important;
                }
                .home-screen .text-blue-800 {
                    color: #1e40af !important;
                }
                .home-screen h1, .home-screen h2, .home-screen h3 {
                    color: #000000 !important;
                }
                .home-screen .gradient-bg h1, .home-screen .gradient-bg p {
                    color: #ffffff !important;
                }
            `}</style>

            {/* Navigation Header */}
            <nav className="bg-white shadow-lg mb-8">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-2">
                            <span className="text-2xl">🎌</span>
                            <h1 className="text-xl font-bold text-gray-900">JLPT N3 Center</h1>
                        </div>

                        <div className="hidden md:flex items-center space-x-6">
                            <button
                                onClick={() => navigate('/')}
                                className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
                            >
                                🏠 Trang chủ
                            </button>
                            <button
                                onClick={() => navigate('/vocabulary')}
                                className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
                            >
                                📝 Từ vựng
                            </button>
                            <button
                                onClick={() => navigate('/grammar')}
                                className="text-gray-600 hover:text-purple-600 transition-colors font-medium"
                            >
                                📚 Ngữ pháp
                            </button>
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="text-gray-600 hover:text-green-600 transition-colors font-medium"
                            >
                                📊 Dashboard
                            </button>
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <button className="text-gray-600 hover:text-gray-900">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="home-screen max-w-6xl mx-auto px-4 py-8">
                <header className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4" style={{ background: 'linear-gradient(90deg,var(--primary),#9f7aea)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
                        JLPT N3 Study Center
                    </h1>
                    <p className="text-xl max-w-2xl mx-auto" style={{ color: '#374151' }}>
                        Comprehensive study materials for JLPT N3 preparation. Access grammar guides, vocabulary lists, and practice tests.
                    </p>
                </header>
                {/* (Removed Grammar Resources and Vocabulary Building sections as requested) */}

                {/* Grammar Section */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 flex items-center" style={{ color: '#000000' }}>
                        <span className="mr-3">📚</span>
                        Grammar Patterns
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div
                            className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-xl p-6 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                            onClick={() => navigate('/grammar')}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="text-4xl">📚</div>
                                <div className="bg-white/20 rounded-full px-3 py-1 text-sm">
                                    N3 Level
                                </div>
                            </div>
                            <h3 className="text-xl font-bold mb-2">JLPT N3 Grammar</h3>
                            <p className="text-purple-100 mb-4">
                                Essential grammar patterns organized by difficulty. Master the most important structures for JLPT N3.
                            </p>
                            <div className="flex items-center justify-between">
                                <span className="text-sm opacity-90">10+ patterns</span>
                                <button className="bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-lg text-sm font-medium">
                                    Study Now →
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Reading Section */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 flex items-center" style={{ color: '#000000' }}>
                        <span className="mr-3">📖</span>
                        Reading Comprehension
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {readingFilesAvailable.map((file, index) => (
                            <PDFCard
                                key={index}
                                title={file.title}
                                description={file.description}
                                pdfFile={file.pdfFile}
                                icon={file.icon}
                                color={file.color}
                            />
                        ))}
                    </div>
                </section>

                {/* Listening Section */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 flex items-center" style={{ color: '#000000' }}>
                        <span className="mr-3">🎧</span>
                        Listening Practice
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {listeningFilesAvailable.map((file, index) => (
                            <PDFCard
                                key={index}
                                title={file.title}
                                description={file.description}
                                pdfFile={file.pdfFile}
                                icon={file.icon}
                                color={file.color}
                            />
                        ))}
                    </div>
                </section>

                {/* Practice Section */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 flex items-center" style={{ color: '#000000' }}>
                        <span className="mr-3">💡</span>
                        Practice & Tips
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {practiceFilesAvailable.map((file, index) => (
                            <PDFCard
                                key={index}
                                title={file.title}
                                description={file.description}
                                pdfFile={file.pdfFile}
                                icon={file.icon}
                                color={file.color}
                            />
                        ))}
                    </div>
                </section>

                {/* Statistics Section */}
                <section className="bg-white rounded-lg shadow-md p-8 mb-12">
                    <h2 className="text-2xl font-bold text-center mb-8" style={{ color: '#000000' }}>
                        Study Progress Overview
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600 mb-2">6</div>
                            <div style={{ color: '#6b7280' }}>Study Materials</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-purple-600 mb-2">200</div>
                            <div style={{ color: '#6b7280' }}>Practice Questions</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-yellow-600 mb-2">100+</div>
                            <div style={{ color: '#6b7280' }}>Study Tips</div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default HomeScreen;