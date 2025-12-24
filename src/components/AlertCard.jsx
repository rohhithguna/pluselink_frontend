import React, { useState } from 'react';
import { motion } from 'framer-motion';
import useAlertStore from '../store/alertStore';
import useAuthStore from '../store/authStore';
import useThemeStore from '../store/themeStore';
import useAppSettings from '../hooks/useAppSettings';
import Card from './Card';
import CategoryBadge from './CategoryBadge';
import EffectivenessScore from './EffectivenessScore';
import IncidentTimeline from './IncidentTimeline';
import axios from 'axios';

const emojis = ['👍', '🔥', '❗', '❤️', '😢'];

const AlertCard = ({ alert, selectable = false, isSelected = false, onSelect }) => {
    const { addReaction } = useAlertStore();
    const { theme } = useThemeStore();
    const { user, hasRole } = useAuthStore();
    const {
        getReactionAnimation,
        getShakeAnimation,
        getAnimationDuration,
        playUISound,
        triggerHaptic,
        reducedEmergencyMotion,
        emergencyVisualConfig,
    } = useAppSettings();
    const [showReactions, setShowReactions] = useState(false);
    const [acknowledged, setAcknowledged] = useState(false);
    const [showTimeline, setShowTimeline] = useState(false);
    const [reactionAnimating, setReactionAnimating] = useState(null);


    const ackCount = alert.acknowledgment_count || 0;


    const canViewTimeline = hasRole(['super_admin', 'college_admin', 'faculty']);

    const getPriorityClass = (priority) => {
        const classes = {
            emergency: 'alert-emergency',
            important: 'alert-important',
            info: 'alert-info',
            reminder: 'alert-reminder',
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

    const handleReaction = async (emoji) => {

        setReactionAnimating(emoji);
        playUISound('tap');
        triggerHaptic('light');

        await addReaction(alert.id, emoji);
        setShowReactions(false);


        setTimeout(() => setReactionAnimating(null), 400);
    };

    const handleAcknowledge = async (e) => {
        e.stopPropagation();
        if (acknowledged) return;

        try {
            const token = localStorage.getItem('token');
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/acknowledgments/alert/${alert.id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });


            setAcknowledged(true);
        } catch (error) {
            console.error('Error acknowledging:', error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = Math.floor((now - date) / 1000 / 60);

        if (diff < 1) return 'Just now';
        if (diff < 60) return `${diff}m ago`;
        if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
        return `${Math.floor(diff / 1440)}d ago`;
    };

    const priorityClass = getPriorityClass(alert.priority);
    const isEmergency = alert.priority === 'emergency';

    return (
        <div className="relative">
            { }
            {isEmergency && (
                <motion.div
                    className="absolute inset-0 bg-red-500/20 rounded-3xl -z-10"
                    animate={{
                        scale: [1, 1.05, 1],
                        opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            )}
            <Card className={`${getPriorityClass(alert.priority)} overflow-hidden mb-4 ${isSelected ? 'ring-2 ring-red-500' : ''}`}>
                <div className="flex items-start gap-4">
                    { }
                    {selectable && (
                        <div className="flex-shrink-0 pt-1">
                            <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => onSelect?.(alert.id, e.target.checked)}
                                className="w-5 h-5 rounded border-2 border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
                                style={{
                                    accentColor: '#dc2626',
                                }}
                            />
                        </div>
                    )}

                    { }
                    <div className="flex-shrink-0 text-3xl">
                        {getPriorityIcon(alert.priority)}
                    </div>

                    { }
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1.5">
                            <h3 className="text-lg font-semibold" style={{ color: '#111827' }}>
                                {alert.title}
                            </h3>
                            <CategoryBadge category={alert.category} />
                        </div>

                        <div
                            className="text-sm mb-3 line-clamp-2"
                            style={{ color: '#4b5563' }}
                            dangerouslySetInnerHTML={{ __html: alert.message }}
                        />

                        <div className="flex items-center gap-4 text-xs mb-3" style={{ color: '#6b7280' }}>
                            <span>By: {alert.sender_name}</span>
                            <span>{formatDate(alert.created_at)}</span>
                        </div>

                        {alert.effectiveness_score !== undefined && (
                            <div className="mb-3">
                                <EffectivenessScore score={alert.effectiveness_score} />
                            </div>
                        )}

                        { }
                        <div className="flex items-center gap-2 mb-2">
                            {alert.reaction_counts && Object.entries(alert.reaction_counts).map(([emoji, count]) => (
                                <span key={emoji} className="text-sm">
                                    {emoji} {count}
                                </span>
                            ))}
                            <button
                                onClick={() => setShowReactions(!showReactions)}
                                className="text-sm text-blue-500 hover:text-blue-700"
                            >
                                +
                            </button>
                        </div>

                        {showReactions && (
                            <div className="flex gap-2 mb-2">
                                {emojis.map((emoji) => (
                                    <button
                                        key={emoji}
                                        onClick={() => handleReaction(emoji)}
                                        className="text-xl hover:scale-125 transition-transform"
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        )}

                        { }
                        {alert.priority === 'emergency' && (
                            <button
                                onClick={handleAcknowledge}
                                disabled={acknowledged}
                                className={`
                                    mt-2 px-4 py-2 rounded-lg text-sm font-medium
                                    transition-all duration-300
                                    ${acknowledged
                                        ? 'bg-green-500 text-white cursor-not-allowed opacity-75'
                                        : 'bg-red-500 text-white hover:bg-red-600 hover:scale-105'
                                    }
                                `}
                            >
                                {acknowledged
                                    ? `✓ Acknowledged (${ackCount})`
                                    : ackCount > 0
                                        ? `Acknowledge (${ackCount} already)`
                                        : 'Acknowledge'
                                }
                            </button>
                        )}

                        { }
                        {canViewTimeline && (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setShowTimeline(true)}
                                className="mt-2 ml-2 px-4 py-2 rounded-lg text-sm font-medium
                                    bg-purple-100 text-purple-700 hover:bg-purple-200
                                    transition-all duration-300 inline-flex items-center gap-2"
                            >
                                <span>📊</span>
                                View Timeline
                            </motion.button>
                        )}
                    </div>
                </div>
            </Card>

            { }
            <IncidentTimeline
                alertId={alert.id}
                isOpen={showTimeline}
                onClose={() => setShowTimeline(false)}
            />
        </div>
    );
};

export default AlertCard;
