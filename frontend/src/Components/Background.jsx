import React from 'react';


const Background = () => {
  return (
    <div className="flex w-full  flex-col items-center px-4 py-6 ">
      <h2
        className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold text-white text-center"
        style={{
          background: 'linear-gradient(90deg, #ffffff, #a1a1aa)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Calculate Your SGPA Easily!
      </h2>
      <p className="mt-3 max-w-xl text-base md:text-lg text-gray-200 text-center">
        Track your academic progress with our SGPA Calculator. Add subjects, input marks and credits, and get your SGPA instantly!
      </p>
    </div>
  );
};

export default Background;