
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import useThemeStore from '../store/themeStore';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import { pageTransition, fadeInUp, staggerContainer } from '../animations/pageTransitions';
import { getPageBackground, getTextColors, getStatCardStyle, getProgressBarStyle } from '../utils/page-theme';


const StatCard = ({ icon, label, value, subtext, color, currentTheme }) => {
    const text = getTextColors(currentTheme);
    const isDark = currentTheme === 'dark';

    return (
        <motion.div variants={fadeInUp}>
            <Card className="h-full">
                <div className="flex items-start gap-4">
                    <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                        style={{
                            background: isDark
                                ? `linear-gradient(135deg, ${color}30 0%, ${color}15 100%)`
                                : `${color}20`,
                            ...(isDark && { boxShadow: `0 0 20px ${color}20` }),
                        }}
                    >
                        {icon}
                    </div>
                    <div className="flex-1">
                        <p
                            className="text-sm mb-1"
                            style={{ color: text.muted }}
                        >
                            {label}
                        </p>
                        <p
                            className="text-3xl font-bold"
                            style={{ color: text.primary }}
                        >
                            {value}
                        </p>
                        {subtext && (
                            <p
                                className="text-xs mt-1"
                                style={{ color: text.muted }}
                            >
                                {subtext}
                            </p>
                        )}
                    </div>
                </div>
            </Card>
        </motion.div>
    );
};


