import React from 'react';

const EffectivenessScore = ({ score }) => {
    if (score === null || score === undefined) {
        return null;
    }

    const getScoreColor = (score) => {
        if (score >= 70) return 'text-green-600 bg-green-100';
        if (score >= 40) return 'text-yellow-600 bg-yellow-100';
        return 'text-red-600 bg-red-100';
    };

    const getProgressColor = (score) => {
        if (score >= 70) return 'bg-green-500';
        if (score >= 40) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <div className="flex items-center gap-2">
            <div className="relative w-16">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className={`h-full ${getProgressColor(score)} transition-all duration-300`}
                        style={{ width: `${score}%` }}
                    />
                </div>
            </div>
            <span className={`text-xs font-semibold px-2 py-1 rounded ${getScoreColor(score)}`} title="Effectiveness Score">
                {Math.round(score)}%
            </span>
        </div>
    );
};

export default EffectivenessScore;
