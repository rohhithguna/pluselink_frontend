import React from 'react';

const CategoryBadge = ({ category }) => {
    const getCategoryConfig = (cat) => {
        const configs = {
            emergency: {
                color: 'bg-red-100 text-red-800 border-red-200',
                icon: '🚨',
                label: 'Emergency'
            },
            academic: {
                color: 'bg-blue-100 text-blue-800 border-blue-200',
                icon: '📚',
                label: 'Academic'
            },
            event: {
                color: 'bg-purple-100 text-purple-800 border-purple-200',
                icon: '🎉',
                label: 'Event'
            },
            maintenance: {
                color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                icon: '🔧',
                label: 'Maintenance'
            },
            weather: {
                color: 'bg-cyan-100 text-cyan-800 border-cyan-200',
                icon: '🌤️',
                label: 'Weather'
            },
            general: {
                color: 'bg-gray-100 text-gray-800 border-gray-200',
                icon: '📢',
                label: 'General'
            }
        };

        return configs[cat] || configs.general;
    };

    const config = getCategoryConfig(category);

    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${config.color}`}>
            <span>{config.icon}</span>
            <span>{config.label}</span>
        </span>
    );
};

export default CategoryBadge;
