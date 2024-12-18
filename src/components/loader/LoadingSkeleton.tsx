import React from "react";

const LoadingSkeleton = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-tertiary-black z-50">
            <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-white rounded-full animate-bounce delay-200"></div>
                <div className="w-3 h-3 bg-white rounded-full animate-bounce delay-400"></div>
            </div>
        </div>
    );
};

export default LoadingSkeleton;