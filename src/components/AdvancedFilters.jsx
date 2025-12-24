import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AdvancedFilters = ({ onApplyFilters, onClose }) => {
    const [filters, setFilters] = useState({
        category: '',
        priority: '',
        startDate: '',
        endDate: '',
        senderId: ''
    });

    const categories = [
        { value: '', label: 'All Categories' },
        { value: 'emergency', label: '🚨 Emergency' },
        { value: 'academic', label: '📚 Academic' },
        { value: 'event', label: '🎉 Event' },
        { value: 'maintenance', label: '🔧 Maintenance' },
        { value: 'weather', label: '🌤️ Weather' },
        { value: 'general', label: '📢 General' }
    ];

    const priorities = [
        { value: '', label: 'All Priorities' },
        { value: 'emergency', label: 'Emergency' },
        { value: 'important', label: 'Important' },
        { value: 'info', label: 'Info' },
        { value: 'reminder', label: 'Reminder' }
    ];

    const handleApply = () => {
        onApplyFilters(filters);
        onClose();
    };

    const handleReset = () => {
        const resetFilters = {
            category: '',
            priority: '',
            startDate: '',
            endDate: '',
            senderId: ''
        };
        setFilters(resetFilters);
        onApplyFilters(resetFilters);
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
                >
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Advanced Filters</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                            ✕
                        </button>
                    </div>

                    <div className="space-y-4">
                        {}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category
                            </label>
                            <select
                                value={filters.category}
                                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                            >
                                {categories.map(cat => (
                                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                                ))}
                            </select>
                        </div>

                        {}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Priority
                            </label>
                            <select
                                value={filters.priority}
                                onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                            >
                                {priorities.map(pri => (
                                    <option key={pri.value} value={pri.value}>{pri.label}</option>
                                ))}
                            </select>
                        </div>

                        {}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    value={filters.startDate}
                                    onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    value={filters.endDate}
                                    onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                        </div>
                    </div>

                    {}
                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={handleReset}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Reset
                        </button>
                        <button
                            onClick={handleApply}
                            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                        >
                            Apply Filters
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default AdvancedFilters;
