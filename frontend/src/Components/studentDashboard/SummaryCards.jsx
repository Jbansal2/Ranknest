import React from "react";
import { Target, TrendingUp, BookOpen, Star, Award } from 'lucide-react';

const SummaryCards = ({ summaryData = {} }) => {
    const getPerformanceIntensity = (percentage) => {
        const perc = parseFloat(percentage);
        if (perc >= 85) return 'text-white';
        if (perc >= 70) return 'text-zinc-200';
        if (perc >= 60) return 'text-zinc-300';
        return 'text-zinc-400';
    };

    const getCardBorder = (percentage) => {
        const perc = parseFloat(percentage);
        if (perc >= 85) return 'border-white/30';
        if (perc >= 70) return 'border-zinc-400/30';
        if (perc >= 60) return 'border-zinc-500/30';
        return 'border-zinc-700/30';
    };

    const cards = [
        {
            id: 'sgpa',
            icon: Target,
            title: 'SGPA',
            value: summaryData.sgpa !== '0.000' ? summaryData.sgpa : 'N/A',
            isPercentage: false
        },
        {
            id: 'percentage',
            icon: TrendingUp,
            title: 'percentage',
            value: summaryData.percentage !== '0.000' ? `${summaryData.percentage}%` : 'N/A',
            percentage: summaryData.percentage,
            isPercentage: true
        },
        {
            id: 'total_marks',
            icon: BookOpen,
            title: 'Total Marks',
            value: summaryData.total_marks !== '0.000' ? `${summaryData.total_marks}/${summaryData.max_marks}` : 'N/A',
            isPercentage: false
        },
        {
            id: 'credits',
            icon: Star,
            title: 'Credits',
            value: summaryData.total_credits !== '0.000' ? `${summaryData.total_credits}/${summaryData.max_credits}` : 'N/A',
            isPercentage: false
        },
        {
            id: 'credit_marks',
            icon: Award,
            title: 'Credit Marks',
            value: `${summaryData.credit_marks || 0} / ${summaryData.max_credit_marks || 0}`,
            isPercentage: false
        },
        {
            id: 'credit_percentage',
            icon: TrendingUp,
            title: 'Credit percentage',
            value: summaryData.credit_percentage !== '0.000' ? `${summaryData.credit_percentage}%` : 'N/A',
            percentage: summaryData.credit_percentage,
            isPercentage: true
        }
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {cards.map((card) => {
                const IconComponent = card.icon;
                const borderClass = card.isPercentage ? getCardBorder(card.percentage) : 'border-zinc-700/30';
                const valueClass = card.isPercentage ? getPerformanceIntensity(card.percentage) : 'text-white';
                
                return (
                    <div 
                        key={card.id}
                        className={`group relative bg-black border-2 ${borderClass} rounded-xl p-6 cursor-pointer transform transition-all duration-300  hover:shadow-2xl hover:shadow-white/10 hover:border-white/50`}
                    >
                    
                        <div className="relative z-10">
                            {/* Header with icon */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-zinc-900 border border-zinc-700 rounded-lg group-hover:bg-white/10 transition-all duration-300">
                                    <IconComponent className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors duration-300" />
                                </div>
                                <span className="text-base font-semibold text-zinc-400 group-hover:text-zinc-300 transition-colors duration-300 uppercase tracking-wider">
                                    {card.title}
                                </span>
                            </div>
                            <div className={`text-2xl font-bold ${valueClass} group-hover:text-white transition-colors duration-300 leading-tight`}>
                                {card.value}
                            </div>
                            {card.isPercentage && card.value !== 'N/A' && (
                                <div className="mt-3">
                                    <div className="w-full bg-zinc-800 rounded-full h-1.5">
                                        <div 
                                            className="bg-white rounded-full h-1.5 transition-all duration-500 group-hover:bg-white/90"
                                            style={{ width: `${Math.min(parseFloat(card.percentage), 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default SummaryCards;