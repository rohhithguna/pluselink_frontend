
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../services/api';
import useThemeStore from '../store/themeStore';
import useAuthStore from '../store/authStore';
import useSettingsStore from '../store/settingsStore';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import BadgeCollection from '../components/BadgeCollection';
import GradientAvatar from '../components/GradientAvatar';
import { pageTransition, fadeInUp, staggerContainer } from '../animations/pageTransitions';
import { getPageBackground, getTextColors, getInputStyle, getPrimaryButtonStyle } from '../utils/page-theme';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [badges, setBadges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});
    const { theme, currentTheme } = useThemeStore();
    const { updateUser } = useAuthStore();
    const avatarGradient = useSettingsStore((s) => s.avatarGradient);
    const text = getTextColors(currentTheme);
    const inputStyle = getInputStyle(currentTheme);
    const isDark = currentTheme === 'dark';

    useEffect(() => {
        fetchUserProfile();
        fetchUserBadges();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const response = await api.get('/users/me');
            setUser(response.data);
            setEditData({
                email: response.data.email || '',
                full_name: response.data.full_name || '',
                department: response.data.department || '',
                year: response.data.year || '',
                section: response.data.section || '',
                phone: response.data.phone || '',
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const fetchUserBadges = async () => {
        try {
            const response = await api.get('/badges/me');
            setBadges(response.data.badges || []);
            
            if (response.data.badges?.some(b => b.is_new)) {
                await api.post('/badges/mark-seen');
            }
        } catch (error) {
            console.error('Error fetching badges:', error);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await api.put('/users/me', editData);
            setUser(response.data);
            updateUser(response.data);
            setIsEditing(false);
            toast.success('Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(error.response?.data?.detail || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    const getRoleBadge = (role) => {
        const badges = {
            super_admin: { label: 'Super Admin', color: 'bg-red-500', icon: '👑' },
            college_admin: { label: 'College Admin', color: 'bg-amber-500', icon: '⚡' },
            faculty: { label: 'Faculty', color: 'bg-blue-500', icon: '🎓' },
            student: { label: 'Student', color: 'bg-purple-500', icon: '📚' },
        };
        return badges[role] || badges.student;
    };

    const EditableField = ({ label, name, value, type = 'text', editable = true }) => (
        <div>
            <p className={`text-sm ${theme.text} opacity-60 mb-1`}>{label}</p>
            {isEditing && editable ? (
                <input
                    type={type}
                    name={name}
                    value={editData[name] || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                />
            ) : (
                <p className={`${theme.text} font-medium`}>{value || '-'}</p>
            )}
        </div>
    );

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
                className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
            >
                <motion.div variants={fadeInUp} className="mb-8 flex items-center justify-between">
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
                            Profile
                        </h1>
                        <p style={{ color: text.muted }}>
                            Your account information and activity
                        </p>
                    </div>
                    {user && !loading && (
                        <motion.button
                            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                            disabled={saving}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`px-6 py-2.5 rounded-xl font-semibold text-white disabled:opacity-50 ${isEditing
                                ? 'bg-green-500 hover:bg-green-600'
                                : ''
                                }`}
                            style={!isEditing ? {
                                background: 'linear-gradient(135deg, #a855f7 0%, #8b5cf6 100%)',
                            } : {}}
                        >
                            {saving ? '...' : (isEditing ? '✓ Save Changes' : '✏️ Edit Profile')}
                        </motion.button>
                    )}
                </motion.div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">⏳</div>
                        <p className={`${theme.text} opacity-60`}>Loading profile...</p>
                    </div>
                ) : user ? (
                    <motion.div variants={staggerContainer} className="space-y-6">
                        {}
                        <motion.div variants={fadeInUp}>
                            <Card>
                                <div className="flex items-center gap-6">
                                    <GradientAvatar
                                        gradient={avatarGradient || 'aurora'}
                                        role={user.role || 'student'}
                                        size="2xl"
                                        name={user.full_name}
                                        showShadow={true}
                                        showRing={true}
                                        animate={true}
                                    />
                                    <div className="flex-1">
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name="full_name"
                                                value={editData.full_name}
                                                onChange={handleChange}
                                                placeholder="Full Name"
                                                className="text-3xl font-bold mb-2 w-full px-2 py-1 rounded-lg border border-gray-200 focus:border-purple-500 outline-none"
                                            />
                                        ) : (
                                            <h2
                                                className="text-3xl font-bold mb-2"
                                                style={{ color: text.primary }}
                                            >
                                                {user.full_name}
                                            </h2>
                                        )}
                                        <p
                                            className="mb-3"
                                            style={{ color: text.muted }}
                                        >
                                            @{user.username}
                                        </p>
                                        <span
                                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white ${getRoleBadge(user.role).color}`}
                                        >
                                            {getRoleBadge(user.role).icon} {getRoleBadge(user.role).label}
                                        </span>
                                    </div>
                                </div>

                                {isEditing && (
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <motion.button
                                            onClick={() => {
                                                setIsEditing(false);
                                                setEditData({
                                                    email: user.email || '',
                                                    full_name: user.full_name || '',
                                                    department: user.department || '',
                                                    year: user.year || '',
                                                    section: user.section || '',
                                                    phone: user.phone || '',
                                                });
                                            }}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="px-4 py-2 rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200 font-medium"
                                        >
                                            Cancel
                                        </motion.button>
                                    </div>
                                )}
                            </Card>
                        </motion.div>

                        {}
                        <motion.div variants={fadeInUp}>
                            <Card className="badge-stats-card">
                                <BadgeCollection
                                    badges={badges}
                                    size="lg"
                                    title="Achievements"
                                />
                            </Card>
                        </motion.div>

                        {}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <motion.div variants={fadeInUp}>
                                <Card>
                                    <h3 className={`text-lg font-semibold mb-4`} style={theme.textStyle}>
                                        Contact Information
                                    </h3>
                                    <div className="space-y-3">
                                        <EditableField label="Email" name="email" value={user.email} type="email" />
                                        <EditableField label="Phone" name="phone" value={user.phone} type="tel" />
                                        <div>
                                            <p className={`text-sm ${theme.text} opacity-60 mb-1`}>Username</p>
                                            <p className={`${theme.text} font-medium`}>{user.username}</p>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>

                            <motion.div variants={fadeInUp}>
                                <Card>
                                    <h3 className={`text-lg font-semibold mb-4`} style={theme.textStyle}>
                                        Academic Information
                                    </h3>
                                    <div className="space-y-3">
                                        <EditableField label="Department" name="department" value={user.department} />
                                        <EditableField label="Year / Batch" name="year" value={user.year} />
                                        <EditableField label="Section" name="section" value={user.section} />
                                    </div>
                                </Card>
                            </motion.div>
                        </div>

                        {}
                        <motion.div variants={fadeInUp}>
                            <Card>
                                <h3 className={`text-lg font-semibold mb-4`} style={theme.textStyle}>
                                    Account Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <p className={`text-sm ${theme.text} opacity-60 mb-1`}>User ID</p>
                                        <p className={`${theme.text} font-medium`}>#{user.id}</p>
                                    </div>
                                    <div>
                                        <p className={`text-sm ${theme.text} opacity-60 mb-1`}>Role</p>
                                        <p className={`${theme.text} font-medium`}>{getRoleBadge(user.role).label}</p>
                                    </div>
                                    <div>
                                        <p className={`text-sm ${theme.text} opacity-60 mb-1`}>Status</p>
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${user.is_active
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-red-100 text-red-700'
                                            }`}>
                                            {user.is_active ? '✓ Active' : '✗ Inactive'}
                                        </span>
                                    </div>
                                </div>
                                {user.last_login_at && (
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <p className={`text-sm ${theme.text} opacity-60`}>
                                            Last login: {new Date(user.last_login_at).toLocaleString()}
                                        </p>
                                    </div>
                                )}
                            </Card>
                        </motion.div>

                        {}
                        <motion.div variants={fadeInUp}>
                            <Card>
                                <h3 className={`text-lg font-semibold mb-4`} style={theme.textStyle}>
                                    Permissions
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { label: 'View Alerts', allowed: true },
                                        { label: 'Create Alerts', allowed: user.role !== 'student' },
                                        { label: 'View Analytics', allowed: true },
                                        { label: 'Manage Users', allowed: user.role === 'super_admin' },
                                        { label: 'React to Alerts', allowed: true },
                                        { label: 'Delete Alerts', allowed: user.role === 'super_admin' || user.role === 'college_admin' },
                                        { label: 'Control Center', allowed: user.role === 'super_admin' },
                                        { label: 'Reset Passwords', allowed: user.role === 'super_admin' },
                                    ].map((perm) => (
                                        <div key={perm.label} className="flex items-center gap-3">
                                            <div className={`
                                                w-6 h-6 rounded-full flex items-center justify-center text-white text-xs
                                                ${perm.allowed ? 'bg-green-500' : 'bg-red-500'}
                                            `}>
                                                {perm.allowed ? '✓' : '✗'}
                                            </div>
                                            <span className={`${theme.text}`}>{perm.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </motion.div>
                    </motion.div>
                ) : null}
            </motion.div>
        </div>
    );
};

export default Profile;
