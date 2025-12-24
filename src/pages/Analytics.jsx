import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../services/api';
import useThemeStore from '../store/themeStore';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import { pageTransition, fadeInUp, staggerContainer } from '../animations/pageTransitions';


const getChartThemeConfig = (currentTheme) => {
    const configs = {
        light: {
            backgroundColor: '#ffffff',
            gridColor: 'rgba(0, 0, 0, 0.06)',
            axisColor: '#6B7280',
            tooltipBg: '#ffffff',
            tooltipBorder: '1px solid rgba(168, 85, 247, 0.2)',
            primaryColor: '#8B5CF6',
            secondaryColor: '#A855F7',
            glowFilter: 'none',
        },
        dark: {
            backgroundColor: '#1D1F27',
            gridColor: 'rgba(255, 255, 255, 0.04)',
            axisColor: '#8A8A94',
            tooltipBg: '#23252F',
            tooltipBorder: '1px solid rgba(122, 92, 255, 0.3)',
            primaryColor: '#7A5CFF',
            secondaryColor: '#4CEAFF',
            glowFilter: 'drop-shadow(0 0 8px rgba(122, 92, 255, 0.5))',
        },
        glass: {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            gridColor: 'rgba(255, 255, 255, 0.08)',
            axisColor: '#374151',
            tooltipBg: 'rgba(255, 255, 255, 0.9)',
            tooltipBorder: '1px solid rgba(255, 255, 255, 0.3)',
            primaryColor: '#A855F7',
            secondaryColor: '#8B5CF6',
            glowFilter: 'none',
        },
        neo: {
            backgroundColor: '#E4E8EB',
            gridColor: 'rgba(0, 0, 0, 0.04)',
            axisColor: '#4A5568',
            tooltipBg: '#EAEEF1',
            tooltipBorder: 'none',
            tooltipShadow: '4px 4px 8px rgba(166, 180, 200, 0.25), -4px -4px 8px rgba(255, 255, 255, 0.7)',
            primaryColor: '#8B5CF6',
            secondaryColor: '#A855F7',
            glowFilter: 'none',
        },
    };
    return configs[currentTheme] || configs.light;
};


const getPageBackground = (currentTheme) => {
    const backgrounds = {
        light: 'linear-gradient(135deg, #f9fafb 0%, rgba(168, 85, 247, 0.03) 50%, #f9fafb 100%)',
        dark: 'linear-gradient(145deg, #0F0F12 0%, #181A22 50%, #0F0F12 100%)',
        glass: 'linear-gradient(145deg, rgba(245, 248, 255, 0.92) 0%, rgba(255, 255, 255, 0.85) 30%, rgba(235, 240, 255, 0.9) 70%, rgba(245, 250, 255, 0.95) 100%)',
        neo: 'linear-gradient(145deg, #E8ECEF 0%, #DDE2E6 50%, #E4E8EB 100%)',
    };
    return backgrounds[currentTheme] || backgrounds.light;
};


const getStatCardStyle = (currentTheme) => {
    const styles = {
        light: {
            background: 'rgba(255, 255, 255, 0.88)',
            border: '1px solid rgba(168, 85, 247, 0.08)',
            boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.7), 0 8px 16px rgba(0, 0, 0, 0.10)',
        },
        dark: {
            background: '#1D1F27',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.04)',
        },
        glass: {
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.24)',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.5), 0 8px 32px rgba(0, 0, 0, 0.08)',
        },
        neo: {
            background: '#E4E8EB',
            border: 'none',
            boxShadow: '8px 15px 24px rgba(166, 180, 200, 0.28), -6px -6px 16px rgba(255, 255, 255, 0.85)',
        },
    };
    return styles[currentTheme] || styles.light;
};


const getTextColors = (currentTheme) => {
    const colors = {
        light: { primary: '#111827', secondary: '#6B7280', muted: '#9CA3AF' },
        dark: { primary: '#ECECEC', secondary: '#8A8A94', muted: '#5C5C66' },
        glass: { primary: '#0A0A0A', secondary: '#374151', muted: '#6B7280' },
        neo: { primary: '#1A1D21', secondary: '#4A5568', muted: '#718096' },
    };
    return colors[currentTheme] || colors.light;
};

