import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../services/api';
import useThemeStore from '../store/themeStore';
import useAuthStore from '../store/authStore';
import Navbar from '../components/Navbar';
import AlertCard from '../components/AlertCard';
import Card from '../components/Card';


const premiumTransition = {
    type: 'spring',
    stiffness: 400,
    damping: 30,
};

const smoothTransition = {
    duration: 0.25,
    ease: [0.16, 1, 0.3, 1],
};


const getPageThemeStyles = (theme) => {
    const styles = {
        light: {
            background: 'bg-gradient-to-br from-gray-50 via-purple-50/30 to-gray-50',
            titleColor: 'transparent',
            titleGradient: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #7c3aed 100%)',
            subtitleColor: '#6b7280',
            dividerColor: 'rgba(168, 85, 247, 0.3)',
        },
        dark: {
            background: 'bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a]',
            titleColor: 'transparent',
            titleGradient: 'linear-gradient(135deg, #c4b5fd 0%, #a855f7 50%, #c4b5fd 100%)',
            subtitleColor: '#9ca3af',
            dividerColor: 'rgba(168, 85, 247, 0.5)',
        },
        glass: {
            background: 'bg-gradient-to-br from-gray-50/80 via-purple-50/20 to-blue-50/30',
            titleColor: 'transparent',
            titleGradient: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #7c3aed 100%)',
            subtitleColor: '#6b7280',
            dividerColor: 'rgba(168, 85, 247, 0.4)',
        },
        neo: {
            background: 'bg-[#e8ecef]',
            titleColor: 'transparent',
            titleGradient: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #7c3aed 100%)',
            subtitleColor: '#6b7280',
            dividerColor: 'rgba(168, 85, 247, 0.3)',
        },
    };
    return styles[theme] || styles.light;
};


const getToolbarThemeStyles = (theme) => {
    const styles = {
        light: {
            background: 'rgba(255, 255, 255, 0.88)',
            border: '1px solid rgba(168, 85, 247, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
            backdropFilter: 'blur(16px) saturate(180%)',
            inputBg: 'rgba(245, 245, 245, 0.8)',
            inputBorder: '1px solid rgba(168, 85, 247, 0.1)',
            inputColor: '#111827',
            labelColor: '#6b7280',
        },
        dark: {
            background: 'rgba(25, 25, 25, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(168, 85, 247, 0.1)',
            backdropFilter: 'blur(20px) saturate(150%)',
            inputBg: 'rgba(40, 40, 40, 0.8)',
            inputBorder: '1px solid rgba(255, 255, 255, 0.08)',
            inputColor: '#f1f5f9',
            labelColor: '#9ca3af',
        },
        glass: {
            background: 'rgba(255, 255, 255, 0.12)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 8px 32px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(24px) saturate(180%)',
            inputBg: 'rgba(255, 255, 255, 0.1)',
            inputBorder: '1px solid rgba(255, 255, 255, 0.15)',
            inputColor: '#111827',
            labelColor: '#6b7280',
        },
        neo: {
            background: '#e8ecef',
            border: 'none',
            boxShadow: '6px 6px 12px rgba(166, 180, 200, 0.35), -6px -6px 12px rgba(255, 255, 255, 0.9)',
            backdropFilter: 'none',
            inputBg: '#e8ecef',
            inputBorder: 'none',
            inputColor: '#111827',
            labelColor: '#6b7280',
            inputShadow: 'inset 3px 3px 6px rgba(166, 180, 200, 0.3), inset -3px -3px 6px rgba(255, 255, 255, 0.8)',
        },
    };
    return styles[theme] || styles.light;
};


const getPriorityAccent = (priority, theme) => {
    const accents = {
        emergency: {
            dot: '#ef4444',
            glow: theme === 'dark' ? 'rgba(239, 68, 68, 0.6)' : 'rgba(239, 68, 68, 0.4)',
            pulse: 'rgba(239, 68, 68, 0.3)',
        },
        important: {
            dot: '#f59e0b',
            glow: theme === 'dark' ? 'rgba(245, 158, 11, 0.5)' : 'rgba(245, 158, 11, 0.35)',
            pulse: 'rgba(245, 158, 11, 0.25)',
        },
        info: {
            dot: '#22c55e',
            glow: theme === 'dark' ? 'rgba(34, 197, 94, 0.5)' : 'rgba(34, 197, 94, 0.35)',
            pulse: 'rgba(34, 197, 94, 0.2)',
        },
        reminder: {
            dot: '#3b82f6',
            glow: theme === 'dark' ? 'rgba(59, 130, 246, 0.5)' : 'rgba(59, 130, 246, 0.35)',
            pulse: 'rgba(59, 130, 246, 0.2)',
        },
    };
    return accents[priority] || accents.info;
};


