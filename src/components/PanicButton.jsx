import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useAlertStore from '../store/alertStore';
import useThemeStore from '../store/themeStore';


const getFabThemeStyles = (theme) => {
    const styles = {
        light: {
            background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%)',
            boxShadow: '0 4px 20px rgba(220, 38, 38, 0.4), 0 0 40px rgba(220, 38, 38, 0.2)',
            border: '2px solid rgba(255,255,255,0.2)',
            ringColor: 'rgba(255,255,255,0.3)',
        },
        dark: {
            background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 50%, #7f1d1d 100%)',
            boxShadow: '0 4px 24px rgba(220, 38, 38, 0.5), 0 0 48px rgba(220, 38, 38, 0.3), 0 0 0 1px rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.15)',
            ringColor: 'rgba(220, 38, 38, 0.5)',
        },
        glass: {
            background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.9) 0%, rgba(185, 28, 28, 0.85) 100%)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3), 0 8px 32px rgba(220, 38, 38, 0.4), 0 0 0 1px rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.25)',
            ringColor: 'rgba(255,255,255,0.4)',
        },
        neo: {
            background: '#e8ecef',
            boxShadow: `
                6px 6px 12px rgba(166, 180, 200, 0.4),
                -6px -6px 12px rgba(255, 255, 255, 0.9),
                inset 0 0 0 3px rgba(220, 38, 38, 0.8)
            `,
            border: 'none',
            ringColor: 'rgba(220, 38, 38, 0.3)',
            isNeo: true,
        },
    };
    return styles[theme] || styles.light;
};

