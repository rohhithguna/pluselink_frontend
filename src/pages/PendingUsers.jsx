
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import useThemeStore from '../store/themeStore';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import { pageTransition, fadeInUp } from '../animations/pageTransitions';
import { getPageBackground, getTextColors } from '../utils/page-theme';


const ROLES = {
    faculty: { label: 'Faculty', color: 'bg-blue-500', icon: '👨‍🏫' },
    student: { label: 'Student', color: 'bg-purple-500', icon: '🎓' },
};

const getRoleBadge = (role) => {
    return ROLES[role] || { label: role, color: 'bg-gray-500', icon: '👤' };
};


const getGenderDisplay = (gender) => {
    const genders = {
        male: { label: 'Male', icon: '♂️' },
        female: { label: 'Female', icon: '♀️' },
        other: { label: 'Other', icon: '⚧️' },
    };
    return genders[gender] || null;
};


const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const PendingUsers = () => {
    const navigate = useNavigate();
    const { user: currentUser } = useAuthStore();
    const { theme, currentTheme } = useThemeStore();

    const [pendingUsers, setPendingUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState({});
    const [pendingCount, setPendingCount] = useState(0);

    
    useEffect(() => {
        if (currentUser?.role !== 'super_admin') {
            toast.error('Access denied. Super admin only.');
            navigate('/dashboard');
        }
    }, [currentUser, navigate]);

    
    useEffect(() => {
        if (currentUser?.role === 'super_admin') {
            fetchPendingUsers();
        }
    }, [currentUser]);

    const fetchPendingUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/pending-users/');
            setPendingUsers(response.data);
            setPendingCount(response.data.length);
        } catch (error) {
            console.error('Error fetching pending users:', error);
            if (error.response?.status === 403) {
                toast.error('Access denied');
                navigate('/dashboard');
            } else {
                toast.error('Failed to load pending users');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (userId, username) => {
        setActionLoading(prev => ({ ...prev, [userId]: 'approve' }));
        try {
            await api.post(`/admin/pending-users/${userId}/approve`);
            
            setPendingUsers(prev => prev.filter(u => u.id !== userId));
            setPendingCount(prev => prev - 1);
            toast.success(`✅ ${username} approved and can now log in.`, {
                style: {
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    fontWeight: '500',
                },
                icon: '🎉',
            });
        } catch (error) {
            console.error('Error approving user:', error);
            toast.error(error.response?.data?.detail || 'Failed to approve user');
        } finally {
            setActionLoading(prev => ({ ...prev, [userId]: null }));
        }
    };

    const handleReject = async (userId, username) => {
        if (!confirm(`Reject ${username}'s signup request? This will delete their account.`)) {
            return;
        }

        setActionLoading(prev => ({ ...prev, [userId]: 'reject' }));
        try {
            await api.delete(`/admin/pending-users/${userId}`);
            
            setPendingUsers(prev => prev.filter(u => u.id !== userId));
            setPendingCount(prev => prev - 1);
            toast('User request rejected.', {
                icon: '🚫',
                style: {
                    background: '#f3f4f6',
                    color: '#374151',
                },
            });
        } catch (error) {
            console.error('Error rejecting user:', error);
            toast.error(error.response?.data?.detail || 'Failed to reject user');
        } finally {
            setActionLoading(prev => ({ ...prev, [userId]: null }));
        }
    };

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
                <motion.div
                    variants={fadeInUp}
                    className="mb-8"
                >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
                                ⏳ Pending Approvals
                            </h1>
                            <p className={`${theme.text} opacity-60`}>
                                Review and approve new user registrations
                            </p>
                        </div>

                        {}
                        <motion.div
                            animate={pendingCount > 0 ? { scale: [1, 1.05, 1] } : {}}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="flex items-center gap-3"
                        >
                            <div
                                className="px-6 py-3 rounded-2xl"
                                style={{
                                    background: pendingCount > 0
                                        ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
                                        : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    boxShadow: pendingCount > 0
                                        ? '0 4px 20px rgba(245, 158, 11, 0.3)'
                                        : '0 4px 20px rgba(16, 185, 129, 0.3)',
                                }}
                            >
                                <div className="flex items-center gap-2 text-white font-semibold">
                                    <span className="text-2xl">
                                        {pendingCount > 0 ? '📋' : '✨'}
                                    </span>
                                    <span className="text-lg">
                                        {pendingCount} {pendingCount === 1 ? 'Request' : 'Requests'} Pending
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                {}
                <motion.div variants={fadeInUp}>
                    <Card
                        className="overflow-hidden"
                        style={{
                            background: currentTheme === 'dark'
                                ? 'rgba(17, 24, 39, 0.8)'
                                : 'rgba(255, 255, 255, 0.8)',
                            backdropFilter: 'blur(20px)',
                        }}
                    >
                        {loading ? (
                            <div className="text-center py-16">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="text-5xl mb-4 inline-block"
                                >
                                    ⏳
                                </motion.div>
                                <p className={`text-body ${theme.textMuted}`}>Loading pending users...</p>
                            </div>
                        ) : pendingUsers.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-16"
                            >
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="text-7xl mb-6"
                                >
                                    🎉
                                </motion.div>
                                <h3 className={`text-2xl font-semibold mb-2`} style={theme.textStyle}>
                                    All Caught Up!
                                </h3>
                                <p className={`text-body ${theme.textMuted}`}>
                                    No pending approval requests right now.
                                </p>
                            </motion.div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className={`border-b ${currentTheme === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}>
                                            <th className={`text-left py-4 px-6 font-semibold ${theme.textMuted}`}>User</th>
                                            <th className={`text-left py-4 px-4 font-semibold ${theme.textMuted}`}>Role</th>
                                            <th className={`text-left py-4 px-4 font-semibold ${theme.textMuted}`}>Contact</th>
                                            <th className={`text-left py-4 px-4 font-semibold ${theme.textMuted}`}>Gender</th>
                                            <th className={`text-left py-4 px-4 font-semibold ${theme.textMuted}`}>Signed Up</th>
                                            <th className={`text-center py-4 px-6 font-semibold ${theme.textMuted}`}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <AnimatePresence mode="popLayout">
                                            {pendingUsers.map((user, index) => {
                                                const roleBadge = getRoleBadge(user.role);
                                                const genderInfo = getGenderDisplay(user.gender);
                                                const isApproving = actionLoading[user.id] === 'approve';
                                                const isRejecting = actionLoading[user.id] === 'reject';

                                                return (
                                                    <motion.tr
                                                        key={user.id}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, x: -100, height: 0 }}
                                                        transition={{
                                                            delay: index * 0.05,
                                                            duration: 0.3,
                                                            exit: { duration: 0.2 }
                                                        }}
                                                        className={`border-b ${currentTheme === 'dark' ? 'border-gray-700/50 hover:bg-gray-800/50' : 'border-gray-50 hover:bg-purple-50/30'} transition-colors`}
                                                    >
                                                        <td className="py-4 px-6">
                                                            <div className="flex items-center gap-3">
                                                                <motion.div
                                                                    whileHover={{ scale: 1.1 }}
                                                                    className={`w-12 h-12 rounded-full ${roleBadge.color} flex items-center justify-center text-white text-xl`}
                                                                >
                                                                    {roleBadge.icon}
                                                                </motion.div>
                                                                <div>
                                                                    <div className={`font-medium`} style={theme.textStyle}>
                                                                        {user.full_name || 'No Name'}
                                                                    </div>
                                                                    <div className={`text-sm ${theme.textMuted}`}>
                                                                        @{user.username}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-4">
                                                            <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-white ${roleBadge.color}`}>
                                                                {roleBadge.icon} {roleBadge.label}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-4">
                                                            <div className="space-y-1">
                                                                {user.email ? (
                                                                    <div className={`text-sm`} style={theme.textStyle}>
                                                                        📧 {user.email}
                                                                    </div>
                                                                ) : null}
                                                                {user.phone ? (
                                                                    <div className={`text-sm ${theme.textMuted}`}>
                                                                        📱 {user.phone}
                                                                    </div>
                                                                ) : null}
                                                                {!user.email && !user.phone && (
                                                                    <span className={`text-sm ${theme.textMuted}`}>—</span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-4">
                                                            {genderInfo ? (
                                                                <span className={`text-sm ${theme.textMuted}`}>
                                                                    {genderInfo.icon} {genderInfo.label}
                                                                </span>
                                                            ) : (
                                                                <span className={`text-sm ${theme.textMuted}`}>—</span>
                                                            )}
                                                        </td>
                                                        <td className="py-4 px-4">
                                                            <span className={`text-sm ${theme.textMuted}`}>
                                                                {formatDate(user.created_at)}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-6">
                                                            <div className="flex items-center justify-center gap-2">
                                                                {}
                                                                <motion.button
                                                                    onClick={() => handleApprove(user.id, user.username)}
                                                                    disabled={isApproving || isRejecting}
                                                                    whileHover={{ scale: 1.05 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                    className="px-4 py-2 rounded-xl font-semibold text-sm text-white disabled:opacity-50 flex items-center gap-2"
                                                                    style={{
                                                                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                                                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                                                                    }}
                                                                >
                                                                    {isApproving ? (
                                                                        <>
                                                                            <motion.span
                                                                                animate={{ rotate: 360 }}
                                                                                transition={{ duration: 1, repeat: Infinity }}
                                                                            >
                                                                                ⏳
                                                                            </motion.span>
                                                                            Approving...
                                                                        </>
                                                                    ) : (
                                                                        <>✅ Approve</>
                                                                    )}
                                                                </motion.button>

                                                                {}
                                                                <motion.button
                                                                    onClick={() => handleReject(user.id, user.username)}
                                                                    disabled={isApproving || isRejecting}
                                                                    whileHover={{ scale: 1.05 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                    className={`px-4 py-2 rounded-xl font-semibold text-sm disabled:opacity-50 flex items-center gap-2 ${currentTheme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-red-900/50 hover:text-red-400' : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'} transition-colors`}
                                                                >
                                                                    {isRejecting ? (
                                                                        <>
                                                                            <motion.span
                                                                                animate={{ rotate: 360 }}
                                                                                transition={{ duration: 1, repeat: Infinity }}
                                                                            >
                                                                                ⏳
                                                                            </motion.span>
                                                                            ...
                                                                        </>
                                                                    ) : (
                                                                        <>🚫 Reject</>
                                                                    )}
                                                                </motion.button>
                                                            </div>
                                                        </td>
                                                    </motion.tr>
                                                );
                                            })}
                                        </AnimatePresence>
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </Card>
                </motion.div>

                {}
                <motion.p
                    variants={fadeInUp}
                    className={`mt-6 text-center text-sm ${theme.textMuted}`}
                >
                    💡 Approved users will receive login access immediately. Rejected requests are permanently deleted.
                </motion.p>
            </motion.div>
        </div>
    );
};

export default PendingUsers;
