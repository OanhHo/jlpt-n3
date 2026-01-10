// 📚 LESSON 2: COMPONENTS & PROPS - Components và truyền dữ liệu

import React from 'react';

// 1. COMPONENT CON NHẬN PROPS
function StudentCard({ name, age, major, gpa, avatar, isActive }) {
    return (
        <div className={`student-card ${isActive ? 'active' : 'inactive'}`}>
            <img src={avatar} alt={name} className="avatar" />
            <h3>{name}</h3>
            <p>Tuổi: {age}</p>
            <p>Ngành: {major}</p>
            <p>GPA: {gpa}</p>
            <span className={`status ${isActive ? 'active' : 'inactive'}`}>
                {isActive ? '🟢 Đang học' : '🔴 Nghỉ học'}
            </span>
        </div>
    );
}

// 2. COMPONENT BUTTON VỚI PROPS FUNCTION
function CustomButton({ text, color, onClick, disabled }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            style={{
                backgroundColor: color,
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.5 : 1
            }}
        >
            {text}
        </button>
    );
}

// 3. COMPONENT HIỂN THỊ DANH SÁCH
function SubjectList({ subjects, title }) {
    return (
        <div className="subject-list">
            <h4>{title}</h4>
            <ul>
                {subjects.map((subject, index) => (
                    <li key={index}>
                        📚 {subject.name} - {subject.credits} tín chỉ
                        <span className={`grade ${subject.grade.toLowerCase()}`}>
                            ({subject.grade})
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

// 4. COMPONENT CHÍNH - SỬ DỤNG TẤT CẢ COMPONENTS CON
function ComponentsAndProps() {
    // Dữ liệu sinh viên
    const students = [
        {
            id: 1,
            name: "Nguyễn Văn An",
            age: 20,
            major: "Công nghệ thông tin",
            gpa: 3.8,
            avatar: "https://via.placeholder.com/100x100/blue/white?text=AN",
            isActive: true
        },
        {
            id: 2,
            name: "Trần Thị Bình",
            age: 19,
            major: "Thiết kế đồ họa",
            gpa: 3.5,
            avatar: "https://via.placeholder.com/100x100/pink/white?text=TB",
            isActive: true
        },
        {
            id: 3,
            name: "Lê Văn Cường",
            age: 21,
            major: "Kế toán",
            gpa: 3.2,
            avatar: "https://via.placeholder.com/100x100/green/white?text=LC",
            isActive: false
        }
    ];

    // Dữ liệu môn học
    const mathSubjects = [
        { name: "Giải tích", credits: 3, grade: "A" },
        { name: "Đại số", credits: 2, grade: "B+" },
        { name: "Xác suất thống kê", credits: 3, grade: "A-" }
    ];

    const itSubjects = [
        { name: "Lập trình Java", credits: 4, grade: "A" },
        { name: "Cơ sở dữ liệu", credits: 3, grade: "B+" },
        { name: "Mạng máy tính", credits: 3, grade: "A-" }
    ];

    // Các hàm xử lý events
    const handleViewProfile = (studentName) => {
        alert(`Xem hồ sơ của ${studentName}`);
    };

    const handleSendMessage = (studentName) => {
        alert(`Gửi tin nhắn cho ${studentName}`);
    };

    const handleDeleteStudent = (studentName) => {
        if (window.confirm(`Bạn có chắc muốn xóa ${studentName}?`)) {
            alert(`Đã xóa ${studentName}`);
        }
    };

    return (
        <div className="components-props-example">
            <h2>🎯 Components & Props</h2>

            {/* PHẦN 1: HIỂN THỊ DANH SÁCH SINH VIÊN */}
            <div className="section">
                <h3>1. Truyền Props cho Components</h3>
                <div className="students-grid">
                    {students.map((student) => (
                        <div key={student.id} className="student-wrapper">
                            <StudentCard
                                name={student.name}
                                age={student.age}
                                major={student.major}
                                gpa={student.gpa}
                                avatar={student.avatar}
                                isActive={student.isActive}
                            />
                            <div className="student-actions">
                                <CustomButton
                                    text="Xem hồ sơ"
                                    color="#007bff"
                                    onClick={() => handleViewProfile(student.name)}
                                />
                                <CustomButton
                                    text="Gửi tin nhắn"
                                    color="#28a745"
                                    onClick={() => handleSendMessage(student.name)}
                                    disabled={!student.isActive}
                                />
                                <CustomButton
                                    text="Xóa"
                                    color="#dc3545"
                                    onClick={() => handleDeleteStudent(student.name)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* PHẦN 2: TRUYỀN ARRAY PROPS */}
            <div className="section">
                <h3>2. Truyền Array làm Props</h3>
                <div className="subjects-container">
                    <SubjectList
                        subjects={mathSubjects}
                        title="📐 Môn Toán"
                    />
                    <SubjectList
                        subjects={itSubjects}
                        title="💻 Môn Tin học"
                    />
                </div>
            </div>

            {/* PHẦN 3: LƯU Ý VỀ PROPS */}
            <div className="section important-notes">
                <h3>⚠️ Lưu ý quan trọng về Props:</h3>
                <ul>
                    <li><strong>Props là read-only</strong> - Không được thay đổi props trong component con</li>
                    <li><strong>Props có thể là:</strong> string, number, boolean, array, object, function</li>
                    <li><strong>Default Props:</strong> Có thể đặt giá trị mặc định cho props</li>
                    <li><strong>PropTypes:</strong> Có thể validate kiểu dữ liệu của props</li>
                    <li><strong>Destructuring:</strong> Nên dùng destructuring để lấy props dễ đọc hơn</li>
                </ul>
            </div>

            {/* PHẦN 4: VÍ DỤ PROPS NÂNG CAO */}
            <div className="section">
                <h3>3. Props nâng cao</h3>
                <div className="advanced-example">
                    <PropsExample
                        title="Ví dụ nâng cao"
                        data={{ message: "Hello World", count: 42 }}
                        render={(data) => (
                            <div>
                                <p>Message: {data.message}</p>
                                <p>Count: {data.count}</p>
                            </div>
                        )}
                    />
                </div>
            </div>
        </div>
    );
}

// 5. COMPONENT VÍ DỤ PROPS NÂNG CAO
function PropsExample({ title, data, render }) {
    return (
        <div className="props-example">
            <h4>{title}</h4>
            {render(data)}
        </div>
    );
}

export default ComponentsAndProps;