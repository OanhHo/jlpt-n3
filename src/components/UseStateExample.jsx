// 📚 LESSON 3: useState HOOK - Quản lý state trong React

import React, { useState } from 'react';

function UseStateExample() {
    // 1. STATE CƠ BẢN - COUNTER
    const [count, setCount] = useState(0);

    // 2. STATE STRING - INPUT
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');

    // 3. STATE BOOLEAN - TOGGLE
    const [isVisible, setIsVisible] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);

    // 4. STATE OBJECT
    const [user, setUser] = useState({
        name: '',
        email: '',
        age: 18
    });

    // 5. STATE ARRAY
    const [todos, setTodos] = useState([
        { id: 1, text: 'Học React', completed: false },
        { id: 2, text: 'Học JavaScript', completed: true },
        { id: 3, text: 'Làm bài tập', completed: false }
    ]);

    const [newTodo, setNewTodo] = useState('');

    // 6. STATE MULTIPLE VALUES
    const [form, setForm] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false
    });

    // ===================
    // CÁC FUNCTIONS XỬ LÝ
    // ===================

    // Counter functions
    const increment = () => setCount(count + 1);
    const decrement = () => setCount(count - 1);
    const reset = () => setCount(0);

    // Toggle functions
    const toggleVisibility = () => setIsVisible(!isVisible);
    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

    // User object functions
    const updateUser = (field, value) => {
        setUser(prevUser => ({
            ...prevUser,
            [field]: value
        }));
    };

    // Todo functions
    const addTodo = () => {
        if (newTodo.trim()) {
            setTodos(prevTodos => [
                ...prevTodos,
                {
                    id: Date.now(),
                    text: newTodo,
                    completed: false
                }
            ]);
            setNewTodo('');
        }
    };

    const toggleTodo = (id) => {
        setTodos(prevTodos =>
            prevTodos.map(todo =>
                todo.id === id
                    ? { ...todo, completed: !todo.completed }
                    : todo
            )
        );
    };

    const deleteTodo = (id) => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    };

    // Form functions
    const handleFormChange = (field, value) => {
        setForm(prevForm => ({
            ...prevForm,
            [field]: value
        }));
    };

    return (
        <div className={`usestate-example ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            <h2>🎯 useState Hook - Quản lý State</h2>

            {/* 1. COUNTER STATE */}
            <div className="section">
                <h3>1. State cơ bản - Counter</h3>
                <div className="counter">
                    <p>Giá trị hiện tại: <strong>{count}</strong></p>
                    <div className="counter-buttons">
                        <button onClick={decrement}>➖ Giảm</button>
                        <button onClick={reset}>🔄 Reset</button>
                        <button onClick={increment}>➕ Tăng</button>
                    </div>
                </div>
            </div>

            {/* 2. STRING STATE */}
            <div className="section">
                <h3>2. State với String - Input</h3>
                <div className="input-example">
                    <input
                        type="text"
                        placeholder="Nhập tên của bạn..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <p>Xin chào: <strong>{name || 'Chưa có tên'}</strong></p>

                    <textarea
                        placeholder="Nhập tin nhắn..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <p>Tin nhắn có {message.length} ký tự</p>
                </div>
            </div>

            {/* 3. BOOLEAN STATE */}
            <div className="section">
                <h3>3. State với Boolean - Toggle</h3>
                <div className="toggle-example">
                    <button onClick={toggleVisibility}>
                        {isVisible ? '👁️ Ẩn' : '👁️‍🗨️ Hiện'} nội dung
                    </button>

                    {isVisible && (
                        <div className="toggle-content">
                            <p>🎉 Nội dung này có thể ẩn/hiện!</p>
                        </div>
                    )}

                    <button onClick={toggleDarkMode}>
                        {isDarkMode ? '☀️ Light' : '🌙 Dark'} Mode
                    </button>
                </div>
            </div>

            {/* 4. OBJECT STATE */}
            <div className="section">
                <h3>4. State với Object</h3>
                <div className="object-example">
                    <input
                        type="text"
                        placeholder="Tên người dùng"
                        value={user.name}
                        onChange={(e) => updateUser('name', e.target.value)}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={user.email}
                        onChange={(e) => updateUser('email', e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Tuổi"
                        value={user.age}
                        onChange={(e) => updateUser('age', parseInt(e.target.value) || 18)}
                    />

                    <div className="user-info">
                        <h4>Thông tin User:</h4>
                        <p>Tên: {user.name || 'Chưa có'}</p>
                        <p>Email: {user.email || 'Chưa có'}</p>
                        <p>Tuổi: {user.age}</p>
                    </div>
                </div>
            </div>

            {/* 5. ARRAY STATE */}
            <div className="section">
                <h3>5. State với Array - Todo List</h3>
                <div className="array-example">
                    <div className="add-todo">
                        <input
                            type="text"
                            placeholder="Thêm công việc mới..."
                            value={newTodo}
                            onChange={(e) => setNewTodo(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                        />
                        <button onClick={addTodo}>➕ Thêm</button>
                    </div>

                    <div className="todo-list">
                        {todos.map(todo => (
                            <div
                                key={todo.id}
                                className={`todo-item ${todo.completed ? 'completed' : ''}`}
                            >
                                <input
                                    type="checkbox"
                                    checked={todo.completed}
                                    onChange={() => toggleTodo(todo.id)}
                                />
                                <span>{todo.text}</span>
                                <button onClick={() => deleteTodo(todo.id)}>🗑️</button>
                            </div>
                        ))}
                    </div>

                    <div className="todo-stats">
                        <p>Tổng: {todos.length} |
                            Hoàn thành: {todos.filter(t => t.completed).length} |
                            Còn lại: {todos.filter(t => !t.completed).length}
                        </p>
                    </div>
                </div>
            </div>

            {/* 6. COMPLEX FORM STATE */}
            <div className="section">
                <h3>6. State phức tạp - Form</h3>
                <div className="form-example">
                    <input
                        type="text"
                        placeholder="Username"
                        value={form.username}
                        onChange={(e) => handleFormChange('username', e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={(e) => handleFormChange('password', e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={form.confirmPassword}
                        onChange={(e) => handleFormChange('confirmPassword', e.target.value)}
                    />
                    <label>
                        <input
                            type="checkbox"
                            checked={form.agreeTerms}
                            onChange={(e) => handleFormChange('agreeTerms', e.target.checked)}
                        />
                        Tôi đồng ý với điều khoản
                    </label>

                    <div className="form-validation">
                        <p>Username: {form.username.length >= 3 ? '✅' : '❌'} (ít nhất 3 ký tự)</p>
                        <p>Password: {form.password.length >= 6 ? '✅' : '❌'} (ít nhất 6 ký tự)</p>
                        <p>Confirm: {form.password === form.confirmPassword ? '✅' : '❌'} (khớp mật khẩu)</p>
                        <p>Terms: {form.agreeTerms ? '✅' : '❌'} (đồng ý điều khoản)</p>
                    </div>
                </div>
            </div>

            {/* LƯU Ý QUAN TRỌNG */}
            <div className="section important-notes">
                <h3>⚠️ Lưu ý quan trọng về useState:</h3>
                <ul>
                    <li><strong>Immutable:</strong> Luôn tạo state mới, không modify trực tiếp</li>
                    <li><strong>Async:</strong> setState là bất đồng bộ</li>
                    <li><strong>Functional Update:</strong> Dùng function khi state mới phụ thuộc state cũ</li>
                    <li><strong>Object/Array:</strong> Phải spread (...) khi cập nhật</li>
                    <li><strong>Re-render:</strong> Component sẽ re-render khi state thay đổi</li>
                </ul>
            </div>
        </div>
    );
}

export default UseStateExample;