import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useAlertStore from '../store/alertStore';
import useThemeStore from '../store/themeStore';
import useAuthStore from '../store/authStore';
import useEmergencyStore from '../store/emergencyStore';
import useAppSettings from '../hooks/useAppSettings';
import useEmergencyAlertEffect from '../hooks/useEmergencyAlertEffect.jsx';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import AlertCard from '../components/AlertCard';
import NotificationQueue from '../components/NotificationQueue';
import SearchBar from '../components/SearchBar';
import AdvancedFilters from '../components/AdvancedFilters';
import CriticalEmergencyOverlay from '../components/CriticalEmergencyOverlay';
import BulkDeleteModal from '../components/BulkDeleteModal';
import PanicButton from '../components/PanicButton';
import SplitViewToggle from '../components/SplitViewToggle';
import AlertDetailPanel from '../components/AlertDetailPanel';
import DynamicBanner from '../components/DynamicBanner';
import '../styles/split-view.css';


const getCriticalButtonThemeStyles = (theme, isActive) => {
    const styles = {
        light: {
            background: isActive
                ? 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)'
                : 'linear-gradient(135deg, #d0021b 0%, #ff4f4f 50%, #d0021b 100%)',
            boxShadow: isActive
                ? '0 0 24px rgba(22, 163, 74, 0.45), inset 0 1px 2px rgba(255,255,255,0.25)'
                : '0 0 30px rgba(208, 2, 27, 0.4), 0 12px 28px rgba(0, 0, 0, 0.14), inset 0 1px 2px rgba(255,255,255,0.2)',
        },
        dark: {
            background: isActive
                ? 'linear-gradient(135deg, #16a34a 0%, #14532d 100%)'
                : 'linear-gradient(135deg, #991b1b 0%, #dc2626 50%, #7f1d1d 100%)',
            boxShadow: isActive
                ? '0 0 32px rgba(22, 163, 74, 0.6), 0 0 0 1px rgba(255,255,255,0.1)'
                : '0 0 40px rgba(220, 38, 38, 0.5), 0 0 0 1px rgba(255,255,255,0.1), 0 12px 32px rgba(0, 0, 0, 0.4)',
        },
        glass: {
            background: isActive
                ? 'linear-gradient(135deg, rgba(22, 163, 74, 0.9) 0%, rgba(21, 128, 61, 0.85) 100%)'
                : 'linear-gradient(135deg, rgba(220, 38, 38, 0.9) 0%, rgba(185, 28, 28, 0.85) 100%)',
            boxShadow: isActive
                ? 'inset 0 1px 0 rgba(255,255,255,0.3), 0 0 32px rgba(22, 163, 74, 0.4), 0 8px 24px rgba(0, 0, 0, 0.15)'
                : 'inset 0 1px 0 rgba(255,255,255,0.3), 0 0 40px rgba(220, 38, 38, 0.4), 0 8px 24px rgba(0, 0, 0, 0.15)',
        },
        neo: {
            background: '#e8ecef',
            boxShadow: isActive
                ? `6px 6px 12px rgba(166, 180, 200, 0.4), -6px -6px 12px rgba(255, 255, 255, 0.9), inset 0 0 0 3px rgba(22, 163, 74, 0.8)`
                : `6px 6px 12px rgba(166, 180, 200, 0.4), -6px -6px 12px rgba(255, 255, 255, 0.9), inset 0 0 0 3px rgba(220, 38, 38, 0.8)`,
            textColor: isActive ? '#16a34a' : '#dc2626',
        },
    };
    return styles[theme] || styles.light;
};


