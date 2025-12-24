
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import useThemeStore from '../store/themeStore';
import useSettingsStore from '../store/settingsStore';
import useAuthStore from '../store/authStore';
import Navbar from '../components/Navbar';
import ThemeEditor from '../components/ThemeEditor';
import PreviewContainer from '../components/PreviewContainer';
import PreviewContent from '../components/PreviewContent';
import SettingsPreviewPane from '../components/SettingsPreviewPane';
import usePreviewManager, { PREVIEW_MODES } from '../hooks/usePreviewManager';
import { pageTransition, fadeInUp, staggerContainer } from '../animations/pageTransitions';
import { getTextColors } from '../utils/page-theme';


const playPreviewSound = (soundStyle, volume = 0.5) => {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        const sounds = {
            water: { freq: 600, duration: 0.12, type: 'sine' },
            digital: { freq: 880, duration: 0.08, type: 'square' },
            glass: { freq: 1200, duration: 0.1, type: 'sine' },
            click: { freq: 400, duration: 0.05, type: 'triangle' },
        };

        const sound = sounds[soundStyle] || sounds.glass;
        oscillator.type = sound.type;
        oscillator.frequency.value = sound.freq;
        gainNode.gain.value = volume * 0.1;

        oscillator.start();
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + sound.duration);
        oscillator.stop(ctx.currentTime + sound.duration);
    } catch (e) {
        }
};


