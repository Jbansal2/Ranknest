import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const glowStyle = {
        background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(29, 78, 216, 0.15), transparent 80%)`,
    };

    return (
        <div className="relative min-h-screen bg-black text-white overflow-hidden">
            {/* Animated background glow */}
            <div
                className="absolute inset-0 transition-opacity duration-300"
                style={{
                    background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.05), transparent 80%)`,
                }}
            />

            {/* Floating particles */}
            <div className="absolute inset-0">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${2 + Math.random() * 3}s`
                        }}
                    />
                ))}
            </div>

            {/* Main content */}
            <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
                <div className="text-center max-w-2xl">
                    {/* Glitch effect 404 */}
                    <div className="relative mb-8">
                        <h1 className="text-8xl md:text-9xl font-black mb-4 relative">
                            <span className="relative inline-block">
                                4
                                <span className="absolute top-0 left-0 text-gray-400 animate-ping opacity-30">4</span>
                            </span>
                            <span className="relative inline-block mx-2">
                                0
                                <span className="absolute top-0 left-0 text-gray-300 animate-pulse opacity-40">0</span>
                            </span>
                            <span className="relative inline-block">
                                4
                                <span className="absolute top-0 left-0 text-gray-500 animate-bounce opacity-30">4</span>
                            </span>
                        </h1>

                        {/* Glitch lines */}
                        <div className="absolute inset-0 opacity-20">
                            <div className="absolute top-1/4 left-0 w-full h-0.5 bg-white animate-pulse"></div>
                            <div className="absolute top-3/4 left-0 w-full h-0.5 bg-gray-400 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                        </div>
                    </div>

                    {/* Title with gradient */}
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white animate-pulse">
                        Oops! Lost in Cyberspace
                    </h2>

                    {/* Description */}
                    <p className="text-lg md:text-xl mb-8 text-gray-300 leading-relaxed">
                        The page you're looking for has vanished into the digital void.
                        <br />
                        Don't worry, even the best explorers sometimes take wrong turns.
                    </p>

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            to="/"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            className="relative group px-8 py-3 bg-white text-black rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-white/25"
                        >
                            <span>Go Home</span>
                            <div className="absolute inset-0 bg-gray-200 rounded-lg blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                        </Link>

                    </div>
                </div>
            </div>

            {/* Bottom decoration */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent"></div>

            {/* Corner decorations */}
            <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-white opacity-50"></div>
            <div className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-gray-500 opacity-50"></div>
            <div className="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-gray-400 opacity-50"></div>
            <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-white opacity-50"></div>
        </div>
    );
};

export default NotFound;