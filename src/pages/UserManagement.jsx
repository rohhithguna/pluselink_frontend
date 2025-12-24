
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import useThemeStore from '../store/themeStore';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import { pageTransition, fadeInUp, staggerContainer } from '../animations/pageTransitions';
import { getPageBackground, getTextColors, getInputStyle, getModalStyle, getTableStyle } from '../utils/page-theme';


const ROLES = [
    { value: 'super_admin', label: 'Super Admin', color: 'bg-red-500', icon: '👑' },
    { value: 'college_admin', label: 'College Admin', color: 'bg-amber-500', icon: '⚡' },
    { value: 'faculty', label: 'Faculty', color: 'bg-blue-500', icon: '🎓' },
    { value: 'student', label: 'Student', color: 'bg-purple-500', icon: '📚' },
];

const getRoleBadge = (role) => {
    return ROLES.find(r => r.value === role) || ROLES[3];
};


const Modal = ({ isOpen, onClose, title, children }) => (
    <AnimatePresence>
        {isOpen && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl"
                    style={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    }}
                >
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                ✕
                            </button>
                        </div>
                        {children}
                    </div>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);


const UserForm = ({ user, onSubmit, onCancel, isLoading }) => {
    const [formData, setFormData] = useState({
        username: user?.username || '',
        email: user?.email || '',
        password: '',
        confirm_password: '',
        role: user?.role || 'student',
        full_name: user?.full_name || '',
        department: user?.department || '',
        year: user?.year || '',
        section: user?.section || '',
        phone: user?.phone || '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!user && formData.password !== formData.confirm_password) {
            toast.error('Passwords do not match');
            return;
        }

        onSubmit(formData);
    };

    const isEditing = !!user;

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username *</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        disabled={isEditing}
                        required
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all disabled:bg-gray-100"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                    />
                </div>
            </div>

            {!isEditing && (
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required={!isEditing}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
                        <input
                            type="password"
                            name="confirm_password"
                            value={formData.confirm_password}
                            onChange={handleChange}
                            required={!isEditing}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                        />
                    </div>
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                    >
                        {ROLES.map(role => (
                            <option key={role.value} value={role.value}>
                                {role.icon} {role.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                    />
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year/Batch</label>
                    <input
                        type="text"
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                    <input
                        type="text"
                        name="section"
                        value={formData.section}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                />
            </div>

            <div className="flex gap-3 pt-4">
                <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-3 rounded-xl font-semibold text-white disabled:opacity-50"
                    style={{
                        background: 'linear-gradient(135deg, #a855f7 0%, #8b5cf6 100%)',
                    }}
                >
                    {isLoading ? '...' : (isEditing ? 'Update User' : 'Create User')}
                </motion.button>
                <motion.button
                    type="button"
                    onClick={onCancel}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 rounded-xl font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200"
                >
                    Cancel
                </motion.button>
            </div>
        </form>
    );
};


const ResetPasswordForm = ({ user, onSubmit, onCancel, isLoading }) => {
    const [passwords, setPasswords] = useState({ new_password: '', confirm_password: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (passwords.new_password !== passwords.confirm_password) {
            toast.error('Passwords do not match');
            return;
        }
        onSubmit(passwords);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-gray-600 mb-4">
                Reset password for <strong>{user.username}</strong>
            </p>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                    type="password"
                    value={passwords.new_password}
                    onChange={(e) => setPasswords({ ...passwords, new_password: e.target.value })}
                    required
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                    type="password"
                    value={passwords.confirm_password}
                    onChange={(e) => setPasswords({ ...passwords, confirm_password: e.target.value })}
                    required
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                />
            </div>
            <div className="flex gap-3 pt-4">
                <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-3 rounded-xl font-semibold text-white bg-amber-500 disabled:opacity-50"
                >
                    {isLoading ? '...' : 'Reset Password'}
                </motion.button>
                <motion.button
                    type="button"
                    onClick={onCancel}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 rounded-xl font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200"
                >
                    Cancel
                </motion.button>
            </div>
        </form>
    );
};

const UserManagement = () => {
    const navigate = useNavigate();
    const { user: currentUser } = useAuthStore();
    const { theme, currentTheme } = useThemeStore();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const textColors = getTextColors(currentTheme);

    
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [resetPasswordUser, setResetPasswordUser] = useState(null);

    
    useEffect(() => {
        if (currentUser?.role !== 'super_admin') {
            toast.error('Access denied. Super admin only.');
            navigate('/dashboard');
        }
    }, [currentUser, navigate]);

    
    useEffect(() => {
        fetchUsers();
    }, [searchTerm, roleFilter, statusFilter]);

    const fetchUsers = async () => {
        try {
            const params = new URLSearchParams();
            if (searchTerm) params.append('search', searchTerm);
            if (roleFilter) params.append('role', roleFilter);
            if (statusFilter) params.append('is_active', statusFilter);

            const response = await api.get(`/admin/users/?${params}`);
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = async (formData) => {
        setActionLoading(true);
        try {
            await api.post('/admin/users', formData);
            toast.success('User created successfully');
            setShowCreateModal(false);
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Failed to create user');
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpdateUser = async (formData) => {
        setActionLoading(true);
        try {
            await api.put(`/admin/users/${editingUser.id}`, formData);
            toast.success('User updated successfully');
            setEditingUser(null);
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Failed to update user');
        } finally {
            setActionLoading(false);
        }
    };

    const handleToggleActive = async (user) => {
        try {
            if (user.is_active) {
                await api.delete(`/admin/users/${user.id}`);
                toast.success(`User ${user.username} deactivated`);
            } else {
                await api.post(`/admin/users/${user.id}/activate`);
                toast.success(`User ${user.username} activated`);
            }
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Action failed');
        }
    };

    const handleResetPassword = async (passwords) => {
        setActionLoading(true);
        try {
            await api.post(`/admin/users/${resetPasswordUser.id}/reset-password`, passwords);
            toast.success('Password reset successfully');
            setResetPasswordUser(null);
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Failed to reset password');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteUser = async (user) => {
        if (!confirm(`Permanently delete user ${user.username}? This cannot be undone.`)) return;

        try {
            await api.delete(`/admin/users/${user.id}?permanent=true`);
            toast.success('User permanently deleted');
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Failed to delete user');
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
                <motion.div variants={fadeInUp} className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className={`text-4xl font-bold mb-2`} style={theme.textStyle}>
                            👥 User Management
                        </h1>
                        <p className={`${theme.text} opacity-60`}>
                            Manage all users in the system
                        </p>
                    </div>
                    <motion.button
                        onClick={() => setShowCreateModal(true)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-6 py-3 rounded-xl font-semibold text-white"
                        style={{
                            background: 'linear-gradient(135deg, #a855f7 0%, #8b5cf6 100%)',
                        }}
                    >
                        ➕ Create User
                    </motion.button>
                </motion.div>

                {}
                <motion.div variants={fadeInUp}>
                    <Card className="mb-6">
                        <div className="flex flex-wrap gap-4">
                            <div className="flex-1 min-w-[200px]">
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                                />
                            </div>
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="px-4 py-2 rounded-xl border border-gray-200 focus:border-purple-500 outline-none"
                            >
                                <option value="">All Roles</option>
                                {ROLES.map(r => (
                                    <option key={r.value} value={r.value}>{r.label}</option>
                                ))}
                            </select>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-2 rounded-xl border border-gray-200 focus:border-purple-500 outline-none"
                            >
                                <option value="">All Status</option>
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                            </select>
                        </div>
                    </Card>
                </motion.div>

                {}
                <motion.div variants={fadeInUp}>
                    <Card>
                        {loading ? (
                            <div className="text-center py-12">
                                <div className="text-4xl mb-4">⏳</div>
                                <p style={{ color: textColors.muted }}>Loading users...</p>
                            </div>
                        ) : users.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-4xl mb-4">👤</div>
                                <p style={{ color: textColors.muted }}>No users found</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-100">
                                            <th className="text-left py-3 px-4 font-semibold" style={{ color: textColors.secondary }}>User</th>
                                            <th className="text-left py-3 px-4 font-semibold" style={{ color: textColors.secondary }}>Role</th>
                                            <th className="text-left py-3 px-4 font-semibold" style={{ color: textColors.secondary }}>Department</th>
                                            <th className="text-left py-3 px-4 font-semibold" style={{ color: textColors.secondary }}>Status</th>
                                            <th className="text-left py-3 px-4 font-semibold" style={{ color: textColors.secondary }}>Last Login</th>
                                            <th className="text-right py-3 px-4 font-semibold text-gray-600">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user) => {
                                            const roleBadge = getRoleBadge(user.role);
                                            return (
                                                <motion.tr
                                                    key={user.id}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="border-b border-gray-50 hover:bg-purple-50/30 transition-colors"
                                                >
                                                    <td className="py-4 px-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-10 h-10 rounded-full ${roleBadge.color} flex items-center justify-center text-white text-lg`}>
                                                                {roleBadge.icon}
                                                            </div>
                                                            <div>
                                                                <div className="font-medium text-gray-800">{user.full_name || user.username}</div>
                                                                <div className="text-sm" style={{ color: textColors.muted }}>@{user.username}</div>
                                                                <div className="text-xs text-gray-400">{user.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium text-white ${roleBadge.color}`}>
                                                            {roleBadge.icon} {roleBadge.label}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4 text-gray-600">
                                                        {user.department || '-'}
                                                        {user.year && <span className="text-gray-400"> ({user.year})</span>}
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${user.is_active
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-red-100 text-red-700'
                                                            }`}>
                                                            {user.is_active ? '✓ Active' : '✗ Inactive'}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4 text-sm" style={{ color: textColors.muted }}>
                                                        {user.last_login_at
                                                            ? new Date(user.last_login_at).toLocaleString()
                                                            : 'Never'
                                                        }
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => setEditingUser(user)}
                                                                className="p-2 hover:bg-purple-100 rounded-lg transition-colors text-purple-600"
                                                                title="Edit"
                                                            >
                                                                ✏️
                                                            </button>
                                                            <button
                                                                onClick={() => setResetPasswordUser(user)}
                                                                className="p-2 hover:bg-amber-100 rounded-lg transition-colors text-amber-600"
                                                                title="Reset Password"
                                                            >
                                                                🔑
                                                            </button>
                                                            <button
                                                                onClick={() => handleToggleActive(user)}
                                                                className={`p-2 rounded-lg transition-colors ${user.is_active
                                                                    ? 'hover:bg-red-100 text-red-600'
                                                                    : 'hover:bg-green-100 text-green-600'
                                                                    }`}
                                                                title={user.is_active ? 'Deactivate' : 'Activate'}
                                                            >
                                                                {user.is_active ? '🚫' : '✅'}
                                                            </button>
                                                            {!user.is_active && (
                                                                <button
                                                                    onClick={() => handleDeleteUser(user)}
                                                                    className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600"
                                                                    title="Delete Permanently"
                                                                >
                                                                    🗑️
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </Card>
                </motion.div>
            </motion.div>

            {}
            <Modal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Create New User"
            >
                <UserForm
                    onSubmit={handleCreateUser}
                    onCancel={() => setShowCreateModal(false)}
                    isLoading={actionLoading}
                />
            </Modal>

            {}
            <Modal
                isOpen={!!editingUser}
                onClose={() => setEditingUser(null)}
                title="Edit User"
            >
                {editingUser && (
                    <UserForm
                        user={editingUser}
                        onSubmit={handleUpdateUser}
                        onCancel={() => setEditingUser(null)}
                        isLoading={actionLoading}
                    />
                )}
            </Modal>

            {}
            <Modal
                isOpen={!!resetPasswordUser}
                onClose={() => setResetPasswordUser(null)}
                title="Reset Password"
            >
                {resetPasswordUser && (
                    <ResetPasswordForm
                        user={resetPasswordUser}
                        onSubmit={handleResetPassword}
                        onCancel={() => setResetPasswordUser(null)}
                        isLoading={actionLoading}
                    />
                )}
            </Modal>
        </div>
    );
};

export default UserManagement;
