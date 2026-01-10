import React from 'react';
import SimplePDFViewer from '../components/SimplePDFViewer';

const MeoLamDe = () => {
    return (
        <div className="container">
            <div className="n3-module">
                <div className="module-intro">
                    <h1>🧠 Mẹo Làm Đề N3</h1>
                    <div className="intro-content">
                        <p>🚀 <strong>Chiến thuật chinh phục</strong> kỳ thi JLPT N3</p>
                        <div className="features">
                            <div className="feature-item">
                                🎯 <strong>Phân bổ thời gian hợp lý:</strong> 110 phút cho 3 phần thi
                            </div>
                            <div className="feature-item">
                                🎯 <strong>Thứ tự làm bài tối ưu:</strong> Đọc hiểu → Ngữ pháp → Từ vựng
                            </div>
                            <div className="feature-item">
                                🎯 <strong>Kỹ thuật loại trừ:</strong> Tăng tỷ lệ đúng khi không chắc chắn
                            </div>
                            <div className="feature-item">
                                🎯 <strong>Tâm lý thi cử:</strong> Giữ bình tĩnh và tự tin
                            </div>
                        </div>

                        <div className="time-management">
                            <h3>⏰ Phân bổ thời gian chi tiết:</h3>
                            <div className="time-sections">
                                <div className="time-section">
                                    <div className="section-name">Ngôn ngữ (văn tự, từ vựng, ngữ pháp)</div>
                                    <div className="section-time">70 phút</div>
                                    <div className="section-tips">
                                        • Từ vựng: 15 phút (25 câu)<br />
                                        • Ngữ pháp: 25 phút (37 câu)<br />
                                        • Đọc hiểu: 30 phút (32 câu)
                                    </div>
                                </div>
                                <div className="time-section">
                                    <div className="section-name">Nghe hiểu</div>
                                    <div className="section-time">40 phút</div>
                                    <div className="section-tips">
                                        • Hiểu nội dung: 12 phút<br />
                                        • Hiểu điểm mục: 9 phút<br />
                                        • Hiểu ý định: 10 phút<br />
                                        • Phản ứng nhanh: 9 phút
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <SimplePDFViewer
                    pdfUrl="/pdfs/meo-lam-de-n3.pdf"
                    title="Mẹo Làm Đề N3 - Chiến thuật chinh phục"
                />                <div className="common-mistakes">
                    <h3>⚠️ Lỗi thường gặp và cách tránh:</h3>
                    <div className="mistakes-grid">
                        <div className="mistake-item">
                            <div className="mistake-title">❌ Mắc bẫy ngữ pháp</div>
                            <div className="mistake-solution">
                                ✅ Đọc kỹ toàn câu, chú ý ngữ cảnh
                            </div>
                        </div>
                        <div className="mistake-item">
                            <div className="mistake-title">❌ Nhầm lẫn từ đồng âm</div>
                            <div className="mistake-solution">
                                ✅ Phân biệt rõ kanji và nghĩa
                            </div>
                        </div>
                        <div className="mistake-item">
                            <div className="mistake-title">❌ Không quản lý thời gian</div>
                            <div className="mistake-solution">
                                ✅ Luyện thi đúng giờ thường xuyên
                            </div>
                        </div>
                        <div className="mistake-item">
                            <div className="mistake-title">❌ Bỏ trống câu khó</div>
                            <div className="mistake-solution">
                                ✅ Đoán có căn cứ, loại trừ đáp án sai
                            </div>
                        </div>
                    </div>
                </div>

                <div className="last-minute-tips">
                    <h3>🔥 Tips phút chót:</h3>
                    <div className="tips-list">
                        <div className="tip-item">🌙 <strong>Trước thi 1 ngày:</strong> Nghỉ ngơi, không học quá sức</div>
                        <div className="tip-item">☀️ <strong>Sáng thi:</strong> Ăn sáng đủ chất, đến sớm 30 phút</div>
                        <div className="tip-item">📝 <strong>Trong thi:</strong> Đọc đề kỹ, đánh dấu từ khóa</div>
                        <div className="tip-item">🎯 <strong>Cuối thi:</strong> Kiểm tra lại đáp án, điền đầy đủ</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MeoLamDe;