const CriticalEmergencyButton = ({ isActive, onClick, currentTheme = 'light' }) => {
    const themeStyles = getCriticalButtonThemeStyles(currentTheme, isActive);
    const isNeo = currentTheme === 'neo';

    return (
        <motion.button
            animate={!isActive ? {
                scale: [1, 1.03, 1],
            } : {}}
            transition={!isActive ? {
                duration: 6,
                repeat: Infinity,
                ease: [0.22, 1, 0.36, 1],
            } : {}}
            whileHover={{
                scale: 1.04,
                y: -2,
                boxShadow: currentTheme === 'dark'
                    ? (isActive ? '0 0 48px rgba(22, 163, 74, 0.7)' : '0 0 56px rgba(220, 38, 38, 0.6), 0 16px 40px rgba(0, 0, 0, 0.5)')
                    : themeStyles.boxShadow,
            }}
            whileTap={{ scale: 0.96 }}
            onClick={onClick}
            className="relative overflow-hidden rounded-2xl px-6 py-4 flex-shrink-0"
            style={{
                background: themeStyles.background,
                boxShadow: themeStyles.boxShadow,
                transformStyle: isNeo ? 'preserve-3d' : 'flat',
            }}
        >
            {}
            {!isActive && (
                <motion.div
                    className="absolute inset-0 rounded-2xl"
                    style={{
                        border: currentTheme === 'dark' ? '1px solid rgba(220, 38, 38, 0.5)' : '2px solid rgba(255,255,255,0.4)',
                    }}
                    animate={{
                        opacity: [0.5, 0.2, 0.5],
                        scale: [1, 1.15, 1],
                        boxShadow: currentTheme === 'dark'
                            ? ['0 0 0 0 rgba(220, 38, 38, 0)', '0 0 24px 10px rgba(220, 38, 38, 0.4)', '0 0 0 0 rgba(220, 38, 38, 0)']
                            : ['0 0 0 0 rgba(208, 2, 27, 0)', '0 0 20px 8px rgba(208, 2, 27, 0.3)', '0 0 0 0 rgba(208, 2, 27, 0)'],
                    }}
                    transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                />
            )}

            {}
            <div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                    background: isNeo ? 'none' : 'radial-gradient(ellipse at center, rgba(255,255,255,0.15) 0%, transparent 70%)',
                }}
            />

            {}
            <motion.div
                className="relative z-10 flex flex-col items-center"
                whileHover={!isActive ? {
                    x: [0, 1, -1, 0.5, -0.5, 0],
                    transition: {
                        duration: 0.3,
                        repeat: Infinity,
                        ease: 'linear',
                    }
                } : {}}
            >
                <span
                    className="text-xs font-semibold tracking-widest flex items-center gap-1.5 mb-0.5"
                    style={{ color: isNeo ? themeStyles.textColor : 'rgba(255,255,255,0.9)' }}
                >
                    🚨 CRITICAL
                </span>
                <span
                    className="text-base font-bold tracking-wider"
                    style={{ color: isNeo ? themeStyles.textColor : 'white' }}
                >
                    {isActive ? 'DEACTIVATE' : 'EMERGENCY'}
                </span>
            </motion.div>
        </motion.button>
    );
};


const getGlassPillThemeStyles = (theme, isActive, variant) => {
    const styles = {
        light: {
            background: isActive
                ? 'rgba(233, 213, 255, 0.8)'
                : variant === 'danger'
                    ? 'rgba(254, 226, 226, 0.8)'
                    : 'rgba(255, 255, 255, 0.75)',
            border: isActive
                ? '1px solid rgba(168, 85, 247, 0.2)'
                : variant === 'danger'
                    ? '1px solid rgba(239, 68, 68, 0.15)'
                    : '1px solid rgba(168, 85, 247, 0.08)',
            color: isActive ? '#7c3aed' : variant === 'danger' ? '#dc2626' : '#374151',
        },
        dark: {
            background: isActive
                ? 'rgba(168, 85, 247, 0.2)'
                : variant === 'danger'
                    ? 'rgba(220, 38, 38, 0.15)'
                    : 'rgba(40, 40, 40, 0.8)',
            border: isActive
                ? '1px solid rgba(168, 85, 247, 0.4)'
                : variant === 'danger'
                    ? '1px solid rgba(220, 38, 38, 0.3)'
                    : '1px solid rgba(255, 255, 255, 0.08)',
            color: isActive ? '#c4b5fd' : variant === 'danger' ? '#fca5a5' : '#e5e7eb',
            boxShadow: isActive ? '0 0 16px rgba(168, 85, 247, 0.3)' : '0 4px 12px rgba(0,0,0,0.3)',
        },
        glass: {
            background: isActive
                ? 'rgba(168, 85, 247, 0.15)'
                : variant === 'danger'
                    ? 'rgba(220, 38, 38, 0.1)'
                    : 'rgba(255, 255, 255, 0.1)',
            border: isActive
                ? '1px solid rgba(168, 85, 247, 0.3)'
                : variant === 'danger'
                    ? '1px solid rgba(220, 38, 38, 0.2)'
                    : '1px solid rgba(255, 255, 255, 0.2)',
            color: isActive ? '#a855f7' : variant === 'danger' ? '#ef4444' : '#374151',
        },
        neo: {
            background: '#e8ecef',
            border: 'none',
            color: isActive ? '#7c3aed' : variant === 'danger' ? '#dc2626' : '#374151',
            boxShadow: isActive
                ? 'inset 2px 2px 4px rgba(166, 180, 200, 0.3), inset -2px -2px 4px rgba(255, 255, 255, 0.6)'
                : '3px 3px 6px rgba(166, 180, 200, 0.3), -3px -3px 6px rgba(255, 255, 255, 0.8)',
        },
    };
    return styles[theme] || styles.light;
};


