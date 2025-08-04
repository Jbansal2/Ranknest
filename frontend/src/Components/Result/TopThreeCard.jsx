import React from 'react';

const TopThreeCard = ({ student, rank, rankingCriteria, onRowClick }) => {
  if (!student || !student.metrics) {
    return null; 
  }

  const { metrics } = student;

  const cardStyles = {
    1: {
      gradient: 'black',
      bgGradient: 'from-yellow-50 to-amber-50',
      iconBg: 'bg-yellow-500',
      icon: '🏆',
      starCount: '⭐⭐⭐',
    },
    2: {
      gradient: 'black',
      bgGradient: 'from-purple-50 to-indigo-50',
      iconBg: 'bg-purple-500',
      icon: '🥈',
      starCount: '⭐⭐',
    },
    3: {
      gradient: 'black',
      bgGradient: 'from-orange-50 to-red-50',
      iconBg: 'bg-orange-500',
      icon: '🥉',
      starCount: '⭐',
    },
  };

  const style = cardStyles[rank] || cardStyles[3]; 
  const scoreValue = metrics[rankingCriteria]
    ? metrics[rankingCriteria]
    : '0.000';

  return (
    <div
      className={`relative bg-gradient-to-br ${style.gradient} border border-zinc-700 rounded-3xl p-4 cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-2xl`}
      onClick={() => onRowClick?.(student)}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 rounded-3xl overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center">
        {/* Profile Section */}
        <div className="mb-4">
          <div className="w-20 h-20 mx-auto mb-3 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-white/30 relative">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center text-2xl text-white font-bold">
              {(student.name || 'N')[0].toUpperCase()}
            </div>
            <div
              className={`absolute -bottom-1 -right-1 w-8 h-8 ${style.iconBg} rounded-full flex items-center justify-center shadow-lg`}
            >
              <span className="text-lg">{style.icon}</span>
            </div>
          </div>

          <h3 className="text-white font-bold text-lg mb-1">
            {student.name || 'Unknown'}
          </h3>
          <p className="text-white/80 text-sm mb-2">
            {student.enroll_no || 'N/A'}
          </p>
          <div className="text-white/90 text-xs">{style.starCount}</div>
        </div>

        {/* Score Section */}
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
          <div className="flex items-center justify-center mb-2">
            <span className="text-white text-2xl font-bold">
              {scoreValue !== '0.000'
                ? parseFloat(scoreValue).toFixed(3)
                : 'N/A'}
            </span>
          </div>
          <div className="text-white/80 text-sm">
            {rankingCriteria === 'sgpa'
              ? 'SGPA'
              : rankingCriteria === 'percentage'
              ? 'Percentage'
              : 'Credit %'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopThreeCard;