const TimelineDot = ({ priority, theme, isFirst }) => {
    const accent = getPriorityAccent(priority, theme);
    return (
        <div className="relative flex-shrink-0">
            {}
            <motion.div
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: accent.pulse }}
                animate={{
                    scale: [1, 1.8, 1],
                    opacity: [0.6, 0, 0.6],
                }}
                transition={{
                    duration: priority === 'emergency' ? 2 : 4,
                    repeat: Infinity,
                    ease: 'easeOut',
                }}
            />
            {}
            <motion.div
                className="w-3 h-3 rounded-full relative z-10"
                style={{
                    backgroundColor: accent.dot,
                    boxShadow: `0 0 12px ${accent.glow}`,
                }}
                whileHover={{ scale: 1.3 }}
                transition={premiumTransition}
            />
        </div>
    );
};


const AnimatedSearchIcon = ({ isFocused, theme }) => (
    <motion.span
        className="text-lg"
        animate={{
            scale: isFocused ? 1.1 : 1,
            filter: isFocused && theme === 'dark' ? 'drop-shadow(0 0 6px rgba(168, 85, 247, 0.6))' : 'none',
        }}
        transition={smoothTransition}
    >
        🔍
    </motion.span>
);


const EmptyState = ({ hasFilters, theme }) => {
    const isDark = theme === 'dark';
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, ...smoothTransition }}
            className="rounded-3xl p-16 text-center"
            style={{
                background: isDark ? 'rgba(25, 25, 25, 0.6)' : 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(20px)',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(168, 85, 247, 0.1)',
                boxShadow: isDark ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 8px 32px rgba(0, 0, 0, 0.06)',
            }}
        >
            {}
            <motion.div
                className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6"
                style={{
                    background: isDark
                        ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(139, 92, 246, 0.15) 100%)'
                        : 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%)',
                    boxShadow: isDark
                        ? '0 8px 24px rgba(168, 85, 247, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)'
                        : '0 8px 24px rgba(168, 85, 247, 0.15)',
                }}
                animate={{
                    y: [0, -8, 0],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            >
                <span className="text-5xl">
                    {hasFilters ? '🔍' : '✨'}
                </span>
            </motion.div>

            <h3
                className="text-xl font-semibold mb-2"
                style={{ color: isDark ? '#f1f5f9' : '#111827' }}
            >
                {hasFilters ? 'No matching alerts' : 'All calm for now'}
            </h3>
            <p
                className="text-sm"
                style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
            >
                {hasFilters
                    ? 'Try adjusting your search or filters'
                    : 'No archived alerts — your history is clear ✨'
                }
            </p>
        </motion.div>
    );
};


const BulkActionBar = ({ selectedCount, onAcknowledge, onArchive, onDelete, theme }) => {
    const isDark = theme === 'dark';

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={premiumTransition}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40"
        >
            <motion.div
                className="flex items-center gap-4 px-6 py-4 rounded-2xl"
                style={{
                    background: isDark ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(24px) saturate(180%)',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(168, 85, 247, 0.15)',
                    boxShadow: isDark
                        ? '0 12px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(168, 85, 247, 0.2)'
                        : '0 12px 40px rgba(0, 0, 0, 0.15)',
                }}
                animate={{
                    boxShadow: isDark
                        ? ['0 12px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(168, 85, 247, 0.2)', '0 12px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(168, 85, 247, 0.4)', '0 12px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(168, 85, 247, 0.2)']
                        : undefined,
                }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <span
                    className="text-sm font-semibold"
                    style={{ color: isDark ? '#c4b5fd' : '#7c3aed' }}
                >
                    {selectedCount} selected
                </span>

                <div className="w-px h-5" style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onAcknowledge}
                    className="px-4 py-2 rounded-xl text-sm font-medium"
                    style={{
                        background: isDark ? 'rgba(34, 197, 94, 0.15)' : 'rgba(34, 197, 94, 0.1)',
                        color: isDark ? '#4ade80' : '#16a34a',
                    }}
                >
                    ✓ Acknowledge
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onArchive}
                    className="px-4 py-2 rounded-xl text-sm font-medium"
                    style={{
                        background: isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.1)',
                        color: isDark ? '#60a5fa' : '#2563eb',
                    }}
                >
                    📦 Archive
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onDelete}
                    className="px-4 py-2 rounded-xl text-sm font-medium"
                    style={{
                        background: isDark ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.1)',
                        color: isDark ? '#f87171' : '#dc2626',
                    }}
                >
                    🗑️ Delete
                </motion.button>
            </motion.div>
        </motion.div>
    );
};

