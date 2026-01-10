import React from 'react';
import Navigation from './Navigation';
import Footer from './Footer';

function Layout({ children }) {
    return (
        <div className="layout">
            <Navigation />
            <main className="main-content">
                {children}
            </main>
            <Footer />
        </div>
    );
}

export default Layout;