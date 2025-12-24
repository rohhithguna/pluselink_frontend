
import React, { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useSettingsStore from '../store/settingsStore';


const playEmergencySound = (volume = 0.5) => {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        
        oscillator.type = 'sine';
        oscillator.frequency.value = 880;
        gainNode.gain.value = volume * 0.08;

        oscillator.start();

        
        const now = ctx.currentTime;
        gainNode.gain.setValueAtTime(volume * 0.08, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        gainNode.gain.setValueAtTime(volume * 0.08, now + 0.15);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        gainNode.gain.setValueAtTime(volume * 0.06, now + 0.3);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

        oscillator.stop(now + 0.6);
    } catch (e) {
        }
};


export const EmergencyPulseOverlay = ({ isActive, priority, onComplete }) => {
    const {
        emergencyVisualMode,
        reducedEmergencyMotion,
        silentEmergencyMode,
        interfaceSounds,
        notificationVolume
    } = useSettingsStore();

    useEffect(() => {
        if (isActive && priority === 'emergency' && interfaceSounds && !silentEmergencyMode) {
            playEmergencySound(notificationVolume);
        }
    }, [isActive, priority, interfaceSounds, silentEmergencyMode, notificationVolume]);

    if (!isActive) return null;

    const isEmergency = priority === 'emergency';
    const isImportant = priority === 'important';

    
    if (reducedEmergencyMotion && isEmergency) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] pointer-events-none"
                onAnimationComplete={onComplete}
            >
                <div
                    className="absolute inset-0"
                    style={{
                        border: '4px solid rgba(239, 68, 68, 0.6)',
                        borderRadius: '0',
                    }}
                />
            </motion.div>
        );
    }

    return (
        <AnimatePresence>
            {isActive && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[100] pointer-events-none"
                    onAnimationComplete={() => {
                        setTimeout(onComplete, isEmergency ? 1500 : 800);
                    }}
                >
                    {}
                    {isEmergency && emergencyVisualMode !== 'basic' && (
                        <>
                            {}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{
                                    opacity: emergencyVisualMode === 'cinematic' ? [0, 0.4, 0] : [0, 0.25, 0],
                                }}
                                transition={{
                                    duration: emergencyVisualMode === 'cinematic' ? 1.5 : 1,
                                    ease: 'easeInOut',
                                }}
                                className="absolute inset-0"
                                style={{ background: 'rgba(239, 68, 68, 0.3)' }}
                            />

                            {}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0.6, 1, 0.6] }}
                                transition={{ duration: 1, repeat: 2 }}
                                className="absolute inset-0"
                                style={{
                                    border: emergencyVisualMode === 'cinematic'
                                        ? '6px solid rgba(239, 68, 68, 0.8)'
                                        : '4px solid rgba(239, 68, 68, 0.6)',
                                    boxShadow: emergencyVisualMode === 'cinematic'
                                        ? 'inset 0 0 60px rgba(239, 68, 68, 0.3), 0 0 40px rgba(239, 68, 68, 0.4)'
                                        : 'inset 0 0 30px rgba(239, 68, 68, 0.2)',
                                }}
                            />

                            {}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.2 }}
                                className="absolute inset-0 bg-black"
                            />
                        </>
                    )}

                    {}
                    {isImportant && (
                        <>
                            {}
                            <motion.div
                                animate={{
                                    boxShadow: [
                                        'inset 0 0 20px rgba(245, 158, 11, 0)',
                                        'inset 0 0 40px rgba(245, 158, 11, 0.2)',
                                        'inset 0 0 20px rgba(245, 158, 11, 0)',
                                    ],
                                }}
                                transition={{ duration: 1.5, repeat: 1 }}
                                className="absolute inset-0"
                                style={{
                                    border: '2px solid rgba(245, 158, 11, 0.4)',
                                }}
                            />

                            {}
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0.5 }}
                                animate={{ scale: 1.5, opacity: 0 }}
                                transition={{ duration: 1.2 }}
                                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full"
                                style={{
                                    border: '2px solid rgba(245, 158, 11, 0.4)',
                                }}
                            />
                        </>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};