const AlertHistory = () => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [alertToDelete, setAlertToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const [selectedAlerts, setSelectedAlerts] = useState([]);

    const { currentTheme } = useThemeStore();
    const { user } = useAuthStore();

    const isSuperAdmin = user?.role === 'super_admin';
    const hasActiveFilters = searchTerm !== '' || priorityFilter !== 'all';

    const pageStyles = getPageThemeStyles(currentTheme);
    const toolbarStyles = getToolbarThemeStyles(currentTheme);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const response = await api.get('/alerts/history');
            setAlerts(response.data);
        } catch (error) {
            console.error('Error fetching history:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleForceDelete = (alert) => {
        setAlertToDelete(alert);
        setDeleteModalOpen(true);
    };

    const confirmForceDelete = async () => {
        if (!alertToDelete) return;

        setDeleting(true);
        try {
            await api.delete(`/alerts/${alertToDelete.id}/permanent`);
            setAlerts(prev => prev.filter(a => a.id !== alertToDelete.id));
            toast.success('Alert permanently deleted');
            setDeleteModalOpen(false);
            setAlertToDelete(null);
        } catch (error) {
            console.error('Error deleting alert:', error);
            toast.error(error.response?.data?.detail || 'Failed to delete alert');
        } finally {
            setDeleting(false);
        }
    };

    const resetFilters = () => {
        setSearchTerm('');
        setPriorityFilter('all');
    };

    const filteredAlerts = useMemo(() => {
        return alerts.filter((alert) => {
            const matchesSearch =
                alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                alert.message.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesPriority =
                priorityFilter === 'all' || alert.priority === priorityFilter;

            return matchesSearch && matchesPriority;
        });
    }, [alerts, searchTerm, priorityFilter]);

    
    const getModalStyles = () => {
        if (currentTheme === 'dark') {
            return {
                overlay: 'rgba(0, 0, 0, 0.7)',
                background: 'rgba(25, 25, 25, 0.98)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                titleColor: '#f1f5f9',
                textColor: '#9ca3af',
                dangerBg: 'rgba(239, 68, 68, 0.1)',
                dangerBorder: 'rgba(239, 68, 68, 0.2)',
            };
        }
        return {
            overlay: 'rgba(0, 0, 0, 0.5)',
            background: 'white',
            border: 'none',
            titleColor: '#111827',
            textColor: '#6b7280',
            dangerBg: 'rgba(254, 226, 226, 0.8)',
            dangerBorder: 'rgba(239, 68, 68, 0.2)',
        };
    };
    const modalStyles = getModalStyles();

    return (
        <div className={`min-h-screen ${pageStyles.background}`}>
            <Navbar />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
            >
                {}
                <motion.div
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, ...smoothTransition }}
                    className="mb-10"
                >
                    <h1
                        className="text-4xl font-bold mb-2"
                        style={{
                            background: pageStyles.titleGradient,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}
                    >
                        Alert History
                    </h1>
                    <p style={{ color: pageStyles.subtitleColor }} className="text-sm">
                        View and search past alerts
                        {isSuperAdmin && (
                            <span className="ml-2 text-red-500 text-xs font-medium">
                                (Super Admin: Force delete available)
                            </span>
                        )}
                    </p>

                    {}
                    <motion.div
                        className="h-0.5 rounded-full mt-6"
                        style={{
                            background: `linear-gradient(90deg, transparent, ${pageStyles.dividerColor}, transparent)`,
                        }}
                        animate={{
                            opacity: [0.5, 0.8, 0.5],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />
                </motion.div>

                {}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, ...smoothTransition }}
                    className="rounded-3xl p-6 mb-10"
                    style={{
                        background: toolbarStyles.background,
                        border: toolbarStyles.border,
                        boxShadow: toolbarStyles.boxShadow,
                        backdropFilter: toolbarStyles.backdropFilter,
                        WebkitBackdropFilter: toolbarStyles.backdropFilter,
                    }}
                    whileHover={currentTheme === 'neo' ? {
                        y: -2,
                        boxShadow: '8px 8px 16px rgba(166, 180, 200, 0.4), -8px -8px 16px rgba(255, 255, 255, 0.95)',
                    } : undefined}
                >
                    <div className="flex flex-col md:flex-row gap-4">
                        {}
                        <div className="flex-1">
                            <label
                                className="text-xs font-medium mb-2 block"
                                style={{ color: toolbarStyles.labelColor }}
                            >
                                Search
                            </label>
                            <div
                                className="flex items-center gap-3 px-4 py-3 rounded-xl"
                                style={{
                                    background: toolbarStyles.inputBg,
                                    border: toolbarStyles.inputBorder,
                                    boxShadow: toolbarStyles.inputShadow || 'none',
                                }}
                            >
                                <AnimatedSearchIcon isFocused={searchFocused} theme={currentTheme} />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onFocus={() => setSearchFocused(true)}
                                    onBlur={() => setSearchFocused(false)}
                                    placeholder="Search alerts..."
                                    className="flex-1 bg-transparent outline-none text-sm"
                                    style={{ color: toolbarStyles.inputColor }}
                                />
                            </div>
                        </div>

                        {}
                        <div className="w-full md:w-48">
                            <label
                                className="text-xs font-medium mb-2 block"
                                style={{ color: toolbarStyles.labelColor }}
                            >
                                Priority
                            </label>
                            <select
                                value={priorityFilter}
                                onChange={(e) => setPriorityFilter(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl text-sm outline-none cursor-pointer"
                                style={{
                                    background: toolbarStyles.inputBg,
                                    border: toolbarStyles.inputBorder,
                                    color: toolbarStyles.inputColor,
                                    boxShadow: toolbarStyles.inputShadow || 'none',
                                }}
                            >
                                <option value="all">All Priorities</option>
                                <option value="emergency">🚨 Emergency</option>
                                <option value="important">⚠️ Important</option>
                                <option value="info">ℹ️ Info</option>
                                <option value="reminder">⏰ Reminder</option>
                            </select>
                        </div>

                        {}
                        <AnimatePresence>
                            {hasActiveFilters && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="flex items-end"
                                >
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={resetFilters}
                                        className="px-4 py-3 rounded-xl text-sm font-medium"
                                        style={{
                                            background: currentTheme === 'dark' ? 'rgba(168, 85, 247, 0.15)' : 'rgba(168, 85, 247, 0.1)',
                                            color: currentTheme === 'dark' ? '#c4b5fd' : '#7c3aed',
                                            border: currentTheme === 'dark' ? '1px solid rgba(168, 85, 247, 0.3)' : '1px solid rgba(168, 85, 247, 0.2)',
                                        }}
                                    >
                                        ✕ Reset
                                    </motion.button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {}
                    <motion.div
                        className="mt-4 text-xs font-medium"
                        style={{ color: toolbarStyles.labelColor }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        Showing {filteredAlerts.length} of {alerts.length} alerts
                    </motion.div>
                </motion.div>

                {}
                <div className="relative">
                    {loading ? (
                        <motion.div
                            className="text-center py-16"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <motion.div
                                className="text-6xl mb-4 inline-block"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                            >
                                ⏳
                            </motion.div>
                            <p style={{ color: pageStyles.subtitleColor }}>Loading history...</p>
                        </motion.div>
                    ) : filteredAlerts.length === 0 ? (
                        <EmptyState hasFilters={hasActiveFilters} theme={currentTheme} />
                    ) : (
                        <div className="relative">
                            {}
                            <motion.div
                                className="absolute left-[18px] top-8 bottom-8 w-0.5 rounded-full"
                                style={{
                                    background: currentTheme === 'dark'
                                        ? 'linear-gradient(to bottom, rgba(168, 85, 247, 0.4), rgba(168, 85, 247, 0.1))'
                                        : 'linear-gradient(to bottom, rgba(168, 85, 247, 0.3), rgba(168, 85, 247, 0.05))',
                                }}
                                initial={{ scaleY: 0 }}
                                animate={{ scaleY: 1 }}
                                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            />

                            {}
                            <div className="space-y-6">
                                {filteredAlerts.map((alert, index) => (
                                    <motion.div
                                        key={alert.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                            delay: index * 0.05,
                                            ...smoothTransition,
                                        }}
                                        className="relative flex gap-6"
                                    >
                                        {}
                                        <div className="flex-shrink-0 pt-6">
                                            <TimelineDot
                                                priority={alert.priority}
                                                theme={currentTheme}
                                                isFirst={index === 0}
                                            />
                                        </div>

                                        {}
                                        <div className="flex-1 relative">
                                            <AlertCard alert={alert} />

                                            {}
                                            {isSuperAdmin && (
                                                <motion.button
                                                    whileHover={{ scale: 1.05, y: -1 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleForceDelete(alert)}
                                                    className="absolute top-4 right-4 px-3 py-1.5 text-sm font-medium rounded-xl transition-colors"
                                                    style={{
                                                        background: currentTheme === 'dark'
                                                            ? 'rgba(220, 38, 38, 0.2)'
                                                            : 'rgba(220, 38, 38, 0.9)',
                                                        color: currentTheme === 'dark' ? '#fca5a5' : 'white',
                                                        boxShadow: currentTheme === 'dark'
                                                            ? '0 0 12px rgba(220, 38, 38, 0.3)'
                                                            : '0 4px 12px rgba(220, 38, 38, 0.3)',
                                                    }}
                                                >
                                                    🗑️ Force Delete
                                                </motion.button>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>

            {}
            <AnimatePresence>
                {selectedAlerts.length > 0 && (
                    <BulkActionBar
                        selectedCount={selectedAlerts.length}
                        onAcknowledge={() => { }}
                        onArchive={() => { }}
                        onDelete={() => { }}
                        theme={currentTheme}
                    />
                )}
            </AnimatePresence>

            {}
            <AnimatePresence>
                {deleteModalOpen && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center px-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ background: modalStyles.overlay }}
                        onClick={() => setDeleteModalOpen(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={premiumTransition}
                            className="rounded-3xl shadow-2xl p-8 w-full max-w-md"
                            style={{
                                background: modalStyles.background,
                                border: modalStyles.border,
                                backdropFilter: 'blur(24px)',
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="text-center mb-6">
                                <motion.div
                                    className="text-6xl mb-4"
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 0.5 }}
                                >
                                    ⚠️
                                </motion.div>
                                <h2
                                    className="text-2xl font-bold mb-2"
                                    style={{ color: modalStyles.titleColor }}
                                >
                                    Permanent Deletion
                                </h2>
                                <p
                                    className="text-sm"
                                    style={{ color: modalStyles.textColor }}
                                >
                                    This action <strong className="text-red-500">cannot be undone</strong>.
                                    The alert will be permanently removed from the database.
                                </p>
                            </div>

                            {alertToDelete && (
                                <div
                                    className="rounded-xl p-4 mb-6"
                                    style={{
                                        background: modalStyles.dangerBg,
                                        border: `1px solid ${modalStyles.dangerBorder}`,
                                    }}
                                >
                                    <p
                                        className="font-semibold"
                                        style={{ color: modalStyles.titleColor }}
                                    >
                                        {alertToDelete.title}
                                    </p>
                                    <p
                                        className="text-xs mt-1"
                                        style={{ color: modalStyles.textColor }}
                                    >
                                        ID: {alertToDelete.id} | Priority: {alertToDelete.priority}
                                    </p>
                                </div>
                            )}

                            <div className="flex gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        setDeleteModalOpen(false);
                                        setAlertToDelete(null);
                                    }}
                                    disabled={deleting}
                                    className="flex-1 px-4 py-3 rounded-xl font-medium transition-colors"
                                    style={{
                                        background: currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#f3f4f6',
                                        color: currentTheme === 'dark' ? '#e5e7eb' : '#374151',
                                        border: currentTheme === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                                    }}
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={confirmForceDelete}
                                    disabled={deleting}
                                    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                                >
                                    {deleting ? 'Deleting...' : '🗑️ Delete Forever'}
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AlertHistory;
