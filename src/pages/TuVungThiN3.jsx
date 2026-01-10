import React from 'react';
import { Link } from 'react-router-dom';
import LessonSelector from '../components/LessonSelector';

const TuVungThiN3 = () => {
    return (
        <div className="container">
            <div className="n3-module">
                <div className="module-intro">
                    <h1>🎯 Từ Vựng Hay Gặp Ở Đề Thi N3</h1>
                    <div className="intro-content">
                        <p>🏆 <strong>300 từ xuất hiện nhiều nhất</strong> trong đề thi N3 thực tế - chia thành 10 bài học</p>
                        <div className="features">
                            <div className="feature-item">
                                ⭐ <strong>Học theo bài:</strong> Mỗi bài 30 từ, dễ quản lý
                            </div>
                            <div className="feature-item">
                                ⭐ <strong>Theo dõi tiến độ:</strong> Biết rõ đã học được bao nhiều
                            </div>
                            <div className="feature-item">
                                ⭐ <strong>Từ frequency cao:</strong> 80%+ xuất hiện trong đề thi
                            </div>
                            <div className="feature-item">
                                ⭐ <strong>Có kiểm tra:</strong> Quiz sau mỗi bài để củng cố
                            </div>
                        </div>

                        <div className="exam-stats">
                            <h3>📊 Lộ trình học:</h3>
                            <div className="stats-grid">
                                <div className="stat-item">
                                    <div className="stat-number">30</div>
                                    <div className="stat-label">Từ mỗi bài học</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-number">45 phút</div>
                                    <div className="stat-label">Thời gian 1 bài</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-number">10 bài</div>
                                    <div className="stat-label">Hoàn thành toàn bộ</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <LessonSelector />

                <div className="grammar-section">
                    <h3>📖 Ngữ Pháp N3 Cần Chú Ý</h3>
                    <div className="grammar-intro">
                        <p>10 cấu trúc ngữ pháp xuất hiện nhiều nhất trong đề thi N3, với giải thích chi tiết và ví dụ thực tế.</p>
                        <Link to="/japanese/grammar-patterns" className="grammar-btn">
                            🚀 Học ngữ pháp N3
                        </Link>
                    </div>
                </div>

                <div className="exam-preparation">
                    <h3>🎯 Lộ trình chuẩn bị thi cử:</h3>
                    <div className="prep-timeline">
                        <div className="timeline-item">
                            <div className="timeline-badge">Tuần 1</div>
                            <div className="timeline-content">
                                <strong>Bài 1-3:</strong> Học 90 từ cơ bản nhất (3 bài đầu)
                            </div>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-badge">Tuần 2</div>
                            <div className="timeline-content">
                                <strong>Bài 4-6:</strong> Học 90 từ tiếp theo + ôn bài cũ
                            </div>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-badge">Tuần 3</div>
                            <div className="timeline-content">
                                <strong>Bài 7-10:</strong> Hoàn thành 120 từ cuối + làm quiz
                            </div>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-badge">Tuần 4</div>
                            <div className="timeline-content">
                                <strong>Ôn tập:</strong> Review toàn bộ + làm đề thi thử
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TuVungThiN3;