const ToggleSwitch = ({ enabled, onChange, size = 'md' }) => {
    const sizes = {
        sm: { width: 40, height: 22, knob: 16 },
        md: { width: 52, height: 28, knob: 22 },
        lg: { width: 64, height: 34, knob: 28 },
    };
    const s = sizes[size];

    return (
        <motion.button
            onClick={() => onChange(!enabled)}
            className="relative rounded-full p-0.5 cursor-pointer"
            style={{
                width: s.width,
                height: s.height,
                background: enabled
                    ? 'linear-gradient(135deg, #a855f7 0%, #8b5cf6 100%)'
                    : 'rgba(0,0,0,0.1)',
                boxShadow: enabled
                    ? '0 0 15px rgba(168, 85, 247, 0.3)'
                    : 'inset 0 2px 4px rgba(0,0,0,0.1)',
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <motion.div
                className="rounded-full bg-white shadow-md"
                style={{ width: s.knob, height: s.knob }}
                animate={{ x: enabled ? s.width - s.knob - 4 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
        </motion.button>
    );
};


const Slider = ({ value, onChange, min = 0, max = 1, step = 0.1, label }) => {
    return (
        <div className="flex items-center gap-4 w-full">
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
                style={{
                    background: `linear-gradient(to right, #a855f7 0%, #a855f7 ${value * 100}%, rgba(0,0,0,0.1) ${value * 100}%, rgba(0,0,0,0.1) 100%)`,
                }}
            />
            {label && <span className="text-xs text-gray-500 w-12 text-right">{label}</span>}
        </div>
    );
};


const OptionSelector = ({ options, value, onChange, columns = 2 }) => {
    const { currentTheme } = useThemeStore();

    const getButtonStyle = (isSelected) => {
        if (currentTheme === 'dark') {
            return isSelected ? {
                background: 'rgba(122, 92, 255, 0.2)',
                color: '#B8AAFF',
                border: '2px solid rgba(122, 92, 255, 0.4)',
            } : {
                background: 'rgba(255, 255, 255, 0.04)',
                color: '#8A8A94',
                border: '1px solid rgba(255, 255, 255, 0.08)',
            };
        }
        if (currentTheme === 'glass') {
            return isSelected ? {
                background: 'rgba(168, 85, 247, 0.15)',
                color: '#7C3AED',
                border: '2px solid rgba(168, 85, 247, 0.3)',
                backdropFilter: 'blur(12px)',
            } : {
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#374151',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(8px)',
            };
        }
        if (currentTheme === 'neo') {
            return isSelected ? {
                background: '#E4E8EB',
                color: '#7C3AED',
                border: 'none',
                boxShadow: 'inset 3px 3px 6px rgba(166, 180, 200, 0.25), inset -3px -3px 6px rgba(255, 255, 255, 0.7)',
            } : {
                background: '#E4E8EB',
                color: '#4A5568',
                border: 'none',
                boxShadow: '4px 4px 8px rgba(166, 180, 200, 0.25), -4px -4px 8px rgba(255, 255, 255, 0.7)',
            };
        }
        
        return isSelected ? {
            background: '#F3E8FF',
            color: '#7C3AED',
            border: '2px solid #D8B4FE',
        } : {
            background: 'rgba(255, 255, 255, 0.5)',
            color: '#4B5563',
            border: '1px solid #E5E7EB',
        };
    };

    return (
        <div className={`grid gap-2`} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {options.map((option) => (
                <motion.button
                    key={option.value}
                    onClick={() => onChange(option.value)}
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-3 rounded-xl text-sm font-medium text-left transition-all duration-150"
                    style={getButtonStyle(value === option.value)}
                >
                    <span className="mr-2">{option.icon}</span>
                    {option.label}
                </motion.button>
            ))}
        </div>
    );
};


const SyncStatusIndicator = ({ status, lastSynced }) => {
    const statusConfig = {
        idle: { color: 'gray', text: 'Not synced', icon: '○' },
        syncing: { color: 'purple', text: 'Syncing', icon: '◐', animate: true },
        synced: { color: 'green', text: 'Synced ✓', icon: '●' },
        offline: { color: 'gray', text: 'Offline – using locally saved mode', icon: '◌' },
        conflict: { color: 'amber', text: 'Sync conflict', icon: '⚠' },
    };

    const config = statusConfig[status] || statusConfig.idle;

    return (
        <motion.div
            className={`
                flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium
                ${config.color === 'green' ? 'bg-green-50 text-green-600' : ''}
                ${config.color === 'purple' ? 'bg-purple-50 text-purple-600' : ''}
                ${config.color === 'gray' ? 'bg-gray-100 text-gray-500' : ''}
                ${config.color === 'amber' ? 'bg-amber-50 text-amber-600' : ''}
            `}
            animate={config.animate ? { opacity: [1, 0.5, 1] } : {}}
            transition={config.animate ? { duration: 1, repeat: Infinity } : {}}
        >
            <span>{config.icon}</span>
            <span>{config.text}</span>
            {status === 'synced' && lastSynced && (
                <span className="text-gray-400 ml-1">
                    {new Date(lastSynced).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            )}
        </motion.div>
    );
};


const getSettingsCardStyles = (currentTheme) => {
    const styles = {
        light: {
            container: {
                background: 'rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(20px) saturate(180%)',
                border: '1px solid rgba(168, 85, 247, 0.1)',
                boxShadow: '0 8px 32px rgba(168, 85, 247, 0.06)',
            },
            hoverBg: 'rgba(168, 85, 247, 0.03)',
            iconBg: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
            divider: 'rgba(0, 0, 0, 0.08)',
            textPrimary: '#111827',
            textMuted: '#6B7280',
            badge: { bg: '#F3E8FF', color: '#7C3AED' },
        },
        dark: {
            container: {
                background: '#1D1F27',
                backdropFilter: 'none',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.04)',
            },
            hoverBg: 'rgba(122, 92, 255, 0.08)',
            iconBg: 'linear-gradient(135deg, rgba(122, 92, 255, 0.15) 0%, rgba(76, 234, 255, 0.1) 100%)',
            divider: 'rgba(255, 255, 255, 0.06)',
            textPrimary: '#ECECEC',
            textMuted: '#5C5C66',
            badge: { bg: 'rgba(122, 92, 255, 0.2)', color: '#B8AAFF' },
        },
        glass: {
            container: {
                background: 'rgba(255, 255, 255, 0.18)',
                backdropFilter: 'blur(24px) saturate(180%)',
                WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                border: '1.5px solid rgba(255, 255, 255, 0.24)',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.5), 0 8px 32px rgba(0, 0, 0, 0.08)',
            },
            hoverBg: 'rgba(168, 85, 247, 0.05)',
            iconBg: 'linear-gradient(135deg, rgba(168, 85, 247, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%)',
            divider: 'rgba(255, 255, 255, 0.15)',
            textPrimary: '#0A0A0A',
            textMuted: '#6B7280',
            badge: { bg: 'rgba(168, 85, 247, 0.15)', color: '#7C3AED' },
        },
        neo: {
            container: {
                background: '#E4E8EB',
                backdropFilter: 'none',
                border: 'none',
                boxShadow: '8px 15px 24px rgba(166, 180, 200, 0.28), -6px -6px 16px rgba(255, 255, 255, 0.85)',
            },
            hoverBg: 'rgba(168, 85, 247, 0.04)',
            iconBg: '#E4E8EB',
            iconShadow: 'inset 3px 3px 6px rgba(166, 180, 200, 0.25), inset -3px -3px 6px rgba(255, 255, 255, 0.7)',
            divider: 'rgba(166, 180, 200, 0.2)',
            textPrimary: '#1A1D21',
            textMuted: '#718096',
            badge: { bg: 'rgba(168, 85, 247, 0.1)', color: '#7C3AED' },
        },
    };
    return styles[currentTheme] || styles.light;
};


const SettingsCard = ({ title, icon, description, children, defaultOpen = true, badge }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const { theme, currentTheme } = useThemeStore();
    const styles = getSettingsCardStyles(currentTheme);

    return (
        <motion.div
            layout
            className="rounded-3xl overflow-hidden"
            style={styles.container}
        >
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-6 flex items-center justify-between text-left"
                whileHover={{ backgroundColor: styles.hoverBg }}
                transition={{ duration: 0.15 }}
            >
                <div className="flex items-center gap-4">
                    <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                        style={{
                            background: styles.iconBg,
                            ...(styles.iconShadow && { boxShadow: styles.iconShadow }),
                            ...(currentTheme === 'dark' && { filter: 'drop-shadow(0 0 8px rgba(122, 92, 255, 0.3))' }),
                        }}
                    >
                        {icon}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3
                                className="text-lg font-semibold"
                                style={{ color: styles.textPrimary }}
                            >
                                {title}
                            </h3>
                            {badge && (
                                <span
                                    className="px-2 py-0.5 rounded-full text-xs font-medium"
                                    style={{
                                        backgroundColor: styles.badge.bg,
                                        color: styles.badge.color
                                    }}
                                >
                                    {badge}
                                </span>
                            )}
                        </div>
                        {description && (
                            <p
                                className="text-sm"
                                style={{ color: styles.textMuted }}
                            >
                                {description}
                            </p>
                        )}
                    </div>
                </div>
                <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ color: styles.textMuted }}
                >
                    ▼
                </motion.span>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div
                            className="px-6 pb-6 pt-2 space-y-6"
                            style={{ borderTop: `1px solid ${styles.divider}` }}
                        >
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};


const SettingRow = ({ label, description, children }) => {
    const { currentTheme } = useThemeStore();
    const styles = getSettingsCardStyles(currentTheme);

    return (
        <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
                <p
                    className="text-sm font-medium"
                    style={{ color: styles.textPrimary }}
                >
                    {label}
                </p>
                {description && (
                    <p
                        className="text-xs mt-0.5"
                        style={{ color: styles.textMuted }}
                    >
                        {description}
                    </p>
                )}
            </div>
            <div className="flex-shrink-0">
                {children}
            </div>
        </div>
    );
};


const ThemePreviewCard = ({ themeName, themeData, isSelected, isPreview, onSelect, onPreview }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className={`
                relative rounded-2xl overflow-hidden cursor-pointer
                transition-all duration-300
                ${isSelected ? 'ring-2 ring-purple-500 ring-offset-2' : ''}
                ${isPreview ? 'ring-2 ring-amber-400 ring-offset-2' : ''}
            `}
            onClick={() => onPreview(themeName)}
        >
            {}
            <div
                className="h-24 w-full"
                style={{ background: themeData.preview }}
            >
                {}
                <motion.div
                    className="absolute top-4 left-4 w-6 h-6 rounded-full"
                    style={{ background: themeData.accent || '#a855f7', opacity: 0.6 }}
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.4, 0.6, 0.4],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                    className="absolute bottom-4 right-4 w-4 h-4 rounded-full"
                    style={{ background: themeData.accent || '#a855f7', opacity: 0.4 }}
                    animate={{
                        y: [0, -5, 0],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                />
            </div>

            {}
            <div className="p-3 bg-white/80 backdrop-blur-sm">
                <p className="font-medium text-sm text-gray-800">{themeData.name}</p>
                <p className="text-xs text-gray-500">{themeData.description}</p>
            </div>

            {}
            {isSelected && (
                <div className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium bg-purple-500 text-white">
                    Active
                </div>
            )}
            {isPreview && !isSelected && (
                <div className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium bg-amber-500 text-white">
                    Preview
                </div>
            )}
            {themeData.hidden && (
                <div className="absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium bg-gray-800 text-white">
                    🔒 Hidden
                </div>
            )}
            {themeData.isCustom && (
                <div className="absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium bg-pink-500 text-white">
                    ✨ Custom
                </div>
            )}
        </motion.div>
    );
};

const Settings = () => {
    const { theme, currentTheme } = useThemeStore();
    const { isAuthenticated } = useAuthStore();
    const settings = useSettingsStore();

    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    const [showConflictModal, setShowConflictModal] = useState(false);
    const [showThemeEditor, setShowThemeEditor] = useState(false);
    const [importText, setImportText] = useState('');
    const [saveIndicator, setSaveIndicator] = useState(false);
    const textColors = getTextColors(currentTheme);

    
    const [pendingSettings, setPendingSettings] = useState({});
    const hasPendingChanges = Object.keys(pendingSettings).length > 0;

    
    const preview = usePreviewManager();

    
    useEffect(() => {
        settings.initSettings(isAuthenticated);
    }, [isAuthenticated]);

    
    useEffect(() => {
        if (settings.syncStatus === 'conflict') {
            setShowConflictModal(true);
        }
    }, [settings.syncStatus]);

    
    const handleSettingChange = useCallback((key, value) => {
        settings.updateSetting(key, value);
        
        const settingLabels = {
            interfaceSounds: value ? '🔊 Interface sounds enabled' : '🔇 Interface sounds disabled',
            loginSound: value ? '🔔 Login sound enabled' : '🔕 Login sound disabled',
            notificationPopups: value ? '📬 Notification popups enabled' : '📭 Notification popups disabled',
            urgentShake: value ? '📳 Urgent shake enabled' : '📴 Urgent shake disabled',
            reducedEmergencyMotion: value ? '🌙 Reduced motion enabled' : '✨ Full motion enabled',
            silentEmergencyMode: value ? '🔕 Silent mode enabled' : '🔔 Sound mode enabled',
            autoAcknowledgeOnOpen: value ? '✅ Auto-acknowledge enabled' : '❌ Manual acknowledge',
            splitViewEnabled: value ? '📐 Split view enabled' : '📱 Single view mode',
            autoCollapseSidebar: value ? '📁 Auto-collapse enabled' : '📂 Sidebar always visible',
        };
        const label = settingLabels[key] || `Setting updated: ${key}`;
        toast.success(label, { duration: 1500 });
        setSaveIndicator(true);
        setTimeout(() => setSaveIndicator(false), 1500);
    }, [settings]);

    
    const handleSettingWithPreview = useCallback((mode, key, value) => {
        settings.updateSetting(key, value);
        preview.triggerPreview(mode, { [key]: value });
        
        const labels = {
            cursorGravity: value ? '🧲 Cursor gravity ON' : '⭕ Cursor gravity OFF',
            parallaxBackground: value ? '🌊 Parallax enabled' : '⏹️ Parallax disabled',
            physicsStrength: `⚡ Physics: ${value}`,
            animationSpeed: `🏃 Speed: ${value}`,
            hapticFeedback: value ? '📳 Haptic enabled' : '📴 Haptic disabled',
            spatialModeEnabled: value ? '🌌 Spatial mode ON' : '📱 Spatial mode OFF',
            spatialMotionIntensity: `✨ Spatial motion: ${value}`,
            spatialDepthBlur: `🔍 Blur: ${Math.round(value * 100)}%`,
            spatialParallax: value ? '🌈 Spatial parallax ON' : '⏹️ Spatial parallax OFF',
            layoutMode: `📐 Layout: ${value}`,
            splitViewEnabled: value ? '📺 Split view ON' : '📱 Single view',
            reactionAnimation: `🎭 Reactions: ${value}`,
            emergencyVisualMode: `🚨 Emergency style: ${value}`,
            soundStyle: `🎵 Sound: ${value}`,
            theme: `🎨 Theme: ${value}`,
        };
        toast.success(labels[key] || `Updated: ${key}`, { duration: 1500 });
        setSaveIndicator(true);
        setTimeout(() => setSaveIndicator(false), 1500);
    }, [preview, settings]);

    
    const handleSaveSettings = useCallback(async () => {
        
        Object.entries(pendingSettings).forEach(([key, value]) => {
            settings.updateSetting(key, value);
        });
        preview.applyChanges();

        
        if (isAuthenticated) {
            await settings.syncToServer();
        }

        
        setPendingSettings({});
        setSaveIndicator(true);
        setTimeout(() => setSaveIndicator(false), 2000);
        toast.success('✓ Settings saved successfully!');
    }, [pendingSettings, preview, settings, isAuthenticated]);

    
    const handleResetToDefaults = useCallback(() => {
        setPendingSettings({});
        settings.resetAllSettings();
        preview.applyChanges();
        toast('Settings reset to defaults', { icon: '🔄' });
    }, [settings, preview]);

    
    const handleExport = () => {
        const data = settings.exportSettings();
        navigator.clipboard.writeText(data);
        setShowExportModal(true);
        setTimeout(() => setShowExportModal(false), 2000);
    };

    
    const handleImport = () => {
        if (settings.importSettings(importText)) {
            setImportText('');
            setSaveIndicator(true);
            setTimeout(() => setSaveIndicator(false), 1500);
        }
    };

    
    const allThemes = settings.getAllThemes();

    
    const physicsOptions = [
        { value: 'off', label: 'Off', icon: '⭕' },
        { value: 'soft', label: 'Soft', icon: '🌊' },
        { value: 'medium', label: 'Medium', icon: '💫' },
        { value: 'strong', label: 'Strong', icon: '⚡' },
    ];

    const speedOptions = [
        { value: 'slow', label: 'Slow', icon: '🐢' },
        { value: 'normal', label: 'Normal', icon: '🚶' },
        { value: 'fast', label: 'Fast', icon: '🚀' },
    ];

    const soundStyleOptions = [
        { value: 'water', label: 'Water Droplet', icon: '💧' },
        { value: 'digital', label: 'Digital Beep', icon: '📟' },
        { value: 'glass', label: 'Glass Tap', icon: '🔔' },
        { value: 'click', label: 'Quiet Click', icon: '👆' },
    ];

    const emergencyModeOptions = [
        { value: 'basic', label: 'Basic', icon: '📢' },
        { value: 'enhanced', label: 'Enhanced', icon: '⚠️' },
        { value: 'cinematic', label: 'Cinematic', icon: '🎬' },
    ];

    const reactionOptions = [
        { value: 'none', label: 'None', icon: '⭕' },
        { value: 'soft', label: 'Soft', icon: '🌸' },
        { value: 'bounce', label: 'Bounce', icon: '🎾' },
        { value: 'confetti', label: 'Confetti', icon: '🎊' },
    ];

    const layoutOptions = [
        { value: 'compact', label: 'Compact', icon: '📱' },
        { value: 'standard', label: 'Standard', icon: '💻' },
        { value: 'immersive', label: 'Immersive', icon: '🖥️' },
    ];

    const spatialMotionOptions = [
        { value: 'off', label: 'Off', icon: '⭕' },
        { value: 'reduced', label: 'Reduced', icon: '🌙' },
        { value: 'full', label: 'Full', icon: '✨' },
    ];

    return (
        <div
            className="min-h-screen transition-colors duration-300"
            style={{
                background: currentTheme === 'dark'
                    ? 'linear-gradient(145deg, #0F0F12 0%, #181A22 50%, #0F0F12 100%)'
                    : currentTheme === 'glass'
                        ? 'linear-gradient(145deg, rgba(245, 248, 255, 0.92) 0%, rgba(255, 255, 255, 0.85) 30%, rgba(235, 240, 255, 0.9) 70%, rgba(245, 250, 255, 0.95) 100%)'
                        : currentTheme === 'neo'
                            ? 'linear-gradient(145deg, #E8ECEF 0%, #DDE2E6 50%, #E4E8EB 100%)'
                            : 'linear-gradient(135deg, #faf5ff 0%, #f5f3ff 100%)'
            }}
        >
            <Navbar />

            {}
            <AnimatePresence>
                {saveIndicator && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full text-sm font-medium"
                        style={{
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            color: 'white',
                            boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)',
                        }}
                    >
                        ✓ Settings saved
                    </motion.div>
                )}
            </AnimatePresence>

            {}
            <AnimatePresence>
                {showExportModal && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl text-sm font-medium"
                        style={{
                            background: 'linear-gradient(135deg, #a855f7 0%, #8b5cf6 100%)',
                            color: 'white',
                            boxShadow: '0 8px 32px rgba(168, 85, 247, 0.4)',
                        }}
                    >
                        📋 Settings copied to clipboard!
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                variants={pageTransition}
                initial="initial"
                animate="animate"
                exit="exit"
                className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
            >
                {}
                <motion.div variants={fadeInUp} className="mb-8 flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                            Settings
                        </h1>
                        <p style={{ color: textColors.muted }}>
                            Personalize your PulseLink experience
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {isAuthenticated && (
                            <SyncStatusIndicator
                                status={settings.syncStatus}
                                lastSynced={settings.lastSynced}
                            />
                        )}
                        {}
                        <AnimatePresence>
                            {hasPendingChanges && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="flex items-center gap-2"
                                >
                                    <motion.button
                                        onClick={handleSaveSettings}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="px-5 py-2 rounded-xl text-sm font-semibold text-white"
                                        style={{
                                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                                        }}
                                    >
                                        💾 Save Settings
                                    </motion.button>
                                    <motion.button
                                        onClick={handleResetToDefaults}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200"
                                    >
                                        🔄 Reset
                                    </motion.button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {}
                    <motion.div variants={staggerContainer} className="lg:col-span-2 space-y-6">

                        {}
                        <motion.div variants={fadeInUp}>
                            <SettingsCard
                                title="Theme & Appearance"
                                icon="🎨"
                                description="Choose your visual style"
                            >
                                {}
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {Object.entries(allThemes).map(([key, themeData]) => (
                                        <ThemePreviewCard
                                            key={key}
                                            themeName={key}
                                            themeData={themeData}
                                            isSelected={settings.theme === key}
                                            isPreview={settings.themePreview === key}
                                            onSelect={() => handleSettingChange('theme', key)}
                                            onPreview={(name) => {
                                                settings.previewTheme(name);
                                                handleSettingWithPreview(PREVIEW_MODES.THEME, 'theme', name);
                                            }}
                                        />
                                    ))}
                                </div>

                                {}
                                <div className="flex flex-wrap gap-3 pt-4">
                                    {settings.themePreview && (
                                        <>
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => {
                                                    handleSettingChange('theme', settings.themePreview);
                                                    settings.cancelPreview();
                                                }}
                                                className="px-6 py-2 rounded-xl font-medium text-white"
                                                style={{
                                                    background: 'linear-gradient(135deg, #a855f7 0%, #8b5cf6 100%)',
                                                }}
                                            >
                                                ✓ Apply Theme
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => settings.cancelPreview()}
                                                className="px-6 py-2 rounded-xl font-medium text-gray-600 bg-gray-100"
                                            >
                                                Cancel
                                            </motion.button>
                                        </>
                                    )}
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setShowThemeEditor(true)}
                                        className="px-6 py-2 rounded-xl font-medium text-pink-600 bg-pink-50 hover:bg-pink-100"
                                    >
                                        ✨ Open Theme Editor
                                    </motion.button>
                                </div>
                            </SettingsCard>
                        </motion.div>

                        {}
                        <motion.div variants={fadeInUp}>
                            <SettingsCard
                                title="Avatar Style"
                                icon="🎭"
                                description="Choose your premium avatar gradient"
                                badge="NEW"
                            >
                                <div className="space-y-4">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Your avatar displays a role-based icon with your chosen gradient background.
                                    </p>

                                    {}
                                    <div className="flex flex-wrap gap-3 items-center justify-center py-4">
                                        {[
                                            { id: 'aurora', name: 'Aurora Mist', gradient: 'linear-gradient(135deg, #E0F2FE 0%, #DDD6FE 50%, #C7D2FE 100%)' },
                                            { id: 'plum', name: 'Neo Plum', gradient: 'linear-gradient(135deg, #E9D5FF 0%, #FBCFE8 50%, #FED7E2 100%)' },
                                            { id: 'silver', name: 'Silver Frost', gradient: 'linear-gradient(135deg, #FFFFFF 0%, #F1F5F9 50%, #E2E8F0 100%)' },
                                            { id: 'arctic', name: 'Arctic Cyan', gradient: 'linear-gradient(135deg, #CCFBF1 0%, #A5F3FC 50%, #BAE6FD 100%)' },
                                            { id: 'iris', name: 'Midnight Iris', gradient: 'linear-gradient(135deg, #C7D2FE 0%, #DDD6FE 50%, #E9D5FF 100%)' },
                                        ].map((preset) => (
                                            <motion.button
                                                key={preset.id}
                                                onClick={() => handleSettingChange('avatarGradient', preset.id)}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.95 }}
                                                className={`relative rounded-full p-0.5 transition-all duration-200 ${settings.avatarGradient === preset.id
                                                    ? 'ring-2 ring-purple-500 ring-offset-2'
                                                    : 'ring-1 ring-transparent hover:ring-gray-300'
                                                    }`}
                                                title={preset.name}
                                            >
                                                <div
                                                    className="w-14 h-14 rounded-full flex items-center justify-center"
                                                    style={{ background: preset.gradient }}
                                                >
                                                    <span className="text-2xl">
                                                        {preset.id === 'aurora' ? '🏔️' :
                                                            preset.id === 'plum' ? '🍇' :
                                                                preset.id === 'silver' ? '❄️' :
                                                                    preset.id === 'arctic' ? '🧊' : '💜'}
                                                    </span>
                                                </div>
                                                {settings.avatarGradient === preset.id && (
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        className="absolute -bottom-1 -right-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center"
                                                    >
                                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </motion.div>
                                                )}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            </SettingsCard>
                        </motion.div>

                        {}
                        <motion.div variants={fadeInUp}>
                            <SettingsCard
                                title="Spatial Mode"
                                icon="🌌"
                                description="VisionOS-style floating glass interface"
                                badge="NEW"
                            >
                                <SettingRow
                                    label="Enable Spatial Mode"
                                    description="Transform UI into floating glass surfaces with depth"
                                >
                                    <ToggleSwitch
                                        enabled={settings.spatialModeEnabled}
                                        onChange={(v) => handleSettingWithPreview(PREVIEW_MODES.SPATIAL, 'spatialModeEnabled', v)}
                                    />
                                </SettingRow>

                                {settings.spatialModeEnabled && (
                                    <>
                                        <div>
                                            <p className="text-sm font-medium text-gray-800 mb-3">Motion Intensity</p>
                                            <OptionSelector
                                                options={spatialMotionOptions}
                                                value={settings.spatialMotionIntensity}
                                                onChange={(v) => handleSettingWithPreview(PREVIEW_MODES.SPATIAL, 'spatialMotionIntensity', v)}
                                                columns={3}
                                            />
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium text-gray-800 mb-3">
                                                Depth Blur Intensity
                                            </p>
                                            <Slider
                                                value={settings.spatialDepthBlur}
                                                onChange={(v) => handleSettingWithPreview(PREVIEW_MODES.SPATIAL, 'spatialDepthBlur', v)}
                                                min={0}
                                                max={1}
                                                step={0.1}
                                                label={`${Math.round(settings.spatialDepthBlur * 100)}%`}
                                            />
                                        </div>

                                        <SettingRow
                                            label="Parallax Background"
                                            description="Elements respond to cursor movement"
                                        >
                                            <ToggleSwitch
                                                enabled={settings.spatialParallax}
                                                onChange={(v) => handleSettingWithPreview(PREVIEW_MODES.SPATIAL, 'spatialParallax', v)}
                                            />
                                        </SettingRow>
                                    </>
                                )}
                            </SettingsCard>
                        </motion.div>

                        {}
                        <motion.div variants={fadeInUp}>
                            <SettingsCard
                                title="Motion & Interaction"
                                icon="✨"
                                description="Control animation behavior"
                            >
                                <SettingRow
                                    label="Cursor Gravity Effect"
                                    description="Elements react to cursor movement"
                                >
                                    <ToggleSwitch
                                        enabled={settings.cursorGravity}
                                        onChange={(v) => handleSettingWithPreview(PREVIEW_MODES.MOTION, 'cursorGravity', v)}
                                    />
                                </SettingRow>

                                <div>
                                    <p className="text-sm font-medium text-gray-800 mb-3">Physics Strength</p>
                                    <OptionSelector
                                        options={physicsOptions}
                                        value={settings.physicsStrength}
                                        onChange={(v) => handleSettingWithPreview(PREVIEW_MODES.MOTION, 'physicsStrength', v)}
                                        columns={4}
                                    />
                                </div>

                                <SettingRow
                                    label="Parallax Background"
                                    description="Layered depth effect on scroll"
                                >
                                    <ToggleSwitch
                                        enabled={settings.parallaxBackground}
                                        onChange={(v) => handleSettingWithPreview(PREVIEW_MODES.MOTION, 'parallaxBackground', v)}
                                    />
                                </SettingRow>

                                <div>
                                    <p className="text-sm font-medium text-gray-800 mb-3">Animation Speed</p>
                                    <OptionSelector
                                        options={speedOptions}
                                        value={settings.animationSpeed}
                                        onChange={(v) => handleSettingWithPreview(PREVIEW_MODES.ANIMATION, 'animationSpeed', v)}
                                        columns={3}
                                    />
                                </div>

                                <SettingRow
                                    label="Micro-Haptic Feedback"
                                    description="Subtle tactile responses on interactions"
                                >
                                    <ToggleSwitch
                                        enabled={settings.hapticFeedback}
                                        onChange={(v) => handleSettingWithPreview(PREVIEW_MODES.ANIMATION, 'hapticFeedback', v)}
                                    />
                                </SettingRow>
                            </SettingsCard>
                        </motion.div>

                        {}
                        <motion.div variants={fadeInUp}>
                            <SettingsCard
                                title="Sound Settings"
                                icon="🔊"
                                description="Audio feedback preferences"
                            >
                                <SettingRow
                                    label="Interface Sounds"
                                    description="Play sounds on UI interactions"
                                >
                                    <ToggleSwitch
                                        enabled={settings.interfaceSounds}
                                        onChange={(v) => handleSettingChange('interfaceSounds', v)}
                                    />
                                </SettingRow>

                                <div>
                                    <p className="text-sm font-medium text-gray-800 mb-3">Sound Style</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {soundStyleOptions.map((option) => (
                                            <motion.button
                                                key={option.value}
                                                onClick={() => {
                                                    handleSettingWithPreview(PREVIEW_MODES.SOUND, 'soundStyle', option.value);
                                                }}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className={`
                                                px-4 py-3 rounded-xl text-sm font-medium text-left
                                                flex items-center justify-between
                                                transition-all duration-300
                                                ${settings.soundStyle === option.value
                                                        ? 'bg-purple-100 text-purple-700 border-2 border-purple-300'
                                                        : 'bg-white/50 text-gray-600 border border-gray-200 hover:border-purple-200'
                                                    }
                                            `}
                                            >
                                                <span>
                                                    <span className="mr-2">{option.icon}</span>
                                                    {option.label}
                                                </span>
                                                <span className="text-xs opacity-60">▶</span>
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>

                                <SettingRow
                                    label="Login Sound"
                                    description="Play sound on successful login"
                                >
                                    <ToggleSwitch
                                        enabled={settings.loginSound}
                                        onChange={(v) => handleSettingChange('loginSound', v)}
                                    />
                                </SettingRow>

                                <div>
                                    <p className="text-sm font-medium text-gray-800 mb-3">
                                        Notification Volume
                                    </p>
                                    <Slider
                                        value={settings.notificationVolume}
                                        onChange={(v) => handleSettingChange('notificationVolume', v)}
                                        min={0}
                                        max={1}
                                        step={0.1}
                                        label={`${Math.round(settings.notificationVolume * 100)}%`}
                                    />
                                </div>
                            </SettingsCard>
                        </motion.div>

                        {}
                        <motion.div variants={fadeInUp}>
                            <SettingsCard
                                title="Alert Experience"
                                icon="🚨"
                                description="Customize alert behavior"
                            >
                                <div>
                                    <p className="text-sm font-medium text-gray-800 mb-2">Emergency Visual Mode</p>
                                    <p className="text-xs text-gray-500 mb-3">
                                        Enhanced mode temporarily increases visual urgency effects.
                                    </p>
                                    <OptionSelector
                                        options={emergencyModeOptions}
                                        value={settings.emergencyVisualMode}
                                        onChange={(v) => handleSettingWithPreview(PREVIEW_MODES.EMERGENCY, 'emergencyVisualMode', v)}
                                        columns={3}
                                    />
                                </div>

                                <SettingRow
                                    label="Notification Popups"
                                    description="Show floating notification cards"
                                >
                                    <ToggleSwitch
                                        enabled={settings.notificationPopups}
                                        onChange={(v) => handleSettingChange('notificationPopups', v)}
                                    />
                                </SettingRow>

                                <SettingRow
                                    label="Urgent Alert Shake"
                                    description="Vibration-like shake for critical alerts"
                                >
                                    <ToggleSwitch
                                        enabled={settings.urgentShake}
                                        onChange={(v) => handleSettingChange('urgentShake', v)}
                                    />
                                </SettingRow>

                                <SettingRow
                                    label="Reduced Emergency Motion"
                                    description="Minimize intense visual effects during emergencies"
                                >
                                    <ToggleSwitch
                                        enabled={settings.reducedEmergencyMotion}
                                        onChange={(v) => handleSettingChange('reducedEmergencyMotion', v)}
                                    />
                                </SettingRow>

                                <SettingRow
                                    label="Silent Emergency Mode"
                                    description="Disable emergency sounds (visual-only alerts)"
                                >
                                    <ToggleSwitch
                                        enabled={settings.silentEmergencyMode}
                                        onChange={(v) => handleSettingChange('silentEmergencyMode', v)}
                                    />
                                </SettingRow>

                                <SettingRow
                                    label="Auto-Acknowledge on Open"
                                    description="Mark alerts as acknowledged when dashboard opens"
                                >
                                    <ToggleSwitch
                                        enabled={settings.autoAcknowledgeOnOpen}
                                        onChange={(v) => handleSettingChange('autoAcknowledgeOnOpen', v)}
                                    />
                                </SettingRow>

                                <div>
                                    <p className="text-sm font-medium text-gray-800 mb-3">Reaction Animation</p>
                                    <OptionSelector
                                        options={reactionOptions}
                                        value={settings.reactionAnimation}
                                        onChange={(v) => handleSettingWithPreview(PREVIEW_MODES.ANIMATION, 'reactionAnimation', v)}
                                        columns={4}
                                    />
                                </div>
                            </SettingsCard>
                        </motion.div>

                        {}
                        <motion.div variants={fadeInUp}>
                            <SettingsCard
                                title="Dashboard Layout"
                                icon="📐"
                                description="Customize your workspace"
                            >
                                <div>
                                    <p className="text-sm font-medium text-gray-800 mb-3">Layout Mode</p>
                                    <OptionSelector
                                        options={layoutOptions}
                                        value={settings.layoutMode}
                                        onChange={(v) => handleSettingWithPreview(PREVIEW_MODES.LAYOUT, 'layoutMode', v)}
                                        columns={3}
                                    />
                                </div>

                                <SettingRow
                                    label="Split View Mode"
                                    description="Show feed and details side by side"
                                >
                                    <ToggleSwitch
                                        enabled={settings.splitViewEnabled}
                                        onChange={(v) => handleSettingWithPreview(PREVIEW_MODES.LAYOUT, 'splitViewEnabled', v)}
                                    />
                                </SettingRow>

                                <SettingRow
                                    label="Auto-Collapse Sidebar"
                                    description="Collapse sidebar when not in use"
                                >
                                    <ToggleSwitch
                                        enabled={settings.autoCollapseSidebar}
                                        onChange={(v) => handleSettingChange('autoCollapseSidebar', v)}
                                    />
                                </SettingRow>
                            </SettingsCard>
                        </motion.div>

                        {}
                        <motion.div variants={fadeInUp}>
                            <SettingsCard
                                title="Save & Reset"
                                icon="💾"
                                description="Manage your preferences"
                            >
                                {isAuthenticated && (
                                    <div className="p-4 rounded-xl bg-purple-50 border border-purple-100 mb-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">☁️</span>
                                            <div>
                                                <p className="font-medium text-purple-800">Cloud Sync Active</p>
                                                <p className="text-xs text-purple-600">
                                                    Your settings sync automatically across all devices
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex flex-wrap gap-3">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleExport}
                                        className="px-6 py-3 rounded-xl font-medium text-purple-700 bg-purple-100 hover:bg-purple-200 transition-colors"
                                    >
                                        📤 Export Settings
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setShowResetConfirm(true)}
                                        className="px-6 py-3 rounded-xl font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                                    >
                                        🔄 Reset All
                                    </motion.button>
                                </div>

                                {}
                                <div className="pt-4 border-t border-gray-100">
                                    <p className="text-sm font-medium text-gray-800 mb-3">Import Settings</p>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={importText}
                                            onChange={(e) => setImportText(e.target.value)}
                                            placeholder="Paste exported settings JSON..."
                                            className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-sm focus:border-purple-300 focus:outline-none"
                                        />
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleImport}
                                            disabled={!importText}
                                            className="px-4 py-2 rounded-xl font-medium text-white bg-purple-500 hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            📥 Import
                                        </motion.button>
                                    </div>
                                </div>
                            </SettingsCard>
                        </motion.div>

                        {}
                        <motion.div variants={fadeInUp}>
                            <SettingsCard
                                title="About PulseLink"
                                icon="ℹ️"
                                description="App information"
                                defaultOpen={false}
                            >
                                <p className="text-sm text-gray-600">
                                    PulseLink is a next-generation real-time campus emergency and
                                    communication platform designed to keep your campus community safe
                                    and informed.
                                </p>
                                <div className="pt-4 border-t border-gray-100 text-xs text-gray-500">
                                    <p>Version 2.0.0</p>
                                    <p>© 2024 PulseLink. All rights reserved.</p>
                                </div>
                            </SettingsCard>
                        </motion.div>
                    </motion.div>

                    {}
                    <div className="hidden lg:block">
                        <SettingsPreviewPane
                            pendingSettings={pendingSettings}
                            onApply={handleSaveSettings}
                            onReset={handleResetToDefaults}
                        />
                    </div>
                </div>
            </motion.div>

            {}
            <AnimatePresence>
                {showThemeEditor && (
                    <ThemeEditor onClose={() => setShowThemeEditor(false)} />
                )}
            </AnimatePresence>

            {}
            <AnimatePresence>
                {showResetConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                        onClick={() => setShowResetConfirm(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-3xl p-8 max-w-md mx-4 text-center"
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
                            }}
                        >
                            <div className="text-5xl mb-4">⚠️</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Reset All Settings?</h3>
                            <p className="text-gray-600 mb-6">
                                This will restore all settings to their default values. This action cannot be undone.
                            </p>
                            <div className="flex gap-3 justify-center">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setShowResetConfirm(false)}
                                    className="px-6 py-3 rounded-xl font-medium text-gray-600 bg-gray-100"
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        handleResetToDefaults();
                                        setShowResetConfirm(false);
                                    }}
                                    className="px-6 py-3 rounded-xl font-medium text-white bg-red-500 hover:bg-red-600"
                                >
                                    Reset All
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {}
            <AnimatePresence>
                {showConflictModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-3xl p-8 max-w-md mx-4 text-center"
                            style={{
                                boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
                            }}
                        >
                            <div className="text-5xl mb-4">🔄</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Settings Conflict</h3>
                            <p className="text-gray-600 mb-6">
                                Your device settings differ from your cloud settings. Which would you like to keep?
                            </p>
                            <div className="flex gap-3 justify-center">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        settings.resolveConflict(false);
                                        setShowConflictModal(false);
                                    }}
                                    className="px-6 py-3 rounded-xl font-medium text-purple-700 bg-purple-100"
                                >
                                    📱 Keep Device
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        settings.resolveConflict(true);
                                        setShowConflictModal(false);
                                    }}
                                    className="px-6 py-3 rounded-xl font-medium text-white bg-purple-500"
                                >
                                    ☁️ Use Cloud
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {}
            <PreviewContainer
                isVisible={preview.isVisible}
                title={`Preview: ${preview.mode || 'Settings'}`}
                onApply={handleSaveSettings}
                onRevert={preview.revertChanges}
                hasChanges={preview.hasUnsavedChanges}
            >
                <PreviewContent
                    mode={preview.mode}
                    data={preview.previewData}
                />
            </PreviewContainer>
        </div>
    );
};

export default Settings;
