import React from 'react';
import { motion } from 'framer-motion';


const SplitViewToggle = ({ enabled, onToggle }) => {
    return (
        <motion.button
            onClick={onToggle}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
                relative flex items-center gap-2 px-2 py-1 rounded-lg
                transition-colors duration-200 text-xs font-medium
                ${enabled
                    ? 'text-purple-600'
                    : 'text-gray-500'
                }
            `}
        >
            <span>{enabled ? '📊' : '📋'}</span>
            <span className="hidden sm:inline">{enabled ? 'Split' : 'List'}</span>

            {}
            <div
                className={`
                    w-8 h-4 rounded-full relative transition-colors duration-200
                    ${enabled ? 'bg-purple-500' : 'bg-gray-300'}
                `}
            >
                {}
                <motion.div
                    className="absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-sm"
                    animate={{
                        left: enabled ? '16px' : '2px',
                    }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
            </div>
        </motion.button>
    );
};

export default SplitViewToggle;
