import React, { useState, useEffect } from 'react';

const Why = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [animationComplete, setAnimationComplete] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 200);

        const animTimer = setTimeout(() => {
            setAnimationComplete(true);
        }, 1000);

        return () => {
            clearTimeout(timer);
            clearTimeout(animTimer);
        };
    }, []);

    return (
        <div className="relative flex items-center justify-center w-full mt-8 sm:mt-12 lg:mt-16 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
            {/* Left decorative line */}
            <div 
                className={`absolute left-0 h-[2px] bg-gradient-to-r from-transparent via-white to-white transition-all duration-1000 ease-out ${
                    isVisible ? 'w-[25%] sm:w-[30%] lg:w-[35%] opacity-100' : 'w-0 opacity-0'
                }`}
                style={{
                    filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.6))'
                }}
            />

            {/* Main text container */}
            <div className="relative flex items-center justify-center">
                {/* Background glow effect */}
                <div 
                    className={`absolute inset-0 transition-all duration-1000 ease-out ${
                        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                    }`}
                    style={{
                        background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.15) 0%, transparent 70%)',
                        filter: 'blur(10px) sm:blur(15px) lg:blur(20px)',
                        transform: 'scale(1.2) sm:scale(1.3) lg:scale(1.5)',
                    }}
                />

                {/* Text with enhanced effects */}
                <h2 
                    className={`relative z-10 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white px-4 sm:px-6 lg:px-8 transition-all duration-1000 ease-out ${
                        isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
                    }`}
                    style={{
                        textShadow: `
                            0 0 8px rgba(255, 255, 255, 0.8),
                            0 0 15px rgba(255, 255, 255, 0.4),
                            0 0 25px rgba(255, 255, 255, 0.2)
                        `,
                        letterSpacing: '0.05em'
                    }}
                >
                    <span className="relative inline-block">
                        Why 
                        <span className="mx-1 sm:mx-2 bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent font-extrabold">
                            Ranknest
                        </span>
                        ?
                        
                        {/* Animated underline */}
                        <span 
                            className={`absolute bottom-[-6px] sm:bottom-[-7px] lg:bottom-[-8px] left-0 h-[2px] sm:h-[2.5px] lg:h-[3px] bg-gradient-to-r from-white via-gray-300 to-white transition-all duration-1500 ease-out ${
                                animationComplete ? 'w-full opacity-100' : 'w-0 opacity-0'
                            }`}
                            style={{
                                filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.8))',
                                borderRadius: '2px'
                            }}
                        />
                    </span>
                </h2>

                {/* Floating particles effect */}
                <div className="absolute inset-0 pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className={`absolute w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white rounded-full transition-all duration-2000 ease-out ${
                                isVisible ? 'opacity-60' : 'opacity-0'
                            }`}
                            style={{
                                left: `${20 + i * 10}%`,
                                top: `${20 + (i % 2) * 50}%`,
                                animationDelay: `${i * 200}ms`,
                                filter: 'blur(0.5px)',
                                animation: isVisible ? `float-${i} 3s ease-in-out infinite` : 'none'
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Right decorative line */}
            <div 
                className={`absolute right-0 h-[2px] bg-gradient-to-l from-transparent via-white to-white transition-all duration-1000 ease-out ${
                    isVisible ? 'w-[25%] sm:w-[30%] lg:w-[35%] opacity-100' : 'w-0 opacity-0'
                }`}
                style={{
                    filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.6))',
                    transitionDelay: '200ms'
                }}
            />

            {/* Enhanced corner decorations */}
            <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 sm:-translate-y-2 transition-all duration-1000 ease-out ${
                animationComplete ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
            }`}>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full" style={{
                    filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.8))',
                    animation: 'pulse 2s ease-in-out infinite'
                }} />
            </div>

            <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 sm:translate-y-2 transition-all duration-1000 ease-out ${
                animationComplete ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
            }`}>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full" style={{
                    filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.8))',
                    animation: 'pulse 2s ease-in-out infinite',
                    animationDelay: '1s'
                }} />
            </div>

            <style jsx>{`
                @keyframes float-0 {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-8px) sm:translateY(-10px) rotate(180deg); }
                }
                @keyframes float-1 {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-10px) sm:translateY(-15px) rotate(-180deg); }
                }
                @keyframes float-2 {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-6px) sm:translateY(-8px) rotate(90deg); }
                }
                @keyframes float-3 {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-8px) sm:translateY(-12px) rotate(-90deg); }
                }
                @keyframes float-4 {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-4px) sm:translateY(-6px) rotate(270deg); }
                }
                @keyframes float-5 {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-10px) sm:translateY(-14px) rotate(-270deg); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(1.1) sm:scale(1.2); }
                }
            `}</style>
        </div>
    );
};

export default Why;