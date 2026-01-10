import React from 'react';

const TestPage = () => {
    return (
        <div style={{ padding: '20px', backgroundColor: 'white' }}>
            <h1 style={{ color: 'black', fontSize: '24px' }}>🧪 Test Page</h1>
            <p style={{ color: 'black' }}>If you can see this, React is working!</p>
            <button
                style={{
                    padding: '10px 20px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}
                onClick={() => alert('Button works!')}
            >
                Test Button
            </button>
        </div>
    );
};

export default TestPage;