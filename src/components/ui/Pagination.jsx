// 📄 Pagination Component

import React from 'react';

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    showInfo = true,
    totalItems = 0,
    itemsPerPage = 10
}) => {
    const generatePageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        // Adjust start page if we're near the end
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    };

    const pages = generatePageNumbers();
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    if (totalPages <= 1) return null;

    return (
        <div className="pagination-container">
            {showInfo && (
                <div className="pagination-info">
                    Hiển thị {startItem}-{endItem} trong tổng số {totalItems} items
                </div>
            )}

            <div className="pagination">
                {/* First Page */}
                {currentPage > 1 && (
                    <button
                        onClick={() => onPageChange(1)}
                        className="pagination-button"
                        title="Trang đầu"
                    >
                        ⏮️
                    </button>
                )}

                {/* Previous Page */}
                {currentPage > 1 && (
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        className="pagination-button"
                        title="Trang trước"
                    >
                        ⬅️
                    </button>
                )}

                {/* Page Numbers */}
                {pages.map(page => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`pagination-button ${page === currentPage ? 'active' : ''}`}
                    >
                        {page}
                    </button>
                ))}

                {/* Next Page */}
                {currentPage < totalPages && (
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        className="pagination-button"
                        title="Trang sau"
                    >
                        ➡️
                    </button>
                )}

                {/* Last Page */}
                {currentPage < totalPages && (
                    <button
                        onClick={() => onPageChange(totalPages)}
                        className="pagination-button"
                        title="Trang cuối"
                    >
                        ⏭️
                    </button>
                )}
            </div>
        </div>
    );
};

export default Pagination;