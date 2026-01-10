import React, { useState } from 'react';

const SearchAndFilter = ({
    searchTerm,
    onSearch,
    onFilter,
    activeFilter = 'all',
    placeholder = "Search by kanji, hiragana, or meaning...",
    filters = []
}) => {
    const [showFilters, setShowFilters] = useState(false);

    const defaultFilters = [
        { id: 'all', label: 'All', count: null },
        { id: 'learned', label: 'Learned', count: null },
        { id: 'unlearned', label: 'Not Learned', count: null },
        { id: 'difficult', label: 'Difficult', count: null }
    ];

    const filterOptions = filters.length > 0 ? filters : defaultFilters;

    return (
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            {/* Search Input */}
            <div className="mb-4">
                <div className="relative">
                    <input
                        type="text"
                        placeholder={placeholder}
                        value={searchTerm}
                        onChange={(e) => onSearch(e.target.value)}
                        className="search-input pr-10"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <span className="text-gray-400">🔍</span>
                    </div>
                </div>
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <span className="mr-2">🔽</span>
                    <span className="font-medium">
                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </span>
                </button>

                {searchTerm && (
                    <button
                        onClick={() => onSearch('')}
                        className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        Clear Search
                    </button>
                )}
            </div>

            {/* Filters */}
            {showFilters && (
                <div className="border-t pt-4">
                    <div className="flex flex-wrap gap-2">
                        {filterOptions.map((filter) => (
                            <button
                                key={filter.id}
                                onClick={() => onFilter && onFilter(filter.id)}
                                className={`filter-button ${activeFilter === filter.id ? 'active' : 'inactive'
                                    }`}
                            >
                                {filter.label}
                                {filter.count !== null && (
                                    <span className="ml-1 text-xs">({filter.count})</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Search Results Info */}
            {searchTerm && (
                <div className="mt-4 text-sm text-gray-600">
                    Searching for: <span className="font-medium">"{searchTerm}"</span>
                </div>
            )}
        </div>
    );
};

export default SearchAndFilter;