import React from 'react';
import useThemeStore from '../store/themeStore';

const AlertCardSkeleton = () => {
    const { currentTheme } = useThemeStore();
    const isDark = currentTheme === 'dark';

    return (
        <div className={`
            p-6 rounded-xl border
            ${isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200'}
        `}>
            {}
            <div className="flex items-start justify-between mb-4">
                <div className={`h-6 rounded-lg ${isDark ? 'skeleton-dark' : 'skeleton'} w-3/4`} />
                <div className={`h-6 w-20 rounded-full ${isDark ? 'skeleton-dark' : 'skeleton'}`} />
            </div>

            {}
            <div className="space-y-2 mb-4">
                <div className={`h-4 rounded ${isDark ? 'skeleton-dark' : 'skeleton'} w-full`} />
                <div className={`h-4 rounded ${isDark ? 'skeleton-dark' : 'skeleton'} w-5/6`} />
                <div className={`h-4 rounded ${isDark ? 'skeleton-dark' : 'skeleton'} w-4/6`} />
            </div>

            {}
            <div className="flex items-center justify-between">
                <div className={`h-4 w-32 rounded ${isDark ? 'skeleton-dark' : 'skeleton'}`} />
                <div className="flex gap-2">
                    <div className={`h-8 w-8 rounded-full ${isDark ? 'skeleton-dark' : 'skeleton'}`} />
                    <div className={`h-8 w-8 rounded-full ${isDark ? 'skeleton-dark' : 'skeleton'}`} />
                </div>
            </div>
        </div>
    );
};

export default AlertCardSkeleton;
