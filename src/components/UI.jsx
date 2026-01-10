import React from 'react';

export const LoadingSpinner = ({ size = 'md', message = 'Loading...' }) => {
    const sizeClasses = {
        sm: 'h-6 w-6',
        md: 'h-12 w-12',
        lg: 'h-16 w-16'
    };

    return (
        <div className="flex flex-col items-center justify-center p-8">
            <div className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizeClasses[size]}`}></div>
            <p className="mt-4 text-gray-600">{message}</p>
        </div>
    );
};

export const ErrorMessage = ({ title = 'Error', message, onRetry }) => {
    return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-start">
                <span className="text-red-600 text-xl mr-3">❌</span>
                <div className="flex-1">
                    <h3 className="text-red-900 font-semibold mb-2">{title}</h3>
                    <p className="text-red-700 mb-4">{message}</p>
                    {onRetry && (
                        <button
                            onClick={onRetry}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        >
                            Try Again
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export const SuccessMessage = ({ title = 'Success', message }) => {
    return (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-start">
                <span className="text-green-600 text-xl mr-3">✅</span>
                <div>
                    <h3 className="text-green-900 font-semibold mb-2">{title}</h3>
                    <p className="text-green-700">{message}</p>
                </div>
            </div>
        </div>
    );
};

export const InfoMessage = ({ title = 'Info', message }) => {
    return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start">
                <span className="text-blue-600 text-xl mr-3">ℹ️</span>
                <div>
                    <h3 className="text-blue-900 font-semibold mb-2">{title}</h3>
                    <p className="text-blue-700">{message}</p>
                </div>
            </div>
        </div>
    );
};