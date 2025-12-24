import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import useAlertStore from '../store/alertStore';
import useAuthStore from '../store/authStore';
import useThemeStore from '../store/themeStore';
import Navbar from '../components/Navbar';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import RichTextEditor from '../components/RichTextEditor';
import TemplateSelector from '../components/TemplateSelector';

const CreateAlert = () => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [priority, setPriority] = useState('info');
    const [category, setCategory] = useState('general');
    const [targetRole, setTargetRole] = useState('all'); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const { createAlert } = useAlertStore();
    const { user } = useAuthStore();
    const { theme } = useThemeStore();
    const navigate = useNavigate();

    
    const resetForm = () => {
        setTitle('');
        setMessage('');
        setPriority('info');
        setCategory('general');
        if (user?.role !== 'faculty') {
            setTargetRole('all');
        }
        setError('');
        setSuccessMessage('');
        setLoading(false);
    };

    
    const availableTargets = useMemo(() => {
        if (!user) return [];

        const role = user.role;

        if (role === 'super_admin' || role === 'college_admin') {
            return [
                { value: 'all', label: '📢 All Users', desc: 'Broadcast to everyone' },
                { value: 'students', label: '👨‍🎓 Only Students', desc: 'All student accounts' },
                { value: 'faculty', label: '👨‍🏫 Only Faculty', desc: 'All faculty members' },
            ];
        } else if (role === 'faculty') {
            return [
                { value: 'students', label: '👨‍🎓 Only Students', desc: 'All student accounts (auto-selected)' },
            ];
        }

        return [];
    }, [user]);

    
    useEffect(() => {
        if (user?.role === 'faculty') {
            setTargetRole('students');
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setLoading(true);

        
        const target_roles = targetRole === 'all'
            ? ['all']
            : targetRole === 'students'
                ? ['student']
                : ['faculty'];

        const result = await createAlert({
            title,
            message,
            priority,
            category,
            target_roles
        });

        if (result.success) {
            
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#a855f7', '#ec4899', '#3b82f6']
            });

            
            const targetLabel = targetRole === 'all' ? 'all users' :
                targetRole === 'students' ? 'students only' : 'faculty only';
            setSuccessMessage(`✅ Alert sent successfully to ${targetLabel}!`);

            
            setTitle('');
            setMessage('');
            setPriority('info');
            setCategory('general');
            setLoading(false);
        } else {
            setError(result.error || 'Failed to create alert');
            setLoading(false);
        }
    };

    const priorities = [
        { value: 'emergency', label: '🚨 Emergency', desc: 'Critical situations' },
        { value: 'important', label: '⚠️ Important', desc: 'Significant updates' },
        { value: 'info', label: 'ℹ️ Info', desc: 'General information' },
        { value: 'reminder', label: '⏰ Reminder', desc: 'Upcoming events' },
    ];

    return (
        <div className="min-h-screen">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {}
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-h1 font-bold mb-2" style={{ color: '#111827' }}>
                        Create Alert
                    </h1>
                    <p className="text-body" style={{ color: '#6b7280' }}>
                        Broadcast a new alert to your target audience
                    </p>
                </motion.div>

                <Card>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {}
                        <TemplateSelector onSelectTemplate={(template) => {
                            if (template) {
                                setTitle(template.title);
                                setMessage(template.message);
                                setPriority(template.priority);
                                setCategory(template.category);
                            }
                        }} />

                        {}
                        <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: '#111827' }}>
                                Category
                            </label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 transition-premium focus:outline-none focus:ring-2 focus:ring-primary/20"
                                style={{ color: '#111827' }}
                            >
                                <option value="general">📢 General</option>
                                <option value="emergency">🚨 Emergency</option>
                                <option value="academic">📚 Academic</option>
                                <option value="event">🎉 Event</option>
                                <option value="maintenance">🔧 Maintenance</option>
                                <option value="weather">🌤️ Weather</option>
                            </select>
                        </div>
                        {}
                        <Input
                            label="Alert Title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter alert title"
                            required
                        />

                        {}
                        <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: '#111827' }}>
                                Message <span className="text-red-500">*</span>
                            </label>
                            <RichTextEditor
                                value={message}
                                onChange={setMessage}
                                placeholder="Enter alert message..."
                            />
                        </div>

                        {}
                        {availableTargets.length > 0 && (
                            <div style={{ position: 'relative', zIndex: 10 }}>
                                <label className="block text-sm font-medium mb-3" style={{ color: '#111827' }}>
                                    Send To <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    {availableTargets.map((target) => {
                                        const isSelected = targetRole === target.value;
                                        const isLocked = user?.role === 'faculty' && availableTargets.length === 1;

                                        return (
                                            <button
                                                key={target.value}
                                                type="button"
                                                onClick={() => {
                                                    if (!isLocked) {
                                                        setTargetRole(target.value);
                                                    }
                                                }}
                                                disabled={isLocked}
                                                className={`
                                                    p-4 rounded-xl border-2 text-left
                                                    transition-all duration-200 ease-out
                                                    hover:scale-[1.02] active:scale-[0.98]
                                                    ${isSelected
                                                        ? 'border-purple-500 bg-purple-50 shadow-md'
                                                        : 'border-gray-200 hover:border-gray-300 bg-white'
                                                    }
                                                    ${isLocked ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}
                                                `}
                                                style={{ position: 'relative', zIndex: 20 }}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`
                                                        w-5 h-5 rounded-full border-2 flex items-center justify-center
                                                        ${isSelected ? 'border-purple-500' : 'border-gray-400'}
                                                    `}>
                                                        {isSelected && (
                                                            <div className="w-3 h-3 rounded-full bg-purple-500" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium" style={{ color: '#111827' }}>
                                                            {target.label}
                                                        </div>
                                                        <div className="text-sm" style={{ color: '#6b7280' }}>
                                                            {target.desc}
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                                {user?.role === 'faculty' && (
                                    <p className="text-sm text-purple-600 mt-2">
                                        Faculty members can only send alerts to Students
                                    </p>
                                )}
                            </div>
                        )}

                        {}
                        <div>
                            <label className="block text-sm font-medium mb-3" style={{ color: '#111827' }}>
                                Priority Level <span className="text-red-500">*</span>
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {priorities.map((p) => (
                                    <motion.button
                                        key={p.value}
                                        type="button"
                                        onClick={() => setPriority(p.value)}
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        className={`
                                            p-4 rounded-xl border-2 text-left
                                            transition-premium
                                            ${priority === p.value
                                                ? 'border-primary bg-primary/5'
                                                : 'border-neutral-200 hover:border-neutral-300'
                                            }
                                        `}
                                    >
                                        <div className="font-semibold mb-1" style={{ color: '#111827' }}>
                                            {p.label}
                                        </div>
                                        <div className="text-caption" style={{ color: '#6b7280' }}>
                                            {p.desc}
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm"
                            >
                                {error}
                            </motion.div>
                        )}

                        {}
                        {successMessage && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 rounded-lg bg-green-50 border border-green-200"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-green-700 font-medium">{successMessage}</span>
                                    <button
                                        type="button"
                                        onClick={() => navigate('/dashboard')}
                                        className="text-green-600 hover:text-green-800 underline text-sm"
                                    >
                                        View Dashboard →
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {}
                        <div className="flex gap-3 pt-2">
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={loading}
                                className="flex-1"
                            >
                                {loading ? 'Broadcasting...' : 'Broadcast Alert'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate('/dashboard')}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default CreateAlert;
