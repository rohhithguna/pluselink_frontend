

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useThemeStore from '../store/themeStore';


const THEME_VARIANTS = [
    {
        id: 'light',
        name: 'Light',
        icon: '☀️',
        description: 'Clean & Minimal',
        preview: { bg: '#ffffff', surface: '#f9fafb', accent: '#a855f7' }
    },
    {
        id: 'dark',
        name: 'Dark',
        icon: '🌙',
        description: 'Premium Deep',
        preview: { bg: '#0a0a0a', surface: '#171717', accent: '#a855f7' }
    },
    {
        id: 'glass',
        name: 'Glass',
        icon: '🔮',
        description: 'VisionOS Style',
        preview: { bg: 'rgba(255,255,255,0.1)', surface: 'rgba(255,255,255,0.2)', accent: '#a855f7' }
    },
    {
        id: 'neo',
        name: '3D',
        icon: '💠',
        description: 'Neomorphic',
        preview: { bg: '#e8ecef', surface: '#e8ecef', accent: '#a855f7' }
    },
];


const springTransition = {
    type: 'spring',
    stiffness: 400,
    damping: 30,
};

const smoothTransition = {
    duration: 0.25,
    ease: [0.16, 1, 0.3, 1],
};


const LiquidThemeToggle = ({ currentTheme, onThemeChange }) => {
    const [hoveredTheme, setHoveredTheme] = useState(null);

    return (
        <div
            className="inline-flex items-center gap-1 p-1.5 rounded-2xl"
            style={{
                background: 'var(--surface-default)',
                boxShadow: 'var(--shadow-md)',
                border: '1px solid var(--border-default)',
            }}
        >
            {THEME_VARIANTS.map((theme) => {
                const isActive = currentTheme === theme.id;
                const isHovered = hoveredTheme === theme.id;

                return (
                    <motion.button
                        key={theme.id}
                        onClick={() => onThemeChange(theme.id)}
                        onMouseEnter={() => setHoveredTheme(theme.id)}
                        onMouseLeave={() => setHoveredTheme(null)}
                        className="relative px-4 py-2.5 rounded-xl flex flex-col items-center gap-1 min-w-[72px]"
                        style={{
                            background: isActive
                                ? 'var(--btn-secondary-bg)'
                                : 'transparent',
                            color: isActive
                                ? 'var(--accent-primary)'
                                : 'var(--text-tertiary)',
                        }}
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        transition={springTransition}
                    >
                        {}
                        {isActive && (
                            <motion.div
                                layoutId="theme-toggle-active"
                                className="absolute inset-0 rounded-xl"
                                style={{
                                    background: 'var(--btn-secondary-bg)',
                                    boxShadow: 'var(--glow-accent)',
                                }}
                                transition={springTransition}
                            />
                        )}

                        {}
                        <motion.span
                            className="text-lg relative z-10"
                            animate={{
                                scale: isActive ? 1.1 : 1,
                                filter: isActive ? 'drop-shadow(0 0 6px var(--accent-primary))' : 'none',
                            }}
                            transition={smoothTransition}
                        >
                            {theme.icon}
                        </motion.span>

                        {}
                        <span
                            className="text-[10px] font-medium uppercase tracking-wide relative z-10"
                            style={{
                                color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
                            }}
                        >
                            {theme.name}
                        </span>
                    </motion.button>
                );
            })}
        </div>
    );
};


const PreviewCard = ({ title, subtitle, accentColor }) => (
    <motion.div
        className="p-4 rounded-2xl"
        style={{
            background: 'var(--surface-card)',
            boxShadow: 'var(--shadow-card)',
            border: '1px solid var(--border-default)',
        }}
        whileHover={{
            boxShadow: 'var(--shadow-card-hover)',
            y: -2,
        }}
        transition={springTransition}
    >
        <div className="flex items-center gap-3 mb-3">
            <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                    background: 'var(--accent-primary-subtle)',
                    color: 'var(--accent-primary)',
                }}
            >
                📊
            </div>
            <div>
                <h4
                    className="text-sm font-semibold"
                    style={{ color: 'var(--text-primary)' }}
                >
                    {title}
                </h4>
                <p
                    className="text-xs"
                    style={{ color: 'var(--text-muted)' }}
                >
                    {subtitle}
                </p>
            </div>
        </div>

        {}
        <div className="flex items-end gap-1 h-8">
            {[40, 65, 45, 80, 55, 70].map((height, i) => (
                <motion.div
                    key={i}
                    className="flex-1 rounded-t"
                    style={{
                        height: `${height}%`,
                        background: i === 3
                            ? 'var(--accent-primary)'
                            : 'var(--border-strong)',
                    }}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: i * 0.05, ...smoothTransition }}
                />
            ))}
        </div>
    </motion.div>
);


const PreviewButton = ({ variant = 'primary', children }) => (
    <motion.button
        className={`px-4 py-2 rounded-xl text-sm font-medium ${variant === 'primary' ? '' : ''
            }`}
        style={{
            background: variant === 'primary'
                ? 'var(--btn-primary-bg)'
                : 'var(--btn-secondary-bg)',
            color: variant === 'primary'
                ? 'white'
                : 'var(--btn-secondary-color)',
            boxShadow: variant === 'primary'
                ? 'var(--btn-primary-shadow)'
                : 'var(--shadow-sm)',
        }}
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.98 }}
        transition={springTransition}
    >
        {children}
    </motion.button>
);


