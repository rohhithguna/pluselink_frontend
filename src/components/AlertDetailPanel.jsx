import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useThemeStore from '../store/themeStore';
import '../styles/split-view.css';


const AlertDetailPanel = ({ alert, onClose }) => {
    const { theme } = useThemeStore();

    
    const formatRelativeTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${diffDays}d ago`;
    };

    
    const getTimeline = () => {
        if (!alert) return [];
        return [
            { time: alert.created_at, action: 'Alert created by ' + alert.sender_name },
            { time: new Date(new Date(alert.created_at).getTime() + 60000).toISOString(), action: 'First reaction received' },
            { time: new Date(new Date(alert.created_at).getTime() + 180000).toISOString(), action: 'Acknowledged by 5 users' },
        ];
    };

    if (!alert) {
        return (
            <div className="split-view-right">
                <div className="detail-empty-state">
                    <div className="detail-empty-icon">📋</div>
                    <p className={theme.text}>Select an alert to view details</p>
                    <p className={`text-sm ${theme.textMuted}`}>Click on any alert from the list</p>
                </div>
            </div>
        );
    }

    const totalReactions = alert.reaction_counts
        ? Object.values(alert.reaction_counts).reduce((a, b) => a + b, 0)
        : 0;

    return (
        <motion.div
            className="split-view-right"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', damping: 20 }}
        >
            {}
            <div className="detail-panel-section">
                <div className="detail-alert-preview">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">
                            {alert.priority === 'emergency' ? '🚨' :
                                alert.priority === 'important' ? '⚠️' :
                                    alert.priority === 'info' ? 'ℹ️' : '⏰'}
                        </span>
                        <div>
                            <h3 className={`font-semibold ${theme.text}`}>{alert.title}</h3>
                            <p className={`text-sm ${theme.textMuted}`}>
                                {formatRelativeTime(alert.created_at)} • {alert.sender_name}
                            </p>
                        </div>
                    </div>
                    <p
                        className={`text-sm ${theme.textMuted}`}
                        dangerouslySetInnerHTML={{ __html: alert.message }}
                    />
                </div>
            </div>

            {}
            <div className="detail-panel-section">
                <h4 className={`detail-panel-title ${theme.textMuted}`}>📊 Analytics</h4>
                <div className="analytics-mini">
                    <div className="analytics-mini-card">
                        <div className="analytics-mini-value">{totalReactions}</div>
                        <div className={`analytics-mini-label ${theme.textMuted}`}>Reactions</div>
                    </div>
                    <div className="analytics-mini-card">
                        <div className="analytics-mini-value">{alert.acknowledgment_count || 0}</div>
                        <div className={`analytics-mini-label ${theme.textMuted}`}>Acknowledged</div>
                    </div>
                    <div className="analytics-mini-card">
                        <div className="analytics-mini-value">{alert.effectiveness_score || '--'}%</div>
                        <div className={`analytics-mini-label ${theme.textMuted}`}>Effectiveness</div>
                    </div>
                    <div className="analytics-mini-card">
                        <div className="analytics-mini-value">{alert.target_roles?.length || 1}</div>
                        <div className={`analytics-mini-label ${theme.textMuted}`}>Target Groups</div>
                    </div>
                </div>
            </div>

            {}
            {alert.reaction_counts && Object.keys(alert.reaction_counts).length > 0 && (
                <div className="detail-panel-section">
                    <h4 className={`detail-panel-title ${theme.textMuted}`}>😊 Reactions</h4>
                    <div className="reactions-grid">
                        {Object.entries(alert.reaction_counts).map(([emoji, count]) => (
                            <div key={emoji} className="reaction-stat">
                                <span className="reaction-stat-emoji">{emoji}</span>
                                <span className={`reaction-stat-count ${theme.text}`}>{count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {}
            <div className="detail-panel-section">
                <h4 className={`detail-panel-title ${theme.textMuted}`}>📅 Timeline</h4>
                <div className="detail-timeline">
                    {getTimeline().map((item, index) => (
                        <div key={index} className="timeline-item">
                            <div className={`timeline-time ${theme.textMuted}`}>
                                {formatRelativeTime(item.time)}
                            </div>
                            <div className={`timeline-content ${theme.text}`}>
                                {item.action}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default AlertDetailPanel;
