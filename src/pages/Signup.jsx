
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Signup = () => {
    
    const [formData, setFormData] = useState({
        full_name: '',
        username: '',
        password: '',
        confirmPassword: '',
        role: 'student',
        gender: '',
        email: '',
        phone: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [focusedField, setFocusedField] = useState(null);

    const navigate = useNavigate();
    const containerRef = useRef(null);

    
    useEffect(() => {
        setTimeout(() => setIsLoaded(true), 100);
    }, []);

    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        if (fieldErrors[name]) {
            setFieldErrors(prev => ({ ...prev, [name]: '' }));
        }
        setError('');
    };

    
    const validateForm = () => {
        const errors = {};

        if (!formData.full_name.trim()) {
            errors.full_name = 'Full name is required';
        }

        if (!formData.username.trim()) {
            errors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            errors.username = 'Username must be at least 3 characters';
        }

        if (!formData.password) {
            errors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        setError('');

        try {
            const response = await api.post('/auth/signup', {
                full_name: formData.full_name,
                username: formData.username,
                password: formData.password,
                role: formData.role,
                gender: formData.gender || null,
                email: formData.email || null,
                phone: formData.phone || null,
            });

            if (response.data.status === 'pending_approval') {
                setShowSuccess(true);
                
                setTimeout(() => {
                    navigate('/login');
                }, 4000);
            }
        } catch (err) {
            const errorMessage = err.response?.data?.detail || 'Signup failed. Please try again.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    
    const orbs = useMemo(() => [
        { size: 300, x: 20, y: 20, delay: 0, color: 'rgba(168, 85, 247, 0.03)' },
        { size: 200, x: 70, y: 60, delay: 2, color: 'rgba(139, 92, 246, 0.02)' },
        { size: 250, x: 10, y: 70, delay: 4, color: 'rgba(168, 85, 247, 0.025)' },
    ], []);

    
    const particleCount = useMemo(() => {
        if (typeof window !== 'undefined') {
            if (window.innerWidth < 640) return 4;
            if (window.innerWidth < 1024) return 8;
            return 12;
        }
        return 8;
    }, []);

    
    if (showSuccess) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white/95 z-50 px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                    className="text-center max-w-md"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="text-7xl mb-6"
                    >
                        ✨
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        className="text-3xl font-semibold text-gray-900 mb-4"
                        style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
                    >
                        Account Created!
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.6 }}
                        className="text-gray-600 mb-6 leading-relaxed"
                        style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 300 }}
                    >
                        Your account is awaiting approval by the administrator.
                        You'll be able to log in once approved.
                    </motion.p>
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.9, duration: 0.8, ease: 'easeOut' }}
                        className="w-48 h-0.5 mx-auto mb-6 rounded-full"
                        style={{ background: 'linear-gradient(90deg, transparent, #a855f7, transparent)' }}
                    />
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2, duration: 0.6 }}
                        className="text-sm text-gray-400"
                        style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
                    >
                        Redirecting to login...
                    </motion.p>
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.4, duration: 0.6 }}
                        onClick={() => navigate('/login')}
                        className="mt-4 text-purple-500 hover:text-purple-600 transition-colors text-sm font-medium"
                        style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
                    >
                        Go to Login Now →
                    </motion.button>
                </motion.div>
            </div>
        );
    }

    
    const renderInputField = (name, label, type = 'text', required = false, autoComplete) => {
        const isFocused = focusedField === name;
        const hasValue = formData[name];
        const hasError = fieldErrors[name];

        return (
            <motion.div
                animate={hasError ? { x: [-5, 5, -5, 5, 0] } : {}}
                transition={{ duration: 0.4 }}
                className="relative"
            >
                <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    onFocus={() => setFocusedField(name)}
                    onBlur={() => setFocusedField(null)}
                    required={required}
                    autoComplete={autoComplete}
                    className="w-full px-5 py-4 rounded-2xl outline-none"
                    style={{
                        fontFamily: "'Inter', system-ui, sans-serif",
                        fontWeight: 400,
                        color: '#111827',
                        WebkitTextFillColor: '#111827',
                        background: isFocused ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.5)',
                        border: hasError
                            ? '1.5px solid rgba(239, 68, 68, 0.5)'
                            : isFocused
                                ? '1.5px solid rgba(168, 85, 247, 0.4)'
                                : '1.5px solid rgba(168, 85, 247, 0.1)',
                        boxShadow: isFocused
                            ? '0 8px 24px rgba(168, 85, 247, 0.15)'
                            : '0 2px 8px rgba(0, 0, 0, 0.02)',
                        transition: 'all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)',
                    }}
                />
                <motion.label
                    initial={false}
                    animate={{
                        y: hasValue || isFocused ? -36 : 0,
                        scale: hasValue || isFocused ? 0.85 : 1,
                        color: hasError ? '#ef4444' : isFocused ? '#a855f7' : '#9ca3af',
                    }}
                    className="absolute left-5 top-4 pointer-events-none origin-left"
                    style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 400 }}
                >
                    {label} {required && '*'}
                </motion.label>
                {hasError && (
                    <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-red-500 mt-1 ml-2"
                    >
                        {hasError}
                    </motion.p>
                )}
            </motion.div>
        );
    };

    return (
        <div
            ref={containerRef}
            className="relative min-h-screen overflow-hidden flex items-center justify-center px-4 py-12"
            style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #faf5ff 100%)',
            }}
        >
            {}
            {orbs.map((orb, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full pointer-events-none"
                    style={{
                        width: orb.size,
                        height: orb.size,
                        left: `${orb.x}%`,
                        top: `${orb.y}%`,
                        background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
                        filter: 'blur(60px)',
                    }}
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                        duration: 8 + orb.delay,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: orb.delay,
                    }}
                />
            ))}

            {}
            {[...Array(particleCount)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full pointer-events-none"
                    style={{
                        width: 3 + Math.random() * 3,
                        height: 3 + Math.random() * 3,
                        left: `${10 + Math.random() * 80}%`,
                        top: `${10 + Math.random() * 80}%`,
                        background: `radial-gradient(circle, rgba(168, 85, 247, ${0.15 + Math.random() * 0.2}) 0%, transparent 70%)`,
                    }}
                    animate={{
                        y: [0, -30 - Math.random() * 20, 0],
                        opacity: [0.3, 0.8, 0.3],
                    }}
                    transition={{
                        duration: 6 + Math.random() * 4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: Math.random() * 3,
                    }}
                />
            ))}

            {}
            <motion.div
                initial={{ opacity: 0, filter: 'blur(20px)' }}
                animate={isLoaded ? { opacity: 1, filter: 'blur(0px)' } : {}}
                transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                className="relative z-10 w-full max-w-lg"
            >
                {}
                <motion.button
                    onClick={() => navigate('/login')}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isLoaded ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    whileHover={{ x: -4 }}
                    className="mb-8 flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors"
                    style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 300 }}
                >
                    <span>←</span>
                    <span className="text-sm">Back to Login</span>
                </motion.button>

                {}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={isLoaded ? { scale: 1, opacity: 1 } : {}}
                    transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
                    className="text-center mb-8"
                >
                    <motion.div
                        animate={{ scale: [1, 1.03, 1] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        className="text-6xl mb-4 inline-block"
                    >
                        🎓
                    </motion.div>
                    <h1
                        className="text-3xl font-semibold mb-2"
                        style={{
                            fontFamily: "'Inter', 'SF Pro Display', system-ui, sans-serif",
                            fontWeight: 600,
                            letterSpacing: '-0.02em',
                            color: '#0a0a0a',
                        }}
                    >
                        Create Account
                    </h1>
                    <p
                        className="text-gray-500 font-light"
                        style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 300 }}
                    >
                        Join PulseLink to stay connected
                    </p>
                </motion.div>

                {}
                <motion.form
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, y: 30 }}
                    animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.4 }}
                    className="relative p-8 rounded-3xl"
                    style={{
                        background: 'rgba(255, 255, 255, 0.4)',
                        backdropFilter: 'blur(20px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                        border: '1px solid rgba(168, 85, 247, 0.1)',
                        boxShadow: '0 8px 32px rgba(168, 85, 247, 0.06)',
                    }}
                >
                    {}
                    <div className="mb-5">
                        {renderInputField('full_name', 'Full Name', 'text', true, 'name')}
                    </div>

                    {}
                    <div className="mb-5">
                        {renderInputField('username', 'Username', 'text', true, 'username')}
                    </div>

                    {}
                    <div className="mb-5 relative">
                        {renderInputField('password', 'Password', showPassword ? 'text' : 'password', true, 'new-password')}
                        <motion.button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 z-10"
                        >
                            <span className="text-xl">{showPassword ? '👁️' : '👁️‍🗨️'}</span>
                        </motion.button>
                    </div>

                    {}
                    <div className="mb-5 relative">
                        {renderInputField('confirmPassword', 'Confirm Password', showConfirmPassword ? 'text' : 'password', true, 'new-password')}
                        <motion.button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 z-10"
                        >
                            <span className="text-xl">{showConfirmPassword ? '👁️' : '👁️‍🗨️'}</span>
                        </motion.button>
                    </div>

                    {}
                    <div className="mb-5">
                        <p className="text-xs text-gray-500 mb-2 ml-2" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                            I am a... *
                        </p>
                        <div className="flex gap-3">
                            {[
                                { value: 'student', label: 'Student', emoji: '🎓' },
                                { value: 'faculty', label: 'Faculty', emoji: '👨‍🏫' },
                            ].map((option) => (
                                <motion.button
                                    key={option.value}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, role: option.value }))}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200"
                                    style={{
                                        fontFamily: "'Inter', system-ui, sans-serif",
                                        background: formData.role === option.value
                                            ? 'linear-gradient(135deg, #a855f7 0%, #8b5cf6 100%)'
                                            : 'rgba(255, 255, 255, 0.5)',
                                        color: formData.role === option.value ? 'white' : '#6b7280',
                                        border: formData.role === option.value
                                            ? '1px solid transparent'
                                            : '1px solid rgba(168, 85, 247, 0.1)',
                                        boxShadow: formData.role === option.value
                                            ? '0 4px 12px rgba(168, 85, 247, 0.3)'
                                            : 'none',
                                    }}
                                >
                                    <span className="mr-2">{option.emoji}</span>
                                    {option.label}
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mb-5"
                    >
                        <p className="text-xs text-gray-400 mb-3 ml-2" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                            Optional Information
                        </p>

                        {}
                        <div className="mb-4">
                            <div className="flex gap-2 flex-wrap">
                                {[
                                    { value: '', label: 'Prefer not to say' },
                                    { value: 'male', label: 'Male' },
                                    { value: 'female', label: 'Female' },
                                    { value: 'other', label: 'Other' },
                                ].map((option) => (
                                    <motion.button
                                        key={option.value}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, gender: option.value }))}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200"
                                        style={{
                                            fontFamily: "'Inter', system-ui, sans-serif",
                                            background: formData.gender === option.value
                                                ? 'rgba(168, 85, 247, 0.15)'
                                                : 'rgba(255, 255, 255, 0.4)',
                                            color: formData.gender === option.value ? '#7c3aed' : '#9ca3af',
                                            border: formData.gender === option.value
                                                ? '1px solid rgba(168, 85, 247, 0.3)'
                                                : '1px solid rgba(168, 85, 247, 0.08)',
                                        }}
                                    >
                                        {option.label}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {renderInputField('email', 'Email', 'email', false, 'email')}
                            {renderInputField('phone', 'Phone', 'tel', false, 'tel')}
                        </div>
                    </motion.div>

                    {}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="mb-4 px-4 py-3 rounded-xl text-sm"
                                style={{
                                    background: 'rgba(239, 68, 68, 0.08)',
                                    border: '1px solid rgba(239, 68, 68, 0.15)',
                                    color: '#dc2626',
                                    fontFamily: "'Inter', system-ui, sans-serif",
                                }}
                            >
                                ⚠️ {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {}
                    <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-4 rounded-2xl font-medium relative overflow-hidden"
                        style={{
                            fontFamily: "'Inter', system-ui, sans-serif",
                            fontWeight: 500,
                            background: loading
                                ? 'rgba(168, 85, 247, 0.5)'
                                : 'linear-gradient(135deg, #a855f7 0%, #8b5cf6 100%)',
                            color: 'white',
                            boxShadow: '0 4px 20px rgba(168, 85, 247, 0.35)',
                        }}
                    >
                        {}
                        <motion.div
                            className="absolute inset-0"
                            animate={{
                                x: ['-100%', '100%'],
                            }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                            style={{
                                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
                            }}
                        />
                        <span className="relative z-10">
                            {loading ? '✨ Creating Account...' : 'Create Account'}
                        </span>
                    </motion.button>

                    {}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="mt-6 text-center"
                    >
                        <span className="text-sm text-gray-400" style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 300 }}>
                            Already have an account?{' '}
                        </span>
                        <Link
                            to="/login"
                            className="text-sm text-purple-500 hover:text-purple-600 transition-colors font-medium"
                            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
                        >
                            Sign In
                        </Link>
                    </motion.div>
                </motion.form>

                {}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-6 text-center text-xs text-gray-400"
                    style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 300 }}
                >
                    Your account will be reviewed by an administrator before activation.
                </motion.p>
            </motion.div>

            {}
            <div
                className="absolute inset-0 opacity-[0.012] pointer-events-none mix-blend-overlay"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
            />
        </div>
    );
};

export default Signup;
