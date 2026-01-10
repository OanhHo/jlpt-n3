// 📚 LESSON 1: JSX SYNTAX - Cú pháp JSX cơ bản

import React from 'react';

function JSXExample() {
    // 1. BIẾN TRONG JSX
    const studentName = "Nguyễn Văn A";
    const age = 20;
    const isStudent = true;

    // 2. OBJECT VÀ ARRAY
    const student = {
        name: "Trần Thị B",
        major: "Công nghệ thông tin",
        gpa: 3.5
    };

    const subjects = ["ReactJS", "JavaScript", "HTML/CSS", "Node.js"];

    // 3. FUNCTION TRONG JSX
    const formatGPA = (gpa) => {
        return gpa >= 3.0 ? "Giỏi" : "Khá";
    };

    const getCurrentTime = () => {
        return new Date().toLocaleTimeString('vi-VN');
    };

    return (
        <div className="jsx-example">
            <h2>🎯 JSX Syntax - Cú pháp cơ bản</h2>

            {/* 1. HIỂN THỊ BIẾN */}
            <div className="section">
                <h3>1. Hiển thị biến trong JSX</h3>
                <p>Tên sinh viên: <strong>{studentName}</strong></p>
                <p>Tuổi: <strong>{age}</strong></p>
                <p>Là sinh viên: <strong>{isStudent ? "Có" : "Không"}</strong></p>
            </div>

            {/* 2. CONDITIONAL RENDERING */}
            <div className="section">
                <h3>2. Hiển thị có điều kiện</h3>
                {isStudent && (
                    <p>✅ Đây là tài khoản sinh viên</p>
                )}

                {age >= 18 ? (
                    <p>🎓 Đủ tuổi đi học đại học</p>
                ) : (
                    <p>📚 Chưa đủ tuổi đi học đại học</p>
                )}
            </div>

            {/* 3. HIỂN THỊ OBJECT */}
            <div className="section">
                <h3>3. Hiển thị object</h3>
                <div className="student-card">
                    <p>Tên: {student.name}</p>
                    <p>Ngành: {student.major}</p>
                    <p>GPA: {student.gpa} ({formatGPA(student.gpa)})</p>
                </div>
            </div>

            {/* 4. HIỂN THỊ ARRAY (MAP) */}
            <div className="section">
                <h3>4. Hiển thị danh sách (Array.map)</h3>
                <ul>
                    {subjects.map((subject, index) => (
                        <li key={index}>
                            📖 {subject}
                        </li>
                    ))}
                </ul>
            </div>

            {/* 5. INLINE STYLES */}
            <div className="section">
                <h3>5. Inline Styles trong JSX</h3>
                <p style={{
                    color: 'blue',
                    fontSize: '18px',
                    backgroundColor: '#f0f8ff',
                    padding: '10px',
                    borderRadius: '5px'
                }}>
                    Đây là text với inline styles
                </p>
            </div>

            {/* 6. FUNCTION CALLS */}
            <div className="section">
                <h3>6. Gọi function trong JSX</h3>
                <p>Thời gian hiện tại: <strong>{getCurrentTime()}</strong></p>
            </div>

            {/* 7. JSX FRAGMENTS */}
            <div className="section">
                <h3>7. JSX Fragments</h3>
                <>
                    <p>Đây là đoạn văn đầu tiên trong Fragment</p>
                    <p>Đây là đoạn văn thứ hai trong Fragment</p>
                </>
            </div>

            {/* 8. LƯU Ý QUAN TRỌNG */}
            <div className="section important-notes">
                <h3>⚠️ Lưu ý quan trọng về JSX:</h3>
                <ul>
                    <li><code>className</code> thay vì <code>class</code></li>
                    <li><code>htmlFor</code> thay vì <code>for</code></li>
                    <li>Tất cả tags phải được đóng: <code>&lt;img /&gt;</code></li>
                    <li>Dùng <code>{`{}`}</code> để nhúng JavaScript</li>
                    <li>camelCase cho tất cả attributes</li>
                </ul>
            </div>
        </div>
    );
}

export default JSXExample;