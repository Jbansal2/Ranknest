import React from 'react';

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center p-8">
    {/* Loading text with typing animation */}
    <div className="mt-4 text-center">
      <p className="text-white font-medium text-lg animate-pulse">Loading students</p>
      <div className="flex justify-center mt-1">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-white  rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-white  rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
    
    {/* Progress bar */}
    <div className="w-48 h-1 bg-zinc-700 rounded-full mt-4 overflow-hidden">
      <div className="h-full bg-white rounded-full animate-pulse"></div>
    </div>
  </div>
);

export default LoadingSpinner;