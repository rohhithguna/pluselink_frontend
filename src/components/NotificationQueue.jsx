import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useAlertStore from '../store/alertStore';
import useThemeStore from '../store/themeStore';
import useAppSettings from '../hooks/useAppSettings';

const NotificationQueue = () => {
    const { queuedAlerts, removeFromQueue } = useAlertStore();
    const { theme, currentTheme } = useThemeStore();
    const {
        notificationPopups,
        getAnimationDuration,
        getShakeAnimation,
        playEmergencySound,
        urgentShake,
        reducedEmergencyMotion,
    } = useAppSettings();
    const processedIds = useRef(new Set());

    
    useEffect(() => {
        if (!queuedAlerts || queuedAlerts.length === 0) return;

        const latestNotification = queuedAlerts[0];

        
        if (processedIds.current.has(latestNotification.id)) {
            return;
        }

        processedIds.current.add(latestNotification.id);

        
        if (latestNotification.priority === 'emergency' || latestNotification.priority === 'important') {
            playEmergencySound(latestNotification.priority);
        }

        const timer = setTimeout(() => {
            removeFromQueue(latestNotification.id);
            processedIds.current.delete(latestNotification.id);
        }, 5000);

        return () => clearTimeout(timer);
    }, [queuedAlerts, removeFromQueue, playEmergencySound]);

    const getPriorityClass = (priority) => {
        const classes = {
            emergency: 'animate-red-glow',
            important: 'animate-yellow-pulse',
            info: '',
            reminder: '',
        };
        return classes[priority] || '';
    };

    const getPriorityIcon = (priority) => {
        const icons = {
            emergency: '🚨',
            important: '⚠️',
            info: 'ℹ️',
            reminder: '⏰',
        };
        return icons[priority] || '📢';
    };

    const getPriorityColor = (priority) => {
        const colors = {
            emergency: 'border-l-red-500 bg-red-50',
            important: 'border-l-amber-500 bg-amber-50',
            info: 'border-l-blue-500 bg-blue-50',
            reminder: 'border-l-purple-500 bg-purple-50',
        };

        if (currentTheme === 'dark') {
            return {
                emergency: 'border-l-red-500 bg-red-950/30',
                important: 'border-l-amber-500 bg-amber-950/30',
                info: 'border-l-blue-500 bg-blue-950/30',
                reminder: 'border-l-purple-500 bg-purple-950/30',
            }[priority] || 'border-l-neutral-500 bg-neutral-800';
        }

        return colors[priority] || 'border-l-neutral-500 bg-white';
    };

    
    if (!notificationPopups) {
        return null;
    }

    if (!queuedAlerts || queuedAlerts.length === 0) {
        return null;
    }

    
    const animDuration = getAnimationDuration(0.4);

    return (
        <div className="fixed top-20 right-4 z-50 space-y-3 max-w-md">
            <AnimatePresence>
                {queuedAlerts.slice(0, 3).map((notification) => {
                    const shakeAnim = urgentShake && !reducedEmergencyMotion
                        ? getShakeAnimation(notification.priority)
                        : {};

                    return (
                        <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, y: -50, scale: 0.95 }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                scale: 1,
                                ...shakeAnim,
                            }}
                            exit={{ opacity: 0, x: 100, scale: 0.95 }}
                            transition={{
                                duration: animDuration,
                                ease: [0.16, 1, 0.3, 1],
                            }}
                            className={`
                                w-full p-4 rounded-xl border-l-4 shadow-soft-xl
                                ${getPriorityColor(notification.priority)}
                                ${getPriorityClass(notification.priority)}
                            `}
                        >
                            <div className="flex items-start gap-3">
                                <span className="text-2xl flex-shrink-0">
                                    {getPriorityIcon(notification.priority)}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <h4 className={`font-semibold text-sm mb-1 ${currentTheme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>
                                        {notification.title}
                                    </h4>
                                    <p className={`text-xs ${currentTheme === 'dark' ? 'text-neutral-300' : 'text-neutral-600'} line-clamp-2`}>
                                        {notification.message}
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        removeFromQueue(notification.id);
                                        processedIds.current.delete(notification.id);
                                    }}
                                    className={`
                                        text-xs px-2 py-1 rounded
                                        ${currentTheme === 'dark'
                                            ? 'hover:bg-neutral-700 text-neutral-400'
                                            : 'hover:bg-neutral-200 text-neutral-500'}
                                        transition-premium
                                    `}
                                >
                                    ✕
                                </button>
                            </div>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
};

export default NotificationQueue;

