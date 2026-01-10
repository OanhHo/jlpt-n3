import React from 'react';
import LessonSelector from '../components/LessonSelector';

const TongHopTuVung = () => {
    return (
        <div className="container">
            <div className="n3-module">
                <div className="module-intro">
                    <h1>📚 Tổng Hợp Từ Vựng N3</h1>
                    <div className="intro-content">
                        <p>🎯 <strong>1000+ từ vựng thiết yếu</strong> cho kỳ thi JLPT N3 - chia theo chủ đề</p>
                        <div className="features">
                            <div className="feature-item">
                                ⭐ <strong>Phân loại theo chủ đề:</strong> Gia đình, Công việc, Du lịch, Thời tiết...
                            </div>
                            <div className="feature-item">
                                ⭐ <strong>Học theo bài:</strong> Mỗi bài 30 từ theo chủ đề cụ thể
                            </div>
                            <div className="feature-item">
                                ⭐ <strong>Kèm theo ví dụ thực tế</strong> và cách sử dụng
                            </div>
                            <div className="feature-item">
                                ⭐ <strong>Nghĩa tiếng Việt</strong> dễ hiểu và ghi nhớ
                            </div>
                        </div>

                        <div className="exam-stats">
                            <h3>📊 Thống kê học tập:</h3>
                            <div className="stats-grid">
                                <div className="stat-item">
                                    <div className="stat-number">1000+</div>
                                    <div className="stat-label">Từ vựng tổng</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-number">33</div>
                                    <div className="stat-label">Bài học</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-number">10</div>
                                    <div className="stat-label">Chủ đề</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-number">30</div>
                                    <div className="stat-label">Từ/bài</div>
                                </div>
                            </div>
                        </div>

                        <div className="study-tips">
                            <h3>💡 Cách học hiệu quả:</h3>
                            <ul>
                                <li>🔄 Học 1 bài mỗi ngày (30 từ)</li>
                                <li>📝 Viết câu ví dụ với từ mới</li>
                                <li>🎧 Nghe phát âm và nhắc lại</li>
                                <li>🔁 Ôn tập định kỳ các bài đã học</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <LessonSelector dataSource="tong-hop-tu-vung-lessons" />
            </div>
        </div>
    );
};

export default TongHopTuVung;