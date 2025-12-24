
import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useAlertStore from '../store/alertStore';
import useEmergencyStore from '../store/emergencyStore';
import useThemeStore from '../store/themeStore';


const premiumTransition = {
    duration: 0.25,
    ease: [0.16, 1, 0.3, 1],
};


const BANNER_STATES = {
    calm: {
        message: 'Campus is stable. Have a good day',
        emoji: '🌿',
        colors: {
            bg: 'linear-gradient(135deg, rgba(236,253,245,0.9) 0%, rgba(220,252,231,0.7) 50%, rgba(255,255,255,0.5) 100%)',
            border: 'rgba(16, 185, 129, 0.12)',
            text: '#065f46',
            ring: 'rgba(16, 185, 129, 0.06)',
            accent: '#10b981',
            shadow: '0 4px 20px rgba(16, 185, 129, 0.08)',
        },
    },
    active: {
        message: 'Stay alert — there are active notifications',
        emoji: '⚠️',
        colors: {
            bg: 'linear-gradient(135deg, rgba(255,251,235,0.9) 0%, rgba(254,243,199,0.7) 50%, rgba(255,255,255,0.5) 100%)',
            border: 'rgba(245, 158, 11, 0.15)',
            text: '#92400e',
            ring: 'rgba(245, 158, 11, 0.08)',
            accent: '#f59e0b',
            shadow: '0 4px 20px rgba(245, 158, 11, 0.1)',
        },
    },
    emergency: {
        message: 'Critical Alert Active — Follow instructions immediately',
        emoji: '🚨',
        colors: {
            bg: 'linear-gradient(135deg, rgba(254,242,242,0.95) 0%, rgba(254,226,226,0.8) 50%, rgba(255,255,255,0.6) 100%)',
            border: 'rgba(239, 68, 68, 0.2)',
            text: '#991b1b',
            ring: 'rgba(239, 68, 68, 0.1)',
            accent: '#ef4444',
            shadow: '0 4px 24px rgba(239, 68, 68, 0.15)',
        },
    },
};


const THEME_OVERRIDES = {
    dark: {
        calm: {
            bg: 'linear-gradient(135deg, #0d1f16 0%, #1b3427 100%)',
            border: 'rgba(16, 185, 129, 0.25)',
            text: '#a7f3d0',
            shadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 24px rgba(16, 185, 129, 0.15)',
        },
        active: {
            bg: 'linear-gradient(135deg, #1f1a0a 0%, #2d2410 100%)',
            border: 'rgba(245, 158, 11, 0.25)',
            text: '#fde68a',
            shadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 24px rgba(245, 158, 11, 0.15)',
        },
        emergency: {
            bg: 'linear-gradient(135deg, #1f0a0a 0%, #2d1010 100%)',
            border: 'rgba(239, 68, 68, 0.35)',
            text: '#fecaca',
            shadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 24px rgba(239, 68, 68, 0.2)',
        },
    },
    glass: {
        calm: {
            bg: 'linear-gradient(135deg, rgba(236,253,245,0.75) 0%, rgba(220,252,231,0.6) 100%)',
            border: 'rgba(16, 185, 129, 0.3)',
            text: '#065f46',
            shadow: 'inset 0 1px 0 rgba(255,255,255,0.8), 0 8px 32px rgba(16, 185, 129, 0.1)',
            backdropFilter: 'blur(24px) saturate(180%)',
        },
        active: {
            bg: 'linear-gradient(135deg, rgba(255,251,235,0.75) 0%, rgba(254,243,199,0.6) 100%)',
            border: 'rgba(245, 158, 11, 0.3)',
            text: '#92400e',
            shadow: 'inset 0 1px 0 rgba(255,255,255,0.8), 0 8px 32px rgba(245, 158, 11, 0.12)',
            backdropFilter: 'blur(24px) saturate(180%)',
        },
        emergency: {
            bg: 'linear-gradient(135deg, rgba(254,242,242,0.85) 0%, rgba(254,226,226,0.7) 100%)',
            border: 'rgba(239, 68, 68, 0.35)',
            text: '#991b1b',
            shadow: 'inset 0 1px 0 rgba(255,255,255,0.8), 0 8px 32px rgba(239, 68, 68, 0.15)',
            backdropFilter: 'blur(24px) saturate(180%)',
        },
    },
    neo: {
        calm: {
            bg: '#e8ecef',
            border: 'transparent',
            text: '#2f6d41',
            shadow: 'inset 3px 3px 6px rgba(166, 180, 200, 0.3), inset -3px -3px 6px rgba(255, 255, 255, 0.5)',
        },
        active: {
            bg: '#e8ecef',
            border: 'transparent',
            text: '#92400e',
            shadow: 'inset 3px 3px 6px rgba(166, 180, 200, 0.3), inset -3px -3px 6px rgba(255, 255, 255, 0.5)',
        },
        emergency: {
            bg: '#e8ecef',
            border: 'transparent',
            text: '#991b1b',
            shadow: 'inset 3px 3px 6px rgba(200, 100, 100, 0.25), inset -3px -3px 6px rgba(255, 200, 200, 0.4)',
        },
    },
};


