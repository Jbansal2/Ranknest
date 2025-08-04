import React from 'react';

const Button = ({ title = "Button Text", onClick, disabled = false, type = "button", className = "" }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`group/button relative inline-flex items-center justify-center overflow-hidden rounded-md bg-black/30 backdrop-blur-lg px-4 py-2.5 sm:py-4 text-base font-semibold text-white transition-all duration-300 ease-in-out hover:scale-105 sm:hover:scale-110 hover:shadow-xl hover:shadow-black/50 border border-white/20 cursor-pointer max-w-[90%] sm:max-w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none ${className}`}
        >
            <span className="text-base sm:text-[15px] relative z-10">{title}</span>
            
            {/* Shimmer effect */}
            <div
                className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:[transform:skew(-13deg)_translateX(100%)]"
            >
                <div className="relative h-full w-8 sm:w-10 bg-white/30"></div>
            </div>
        </button>
    );
};

export default Button;