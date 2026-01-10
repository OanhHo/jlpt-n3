import React from 'react';
import SimplePDFViewer from '../components/SimplePDFViewer';

const Cau200Kho = () => {
    return (
        <div className="container">
            <div className="n3-module">
                <div className="module-intro">
                    <h1>🔥 200 Câu N3 Khó Nhất</h1>
                    <div className="intro-content">
                        <p>⚡ <strong>Thử thách bản thân</strong> với những câu hỏi khó nhất từ đề thi N3</p>
                        <div className="features">
                            <div className="feature-item">
                                💪 <strong>Độ khó cực cao:</strong> Chỉ 20-30% thí sinh làm đúng
                            </div>
                            <div className="feature-item">
                                💪 <strong>Phân tích chi tiết:</strong> Giải thích tại sao đáp án đúng/sai
                            </div>
                            <div className="feature-item">
                                💪 <strong>Bẫy thường gặp:</strong> Những "cạm bẫy" mà examiner hay đặt
                            </div>
                            <div className="feature-item">
                                💪 <strong>Nâng cao trình độ:</strong> Từ N3 lên N2 một cách tự nhiên
                            </div>
                        </div>

                        <div className="difficulty-levels">
                            <h3>📈 Phân loại độ khó:</h3>
                            <div className="levels-grid">
                                <div className="level-item hard">
                                    <div className="level-badge">🔴 HARD</div>
                                    <div className="level-count">Câu 1-70</div>
                                    <div className="level-desc">Ngữ pháp phức tạp, từ vựng hiếm</div>
                                </div>
                                <div className="level-item expert">
                                    <div className="level-badge">🔥 EXPERT</div>
                                    <div className="level-count">Câu 71-140</div>
                                    <div className="level-desc">Đọc hiểu dài, logic phức tạp</div>
                                </div>
                                <div className="level-item nightmare">
                                    <div className="level-badge">💀 NIGHTMARE</div>
                                    <div className="level-count">Câu 141-200</div>
                                    <div className="level-desc">Siêu khó, cần tư duy cao</div>
                                </div>
                            </div>
                        </div>

                        <div className="challenge-stats">
                            <h3>🏆 Thống kê thử thách:</h3>
                            <div className="stats-challenge">
                                <div className="challenge-item">
                                    <span className="challenge-number">15%</span>
                                    <span className="challenge-label">Làm đúng 160+/200 câu</span>
                                </div>
                                <div className="challenge-item">
                                    <span className="challenge-number">40%</span>
                                    <span className="challenge-label">Làm đúng 120+/200 câu</span>
                                </div>
                                <div className="challenge-item">
                                    <span className="challenge-number">70%</span>
                                    <span className="challenge-label">Làm đúng 80+/200 câu</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <SimplePDFViewer
                    pdfUrl="/pdfs/200-cau-kho-nhat-n3.pdf"
                    title="200 Câu N3 Khó Nhất - Thử thách bản thân"
                />                <div className="study-approach">
                    <h3>📚 Cách tiếp cận hiệu quả:</h3>
                    <div className="approach-steps">
                        <div className="step-item">
                            <div className="step-number">1️⃣</div>
                            <div className="step-content">
                                <h4>Làm từng nhóm 10 câu</h4>
                                <p>Không làm hết 200 câu một lúc, sẽ mệt mỏi và không hiệu quả</p>
                            </div>
                        </div>
                        <div className="step-item">
                            <div className="step-number">2️⃣</div>
                            <div className="step-content">
                                <h4>Phân tích câu sai kỹ lưỡng</h4>
                                <p>Hiểu rõ tại sao sai, bẫy ở đâu, cách tránh lần sau</p>
                            </div>
                        </div>
                        <div className="step-item">
                            <div className="step-number">3️⃣</div>
                            <div className="step-content">
                                <h4>Ghi chú từ vựng/ngữ pháp mới</h4>
                                <p>Tạo danh sách riêng cho những điểm mới học được</p>
                            </div>
                        </div>
                        <div className="step-item">
                            <div className="step-number">4️⃣</div>
                            <div className="step-content">
                                <h4>Làm lại sau 1 tuần</h4>
                                <p>Kiểm tra xem đã nhớ và hiểu chưa</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="motivation-box">
                    <h3>💪 Động lực:</h3>
                    <div className="motivation-content">
                        <p><strong>"Nếu bạn có thể làm đúng 150+/200 câu này, bạn đã sẵn sàng cho N3!"</strong></p>
                        <p>Đây là thử thách cuối cùng trước khi bước vào phòng thi. Hãy kiên nhẫn và không bỏ cuộc! 🔥</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cau200Kho;