const GlassPillButton = ({ icon, label, onClick, isActive = false, variant = 'default', currentTheme = 'light' }) => {
    const themeStyles = getGlassPillThemeStyles(currentTheme, isActive, variant);

    return (
        <motion.button
            whileHover={{
                scale: 1.02,
                y: -3,
                boxShadow: currentTheme === 'dark' && !isActive ? '0 8px 20px rgba(0,0,0,0.4)' : undefined,
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={onClick}
            className="px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2"
            style={{
                background: themeStyles.background,
                border: themeStyles.border,
                color: themeStyles.color,
                boxShadow: themeStyles.boxShadow || '0 2px 4px rgba(0,0,0,0.04)',
                backdropFilter: currentTheme === 'glass' ? 'blur(16px) saturate(180%)' : 'blur(12px)',
            }}
        >
            <span>{icon}</span>
            <span>{label}</span>
        </motion.button>
    );
};

const Dashboard = () => {
    const { alerts, loading, fetchAlerts, initWebSocket, queuedAlerts } = useAlertStore();
    const { theme, currentTheme } = useThemeStore();
    const { user, hasRole } = useAuthStore();
    const { isEmergencyActive, toggleEmergency } = useEmergencyStore();
    const {
        splitViewEnabled: settingsSplitView,
        layoutMode,
        layoutConfig,
        autoAcknowledgeOnOpen,
        getAnimationDuration,
        updateSetting,
    } = useAppSettings();

    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({});
    const [showFilters, setShowFilters] = useState(false);

    
    const [selectionMode, setSelectionMode] = useState(false);
    const [selectedAlerts, setSelectedAlerts] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    
    const [splitViewEnabled, setSplitViewEnabled] = useState(settingsSplitView);
    const [selectedAlertForDetail, setSelectedAlertForDetail] = useState(null);

    
    useEffect(() => {
        setSplitViewEnabled(settingsSplitView);
    }, [settingsSplitView]);

    const isAdmin = hasRole(['super_admin', 'college_admin']);
    const canUsePanicButton = hasRole(['super_admin', 'college_admin', 'faculty']);

    const handleSplitViewToggle = () => {
        const newValue = !splitViewEnabled;
        setSplitViewEnabled(newValue);
        updateSetting('splitViewEnabled', newValue);
    };

    
    useEffect(() => {
        if (queuedAlerts.length > 0) {
            const latestAlert = queuedAlerts[queuedAlerts.length - 1];
            useEmergencyAlertEffect(latestAlert);
        }
    }, [queuedAlerts]);

    useEffect(() => {
        const params = {
            search: searchTerm,
            ...filters
        };
        fetchAlerts(params);
        initWebSocket();
    }, [searchTerm, filters]);

    
    const getStatThemeStyles = (type) => {
        const iconBgStyles = {
            light: {
                total: 'bg-blue-50 text-blue-600',
                emergency: 'bg-red-50 text-red-600',
                important: 'bg-amber-50 text-amber-600',
                active: 'bg-green-50 text-green-600',
            },
            dark: {
                total: 'bg-blue-900/30 text-blue-400',
                emergency: 'bg-red-900/30 text-red-400',
                important: 'bg-amber-900/30 text-amber-400',
                active: 'bg-green-900/30 text-green-400',
            },
            glass: {
                total: 'bg-blue-500/10 text-blue-600',
                emergency: 'bg-red-500/10 text-red-600',
                important: 'bg-amber-500/10 text-amber-600',
                active: 'bg-green-500/10 text-green-600',
            },
            neo: {
                total: 'bg-blue-50 text-blue-600',
                emergency: 'bg-red-50 text-red-600',
                important: 'bg-amber-50 text-amber-600',
                active: 'bg-green-50 text-green-600',
            },
        };
        return (iconBgStyles[currentTheme] || iconBgStyles.light)[type];
    };

    const stats = [
        { label: 'Total Alerts', value: alerts.length, icon: '📢', type: 'total' },
        { label: 'Emergency', value: alerts.filter(a => a.priority === 'emergency').length, icon: '🚨', type: 'emergency' },
        { label: 'Important', value: alerts.filter(a => a.priority === 'important').length, icon: '⚠️', type: 'important' },
        { label: 'Active', value: alerts.filter(a => a.is_active).length, icon: '✅', type: 'active' },
    ];

    
    const getPageBackground = () => {
        const backgrounds = {
            light: 'bg-gradient-to-br from-gray-50 via-purple-50/30 to-gray-50',
            dark: 'bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a]',
            glass: 'bg-gradient-to-br from-gray-50/80 via-purple-50/20 to-blue-50/30',
            neo: 'bg-[#e8ecef]',
        };
        return backgrounds[currentTheme] || backgrounds.light;
    };

    return (
        <div className={`min-h-screen ${getPageBackground()} ambient-glow-bg`}>
            <Navbar />
            <DynamicBanner />
            <NotificationQueue />
            <CriticalEmergencyOverlay />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {}
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="mb-8"
                >
                    <h1
                        className="text-3xl font-semibold mb-1 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-clip-text text-transparent"
                        style={{ letterSpacing: '0.5px' }}
                    >
                        Dashboard
                    </h1>
                    <p
                        className="text-sm"
                        style={{
                            letterSpacing: '0.3px',
                            color: currentTheme === 'dark' ? '#9ca3af' : '#6b7280',
                        }}
                    >
                        Real-time campus alerts and notifications
                    </p>
                </motion.div>

                {}
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-wrap items-center gap-4 mb-10"
                >
                    {}
                    <div className="flex-1 min-w-[200px]">
                        <SearchBar onSearch={setSearchTerm} />
                    </div>

                    {}
                    <GlassPillButton
                        icon="🔍"
                        label="Filters"
                        onClick={() => setShowFilters(true)}
                        currentTheme={currentTheme}
                    />

                    {}
                    {isAdmin && (
                        <CriticalEmergencyButton
                            isActive={isEmergencyActive}
                            onClick={() => toggleEmergency(user?.id)}
                            currentTheme={currentTheme}
                        />
                    )}
                </motion.div>

                {showFilters && (
                    <AdvancedFilters
                        onApplyFilters={setFilters}
                        onClose={() => setShowFilters(false)}
                    />
                )}

                {}
                <div className={`grid ${layoutConfig.gridCols} ${layoutConfig.gap} mb-10`}>
                    {stats.map((stat, index) => (
                        <Card
                            key={stat.label}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p
                                        className="text-sm font-medium mb-1.5"
                                        style={{ color: currentTheme === 'dark' ? '#9ca3af' : '#6b7280' }}
                                    >
                                        {stat.label}
                                    </p>
                                    <p
                                        className="text-4xl font-bold"
                                        style={{ color: currentTheme === 'dark' ? '#f1f5f9' : '#111827' }}
                                    >
                                        {stat.value}
                                    </p>
                                </div>
                                <div className={`p-3 rounded-xl ${getStatThemeStyles(stat.type)}`}>
                                    <span className="text-2xl">{stat.icon}</span>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {}
                <div>
                    {}
                    <div className="flex items-center justify-between mb-5">
                        <h2
                            className="text-xl font-medium"
                            style={{
                                letterSpacing: '0.5px',
                                color: currentTheme === 'dark' ? '#f1f5f9' : '#111827',
                            }}
                        >
                            Recent Alerts
                        </h2>

                        {}
                        <div
                            className="flex items-center gap-1 p-1.5 rounded-2xl"
                            style={{
                                background: currentTheme === 'dark'
                                    ? 'rgba(30, 30, 30, 0.8)'
                                    : currentTheme === 'neo'
                                        ? '#e8ecef'
                                        : 'rgba(255, 255, 255, 0.8)',
                                backdropFilter: currentTheme === 'neo' ? 'none' : 'blur(16px)',
                                border: currentTheme === 'dark'
                                    ? '1px solid rgba(255, 255, 255, 0.08)'
                                    : currentTheme === 'neo'
                                        ? 'none'
                                        : '1px solid rgba(168, 85, 247, 0.1)',
                                boxShadow: currentTheme === 'dark'
                                    ? '0 8px 24px rgba(0, 0, 0, 0.3)'
                                    : currentTheme === 'neo'
                                        ? '4px 4px 8px rgba(166, 180, 200, 0.3), -4px -4px 8px rgba(255, 255, 255, 0.8)'
                                        : '0 8px 16px rgba(0, 0, 0, 0.08)',
                            }}
                        >
                            {}
                            <div className="flex items-center gap-2 px-3 py-2">
                                <span
                                    className="text-xs font-medium"
                                    style={{ color: currentTheme === 'dark' ? '#9ca3af' : '#6b7280' }}
                                >
                                    View:
                                </span>
                                <SplitViewToggle
                                    enabled={splitViewEnabled}
                                    onToggle={handleSplitViewToggle}
                                />
                            </div>

                            {}
                            {isAdmin && <div className="w-px h-5" style={{ background: currentTheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />}

                            {}
                            {isAdmin && (
                                <>
                                    {selectionMode ? (
                                        <>
                                            <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm cursor-pointer hover:bg-white/50 transition-colors">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedAlerts.length === alerts.length && alerts.length > 0}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedAlerts(alerts.map(a => a.id));
                                                        } else {
                                                            setSelectedAlerts([]);
                                                        }
                                                    }}
                                                    className="w-4 h-4 rounded"
                                                    style={{ accentColor: '#a855f7' }}
                                                />
                                                <span className="font-medium" style={{ color: currentTheme === 'dark' ? '#e5e7eb' : '#374151' }}>All</span>
                                            </label>

                                            {selectedAlerts.length > 0 && (
                                                <span className="text-xs text-purple-600 font-semibold px-2 py-1 bg-purple-50 rounded-lg">
                                                    {selectedAlerts.length} selected
                                                </span>
                                            )}

                                            <motion.button
                                                whileHover={{ scale: 1.03 }}
                                                whileTap={{ scale: 0.97 }}
                                                onClick={() => setShowDeleteModal(true)}
                                                className={`px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5 transition-colors ${selectedAlerts.length > 0
                                                    ? 'bg-red-100 text-red-600 hover:bg-red-200'
                                                    : 'text-gray-500 hover:bg-white/50'
                                                    }`}
                                            >
                                                <span>🗑️</span>
                                                <span>Delete</span>
                                            </motion.button>

                                            <button
                                                onClick={() => {
                                                    setSelectionMode(false);
                                                    setSelectedAlerts([]);
                                                }}
                                                className="px-3 py-2 text-xs text-gray-500 hover:text-gray-700 hover:bg-white/50 rounded-xl transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <motion.button
                                            whileHover={{ scale: 1.03, backgroundColor: 'rgba(255,255,255,0.8)' }}
                                            whileTap={{ scale: 0.97 }}
                                            onClick={() => setSelectionMode(true)}
                                            className="px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5"
                                            style={{ color: currentTheme === 'dark' ? '#e5e7eb' : '#374151' }}
                                        >
                                            <span>☑️</span>
                                            <span>Select</span>
                                        </motion.button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {}
                    <div className={splitViewEnabled ? 'split-view-container' : ''}>
                        {}
                        <div className={splitViewEnabled ? 'split-view-left' : ''}>
                            {loading ? (
                                <div className="text-center py-16">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        className="text-5xl mb-4 inline-block"
                                    >
                                        ⏳
                                    </motion.div>
                                    <p style={{ color: currentTheme === 'dark' ? '#9ca3af' : '#6b7280' }}>Loading alerts...</p>
                                </div>
                            ) : alerts.length === 0 ? (
                                <div className="bg-white/80 p-16 rounded-2xl text-center backdrop-blur-sm border border-gray-100">
                                    <div className="text-6xl mb-4">📭</div>
                                    <p style={{ color: currentTheme === 'dark' ? '#9ca3af' : '#6b7280' }}>No alerts yet</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <AnimatePresence mode="popLayout">
                                        {alerts.map((alert, index) => (
                                            <motion.div
                                                key={alert.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, x: -100 }}
                                                transition={{
                                                    delay: index * 0.08,
                                                    duration: 0.4,
                                                    ease: [0.16, 1, 0.3, 1]
                                                }}
                                                onClick={() => splitViewEnabled && setSelectedAlertForDetail(alert)}
                                                style={{ cursor: splitViewEnabled ? 'pointer' : 'default' }}
                                            >
                                                <AlertCard
                                                    alert={alert}
                                                    selectable={selectionMode}
                                                    isSelected={selectedAlerts.includes(alert.id)}
                                                    onSelect={(id, checked) => {
                                                        if (checked) {
                                                            setSelectedAlerts(prev => [...prev, id]);
                                                        } else {
                                                            setSelectedAlerts(prev => prev.filter(aid => aid !== id));
                                                        }
                                                    }}
                                                />
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>

                        {}
                        {splitViewEnabled && (
                            <AlertDetailPanel
                                alert={selectedAlertForDetail}
                                onClose={() => setSelectedAlertForDetail(null)}
                            />
                        )}
                    </div>
                </div>
            </div>

            {}
            <BulkDeleteModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                selectedAlerts={selectedAlerts}
                onDeleteComplete={() => {
                    setSelectionMode(false);
                    setSelectedAlerts([]);
                }}
            />

            {}
            {canUsePanicButton && (
                <PanicButton
                    onEmergencyDispatch={() => {
                        fetchAlerts();
                    }}
                />
            )}
        </div>
    );
};

export default Dashboard;