const getThemedConfig = (theme, bannerState) => {
    const base = BANNER_STATES[bannerState];
    const override = THEME_OVERRIDES[theme]?.[bannerState] || {};

    return {
        ...base,
        colors: {
            ...base.colors,
            ...override,
        },
    };
};


const DynamicBanner = () => {
    const { alerts } = useAlertStore();
    const { isEmergencyActive } = useEmergencyStore();
    const { currentTheme } = useThemeStore();

    
    const bannerState = useMemo(() => {
        if (isEmergencyActive) return 'emergency';

        const hasEmergencyAlert = alerts.some(
            alert => alert.priority === 'emergency' && alert.is_active
        );
        if (hasEmergencyAlert) return 'emergency';

        const hasActiveAlerts = alerts.some(alert => alert.is_active);
        if (hasActiveAlerts) return 'active';

        return 'calm';
    }, [alerts, isEmergencyActive]);

    
    const config = useMemo(() =>
        getThemedConfig(currentTheme, bannerState),
        [currentTheme, bannerState]
    );

    
    const backdropFilter = config.colors.backdropFilter ||
        (currentTheme === 'neo' ? 'none' : 'blur(16px) saturate(180%)');

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            <AnimatePresence mode="wait">
                <motion.div
                    key={`${bannerState}-${currentTheme}`}
                    initial={{ opacity: 0, y: -12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -12, scale: 0.98 }}
                    transition={premiumTransition}
                    className="relative overflow-hidden rounded-2xl"
                    style={{
                        background: config.colors.bg,
                        backdropFilter: backdropFilter,
                        WebkitBackdropFilter: backdropFilter,
                        border: `1px solid ${config.colors.border}`,
                        boxShadow: config.colors.shadow,
                    }}
                >
                    {}
                    <motion.div
                        className="absolute inset-x-0 top-1/2"
                        style={{
                            height: '2px',
                            background: `linear-gradient(90deg, 
                                transparent 0%, 
                                ${config.colors.accent}20 10%, 
                                ${config.colors.accent}40 20%, 
                                ${config.colors.accent}60 30%, 
                                ${config.colors.accent}80 40%, 
                                ${config.colors.accent} 50%, 
                                ${config.colors.accent}80 60%, 
                                ${config.colors.accent}60 70%, 
                                ${config.colors.accent}40 80%, 
                                ${config.colors.accent}20 90%, 
                                transparent 100%
                            )`,
                        }}
                        animate={{
                            opacity: [0.2, 0.5, 0.2],
                            scaleX: [0.6, 1.1, 0.6],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                    />

                    {}
                    <motion.div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background: `radial-gradient(ellipse 80% 60% at 50% 50%, ${config.colors.accent}08 0%, transparent 70%)`,
                        }}
                        animate={{
                            opacity: [0.5, 0.8, 0.5],
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />

                    {}
                    <div className="relative z-10 px-6 py-5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <motion.span
                                className="text-2xl"
                                animate={bannerState === 'emergency' ? {
                                    scale: [1, 1.1, 1],
                                } : {
                                    scale: [1, 1.03, 1],
                                }}
                                transition={{
                                    duration: bannerState === 'emergency' ? 0.6 : 3,
                                    repeat: Infinity,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                            >
                                {config.emoji}
                            </motion.span>
                            <p
                                className="text-sm font-medium tracking-wide"
                                style={{ color: config.colors.text }}
                            >
                                {config.message}
                            </p>
                        </div>

                        {}
                        <motion.div
                            className="px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2"
                            style={{
                                background: `${config.colors.accent}12`,
                                color: config.colors.text,
                                border: `1px solid ${config.colors.accent}20`,
                            }}
                            animate={{
                                boxShadow: [
                                    `0 0 0 0 ${config.colors.accent}00`,
                                    `0 0 0 4px ${config.colors.accent}10`,
                                    `0 0 0 0 ${config.colors.accent}00`,
                                ],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        >
                            <motion.span
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ background: config.colors.accent }}
                                animate={{ opacity: [1, 0.4, 1] }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                }}
                            />
                            {bannerState === 'emergency' ? 'LIVE' : 'auto-updating'}
                        </motion.div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default DynamicBanner;