const Analytics = () => {
    const [stats, setStats] = useState(null);
    const [priorityData, setPriorityData] = useState([]);
    const [timeData, setTimeData] = useState([]);
    const [topReactions, setTopReactions] = useState([]);
    const [engagement, setEngagement] = useState(null);
    const [loading, setLoading] = useState(true);
    const { theme, currentTheme } = useThemeStore();

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const [statsRes, priorityRes, timeRes, reactionsRes, engagementRes] = await Promise.all([
                api.get('/analytics/stats'),
                api.get('/analytics/alerts-by-priority'),
                api.get('/analytics/alerts-over-time?days=7'),
                api.get('/analytics/top-reactions'),
                api.get('/analytics/engagement'),
            ]);

            setStats(statsRes.data);
            setPriorityData(priorityRes.data);
            setTimeData(timeRes.data);
            setTopReactions(reactionsRes.data);
            setEngagement(engagementRes.data);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const chartConfig = getChartThemeConfig(currentTheme);
    const textColors = getTextColors(currentTheme);
    const statCardStyle = getStatCardStyle(currentTheme);

    const COLORS = currentTheme === 'dark'
        ? ['#EF4444', '#FBBF24', '#4CEAFF', '#7A5CFF']
        : ['#EF4444', '#F59E0B', '#3B82F6', '#6B21A8'];

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
                <motion.div variants={fadeInUp} className="mb-8">
                    <h1
                        className="text-4xl font-bold mb-2"
                        style={{
                            color: textColors.primary,
                            ...(currentTheme === 'dark' && {
                                background: 'linear-gradient(135deg, #ECECEC 0%, #B8AAFF 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            })
                        }}
                    >
                        Analytics
                    </h1>
                    <p style={{ color: textColors.muted }}>
                        Alert statistics and user engagement metrics
                    </p>
                </motion.div>

                {loading ? (
                    <motion.div
                        className="text-center py-12"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        <div className="text-6xl mb-4">📊</div>
                        <p style={{ color: textColors.muted }}>Loading analytics...</p>
                    </motion.div>
                ) : (
                    <motion.div variants={staggerContainer} className="space-y-8">
                        {}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {stats && [
                                { label: 'Total Alerts', value: stats.total_alerts, icon: '📢' },
                                { label: 'Active Alerts', value: stats.active_alerts, icon: '✅' },
                                { label: 'Total Reactions', value: stats.total_reactions, icon: '❤️' },
                                { label: 'Total Users', value: stats.total_users, icon: '👥' },
                            ].map((stat, index) => (
                                <motion.div
                                    key={stat.label}
                                    variants={fadeInUp}
                                    custom={index}
                                    whileHover={{
                                        y: -4,
                                        boxShadow: currentTheme === 'dark'
                                            ? '0 8px 24px rgba(0, 0, 0, 0.5), 0 0 32px rgba(122, 92, 255, 0.08)'
                                            : undefined
                                    }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                    className="rounded-2xl p-6"
                                    style={statCardStyle}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p
                                                className="text-sm mb-1"
                                                style={{ color: textColors.muted }}
                                            >
                                                {stat.label}
                                            </p>
                                            <p
                                                className="text-3xl font-bold"
                                                style={{ color: textColors.primary }}
                                            >
                                                {stat.value}
                                            </p>
                                        </div>
                                        <div
                                            className="text-4xl"
                                            style={{
                                                filter: currentTheme === 'dark' ? chartConfig.glowFilter : 'none'
                                            }}
                                        >
                                            {stat.icon}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {}
                        {engagement && (
                            <motion.div variants={fadeInUp}>
                                <motion.div
                                    className="rounded-2xl p-6"
                                    style={statCardStyle}
                                    whileHover={{ y: -2 }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                >
                                    <h3
                                        className="text-xl font-bold mb-4"
                                        style={{ color: textColors.primary }}
                                    >
                                        User Engagement
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                        {[
                                            { label: 'Total Views', value: engagement.total_views },
                                            { label: 'Total Reactions', value: engagement.total_reactions },
                                            { label: 'View Rate', value: `${engagement.view_rate}%` },
                                            { label: 'Reaction Rate', value: `${engagement.reaction_rate}%` },
                                        ].map((item) => (
                                            <div key={item.label}>
                                                <p
                                                    className="text-sm mb-1"
                                                    style={{ color: textColors.muted }}
                                                >
                                                    {item.label}
                                                </p>
                                                <p
                                                    className="text-2xl font-bold"
                                                    style={{ color: textColors.primary }}
                                                >
                                                    {item.value}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}

                        {}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {}
                            <motion.div variants={fadeInUp}>
                                <motion.div
                                    className="rounded-2xl p-6"
                                    style={statCardStyle}
                                    whileHover={{ y: -2 }}
                                >
                                    <h3
                                        className="text-xl font-bold mb-4"
                                        style={{ color: textColors.primary }}
                                    >
                                        Alerts by Priority
                                    </h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={priorityData}>
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                stroke={chartConfig.gridColor}
                                                vertical={false}
                                            />
                                            <XAxis
                                                dataKey="priority"
                                                stroke={chartConfig.axisColor}
                                                tick={{ fill: chartConfig.axisColor }}
                                                axisLine={{ stroke: chartConfig.gridColor }}
                                            />
                                            <YAxis
                                                stroke={chartConfig.axisColor}
                                                tick={{ fill: chartConfig.axisColor }}
                                                axisLine={{ stroke: chartConfig.gridColor }}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: chartConfig.tooltipBg,
                                                    border: chartConfig.tooltipBorder,
                                                    borderRadius: '12px',
                                                    boxShadow: chartConfig.tooltipShadow || '0 8px 24px rgba(0, 0, 0, 0.15)',
                                                }}
                                                labelStyle={{ color: textColors.primary }}
                                            />
                                            <Bar
                                                dataKey="count"
                                                fill={chartConfig.primaryColor}
                                                radius={[6, 6, 0, 0]}
                                                style={{ filter: chartConfig.glowFilter }}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </motion.div>
                            </motion.div>

                            {}
                            <motion.div variants={fadeInUp}>
                                <motion.div
                                    className="rounded-2xl p-6"
                                    style={statCardStyle}
                                    whileHover={{ y: -2 }}
                                >
                                    <h3
                                        className="text-xl font-bold mb-4"
                                        style={{ color: textColors.primary }}
                                    >
                                        Alerts Over Time (Last 7 Days)
                                    </h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={timeData}>
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                stroke={chartConfig.gridColor}
                                            />
                                            <XAxis
                                                dataKey="date"
                                                stroke={chartConfig.axisColor}
                                                tick={{ fill: chartConfig.axisColor }}
                                            />
                                            <YAxis
                                                stroke={chartConfig.axisColor}
                                                tick={{ fill: chartConfig.axisColor }}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: chartConfig.tooltipBg,
                                                    border: chartConfig.tooltipBorder,
                                                    borderRadius: '12px',
                                                    boxShadow: chartConfig.tooltipShadow || '0 8px 24px rgba(0, 0, 0, 0.15)',
                                                }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="count"
                                                stroke={chartConfig.primaryColor}
                                                strokeWidth={3}
                                                dot={{
                                                    fill: chartConfig.primaryColor,
                                                    strokeWidth: 2,
                                                    r: 4,
                                                }}
                                                activeDot={{
                                                    r: 6,
                                                    fill: chartConfig.secondaryColor,
                                                    style: { filter: chartConfig.glowFilter }
                                                }}
                                                style={{ filter: currentTheme === 'dark' ? 'drop-shadow(0 0 6px rgba(122, 92, 255, 0.4))' : 'none' }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </motion.div>
                            </motion.div>
                        </div>

                        {}
                        {topReactions.length > 0 && (
                            <motion.div variants={fadeInUp}>
                                <motion.div
                                    className="rounded-2xl p-6"
                                    style={statCardStyle}
                                    whileHover={{ y: -2 }}
                                >
                                    <h3
                                        className="text-xl font-bold mb-4"
                                        style={{ color: textColors.primary }}
                                    >
                                        Top Reactions
                                    </h3>
                                    <div className="flex gap-8 flex-wrap">
                                        {topReactions.map((reaction, index) => (
                                            <motion.div
                                                key={index}
                                                className="text-center"
                                                whileHover={{
                                                    scale: 1.1,
                                                    filter: currentTheme === 'dark' ? 'drop-shadow(0 0 12px rgba(122, 92, 255, 0.5))' : 'none'
                                                }}
                                                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                                            >
                                                <div
                                                    className="text-5xl mb-2"
                                                    style={{
                                                        filter: currentTheme === 'dark' ? chartConfig.glowFilter : 'none'
                                                    }}
                                                >
                                                    {reaction.emoji}
                                                </div>
                                                <div
                                                    className="text-2xl font-bold"
                                                    style={{ color: textColors.primary }}
                                                >
                                                    {reaction.count}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default Analytics;
