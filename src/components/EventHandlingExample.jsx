// 📚 LESSON 4: EVENT HANDLING - Xử lý sự kiện trong React

import React, { useState } from 'react';

function EventHandlingExample() {
    // States để demo các events
    const [clickCount, setClickCount] = useState(0);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [inputValue, setInputValue] = useState('');
    const [keyPressed, setKeyPressed] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        country: '',
        newsletter: false
    });
    const [draggedItem, setDraggedItem] = useState(null);
    const [items, setItems] = useState(['Item 1', 'Item 2', 'Item 3']);

    // ===================
    // EVENT HANDLERS
    // ===================

    // 1. CLICK EVENTS
    const handleClick = () => {
        setClickCount(prev => prev + 1);
    };

    const handleDoubleClick = () => {
        alert('Double clicked!');
    };

    const handleRightClick = (e) => {
        e.preventDefault(); // Ngăn context menu
        alert('Right clicked!');
    };

    // 2. MOUSE EVENTS
    const handleMouseMove = (e) => {
        setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = (e) => {
        e.target.style.backgroundColor = '#e3f2fd';
    };

    const handleMouseLeave = (e) => {
        e.target.style.backgroundColor = '';
    };

    // 3. KEYBOARD EVENTS
    const handleKeyDown = (e) => {
        setKeyPressed(`Key Down: ${e.key}`);

        // Xử lý phím đặc biệt
        if (e.key === 'Enter') {
            alert('Enter pressed!');
        } else if (e.key === 'Escape') {
            setInputValue('');
        }
    };

    const handleKeyUp = (e) => {
        setKeyPressed(`Key Up: ${e.key}`);
    };

    // 4. FORM EVENTS
    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleFormChange = (field) => (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Ngăn page reload
        alert(`Form submitted:\n${JSON.stringify(formData, null, 2)}`);
    };

    const handleReset = () => {
        setFormData({
            name: '',
            email: '',
            country: '',
            newsletter: false
        });
    };

    // 5. FOCUS EVENTS
    const handleFocus = (e) => {
        e.target.style.borderColor = '#007bff';
        e.target.style.boxShadow = '0 0 5px rgba(0,123,255,.3)';
    };

    const handleBlur = (e) => {
        e.target.style.borderColor = '';
        e.target.style.boxShadow = '';
    };

    // 6. DRAG & DROP EVENTS
    const handleDragStart = (e, item) => {
        setDraggedItem(item);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e, targetIndex) => {
        e.preventDefault();
        if (draggedItem) {
            const draggedIndex = items.indexOf(draggedItem);
            const newItems = [...items];
            newItems.splice(draggedIndex, 1);
            newItems.splice(targetIndex, 0, draggedItem);
            setItems(newItems);
            setDraggedItem(null);
        }
    };

    // 7. CUSTOM EVENT HANDLER WITH PARAMETERS
    const handleButtonClick = (message, number) => {
        alert(`Message: ${message}, Number: ${number}`);
    };

    // 8. PREVENT DEFAULT EXAMPLES
    const handleLinkClick = (e) => {
        e.preventDefault();
        alert('Link click prevented!');
    };

    return (
        <div className="event-handling-example">
            <h2>🎯 Event Handling - Xử lý sự kiện</h2>

            {/* 1. CLICK EVENTS */}
            <div className="section">
                <h3>1. Click Events</h3>
                <div className="click-demo">
                    <button onClick={handleClick}>
                        Single Click (Clicked {clickCount} times)
                    </button>
                    <button onDoubleClick={handleDoubleClick}>
                        Double Click Me
                    </button>
                    <button onContextMenu={handleRightClick}>
                        Right Click Me
                    </button>
                </div>
            </div>

            {/* 2. MOUSE EVENTS */}
            <div className="section">
                <h3>2. Mouse Events</h3>
                <div
                    className="mouse-demo"
                    onMouseMove={handleMouseMove}
                    style={{
                        border: '2px dashed #ccc',
                        padding: '20px',
                        minHeight: '100px'
                    }}
                >
                    <p>Move mouse here to see coordinates</p>
                    <p>Mouse Position: X={mousePosition.x}, Y={mousePosition.y}</p>

                    <div
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        style={{
                            padding: '10px',
                            border: '1px solid #ddd',
                            marginTop: '10px',
                            cursor: 'pointer'
                        }}
                    >
                        Hover over me to change background
                    </div>
                </div>
            </div>

            {/* 3. KEYBOARD EVENTS */}
            <div className="section">
                <h3>3. Keyboard Events</h3>
                <div className="keyboard-demo">
                    <input
                        type="text"
                        placeholder="Type here (try Enter or Escape)"
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        onKeyUp={handleKeyUp}
                        style={{ padding: '10px', marginBottom: '10px', width: '300px' }}
                    />
                    <p>Last key pressed: <strong>{keyPressed}</strong></p>
                    <p>Input value: <strong>{inputValue}</strong></p>
                </div>
            </div>

            {/* 4. FORM EVENTS */}
            <div className="section">
                <h3>4. Form Events</h3>
                <form onSubmit={handleSubmit} className="form-demo">
                    <div className="form-group">
                        <label>Name:</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={handleFormChange('name')}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                        />
                    </div>

                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={handleFormChange('email')}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                        />
                    </div>

                    <div className="form-group">
                        <label>Country:</label>
                        <select
                            value={formData.country}
                            onChange={handleFormChange('country')}
                        >
                            <option value="">Select Country</option>
                            <option value="vietnam">Vietnam</option>
                            <option value="usa">USA</option>
                            <option value="japan">Japan</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={formData.newsletter}
                                onChange={handleFormChange('newsletter')}
                            />
                            Subscribe to newsletter
                        </label>
                    </div>

                    <div className="form-buttons">
                        <button type="submit">Submit</button>
                        <button type="button" onClick={handleReset}>Reset</button>
                    </div>
                </form>
            </div>

            {/* 5. DRAG & DROP */}
            <div className="section">
                <h3>5. Drag & Drop Events</h3>
                <div className="drag-demo">
                    <p>Drag items to reorder them:</p>
                    <div className="drag-container">
                        {items.map((item, index) => (
                            <div
                                key={item}
                                draggable
                                onDragStart={(e) => handleDragStart(e, item)}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, index)}
                                className="drag-item"
                                style={{
                                    padding: '10px',
                                    margin: '5px',
                                    backgroundColor: '#f8f9fa',
                                    border: '1px solid #ddd',
                                    cursor: 'move'
                                }}
                            >
                                🔄 {item}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 6. CUSTOM EVENT HANDLERS */}
            <div className="section">
                <h3>6. Custom Event Handlers with Parameters</h3>
                <div className="custom-demo">
                    <button onClick={() => handleButtonClick('Hello', 1)}>
                        Button 1
                    </button>
                    <button onClick={() => handleButtonClick('World', 2)}>
                        Button 2
                    </button>
                    <button onClick={(e) => {
                        e.stopPropagation(); // Ngăn event bubbling
                        alert('Event propagation stopped!');
                    }}>
                        Stop Propagation
                    </button>
                </div>
            </div>

            {/* 7. PREVENT DEFAULT */}
            <div className="section">
                <h3>7. Prevent Default Behavior</h3>
                <div className="prevent-demo">
                    <a href="https://google.com" onClick={handleLinkClick}>
                        This link is disabled by preventDefault
                    </a>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        alert('Form submission prevented!');
                    }}>
                        <input type="text" placeholder="Type something" />
                        <button type="submit">Submit (prevented)</button>
                    </form>
                </div>
            </div>

            {/* LƯU Ý QUAN TRỌNG */}
            <div className="section important-notes">
                <h3>⚠️ Lưu ý quan trọng về Event Handling:</h3>
                <ul>
                    <li><strong>SyntheticEvent:</strong> React sử dụng SyntheticEvent, tương thích cross-browser</li>
                    <li><strong>Event Object:</strong> Luôn nhận event object làm tham số đầu tiên</li>
                    <li><strong>preventDefault():</strong> Ngăn hành vi mặc định của element</li>
                    <li><strong>stopPropagation():</strong> Ngăn event lan truyền lên parent</li>
                    <li><strong>Arrow Functions:</strong> Cẩn thận với binding this khi dùng arrow functions</li>
                    <li><strong>Event Delegation:</strong> React tự động delegate events</li>
                    <li><strong>Passive Events:</strong> Một số events có thể là passive để tối ưu performance</li>
                </ul>
            </div>

            {/* CODE EXAMPLES */}
            <div className="section">
                <h3>8. Các cách viết Event Handler</h3>
                <div className="code-examples">
                    <pre>{`
// 1. Inline function
<button onClick={() => alert('Hello')}>Click</button>

// 2. Function reference
<button onClick={handleClick}>Click</button>

// 3. Function with parameters
<button onClick={() => handleClick('param')}>Click</button>

// 4. Function with event and parameters
<button onClick={(e) => handleClick(e, 'param')}>Click</button>

// 5. Class method (class components)
<button onClick={this.handleClick.bind(this)}>Click</button>
          `}</pre>
                </div>
            </div>
        </div>
    );
}

export default EventHandlingExample;