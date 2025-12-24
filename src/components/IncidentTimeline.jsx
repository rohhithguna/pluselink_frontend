
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import useThemeStore from '../store/themeStore';


const EVENT_CONFIG = {
    created: { icon: '📢', color: '#a855f7', label: 'Alert Created' },
    viewed: { icon: '👁️', color: '#3b82f6', label: 'Viewed' },
    reaction: { icon: '❤️', color: '#ec4899', label: 'Reaction' },
    acknowledged: { icon: '✅', color: '#10b981', label: 'Acknowledged' },
    escalated: { icon: '🚨', color: '#ef4444', label: 'Escalated' },
    resolved: { icon: '✔️', color: '#22c55e', label: 'Resolved' },
};

const IncidentTimeline = ({ alertId, isOpen, onClose }) => {
    const { theme, currentTheme } = useThemeStore();
    const [timeline, setTimeline] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackIndex, setPlaybackIndex] = useState(0);
    const [soundEnabled, setSoundEnabled] = useState(false);
    const playbackRef = useRef(null);
    const audioContextRef = useRef(null);

    
    useEffect(() => {
        if (isOpen && alertId) {
            fetchTimeline();
        }
        return () => {
            if (playbackRef.current) {
                clearInterval(playbackRef.current);
            }
        };
    }, [isOpen, alertId]);

    const fetchTimeline = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get(`/alerts/${alertId}/timeline`);
            setTimeline(response.data);
            setPlaybackIndex(0);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to load timeline');
        } finally {
            setLoading(false);
        }
    };

    
    const startPlayback = () => {
        if (!timeline?.events?.length) return;
        setIsPlaying(true);
        setPlaybackIndex(0);

        playbackRef.current = setInterval(() => {
            setPlaybackIndex(prev => {
                if (prev >= timeline.events.length - 1) {
                    clearInterval(playbackRef.current);
                    setIsPlaying(false);
                    return prev;
                }
                
                if (soundEnabled) {
                    const nextEvent = timeline.events[prev + 1];
                    if (['created', 'acknowledged', 'escalated'].includes(nextEvent?.event_type)) {
                        playBeep();
                    }
                }
                return prev + 1;
            });
        }, 1500);
    };

    const stopPlayback = () => {
        if (playbackRef.current) {
            clearInterval(playbackRef.current);
        }
        setIsPlaying(false);
    };

    const playBeep = () => {
        try {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            }
            const ctx = audioContextRef.current;
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.frequency.value = 800;
            gainNode.gain.value = 0.05;

            oscillator.start();
            gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
            oscillator.stop(ctx.currentTime + 0.15);
        } catch (e) {
            }
    };

    const formatTime = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return '#10b981';
            case 'resolved': return '#22c55e';
            case 'expired': return '#6b7280';
            case 'escalated': return '#ef4444';
            default: return '#6b7280';
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                onClick={onClose}
            />

            {}
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="fixed right-0 top-0 h-full z-50 overflow-hidden"
                style={{
                    width: '420px',
                    maxWidth: '90vw',
                    background: currentTheme === 'dark'
                        ? 'linear-gradient(135deg, #1f1f1f 0%, #0a0a0a 100%)'
                        : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                    borderLeft: currentTheme === 'dark'
                        ? '1px solid rgba(255,255,255,0.1)'
                        : '1px solid rgba(0,0,0,0.1)',
                    boxShadow: '-20px 0 60px rgba(0,0,0,0.3)',
                }}
            >
                {}
                <div
                    className="p-6 border-b"
                    style={{
                        borderColor: currentTheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                        background: currentTheme === 'dark'
                            ? 'rgba(168, 85, 247, 0.05)'
                            : 'rgba(168, 85, 247, 0.03)',
                    }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className={`text-xl font-bold ${theme.text}`}>
                            📊 Incident Timeline
                        </h2>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={onClose}
                            className={`p-2 rounded-full ${currentTheme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}
                        >
                            <span className="text-lg">✕</span>
                        </motion.button>
                    </div>

                    {timeline && (
                        <div className="space-y-2">
                            <h3 className={`font-semibold ${theme.text}`}>{timeline.alert_title}</h3>
                            <div className="flex items-center gap-3 text-sm">
                                <span
                                    className="px-2 py-1 rounded-full text-xs font-medium"
                                    style={{
                                        backgroundColor: getStatusColor(timeline.status) + '20',
                                        color: getStatusColor(timeline.status),
                                    }}
                                >
                                    {timeline.status.toUpperCase()}
                                </span>
                                <span className={theme.textMuted}>
                                    👁️ {timeline.total_views} • ❤️ {timeline.total_reactions} • ✅ {timeline.total_acknowledgments}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {}
                {timeline?.events?.length > 0 && (
                    <div
                        className="px-6 py-4 border-b"
                        style={{ borderColor: currentTheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
                    >
                        <div className="flex items-center gap-3">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={isPlaying ? stopPlayback : startPlayback}
                                className="px-4 py-2 rounded-xl font-medium text-sm"
                                style={{
                                    background: 'linear-gradient(135deg, #a855f7 0%, #8b5cf6 100%)',
                                    color: 'white',
                                }}
                            >
                                {isPlaying ? '⏸️ Pause' : '▶️ Play'}
                            </motion.button>

                            <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(168, 85, 247, 0.2)' }}>
                                <motion.div
                                    className="h-full rounded-full"
                                    style={{ background: 'linear-gradient(90deg, #a855f7, #ec4899)' }}
                                    animate={{ width: `${((playbackIndex + 1) / timeline.events.length) * 100}%` }}
                                />
                            </div>

                            <label className="flex items-center gap-2 text-sm cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={soundEnabled}
                                    onChange={(e) => setSoundEnabled(e.target.checked)}
                                    className="rounded"
                                />
                                <span className={theme.textMuted}>🔊</span>
                            </label>
                        </div>
                        <p className={`text-xs mt-2 ${theme.textMuted}`}>
                            Event {playbackIndex + 1} of {timeline.events.length}
                        </p>
                    </div>
                )}

                {}
                <div className="flex-1 overflow-y-auto p-6" style={{ maxHeight: 'calc(100vh - 280px)' }}>
                    {loading && (
                        <div className="flex items-center justify-center h-40">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                className="text-4xl"
                            >
                                ⏳
                            </motion.div>
                        </div>
                    )}

                    {error && (
                        <div className="text-center py-8">
                            <p className="text-red-500">{error}</p>
                        </div>
                    )}

                    {!loading && !error && (!timeline?.events?.length) && (
                        <div className="text-center py-12">
                            <div className="text-5xl mb-4 opacity-50">📭</div>
                            <p className={theme.textMuted}>No activity recorded yet.</p>
                        </div>
                    )}

                    {!loading && timeline?.events?.length > 0 && (
                        <div className="relative">
                            {}
                            <div
                                className="absolute left-4 top-0 bottom-0 w-0.5"
                                style={{
                                    background: currentTheme === 'dark'
                                        ? 'linear-gradient(to bottom, rgba(168, 85, 247, 0.5), transparent)'
                                        : 'linear-gradient(to bottom, rgba(168, 85, 247, 0.3), transparent)'
                                }}
                            />

                            {}
                            <div className="space-y-6">
                                {timeline.events.map((event, index) => {
                                    const config = EVENT_CONFIG[event.event_type] || EVENT_CONFIG.viewed;
                                    const isHighlighted = isPlaying && index === playbackIndex;

                                    return (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{
                                                opacity: isPlaying ? (index <= playbackIndex ? 1 : 0.3) : 1,
                                                x: 0,
                                                scale: isHighlighted ? 1.02 : 1,
                                            }}
                                            transition={{ delay: isPlaying ? 0 : index * 0.05 }}
                                            className="relative flex items-start gap-4 pl-10"
                                        >
                                            {}
                                            <motion.div
                                                className="absolute left-0 w-8 h-8 rounded-full flex items-center justify-center text-sm"
                                                style={{
                                                    background: isHighlighted
                                                        ? config.color
                                                        : currentTheme === 'dark' ? '#1f1f1f' : '#ffffff',
                                                    border: `2px solid ${config.color}`,
                                                    boxShadow: isHighlighted
                                                        ? `0 0 20px ${config.color}60`
                                                        : 'none',
                                                }}
                                                animate={isHighlighted ? {
                                                    boxShadow: [
                                                        `0 0 10px ${config.color}40`,
                                                        `0 0 25px ${config.color}60`,
                                                        `0 0 10px ${config.color}40`,
                                                    ]
                                                } : {}}
                                                transition={{ duration: 1.5, repeat: Infinity }}
                                            >
                                                {event.details?.emoji || config.icon}
                                            </motion.div>

                                            {}
                                            <div
                                                className="flex-1 p-3 rounded-xl"
                                                style={{
                                                    background: isHighlighted
                                                        ? `${config.color}15`
                                                        : currentTheme === 'dark'
                                                            ? 'rgba(255,255,255,0.03)'
                                                            : 'rgba(0,0,0,0.02)',
                                                    border: `1px solid ${isHighlighted ? config.color + '40' : 'transparent'}`,
                                                }}
                                            >
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className={`font-medium text-sm ${theme.text}`}>
                                                        {config.label}
                                                    </span>
                                                    <span className={`text-xs ${theme.textMuted}`}>
                                                        {formatTime(event.timestamp)}
                                                    </span>
                                                </div>
                                                <p className={`text-sm ${theme.textMuted}`}>
                                                    {event.user_name}
                                                    {event.user_role && (
                                                        <span className="opacity-60"> • {event.user_role.replace('_', ' ')}</span>
                                                    )}
                                                </p>
                                                <span className={`text-xs ${theme.textMuted} opacity-60`}>
                                                    {formatDate(event.timestamp)}
                                                </span>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default IncidentTimeline;