const PanicButton = ({ onEmergencyDispatch }) => {
    const { createAlert } = useAlertStore();
    const { currentTheme } = useThemeStore();
    const [showModal, setShowModal] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [ripples, setRipples] = useState([]);
    const [isHaptic, setIsHaptic] = useState(false);
    const lastTapRef = useRef(0);
    const doubleTapTimeoutRef = useRef(null);
    const buttonRef = useRef(null);

    const themeStyles = getFabThemeStyles(currentTheme);

    
    const createRipple = useCallback((e) => {
        const button = buttonRef.current;
        if (!button) return;

        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - 20;
        const y = e.clientY - rect.top - 20;
        const id = Date.now();

        setRipples(prev => [...prev, { id, x, y }]);
        setTimeout(() => {
            setRipples(prev => prev.filter(r => r.id !== id));
        }, 600);
    }, []);

    
    const triggerHaptic = useCallback(() => {
        setIsHaptic(true);
        setTimeout(() => setIsHaptic(false), 400);
        if (navigator.vibrate) {
            navigator.vibrate([50, 30, 50]);
        }
    }, []);

    
    const dispatchEmergency = useCallback(async () => {
        triggerHaptic();

        const result = await createAlert({
            title: '🚨 EMERGENCY ALERT',
            message: 'An emergency has been triggered via Panic Button. Immediate attention required!',
            priority: 'emergency',
            category: 'emergency',
            target_roles: ['all']
        });

        if (result.success) {
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 500);
            onEmergencyDispatch?.();
        }

        setShowModal(false);
    }, [createAlert, triggerHaptic, onEmergencyDispatch]);

    
    const handleTap = useCallback((e) => {
        createRipple(e);
        triggerHaptic();

        const now = Date.now();
        const timeSinceLastTap = now - lastTapRef.current;
        lastTapRef.current = now;

        if (timeSinceLastTap < 300) {
            if (doubleTapTimeoutRef.current) {
                clearTimeout(doubleTapTimeoutRef.current);
            }
            dispatchEmergency();
        } else {
            doubleTapTimeoutRef.current = setTimeout(() => {
                setShowModal(true);
            }, 300);
        }
    }, [createRipple, triggerHaptic, dispatchEmergency]);

    
    const getModalStyles = () => {
        if (currentTheme === 'dark') {
            return {
                background: 'rgba(25, 25, 25, 0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                textColor: '#f1f5f9',
                textMuted: '#9ca3af',
            };
        }
        return {
            background: 'white',
            border: 'none',
            textColor: '#111827',
            textMuted: '#6b7280',
        };
    };
    const modalStyles = getModalStyles();

    return (
        <>
            {}
            <div className="fixed bottom-6 right-6 z-40">
                <motion.button
                    ref={buttonRef}
                    onClick={handleTap}
                    whileHover={{
                        scale: 1.08,
                        y: -4,
                        boxShadow: currentTheme === 'dark'
                            ? '0 8px 32px rgba(220, 38, 38, 0.6), 0 0 64px rgba(220, 38, 38, 0.4)'
                            : currentTheme === 'neo'
                                ? '8px 8px 16px rgba(166, 180, 200, 0.5), -8px -8px 16px rgba(255, 255, 255, 1), inset 0 0 0 3px rgba(220, 38, 38, 0.9)'
                                : themeStyles.boxShadow,
                    }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                        relative w-14 h-14 rounded-full
                        flex items-center justify-center
                        text-2xl overflow-hidden
                        ${isHaptic ? 'animate-pulse' : ''}
                    `}
                    style={{
                        background: themeStyles.background,
                        boxShadow: themeStyles.boxShadow,
                        border: themeStyles.border,
                        transformStyle: currentTheme === 'neo' ? 'preserve-3d' : 'flat',
                    }}
                >
                    {}
                    <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{ border: `2px solid ${themeStyles.ringColor}` }}
                        animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.5, 0, 0.5],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeOut',
                        }}
                    />

                    🚨

                    {}
                    {ripples.map(ripple => (
                        <motion.span
                            key={ripple.id}
                            className="absolute w-10 h-10 rounded-full bg-white/30"
                            style={{ left: ripple.x, top: ripple.y }}
                            initial={{ scale: 0, opacity: 1 }}
                            animate={{ scale: 3, opacity: 0 }}
                            transition={{ duration: 0.6 }}
                        />
                    ))}
                </motion.button>

                {}
                <div
                    className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 rounded-lg text-xs opacity-0 hover:opacity-100 transition-opacity"
                    style={{
                        background: currentTheme === 'dark' ? 'rgba(30,30,30,0.9)' : 'rgba(255,255,255,0.9)',
                        color: currentTheme === 'dark' ? '#e5e7eb' : '#4b5563',
                        backdropFilter: 'blur(8px)',
                        boxShadow: currentTheme === 'dark' ? '0 2px 8px rgba(0,0,0,0.4)' : '0 2px 8px rgba(0,0,0,0.1)',
                    }}
                >
                    Tap: Confirm • Double: Instant
                </div>
            </div>

            {}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm px-4"
                        style={{ background: currentTheme === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.4)' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            className="rounded-3xl p-6 max-w-sm w-full shadow-2xl"
                            style={{
                                background: modalStyles.background,
                                border: modalStyles.border,
                            }}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: 'spring', damping: 20 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="text-center mb-4">
                                <div className="text-5xl mb-3">🚨</div>
                                <h2 className="text-xl font-bold mb-2" style={{ color: modalStyles.textColor }}>
                                    Trigger Emergency Alert?
                                </h2>
                                <p className="text-sm" style={{ color: modalStyles.textMuted }}>
                                    This will send an immediate notification to <strong>all users</strong>.
                                </p>
                                <p className="text-xs mt-2 italic" style={{ color: modalStyles.textMuted }}>
                                    Tip: Double-tap for instant dispatch
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                                    style={{
                                        background: currentTheme === 'dark' ? 'rgba(255,255,255,0.1)' : '#f3f4f6',
                                        color: currentTheme === 'dark' ? '#e5e7eb' : '#4b5563',
                                    }}
                                >
                                    Cancel
                                </button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={dispatchEmergency}
                                    className="flex-1 px-4 py-3 rounded-xl text-sm font-bold text-white"
                                    style={{
                                        background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                                        boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
                                    }}
                                >
                                    🚨 Send Alert
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        className="fixed inset-0 z-50 pointer-events-none"
                        style={{
                            background: 'radial-gradient(circle, rgba(220,38,38,0.15) 0%, transparent 70%)',
                        }}
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default PanicButton;