export const EnhancedAlertNotification = ({
    alert,
    onDismiss,
    onAcknowledge,
    isPinned = false
}) => {
    const {
        emergencyVisualMode,
        reducedEmergencyMotion,
        urgentShake,
        reactionAnimation,
        interfaceSounds,
        notificationVolume,
        autoAcknowledgeOnOpen
    } = useSettingsStore();

    const intervalRef = useRef(null);
    const [showPulse, setShowPulse] = React.useState(false);

    const isEmergency = alert.priority === 'emergency';
    const isImportant = alert.priority === 'important';

    
    useEffect(() => {
        if (isEmergency && !alert.acknowledged && !reducedEmergencyMotion) {
            intervalRef.current = setInterval(() => {
                setShowPulse(true);
                setTimeout(() => setShowPulse(false), 500);
            }, 30000);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isEmergency, alert.acknowledged, reducedEmergencyMotion]);

    
    useEffect(() => {
        if (autoAcknowledgeOnOpen && isEmergency && onAcknowledge) {
            onAcknowledge();
        }
    }, [autoAcknowledgeOnOpen, isEmergency, onAcknowledge]);

    const getShakeAnimation = () => {
        if (!urgentShake || reducedEmergencyMotion) return {};

        if (isEmergency) {
            return {
                x: [0, -8, 8, -6, 6, -4, 4, 0],
                transition: { duration: 0.5 }
            };
        }
        return {};
    };

    const getPriorityStyles = () => {
        if (isEmergency) {
            return {
                background: emergencyVisualMode === 'cinematic'
                    ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.1) 100%)'
                    : 'rgba(239, 68, 68, 0.08)',
                border: `2px solid rgba(239, 68, 68, ${emergencyVisualMode === 'cinematic' ? 0.5 : 0.3})`,
                boxShadow: emergencyVisualMode === 'cinematic'
                    ? '0 0 30px rgba(239, 68, 68, 0.2), 0 8px 32px rgba(0,0,0,0.1)'
                    : '0 4px 16px rgba(239, 68, 68, 0.15)',
            };
        }

        if (isImportant) {
            return {
                background: 'rgba(245, 158, 11, 0.08)',
                border: '2px solid rgba(245, 158, 11, 0.3)',
                boxShadow: '0 0 20px rgba(245, 158, 11, 0.1)',
            };
        }

        return {
            background: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid rgba(168, 85, 247, 0.1)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        };
    };

    const getEntryAnimation = () => {
        if (isEmergency || isImportant) {
            return {
                initial: { opacity: 0, y: -50, scale: 0.9 },
                animate: { opacity: 1, y: 0, scale: 1, ...getShakeAnimation() },
                exit: { opacity: 0, y: -30, scale: 0.95 },
            };
        }

        
        return {
            initial: { opacity: 0, x: 100 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: 50 },
        };
    };

    const animation = getEntryAnimation();

    return (
        <motion.div
            layout
            {...animation}
            transition={{
                type: 'spring',
                stiffness: isEmergency ? 400 : 300,
                damping: isEmergency ? 25 : 30
            }}
            className={`
                relative rounded-2xl p-4 mb-3 
                backdrop-blur-md overflow-hidden
                ${isPinned ? 'ring-2 ring-red-400' : ''}
            `}
            style={{
                ...getPriorityStyles(),
            }}
        >
            {}
            <AnimatePresence>
                {showPulse && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.3, 0] }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-red-500/10"
                    />
                )}
            </AnimatePresence>

            {}
            <div className="flex items-start gap-3">
                <motion.div
                    animate={isEmergency && !reducedEmergencyMotion ? {
                        scale: [1, 1.2, 1],
                    } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-2xl"
                >
                    {isEmergency ? '🚨' : isImportant ? '⚠️' : 'ℹ️'}
                </motion.div>

                <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">
                        {alert.title}
                    </h4>
                    <p className="text-sm text-gray-600 line-clamp-2">
                        {alert.message}
                    </p>

                    {}
                    <div className="flex gap-2 mt-3">
                        {isEmergency && onAcknowledge && !alert.acknowledged && (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onAcknowledge}
                                className="px-4 py-2 rounded-xl text-sm font-medium bg-red-500 text-white"
                            >
                                ✓ Acknowledge
                            </motion.button>
                        )}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onDismiss}
                            className="px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 text-gray-600"
                        >
                            Dismiss
                        </motion.button>
                    </div>
                </div>

                {}
                {isPinned && (
                    <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-600">
                        Pinned
                    </span>
                )}
            </div>

            {}
            {isImportant && (
                <motion.div
                    animate={{
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: 'radial-gradient(circle at center, rgba(245, 158, 11, 0.1) 0%, transparent 70%)',
                    }}
                />
            )}
        </motion.div>
    );
};


export const useEmergencyAlertEffects = () => {
    const [activeEmergency, setActiveEmergency] = React.useState(null);
    const [showPulse, setShowPulse] = React.useState(false);

    const triggerEmergency = useCallback((alert) => {
        if (alert.priority === 'emergency' || alert.priority === 'important') {
            setActiveEmergency(alert);
            setShowPulse(true);
        }
    }, []);

    const clearEmergency = useCallback(() => {
        setShowPulse(false);
        setTimeout(() => setActiveEmergency(null), 500);
    }, []);

    return {
        activeEmergency,
        showPulse,
        triggerEmergency,
        clearEmergency,
    };
};

export default {
    EmergencyPulseOverlay,
    EnhancedAlertNotification,
    useEmergencyAlertEffects,
};