const RoleChart = ({ data, currentTheme }) => {
    const text = getTextColors(currentTheme);
    const isDark = currentTheme === 'dark';
    const total = Object.values(data).reduce((a, b) => a + b, 0);

    const roles = [
        { key: 'super_admin', label: 'Super Admin', color: '#ef4444' },
        { key: 'college_admin', label: 'College Admin', color: '#f59e0b' },
        { key: 'faculty', label: 'Faculty', color: '#3b82f6' },
        { key: 'student', label: 'Student', color: '#a855f7' },
    ];

    return (
        <div className="space-y-4">
            {roles.map(role => {
                const count = data[role.key] || 0;
                const percentage = total > 0 ? (count / total) * 100 : 0;
                return (
                    <div key={role.key}>
                        <div className="flex justify-between items-center mb-1">
                            <span
                                className="text-sm"
                                style={{ color: text.secondary }}
                            >
                                {role.label}
                            </span>
                            <span
                                className="text-sm font-medium"
                                style={{ color: text.primary }}
                            >
                                {count}
                            </span>
                        </div>
                        <div
                            className="h-2 rounded-full overflow-hidden"
                            style={{
                                background: isDark
                                    ? 'rgba(51, 65, 85, 0.5)'
                                    : 'rgba(241, 245, 249, 0.8)'
                            }}
                        >
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="h-full rounded-full"
                                style={{
                                    background: role.color,
                                    ...(isDark && { boxShadow: `0 0 8px ${role.color}60` }),
                                }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};


const ActivityItem = ({ activity, currentTheme }) => {
    const text = getTextColors(currentTheme);
    const isDark = currentTheme === 'dark';

    const getActivityIcon = (type) => {
        const icons = {
            login: '🔑',
            logout: '👋',
            create_alert: '📢',
            create_user: '👤',
            update_user: '✏️',
            delete_user: '🗑️',
            reset_password: '🔐',
            update_profile: '📝',
        };
        return icons[type] || '📋';
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-start gap-3 py-3"
            style={{
                borderBottom: `1px solid ${isDark ? 'rgba(51, 65, 85, 0.4)' : 'rgba(241, 245, 249, 0.8)'}`,
            }}
        >
            <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                style={{
                    background: isDark
                        ? 'rgba(168, 85, 247, 0.15)'
                        : 'rgba(168, 85, 247, 0.1)',
                }}
            >
                {getActivityIcon(activity.activity_type)}
            </div>
            <div className="flex-1 min-w-0">
                <p
                    className="text-sm truncate"
                    style={{ color: text.primary }}
                >
                    {activity.description}
                </p>
                <div className="flex items-center gap-2 mt-1">
                    {activity.username && (
                        <span
                            className="text-xs font-medium"
                            style={{ color: text.accent }}
                        >
                            @{activity.username}
                        </span>
                    )}
                    <span
                        className="text-xs"
                        style={{ color: text.muted }}
                    >
                        {new Date(activity.created_at).toLocaleString()}
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

const ControlCenter = () => {
    const navigate = useNavigate();
    const { user: currentUser } = useAuthStore();
    const { theme, currentTheme } = useThemeStore();
    const text = getTextColors(currentTheme);
    const isDark = currentTheme === 'dark';

    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [loginStats, setLoginStats] = useState([]);
    const [activities, setActivities] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState({ count: 0, users: [] });

    
    useEffect(() => {
        if (currentUser?.role !== 'super_admin') {
            toast.error('Access denied. Super admin only.');
            navigate('/dashboard');
        }
    }, [currentUser, navigate]);

    
    useEffect(() => {
        fetchData();
        const interval = setInterval(() => fetchOnlineUsers(), 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, loginsRes, activityRes, onlineRes] = await Promise.all([
                api.get('/admin/stats'),
                api.get('/admin/logins?days=7'),
                api.get('/admin/activity-log?limit=20'),
                api.get('/admin/online-users'),
            ]);

            setStats(statsRes.data);
            setLoginStats(loginsRes.data);
            setActivities(activityRes.data);
            setOnlineUsers(onlineRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load control center data');
        } finally {
            setLoading(false);
        }
    };

    const fetchOnlineUsers = async () => {
        try {
            const response = await api.get('/admin/online-users');
            setOnlineUsers(response.data);
        } catch (error) {
            console.error('Error fetching online users:', error);
        }
    };

    if (loading) {
        return (
            <div
                className="min-h-screen transition-colors duration-300"
                style={{ background: getPageBackground(currentTheme) }}
            >
                <Navbar />
                <div className="flex items-center justify-center h-[60vh]">
                    <motion.div
                        className="text-center"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        <div className="text-6xl mb-4">⏳</div>
                        <p style={{ color: text.muted }}>Loading control center...</p>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen transition-colors duration-300"
            style={{ background: getPageBackground(currentTheme) }}
        >
            <Navbar />

            <motion.div
                variants={pageTransition}
                initial="initial"
                animate="animate"
                exit="exit"
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
            >
                {}
                <motion.div variants={fadeInUp} className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1
                            className="text-4xl font-bold mb-2"
                            style={{
                                color: text.primary,
                                ...(isDark && {
                                    background: 'linear-gradient(135deg, #F1F5F9 0%, #C4B5FD 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }),
                            }}
                        >
                            🎛️ Control Center
                        </h1>
                        <p style={{ color: text.muted }}>
                            System overview and administration
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link to="/admin/users">
                            <motion.button
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-5 py-2.5 rounded-xl font-semibold text-white"
                                style={{
                                    background: 'linear-gradient(135deg, #a855f7 0%, #8b5cf6 100%)',
                                    boxShadow: isDark
                                        ? '0 4px 16px rgba(168, 85, 247, 0.4)'
                                        : '0 4px 12px rgba(168, 85, 247, 0.25)',
                                }}
                            >
                                👥 Manage Users
                            </motion.button>
                        </Link>
                    </div>
                </motion.div>

                {}
                <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        icon="👥"
                        label="Total Users"
                        value={stats?.total_users || 0}
                        subtext={`${stats?.active_users || 0} active`}
                        color="#a855f7"
                        currentTheme={currentTheme}
                    />
                    <StatCard
                        icon="🟢"
                        label="Online Now"
                        value={onlineUsers.count}
                        subtext="In last 15 min"
                        color="#22c55e"
                        currentTheme={currentTheme}
                    />
                    <StatCard
                        icon="📢"
                        label="Total Alerts"
                        value={stats?.total_alerts || 0}
                        subtext={`${stats?.active_alerts || 0} active`}
                        color="#3b82f6"
                        currentTheme={currentTheme}
                    />
                    <StatCard
                        icon="✅"
                        label="Acknowledgments"
                        value={stats?.total_acknowledgments || 0}
                        subtext={`${stats?.total_reactions || 0} reactions`}
                        color="#f59e0b"
                        currentTheme={currentTheme}
                    />
                </motion.div>

                {}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {}
                    <motion.div variants={fadeInUp} className="lg:col-span-1">
                        <Card>
                            <h3
                                className="text-lg font-semibold mb-4"
                                style={{ color: text.primary }}
                            >
                                Users by Role
                            </h3>
                            {stats?.users_by_role && (
                                <RoleChart data={stats.users_by_role} currentTheme={currentTheme} />
                            )}
                        </Card>
                    </motion.div>

                    {}
                    <motion.div variants={fadeInUp} className="lg:col-span-1">
                        <Card>
                            <h3
                                className="text-lg font-semibold mb-4"
                                style={{ color: text.primary }}
                            >
                                Logins (7 Days)
                            </h3>
                            <div className="space-y-2">
                                {loginStats.map((day, idx) => {
                                    const maxCount = Math.max(...loginStats.map(d => d.count), 1);
                                    const percentage = (day.count / maxCount) * 100;
                                    return (
                                        <div key={idx} className="flex items-center gap-3">
                                            <span
                                                className="text-xs w-20"
                                                style={{ color: text.muted }}
                                            >
                                                {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                            </span>
                                            <div
                                                className="flex-1 h-4 rounded-full overflow-hidden"
                                                style={{
                                                    background: isDark
                                                        ? 'rgba(51, 65, 85, 0.5)'
                                                        : 'rgba(241, 245, 249, 0.8)'
                                                }}
                                            >
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${percentage}%` }}
                                                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                                                    className="h-full rounded-full"
                                                    style={{
                                                        background: 'linear-gradient(90deg, #a855f7 0%, #8b5cf6 100%)',
                                                        ...(isDark && { boxShadow: '0 0 8px rgba(168, 85, 247, 0.5)' }),
                                                    }}
                                                />
                                            </div>
                                            <span
                                                className="text-sm font-medium w-8 text-right"
                                                style={{ color: text.primary }}
                                            >
                                                {day.count}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </Card>
                    </motion.div>

                    {}
                    <motion.div variants={fadeInUp} className="lg:col-span-1">
                        <Card>
                            <h3
                                className="text-lg font-semibold mb-4"
                                style={{ color: text.primary }}
                            >
                                Online Users ({onlineUsers.count})
                            </h3>
                            {onlineUsers.users.length === 0 ? (
                                <p style={{ color: text.muted }} className="text-sm">
                                    No active users
                                </p>
                            ) : (
                                <div className="space-y-2">
                                    {onlineUsers.users.slice(0, 10).map(user => (
                                        <div key={user.id} className="flex items-center gap-2">
                                            <motion.div
                                                className="w-2 h-2 rounded-full bg-green-500"
                                                animate={{ opacity: [1, 0.5, 1] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                            />
                                            <span
                                                className="text-sm"
                                                style={{ color: text.primary }}
                                            >
                                                @{user.username}
                                            </span>
                                            <span
                                                className="text-xs capitalize"
                                                style={{ color: text.muted }}
                                            >
                                                {user.role}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card>
                    </motion.div>
                </div>

                {}
                <motion.div variants={fadeInUp} className="mt-6">
                    <Card>
                        <h3
                            className="text-lg font-semibold mb-4"
                            style={{ color: text.primary }}
                        >
                            Recent Activity
                        </h3>
                        <div className="max-h-[400px] overflow-y-auto">
                            {activities.length === 0 ? (
                                <p
                                    className="text-sm text-center py-8"
                                    style={{ color: text.muted }}
                                >
                                    No activity recorded yet
                                </p>
                            ) : (
                                activities.map(activity => (
                                    <ActivityItem
                                        key={activity.id}
                                        activity={activity}
                                        currentTheme={currentTheme}
                                    />
                                ))
                            )}
                        </div>
                    </Card>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default ControlCenter;
