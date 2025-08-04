import React from "react";
import { useState, useEffect } from "react";

const Button = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 200);
  };

  return (
    <div className="flex items-center justify-center  bg-black ">
      <button
        onClick={handleClick}
        className={`relative inline-flex h-14 active:scale-95 transition-all duration-200 overflow-hidden rounded-full p-[1px]  hover:scale-105 ${
          isClicked ? 'scale-95' : ''
        }`}
        aria-label={`Network status: ${isOnline ? 'Online' : 'Offline'}`}
      >
        <span
          className={`absolute rounded-full inset-[-1000%] transition-all duration-300 ${
            isOnline 
              ? "animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#10b981_0%,#34d399_25%,#6ee7b7_50%,#a7f3d0_75%,#10b981_100%)]"
              : "animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#ef4444_0%,#f87171_25%,#fca5a5_50%,#fecaca_75%,#ef4444_100%)]"
          }`}
        >
        </span>
        <span
          className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-black backdrop-blur-3xl px-8 text-sm font-medium text-white gap-3 border border-white"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div 
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  isOnline ? 'bg-white shadow-lg shadow-white/30' : 'bg-gray-500 shadow-lg shadow-gray-500/30'
                }`}
              />
              {isOnline && (
                <div className="absolute inset-0 w-3 h-3 rounded-full bg-white animate-ping opacity-50" />
              )}
            </div>
            <span className={`font-semibold transition-colors duration-300 ${
              isOnline ? 'text-white' : 'text-gray-400'
            }`}>
              {isOnline ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          
          <div className="h-6 w-px bg-gray-700" />
          
          <span className="text-gray-400 font-mono text-xs">
            v1.2.0
          </span>
          
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 448 512"
            height="1.2em"
            width="1.2em"
            xmlns="http://www.w3.org/2000/svg"
            className={`transition-transform duration-200 ${
              isClicked ? 'translate-x-1' : ''
            } ${isOnline ? 'text-white' : 'text-gray-500'}`}
            aria-hidden="true"
          >
            <path
              d="M429.6 92.1c4.9-11.9 2.1-25.6-7-34.7s-22.8-11.9-34.7-7l-352 144c-14.2 5.8-22.2 20.8-19.3 35.8s16.1 25.8 31.4 25.8H224V432c0 15.3 10.8 28.4 25.8 31.4s30-5.1 35.8-19.3l144-352z"
            />
          </svg>
        </span>
      </button>
    </div>
  );
};

export default Button;