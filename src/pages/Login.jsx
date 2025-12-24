
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useAppSettings from '../hooks/useAppSettings';


const SOUNDS = {
    glassTap: { frequency: 1200, duration: 0.08 },
    techChime: { frequency: 880, duration: 0.15 },
    waterDrop: { frequency: 600, duration: 0.12 },
    gentleWhoosh: { frequency: 400, duration: 0.2 },
};


const getAdaptiveErrorMessage = (attemptCount, originalError) => {
    if (attemptCount === 1) return "That doesn't look right — try one more time.";
    if (attemptCount === 2) return "Double-check your credentials. You're close.";
    if (attemptCount >= 3) return "Need help? Reset password or contact admin.";
    return originalError;
};


const TYPING_HINTS = {
    username: "Use your registered institution email format.",
    password: "Passwords are case-sensitive.",
};

const Login = () => {
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [usernameFocused, setUsernameFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);

    
    const [errorAttempts, setErrorAttempts] = useState(0);
    const [showWelcome, setShowWelcome] = useState(false);
    const [welcomeUser, setWelcomeUser] = useState('');
    const [soundEnabled, setSoundEnabled] = useState(false);
    const [typingHint, setTypingHint] = useState('');
    const [securityAnimation, setSecurityAnimation] = useState(false);
    const [privacyMode, setPrivacyMode] = useState(false);
    const [demoMode, setDemoMode] = useState(false);
    const [selectedDemoRole, setSelectedDemoRole] = useState('');
    const [isPendingApproval, setIsPendingApproval] = useState(false);
    const [showDemoCredentials, setShowDemoCredentials] = useState(false);

    
    const typingTimeoutRef = useRef(null);
    const audioContextRef = useRef(null);
    const containerRef = useRef(null);

    
    const { login } = useAuthStore();
    const { loginSound: loginSoundEnabled, playLoginSound, interfaceSounds, soundStyle, notificationVolume } = useAppSettings();
    const navigate = useNavigate();

    
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
    const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });

    
    const bgX = useTransform(smoothMouseX, [0, window.innerWidth], [-30, 30]);
    const bgY = useTransform(smoothMouseY, [0, window.innerHeight], [-30, 30]);
    const orbX = useTransform(smoothMouseX, [0, window.innerWidth], [50, -50]);
    const orbY = useTransform(smoothMouseY, [0, window.innerHeight], [50, -50]);

    
    useEffect(() => {
        setTimeout(() => setIsLoaded(true), 100);

        
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('demo') === 'true') {
            setDemoMode(true);
        }

        return () => {
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        };
    }, []);

    
    const handleMouseMove = useCallback((e) => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
    }, [mouseX, mouseY]);

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [handleMouseMove]);

    
    useEffect(() => {
        setPrivacyMode(passwordFocused);
    }, [passwordFocused]);

    
    const playSound = useCallback((soundType = 'glassTap') => {
        if (!soundEnabled) return;

        try {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            }
            const ctx = audioContextRef.current;
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            const sound = SOUNDS[soundType] || SOUNDS.glassTap;
            oscillator.frequency.value = sound.frequency;
            gainNode.gain.value = 0.03;

            oscillator.start();
            gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + sound.duration);
            oscillator.stop(ctx.currentTime + sound.duration);
        } catch (e) {
            }
    }, [soundEnabled]);

    
    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
        playSound('glassTap');

        
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        setTypingHint('');

        
        typingTimeoutRef.current = setTimeout(() => {
            if (e.target.value.length > 0 && !e.target.value.includes('@')) {
                setTypingHint(TYPING_HINTS.username);
            }
        }, 2000);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        playSound('glassTap');

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        setTypingHint('');

        typingTimeoutRef.current = setTimeout(() => {
            if (e.target.value.length > 0 && e.target.value.length < 6) {
                setTypingHint(TYPING_HINTS.password);
            }
        }, 2000);
    };

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        setSecurityAnimation(true);
        playSound('techChime');

        
        await new Promise(resolve => setTimeout(resolve, 800));
        setSecurityAnimation(false);

        const result = await login(username, password);

        if (result.success) {
            
            if (loginSoundEnabled) {
                playLoginSound();
            } else {
                playSound('gentleWhoosh');
            }
            setWelcomeUser(username);
            setShowWelcome(true);

            
            setTimeout(() => {
                navigate('/dashboard');
            }, 1800);
        } else {
            setErrorAttempts(prev => prev + 1);
            
            if (result.isPendingApproval) {
                setIsPendingApproval(true);
                setError(result.error);
            } else {
                setIsPendingApproval(false);
                setError(getAdaptiveErrorMessage(errorAttempts + 1, result.error));
            }
            setLoading(false);
            playSound('waterDrop');
        }
    };

    
    const demoRoles = useMemo(() => ({
        root: { username: 'superadmin', password: 'admin123' },
        admin: { username: 'collegeadmin', password: 'admin123' },
        faculty: { username: 'faculty', password: 'faculty123' },
        student: { username: 'student', password: 'student123' },
    }), []);

    
    const handleDemoRoleSelect = (role) => {
        const creds = demoRoles[role];
        if (creds) {
            setUsername(creds.username);
            setPassword(creds.password);
            setSelectedDemoRole(role);
            playSound('techChime');
        }
    };

    
    const particleCount = useMemo(() => {
        if (typeof window !== 'undefined') {
            if (window.innerWidth < 640) return 4;
            if (window.innerWidth < 1024) return 8;
            return 12;
        }
        return 8;
    }, []);

    
    const orbs = useMemo(() => [
        { size: 300, x: 20, y: 20, delay: 0, color: 'rgba(168, 85, 247, 0.03)' },
        { size: 200, x: 70, y: 60, delay: 2, color: 'rgba(139, 92, 246, 0.02)' },
        { size: 250, x: 10, y: 70, delay: 4, color: 'rgba(168, 85, 247, 0.025)' },
    ], []);

    
    if (showWelcome) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white/95 z-50">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, rotateX: -10 }}
                    animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                    transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                    className="text-center"
                    style={{ perspective: '1000px' }}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="text-6xl mb-6"
                    >
                        👋
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        className="text-4xl font-semibold text-gray-900 mb-2"
                        style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
                    >
                        Welcome back, {welcomeUser}.
                    </motion.h1>
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.8, duration: 0.8, ease: 'easeOut' }}
                        className="w-48 h-0.5 mx-auto mt-6 rounded-full"
                        style={{ background: 'linear-gradient(90deg, transparent, #a855f7, transparent)' }}
                    />
                </motion.div>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="relative min-h-screen overflow-hidden flex items-center justify-center px-4"
            style={{
                background: privacyMode
                    ? 'linear-gradient(135deg, #fafafa 0%, #f0f0f5 100%)'
                    : 'linear-gradient(135deg, #ffffff 0%, #faf5ff 100%)',
                transition: 'background 0.5s ease',
            }}
        >
            {}
            <AnimatePresence>
                {privacyMode && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="fixed inset-0 pointer-events-none z-5"
                        style={{
                            background: 'radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.03) 100%)',
                            backdropFilter: 'blur(1px)',
                        }}
                    />
                )}
            </AnimatePresence>

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
                        x: orbX,
                        y: orbY,
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
                        x: bgX,
                        y: bgY,
                    }}
                    animate={{
                        y: [0, -30 - Math.random() * 20, 0],
                        x: [0, Math.random() * 20 - 10, 0],
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
            <AnimatePresence>
                {securityAnimation && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center"
                        style={{ background: 'rgba(255,255,255,0.9)' }}
                    >
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                rotate: [0, 360],
                            }}
                            transition={{ duration: 0.8, ease: 'easeInOut' }}
                            className="text-6xl"
                        >
                            🔐
                        </motion.div>
                        <motion.div
                            className="absolute w-32 h-32 rounded-full border-2 border-purple-400"
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.5, 0, 0.5],
                            }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {}
            <motion.div
                initial={{ opacity: 0, filter: 'blur(20px)' }}
                animate={isLoaded ? { opacity: 1, filter: 'blur(0px)' } : {}}
                transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                className="relative z-10 w-full max-w-md"
            >
                {}
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    onClick={() => {
                        setSoundEnabled(!soundEnabled);
                        if (!soundEnabled) playSound('glassTap');
                    }}
                    className="absolute -top-12 right-0 p-2 rounded-xl text-sm text-gray-400 hover:text-purple-500 transition-colors"
                    style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
                    title={soundEnabled ? 'Sound On' : 'Sound Off'}
                >
                    {soundEnabled ? '🔊' : '🔇'}
                </motion.button>

                {}
                <motion.button
                    onClick={() => navigate('/')}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isLoaded ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    whileHover={{ x: -4 }}
                    className="mb-8 flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors"
                    style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 300 }}
                >
                    <span>←</span>
                    <span className="text-sm">Back to Welcome</span>
                </motion.button>

                {}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={isLoaded ? { scale: 1, opacity: 1 } : {}}
                    transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
                    className="text-center mb-12"
                >
                    <motion.div
                        animate={{ scale: [1, 1.03, 1] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        className="text-7xl mb-4 inline-block"
                    >
                        📡
                    </motion.div>
                    <h1
                        className="text-4xl font-semibold mb-2"
                        style={{
                            fontFamily: "'Inter', 'SF Pro Display', system-ui, sans-serif",
                            fontWeight: 600,
                            letterSpacing: '-0.02em',
                            color: '#0a0a0a',
                        }}
                    >
                        Welcome Back
                    </h1>
                    <p
                        className="text-gray-500 font-light"
                        style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 300 }}
                    >
                        Sign in to continue to PulseLink
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
                        background: privacyMode
                            ? 'rgba(255, 255, 255, 0.7)'
                            : 'rgba(255, 255, 255, 0.4)',
                        backdropFilter: `blur(${privacyMode ? 30 : 20}px) saturate(180%)`,
                        WebkitBackdropFilter: `blur(${privacyMode ? 30 : 20}px) saturate(180%)`,
                        border: privacyMode
                            ? '1px solid rgba(168, 85, 247, 0.2)'
                            : '1px solid rgba(168, 85, 247, 0.1)',
                        boxShadow: privacyMode
                            ? '0 8px 40px rgba(168, 85, 247, 0.15), 0 0 60px rgba(168, 85, 247, 0.05)'
                            : '0 8px 32px rgba(168, 85, 247, 0.06)',
                        transition: 'all 0.4s ease',
                    }}
                >
                    {}
                    <AnimatePresence>
                        {privacyMode && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs"
                                style={{
                                    background: 'linear-gradient(135deg, #a855f7, #8b5cf6)',
                                    color: 'white',
                                    boxShadow: '0 4px 12px rgba(168, 85, 247, 0.3)',
                                }}
                            >
                                🔒 Privacy Mode
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {}
                    {demoMode && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mb-6 p-3 rounded-xl"
                            style={{
                                background: 'rgba(168, 85, 247, 0.05)',
                                border: '1px dashed rgba(168, 85, 247, 0.2)',
                            }}
                        >
                            <p className="text-xs text-purple-600 mb-2 font-medium">🛠 Demo Mode</p>
                            <div className="flex gap-2 flex-wrap">
                                {['root', 'admin', 'faculty', 'student'].map(role => (
                                    <button
                                        key={role}
                                        type="button"
                                        onClick={() => handleDemoRoleSelect(role)}
                                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${selectedDemoRole === role
                                            ? 'bg-purple-500 text-white'
                                            : 'bg-white text-purple-600 hover:bg-purple-50'
                                            }`}
                                    >
                                        {role}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {}
                    <motion.div
                        animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
                        transition={{ duration: 0.4 }}
                        className="mb-6 relative"
                    >
                        <motion.div
                            className="absolute inset-0 rounded-2xl pointer-events-none"
                            animate={usernameFocused ? {
                                boxShadow: [
                                    '0 0 0 0 rgba(168, 85, 247, 0)',
                                    '0 0 0 4px rgba(168, 85, 247, 0.1)',
                                    '0 0 0 0 rgba(168, 85, 247, 0)',
                                ]
                            } : {}}
                            transition={{ duration: 1.5, repeat: usernameFocused ? Infinity : 0 }}
                        />
                        <motion.input
                            type="text"
                            value={username}
                            onChange={handleUsernameChange}
                            onFocus={() => { setUsernameFocused(true); setTypingHint(''); }}
                            onBlur={() => setUsernameFocused(false)}
                            required
                            className="w-full px-5 py-4 rounded-2xl outline-none"
                            style={{
                                fontFamily: "'Inter', system-ui, sans-serif",
                                fontWeight: 400,
                                fontSize: '16px',
                                color: '#1a1a2e',
                                background: usernameFocused
                                    ? 'rgba(255, 255, 255, 0.9)'
                                    : 'rgba(255, 255, 255, 0.5)',
                                border: usernameFocused
                                    ? '1.5px solid rgba(168, 85, 247, 0.4)'
                                    : '1.5px solid rgba(168, 85, 247, 0.1)',
                                boxShadow: usernameFocused
                                    ? '0 8px 24px rgba(168, 85, 247, 0.15)'
                                    : '0 2px 8px rgba(0, 0, 0, 0.02)',
                                transition: 'all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)',
                                transform: usernameFocused ? 'scale(1.01)' : 'scale(1)',
                            }}
                        />
                        <motion.label
                            initial={false}
                            animate={{
                                y: username || usernameFocused ? -36 : 0,
                                scale: username || usernameFocused ? 0.85 : 1,
                                color: usernameFocused ? '#a855f7' : '#9ca3af',
                            }}
                            className="absolute left-5 top-4 pointer-events-none origin-left"
                            style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 400 }}
                        >
                            Username
                        </motion.label>
                    </motion.div>

                    {}
                    <motion.div
                        animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
                        transition={{ duration: 0.4 }}
                        className="mb-6 relative"
                    >
                        <motion.div
                            className="absolute inset-0 rounded-2xl pointer-events-none"
                            animate={passwordFocused ? {
                                boxShadow: [
                                    '0 0 0 0 rgba(168, 85, 247, 0)',
                                    '0 0 0 4px rgba(168, 85, 247, 0.15)',
                                    '0 0 0 0 rgba(168, 85, 247, 0)',
                                ]
                            } : {}}
                            transition={{ duration: 1.5, repeat: passwordFocused ? Infinity : 0 }}
                        />
                        <motion.input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={handlePasswordChange}
                            onFocus={() => { setPasswordFocused(true); setTypingHint(''); }}
                            onBlur={() => setPasswordFocused(false)}
                            required
                            className="w-full px-5 py-4 rounded-2xl outline-none pr-24"
                            style={{
                                fontFamily: "'Inter', system-ui, sans-serif",
                                fontWeight: 400,
                                fontSize: '16px',
                                color: '#1a1a2e',
                                background: passwordFocused
                                    ? 'rgba(255, 255, 255, 0.9)'
                                    : 'rgba(255, 255, 255, 0.5)',
                                border: passwordFocused
                                    ? '1.5px solid rgba(168, 85, 247, 0.4)'
                                    : '1.5px solid rgba(168, 85, 247, 0.1)',
                                boxShadow: passwordFocused
                                    ? '0 8px 24px rgba(168, 85, 247, 0.15)'
                                    : '0 2px 8px rgba(0, 0, 0, 0.02)',
                                transition: 'all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)',
                                transform: passwordFocused ? 'scale(1.01)' : 'scale(1)',
                            }}
                        />
                        <motion.label
                            initial={false}
                            animate={{
                                y: password || passwordFocused ? -36 : 0,
                                scale: password || passwordFocused ? 0.85 : 1,
                                color: passwordFocused ? '#a855f7' : '#9ca3af',
                            }}
                            className="absolute left-5 top-4 pointer-events-none origin-left"
                            style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 400 }}
                        >
                            Password
                        </motion.label>

                        {}
                        <motion.div
                            className="absolute right-12 top-4 text-gray-400"
                            animate={passwordFocused || password ? {
                                rotate: [0, -10, 10, 0],
                                scale: [1, 1.1, 1],
                            } : {}}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            🔐
                        </motion.div>

                        {}
                        <motion.button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                        >
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={showPassword ? 'show' : 'hide'}
                                    initial={{ opacity: 0, rotate: -90 }}
                                    animate={{ opacity: 1, rotate: 0 }}
                                    exit={{ opacity: 0, rotate: 90 }}
                                    transition={{ duration: 0.2 }}
                                    className="text-xl"
                                >
                                    {showPassword ? '👁️' : '👁️‍🗨️'}
                                </motion.span>
                            </AnimatePresence>
                        </motion.button>
                    </motion.div>

                    {}
                    <AnimatePresence>
                        {typingHint && (
                            <motion.div
                                initial={{ opacity: 0, y: -10, height: 0 }}
                                animate={{ opacity: 1, y: 0, height: 'auto' }}
                                exit={{ opacity: 0, y: -10, height: 0 }}
                                className="mb-4 px-4 py-2 rounded-xl text-xs text-purple-600"
                                style={{
                                    background: 'rgba(168, 85, 247, 0.08)',
                                    border: '1px solid rgba(168, 85, 247, 0.15)',
                                }}
                            >
                                💡 {typingHint}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="mb-4 px-4 py-3 rounded-xl text-sm"
                                style={{
                                    background: isPendingApproval
                                        ? 'rgba(251, 191, 36, 0.1)'
                                        : errorAttempts >= 3
                                            ? 'rgba(168, 85, 247, 0.1)'
                                            : 'rgba(239, 68, 68, 0.08)',
                                    border: isPendingApproval
                                        ? '1px solid rgba(251, 191, 36, 0.3)'
                                        : errorAttempts >= 3
                                            ? '1px solid rgba(168, 85, 247, 0.2)'
                                            : '1px solid rgba(239, 68, 68, 0.15)',
                                    color: isPendingApproval
                                        ? '#b45309'
                                        : errorAttempts >= 3 ? '#7c3aed' : '#dc2626',
                                    fontFamily: "'Inter', system-ui, sans-serif",
                                }}
                            >
                                {isPendingApproval ? '⏳' : errorAttempts >= 3 ? '🤝' : '⚠️'} {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {}
                    <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: 1.02, rotateX: 3, rotateY: 3 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        className="w-full py-4 rounded-2xl font-medium relative overflow-hidden"
                        style={{
                            fontFamily: "'Inter', system-ui, sans-serif",
                            fontWeight: 500,
                            background: loading
                                ? 'rgba(168, 85, 247, 0.5)'
                                : 'linear-gradient(135deg, #a855f7 0%, #8b5cf6 100%)',
                            color: 'white',
                            boxShadow: '0 4px 20px rgba(168, 85, 247, 0.35)',
                            transformStyle: 'preserve-3d',
                        }}
                    >
                        {}
                        <motion.div
                            className="absolute inset-0"
                            animate={{
                                background: [
                                    'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
                                ],
                                x: ['-100%', '100%'],
                            }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                            style={{ backgroundSize: '200% 100%' }}
                        />
                        <span className="relative z-10">
                            {loading ? '🔐 Verifying...' : 'Sign In'}
                        </span>
                    </motion.button>

                    {}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="mt-6 text-center space-y-3"
                    >
                        <button
                            type="button"
                            className="text-sm text-gray-400 hover:text-purple-600 transition-colors"
                            style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 300 }}
                        >
                            Forgot password?
                        </button>
                        <div className="text-sm" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                            <span className="text-gray-400" style={{ fontWeight: 300 }}>Don't have an account? </span>
                            <Link
                                to="/signup"
                                className="text-purple-500 hover:text-purple-600 transition-colors font-medium"
                            >
                                Create Account
                            </Link>
                        </div>
                    </motion.div>
                </motion.form>

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

export default Login;