const PreviewAlert = ({ severity = 'info' }) => {
    const severityConfig = {
        emergency: { icon: '🚨', label: 'Emergency', color: 'var(--emergency-color)', bg: 'var(--emergency-bg)', border: 'var(--emergency-border)' },
        important: { icon: '⚠️', label: 'Important', color: 'var(--important-color)', bg: 'var(--important-bg)', border: 'var(--important-border)' },
        info: { icon: 'ℹ️', label: 'Info', color: 'var(--info-color)', bg: 'var(--info-bg)', border: 'var(--info-border)' },
        success: { icon: '✅', label: 'Success', color: 'var(--success-color)', bg: 'var(--success-bg)', border: 'var(--success-border)' },
    };

    const config = severityConfig[severity];

    return (
        <motion.div
            className="px-3 py-2 rounded-xl flex items-center gap-2 text-xs font-medium"
            style={{
                background: config.bg,
                border: `1px solid ${config.border}`,
                color: config.color,
            }}
            whileHover={{ scale: 1.02 }}
            transition={springTransition}
        >
            <span>{config.icon}</span>
            <span>{config.label}</span>
        </motion.div>
    );
};


const ThemePreview = ({ showToggle = true, compact = false }) => {
    const { currentTheme, setTheme } = useThemeStore();

    const handleThemeChange = (themeId) => {
        
        const mappedTheme = themeId === '3d' ? 'neo' : themeId;
        setTheme(mappedTheme);

        
        document.documentElement.setAttribute('data-theme', themeId);
        document.body.setAttribute('data-theme', themeId);
    };

    
    useEffect(() => {
        const mappedTheme = currentTheme === 'neo' ? '3d' : currentTheme;
        document.documentElement.setAttribute('data-theme', mappedTheme);
        document.body.setAttribute('data-theme', mappedTheme);
    }, [currentTheme]);

    if (compact) {
        return (
            <LiquidThemeToggle
                currentTheme={currentTheme === 'neo' ? '3d' : currentTheme}
                onThemeChange={handleThemeChange}
            />
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={smoothTransition}
            className="p-6 rounded-3xl"
            style={{
                background: 'var(--surface-default)',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--border-default)',
            }}
        >
            {}
            <div className="mb-6">
                <h3
                    className="text-lg font-semibold mb-1"
                    style={{ color: 'var(--text-primary)' }}
                >
                    Theme Preview
                </h3>
                <p
                    className="text-sm"
                    style={{ color: 'var(--text-muted)' }}
                >
                    See how UI elements appear in each theme
                </p>
            </div>

            {}
            {showToggle && (
                <div className="mb-8">
                    <LiquidThemeToggle
                        currentTheme={currentTheme === 'neo' ? '3d' : currentTheme}
                        onThemeChange={handleThemeChange}
                    />
                </div>
            )}

            {}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {}
                <div>
                    <h4
                        className="text-xs font-medium uppercase tracking-wide mb-3"
                        style={{ color: 'var(--text-tertiary)' }}
                    >
                        Cards
                    </h4>
                    <PreviewCard
                        title="Analytics Overview"
                        subtitle="Live data metrics"
                    />
                </div>

                {}
                <div>
                    <h4
                        className="text-xs font-medium uppercase tracking-wide mb-3"
                        style={{ color: 'var(--text-tertiary)' }}
                    >
                        Buttons
                    </h4>
                    <div className="flex flex-wrap gap-3">
                        <PreviewButton variant="primary">Primary</PreviewButton>
                        <PreviewButton variant="secondary">Secondary</PreviewButton>
                    </div>
                </div>

                {}
                <div className="md:col-span-2">
                    <h4
                        className="text-xs font-medium uppercase tracking-wide mb-3"
                        style={{ color: 'var(--text-tertiary)' }}
                    >
                        Alert States
                    </h4>
                    <div className="flex flex-wrap gap-3">
                        <PreviewAlert severity="emergency" />
                        <PreviewAlert severity="important" />
                        <PreviewAlert severity="info" />
                        <PreviewAlert severity="success" />
                    </div>
                </div>

                {}
                <div className="md:col-span-2">
                    <h4
                        className="text-xs font-medium uppercase tracking-wide mb-3"
                        style={{ color: 'var(--text-tertiary)' }}
                    >
                        Typography
                    </h4>
                    <div className="space-y-2">
                        <p style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                            Primary Text — Bold headlines
                        </p>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            Secondary Text — Body content
                        </p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                            Muted Text — Metadata and labels
                        </p>
                    </div>
                </div>
            </div>

            {}
            <div
                className="mt-6 pt-6 flex items-center justify-between"
                style={{ borderTop: '1px solid var(--border-subtle)' }}
            >
                <div className="flex items-center gap-2">
                    <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                        Current:
                    </span>
                    <span
                        className="px-2 py-1 rounded-lg text-xs font-semibold"
                        style={{
                            background: 'var(--accent-primary-subtle)',
                            color: 'var(--accent-primary)',
                        }}
                    >
                        {THEME_VARIANTS.find(t => t.id === (currentTheme === 'neo' ? '3d' : currentTheme))?.name || 'Light'}
                    </span>
                </div>
                <motion.button
                    onClick={() => {
                        const themeOrder = ['light', 'dark', 'glass', 'neo'];
                        const currentIndex = themeOrder.indexOf(currentTheme);
                        const nextTheme = themeOrder[(currentIndex + 1) % themeOrder.length];
                        handleThemeChange(nextTheme === 'neo' ? '3d' : nextTheme);
                    }}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg"
                    style={{
                        color: 'var(--accent-primary)',
                        background: 'var(--accent-primary-subtle)',
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    Cycle Theme →
                </motion.button>
            </div>
        </motion.div>
    );
};

export default ThemePreview;
export { LiquidThemeToggle, PreviewCard, PreviewButton, PreviewAlert };
