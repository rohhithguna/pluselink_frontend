import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import '../styles/welcome-themes.css';
import { playThemeSound } from '../utils/themeSounds';

const Welcome = () => {
    const navigate = useNavigate();
    const [currentWord, setCurrentWord] = useState(0);
    const [currentQuote, setCurrentQuote] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isExiting, setIsExiting] = useState(false);
    const [isQuoteHovered, setIsQuoteHovered] = useState(false);
    const [currentTheme, setCurrentTheme] = useState(() => {
        
        return localStorage.getItem('welcome_theme') || 'default';
    });
    const [soundEnabled, setSoundEnabled] = useState(() => {
        return localStorage.getItem('welcome_theme_sounds') === 'true';
    });
    const [hoveredTheme, setHoveredTheme] = useState(null);
    const [showFirstTimeModal, setShowFirstTimeModal] = useState(true); 

    const rotatingWords = ['Future-Ready', 'Intelligent', 'Secure', 'Human-Centered', 'Real-Time Connected'];

    const motivationalQuotes = [
        "Stay aware. Stay safe.",
        "A single alert can save hundreds.",
        "Connection creates safety.",
        "Information is protection.",
        "Preparedness is power.",
        "When everyone knows, everyone is safer."
    ];


    
    useEffect(() => {
        setTimeout(() => setIsLoaded(true), 50);
    }, []);

    
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentWord((prev) => (prev + 1) % rotatingWords.length);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    
    useEffect(() => {
        if (!isQuoteHovered) {
            const interval = setInterval(() => {
                setCurrentQuote((prev) => (prev + 1) % motivationalQuotes.length);
            }, 7000);
            return () => clearInterval(interval);
        }
    }, [isQuoteHovered, motivationalQuotes.length]);

    const handleEnter = () => {
        setIsExiting(true);
        setTimeout(() => navigate('/login'), 2000);
    };

    
    const handleThemeChange = (theme) => {
        setCurrentTheme(theme);
        localStorage.setItem('welcome_theme', theme);
        
        playThemeSound(theme, soundEnabled);
    };

    
    const handleSoundToggle = () => {
        const newValue = !soundEnabled;
        setSoundEnabled(newValue);
        localStorage.setItem('welcome_theme_sounds', newValue.toString());
        
        if (newValue) {
            playThemeSound(currentTheme, true);
        }
    };

    
    const handleModalThemeSelect = (themeId) => {
        setCurrentTheme(themeId);
        localStorage.setItem('welcome_theme', themeId);
        localStorage.setItem('welcome_modal_dismissed', 'true');
        playThemeSound(themeId, soundEnabled);
        
        setTimeout(() => {
            setShowFirstTimeModal(false);
        }, 300);
    };

    
    const handleModalSkip = () => {
        localStorage.setItem('welcome_modal_dismissed', 'true');
        setShowFirstTimeModal(false);
    };

    
    
    const themes = [
        {
            id: 'default',
            name: 'Calm Prestige',
            emoji: '🏔️',
            description: 'Spatial cool-tone serenity',
            vibe: 'Ultra-clean & professional',
            gradient: 'linear-gradient(135deg, #f8fbff 0%, #eef4fc 30%, #dde8f4 70%, #f5f9ff 100%)',
            glow: 'rgba(94, 159, 212, 0.4)'
        },
        {
            id: 'aurora',
            name: 'Executive Nocturne',
            emoji: '🌃',
            description: 'Deep luminous sophistication',
            vibe: 'Midnight elegance',
            gradient: 'linear-gradient(135deg, #0a0c14 0%, #1a1f35 40%, #151a2e 80%, #0d0f18 100%)',
            glow: 'rgba(196, 163, 90, 0.5)'
        },
        {
            id: 'cyber',
            name: 'Vivid Momentum',
            emoji: '🔥',
            description: 'Radiant energized warmth',
            vibe: 'Dynamic & inspiring',
            gradient: 'linear-gradient(135deg, #fff8f5 0%, #ffe8e0 40%, #ffdfd8 70%, #fffaf8 100%)',
            glow: 'rgba(232, 90, 48, 0.45)'
        },
        {
            id: 'serenity',
            name: 'Glass Horizon',
            emoji: '☁️',
            description: 'Airy VisionOS translucence',
            vibe: 'Soft floating surfaces',
            gradient: 'linear-gradient(135deg, #fdfbfe 0%, #f0f5f8 40%, #f5f8fa 70%, #fefefe 100%)',
            glow: 'rgba(120, 168, 184, 0.4)'
        },
        {
            id: 'royal',
            name: 'Imperial Gradient',
            emoji: '👑',
            description: 'Royal luxury refinement',
            vibe: 'Burgundy & gold prestige',
            gradient: 'linear-gradient(135deg, #1a0f15 0%, #3d1a2a 40%, #301825 80%, #150a10 100%)',
            glow: 'rgba(212, 168, 90, 0.5)'
        },
        {
            id: 'festival',
            name: 'Prismatic Flux',
            emoji: '🌈',
            description: 'Holographic iridescence',
            vibe: 'Playful chromatic premium',
            gradient: 'linear-gradient(135deg, #faf8ff 0%, #f0f8ff 25%, #f8fff8 50%, #fffff8 75%, #fdf5ff 100%)',
            glow: 'rgba(138, 106, 205, 0.45)'
        },
    ];


    return (
        <div
            className={`min-h-screen overflow-hidden theme-${currentTheme}`}
            style={{ background: 'transparent' }}
        >
            {}
            <AnimatePresence>
                {showFirstTimeModal && (
                    <>
                        {}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100]"
                            onClick={handleModalSkip}
                        />

                        {}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{
                                duration: 0.4,
                                ease: [0.25, 0.1, 0.25, 1]
                            }}
                            className="fixed inset-0 flex items-center justify-center z-[101] p-6"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full p-8 md:p-12 max-h-[90vh] overflow-y-auto">
                                {}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="text-center mb-8"
                                >
                                    <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-3" style={{ fontFamily: "'Inter', 'SF Pro Display', system-ui, sans-serif" }}>
                                        Pick how you want this world to feel.
                                    </h2>
                                    <p className="text-sm text-gray-500 font-light">
                                        You can change this anytime later.
                                    </p>
                                </motion.div>

                                {}
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                                    {themes.map((theme, index) => (
                                        <motion.button
                                            key={theme.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.15 + index * 0.05 }}
                                            onClick={() => handleModalThemeSelect(theme.id)}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.97 }}
                                            className="group relative p-6 rounded-2xl border-2 border-gray-200 hover:border-purple-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                                            tabIndex={0}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    e.preventDefault();
                                                    handleModalThemeSelect(theme.id);
                                                }
                                            }}
                                        >
                                            {}
                                            <div
                                                className="w-full h-24 rounded-xl mb-4 shadow-md group-hover:shadow-lg transition-shadow duration-300"
                                                style={{ background: theme.gradient }}
                                            />

                                            {}
                                            <div className="text-center">
                                                <div className="text-2xl mb-2">{theme.emoji}</div>
                                                <h3 className="text-base font-semibold text-gray-900 mb-1">
                                                    {theme.name}
                                                </h3>
                                                <p className="text-xs text-gray-600 font-light">
                                                    {theme.vibe}
                                                </p>
                                            </div>

                                            {}
                                            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                                                style={{
                                                    boxShadow: `0 0 40px ${theme.glow}, 0 0 80px ${theme.glow}`
                                                }}
                                            />
                                        </motion.button>
                                    ))}
                                </div>

                                {}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="text-center"
                                >
                                    <button
                                        onClick={handleModalSkip}
                                        className="text-sm text-gray-500 hover:text-gray-700 font-light transition-colors duration-200 underline decoration-dotted underline-offset-4"
                                    >
                                        Skip for now
                                    </button>
                                </motion.div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="fixed top-6 left-6 z-50"
            >
                <motion.button
                    onClick={handleSoundToggle}
                    whileHover={{
                        scale: 1.08,
                        y: -3,
                        rotate: 2,
                        boxShadow: '0 12px 24px rgba(168, 85, 247, 0.25), 0 4px 8px rgba(0, 0, 0, 0.1)',
                        transition: {
                            type: 'spring',
                            stiffness: 400,
                            damping: 12,
                            duration: 0.2
                        }
                    }}
                    whileTap={{
                        scale: 0.94,
                        rotate: 0,
                        transition: {
                            type: 'spring',
                            stiffness: 600,
                            damping: 15,
                            duration: 0.15
                        }
                    }}
                    title={soundEnabled ? 'Disable theme sounds' : 'Enable theme sounds'}
                    className={`
                        relative w-12 h-12 rounded-full flex items-center justify-center
                        backdrop-blur-md border transition-all duration-300
                        ${soundEnabled
                            ? 'bg-gradient-to-br from-purple-500 to-purple-600 border-purple-400/50'
                            : 'bg-white/60 border-white/30 hover:bg-white/80'
                        }
                    `}
                    style={{
                        boxShadow: soundEnabled
                            ? '0 8px 24px rgba(168, 85, 247, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                            : '0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
                    }}
                >
                    {}
                    <motion.div
                        className="absolute inset-0 rounded-full pointer-events-none"
                        initial={{ scale: 1, opacity: 0 }}
                        whileTap={{
                            scale: [1, 1.8],
                            opacity: [0.4, 0],
                            transition: { duration: 0.3, ease: 'easeOut' }
                        }}
                        style={{
                            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 70%)',
                        }}
                    />
                    {}
                    <motion.div
                        whileHover={{ rotate: -2 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 10 }}
                    >
                        {soundEnabled ? (
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        )}
                    </motion.div>
                </motion.button>
            </motion.div>

            {}

            {}
            <motion.div
                animate={isExiting ? {
                    scale: 0.92,
                    opacity: 0,
                    filter: 'blur(20px)',
                } : {}}
                transition={{
                    duration: 1.5,
                    ease: [0.25, 0.1, 0.25, 1],
                }}
                className="relative z-10 h-screen flex flex-col items-center justify-center px-4 py-4 pb-16"
                style={{ background: 'transparent' }}
            >
                {}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={isLoaded ? { scale: 1, opacity: 1 } : {}}
                    transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
                    className="mb-4 relative"
                >
                    {}
                    <motion.div
                        animate={isExiting ? {
                            scale: [1, 1.2, 0.8],
                            y: -100,
                            opacity: 0,
                        } : {
                            scale: [1, 1.04, 1],
                        }}
                        transition={isExiting ? {
                            duration: 1.5,
                            ease: [0.34, 1.56, 0.64, 1], 
                        } : {
                            duration: 3.5,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                        className="relative text-6xl filter drop-shadow-2xl"
                    >
                        📡
                    </motion.div>
                </motion.div>

                {}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mb-4"
                >
                    {}
                    <motion.div
                        className="relative p-3 rounded-full"
                        whileHover={{
                            y: -2,
                            boxShadow: '0 16px 48px rgba(0, 0, 0, 0.12), 0 8px 24px rgba(168, 85, 247, 0.15), inset 0 2px 0 rgba(255, 255, 255, 0.8), inset 0 -2px 4px rgba(0, 0, 0, 0.05)',
                            transition: { type: 'spring', stiffness: 400, damping: 20 }
                        }}
                        style={{
                            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.7) 100%)',
                            backdropFilter: 'blur(24px) saturate(200%)',
                            WebkitBackdropFilter: 'blur(24px) saturate(200%)',
                            border: '1px solid rgba(255, 255, 255, 0.5)',
                            boxShadow: `
                                0 8px 32px rgba(0, 0, 0, 0.08),
                                0 4px 16px rgba(168, 85, 247, 0.08),
                                inset 0 2px 0 rgba(255, 255, 255, 0.9),
                                inset 0 -1px 2px rgba(0, 0, 0, 0.03)
                            `,
                        }}
                    >
                        {}
                        <AnimatePresence>
                            {hoveredTheme && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                    transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                                    className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 px-4 py-2.5 rounded-xl z-10"
                                    style={{
                                        minWidth: '160px',
                                        background: 'rgba(255, 255, 255, 0.95)',
                                        backdropFilter: 'blur(20px)',
                                        WebkitBackdropFilter: 'blur(20px)',
                                        border: '1px solid rgba(255, 255, 255, 0.4)',
                                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                                    }}
                                >
                                    <div className="text-center">
                                        <div className="text-sm font-medium text-gray-800 mb-0.5">
                                            {hoveredTheme.emoji} {hoveredTheme.name}
                                        </div>
                                        <div className="text-xs text-gray-500 font-light">
                                            {hoveredTheme.vibe}
                                        </div>
                                    </div>
                                    {}
                                    <div
                                        className="absolute -top-1.5 left-1/2 transform -translate-x-1/2 w-3 h-3 rotate-45"
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.95)',
                                            borderLeft: '1px solid rgba(255, 255, 255, 0.4)',
                                            borderTop: '1px solid rgba(255, 255, 255, 0.4)',
                                        }}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {}
                        <div className="flex gap-1.5">
                            {themes.map((theme, index) => {
                                const isActive = currentTheme === theme.id;

                                return (
                                    <div key={theme.id} className="relative">
                                        {}
                                        {isActive && (
                                            <motion.div
                                                className="absolute -inset-1 rounded-full pointer-events-none"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: [0.6, 0.3, 0.6] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                                style={{
                                                    background: `radial-gradient(circle, ${theme.glow} 0%, transparent 70%)`,
                                                }}
                                            />
                                        )}

                                        <motion.button
                                            onClick={() => handleThemeChange(theme.id)}
                                            onMouseEnter={() => setHoveredTheme(theme)}
                                            onMouseLeave={() => setHoveredTheme(null)}
                                            
                                            animate={isActive ? {} : {
                                                scale: [1, 0.98, 1],
                                            }}
                                            transition={{
                                                duration: 8 + index * 2,
                                                repeat: Infinity,
                                                ease: 'easeInOut',
                                            }}
                                            whileHover={{
                                                scale: 1.12,
                                                y: -3,
                                                transition: {
                                                    type: 'spring',
                                                    stiffness: 500,
                                                    damping: 12
                                                }
                                            }}
                                            whileTap={{
                                                scale: 0.88,
                                                y: 1,
                                                transition: {
                                                    type: 'spring',
                                                    stiffness: 600,
                                                    damping: 15
                                                }
                                            }}
                                            className="relative w-12 h-12 rounded-full flex items-center justify-center text-xl focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:ring-offset-2 focus:ring-offset-white/50"
                                            style={{
                                                
                                                background: isActive
                                                    ? `linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, ${theme.glow.replace('0.', '0.15').replace(')', ', 0.4)')} 100%)`
                                                    : 'linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.3) 100%)',
                                                backdropFilter: 'blur(8px)',
                                                WebkitBackdropFilter: 'blur(8px)',
                                                boxShadow: isActive
                                                    ? `
                                                        0 4px 16px ${theme.glow},
                                                        inset 0 2px 4px rgba(255, 255, 255, 0.9),
                                                        inset 0 -2px 6px rgba(0, 0, 0, 0.08),
                                                        0 1px 2px rgba(0, 0, 0, 0.1)
                                                    `
                                                    : `
                                                        inset 0 1px 2px rgba(255, 255, 255, 0.6),
                                                        inset 0 -1px 2px rgba(0, 0, 0, 0.03),
                                                        0 1px 2px rgba(0, 0, 0, 0.04)
                                                    `,
                                                transform: isActive ? 'scale(1.05)' : 'scale(1)',
                                            }}
                                            tabIndex={0}
                                            aria-label={`Select ${theme.name} theme`}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    e.preventDefault();
                                                    handleThemeChange(theme.id);
                                                }
                                            }}
                                        >
                                            {}
                                            <div
                                                className="absolute top-1 left-1/2 -translate-x-1/2 w-5 h-2 rounded-full pointer-events-none"
                                                style={{
                                                    background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0) 100%)',
                                                    opacity: isActive ? 0.8 : 0.5,
                                                }}
                                            />

                                            {}
                                            <motion.span
                                                className="relative z-10"
                                                animate={isActive ? {
                                                    y: [0, -2, 0],
                                                    scale: [1, 1.05, 1],
                                                } : {}}
                                                transition={{
                                                    duration: 0.5,
                                                    ease: [0.34, 1.56, 0.64, 1]
                                                }}
                                                style={{
                                                    filter: isActive ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' : 'none',
                                                }}
                                            >
                                                {theme.emoji}
                                            </motion.span>

                                            {}
                                            <motion.div
                                                className="absolute inset-0 rounded-full pointer-events-none overflow-hidden"
                                                initial={{ opacity: 0 }}
                                                animate={isActive ? { opacity: 1 } : { opacity: 0 }}
                                            >
                                                <motion.div
                                                    className="absolute inset-0"
                                                    initial={{ scale: 0, opacity: 0.6 }}
                                                    animate={isActive ? {
                                                        scale: [0, 2.5],
                                                        opacity: [0.5, 0],
                                                    } : {}}
                                                    transition={{ duration: 0.6, ease: 'easeOut' }}
                                                    style={{
                                                        background: `radial-gradient(circle, ${theme.glow} 0%, transparent 60%)`,
                                                    }}
                                                />
                                            </motion.div>

                                            {}
                                            {isActive && (
                                                <motion.div
                                                    className="absolute inset-0 rounded-full pointer-events-none overflow-hidden"
                                                    initial={{ x: '-100%', opacity: 0 }}
                                                    animate={{ x: '200%', opacity: [0, 0.4, 0] }}
                                                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                                                    style={{
                                                        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)',
                                                        width: '50%',
                                                    }}
                                                />
                                            )}
                                        </motion.button>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                </motion.div>

                {}
                <div className="relative mb-2">
                    {}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                className="absolute rounded-full"
                                style={{
                                    border: '2px solid var(--pulse-color)',
                                }}
                                initial={{ width: '150px', height: '150px', opacity: 0 }}
                                animate={{
                                    width: ['150px', '700px'],
                                    height: ['150px', '700px'],
                                    opacity: [0.5, 0],
                                }}
                                transition={{
                                    duration: 12,
                                    repeat: Infinity,
                                    delay: i * 4,
                                    ease: 'easeOut',
                                }}
                            />
                        ))}
                    </div>

                    <motion.h1
                        key={`headline-${currentTheme}`}
                        initial={{ scale: 0.98, opacity: 0.8 }}
                        animate={isLoaded ? (isExiting ? {
                            opacity: 0,
                            y: -50,
                            scale: 0.9,
                        } : { opacity: 1, y: 0, scale: 1 }) : {}}
                        transition={isExiting ? {
                            duration: 1.2,
                            ease: [0.25, 0.1, 0.25, 1],
                            delay: 0.2,
                        } : {
                            duration: 0.5,
                            ease: [0.25, 0.1, 0.25, 1],
                            delay: 0.1,
                        }}
                        className="text-5xl md:text-6xl font-semibold tracking-tight text-center"
                        style={{
                            fontFamily: "'Inter', 'SF Pro Display', system-ui, sans-serif",
                            fontWeight: 600,
                            letterSpacing: '-0.04em',
                            color: 'var(--text)',
                        }}
                    >
                        PulseLink
                    </motion.h1>
                </div>

                {}
                <motion.p
                    key={`subheadline-${currentTheme}`}
                    initial={{ scale: 0.98, opacity: 0.8 }}
                    animate={isLoaded ? (isExiting ? {
                        opacity: 0,
                        y: 30,
                    } : { opacity: 1, y: 0, scale: 1 }) : {}}
                    transition={isExiting ? {
                        duration: 1,
                        delay: 0.1,
                    } : {
                        duration: 0.8,
                        ease: [0.25, 0.1, 0.25, 1],
                        delay: 0.35,
                    }}
                    className="text-base md:text-lg mb-4 text-center font-light max-w-2xl transition-colors duration-500"
                    style={{
                        fontFamily: "'Inter', system-ui, sans-serif",
                        fontWeight: 300,
                        letterSpacing: '-0.01em',
                        lineHeight: 1.6,
                        color: 'var(--text-secondary)',
                    }}
                >
                    The next generation of smart campus communication.
                </motion.p>

                {}
                <motion.p
                    key={`description-${currentTheme}`}
                    initial={{ scale: 0.98, opacity: 0.8 }}
                    animate={isLoaded ? (isExiting ? {
                        opacity: 0,
                        y: 40,
                    } : { opacity: 1, scale: 1 }) : {}}
                    transition={isExiting ? {
                        duration: 0.8,
                    } : {
                        duration: 0.5,
                        delay: 0.2,
                    }}
                    className="text-sm mb-4 max-w-2xl text-center font-light leading-relaxed transition-colors duration-500"
                    style={{
                        fontFamily: "'Inter', system-ui, sans-serif",
                        fontWeight: 300,
                        lineHeight: 1.8,
                        color: 'var(--text-muted)',
                    }}
                >
                    PulseLink transforms how campuses send, receive, and react to important information — instantly, intelligently, and securely.
                </motion.p>

                {}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={isLoaded ? (isExiting ? {
                        opacity: 0,
                        y: 20,
                    } : { opacity: 1 }) : {}}
                    transition={isExiting ? {
                        duration: 0.7,
                    } : {
                        duration: 0.8,
                        delay: 0.6,
                    }}
                    onMouseEnter={() => setIsQuoteHovered(true)}
                    onMouseLeave={() => setIsQuoteHovered(false)}
                    className="h-6 mb-3 flex items-center justify-center"
                >
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={currentQuote}
                            initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                            animate={{ opacity: 0.75, y: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
                            className="text-sm md:text-base text-center font-light italic transition-colors duration-500"
                            style={{
                                fontFamily: "'SF Pro Display', 'Inter', system-ui, sans-serif",
                                fontWeight: 300,
                                letterSpacing: '0.01em',
                                lineHeight: 1.6,
                                color: 'var(--text-muted)',
                            }}
                        >
                            "{motivationalQuotes[currentQuote]}"
                        </motion.p>
                    </AnimatePresence>
                </motion.div>

                {}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={isLoaded ? (isExiting ? {
                        opacity: 0,
                        scale: 0.8,
                    } : { opacity: 1 }) : {}}
                    transition={isExiting ? {
                        duration: 0.6,
                    } : {
                        delay: 0.7,
                        duration: 0.7,
                    }}
                    className="h-10 mb-6 flex items-center justify-center overflow-hidden"
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentWord}
                            initial={{ y: 30, opacity: 0, filter: 'blur(8px)' }}
                            animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                            exit={{ y: -30, opacity: 0, filter: 'blur(8px)' }}
                            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
                            className="text-2xl md:text-3xl font-medium transition-all duration-500"
                            style={{
                                fontFamily: "'Inter', system-ui, sans-serif",
                                fontWeight: 500,
                                background: 'var(--button-bg)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            {rotatingWords[currentWord]}
                        </motion.div>
                    </AnimatePresence>
                </motion.div>

                {}
                <motion.div
                    key={`button-${currentTheme}`}
                    initial={{ opacity: 0.8, scale: 0.98 }}
                    animate={isLoaded ? (isExiting ? {
                        opacity: 0,
                        scale: 1.15,
                        y: -30,
                        filter: 'blur(8px)',
                    } : {
                        opacity: 1,
                        scale: [1, 1.01, 1], 
                    }) : {}}
                    transition={isExiting ? {
                        duration: 0.8,
                        ease: [0.25, 0.1, 0.25, 1],
                    } : {
                        duration: 12, 
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                >
                    <motion.button
                        onClick={handleEnter}
                        whileHover={{
                            scale: 1.04,
                            y: -4,
                            rotate: 0.5,
                            boxShadow: '0 16px 48px var(--button-glow), 0 8px 24px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
                            transition: {
                                type: 'spring',
                                stiffness: 400,
                                damping: 15,
                                duration: 0.25
                            }
                        }}
                        whileTap={{
                            scale: 0.94,
                            y: 0,
                            rotate: 0,
                            transition: {
                                type: 'spring',
                                stiffness: 600,
                                damping: 20,
                                duration: 0.15
                            }
                        }}
                        className="group relative px-12 py-4 rounded-full overflow-hidden"
                        style={{
                            background: 'var(--button-bg)',
                            backdropFilter: 'blur(16px) saturate(180%)',
                            WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                            border: '1px solid var(--button-border)',
                            boxShadow: '0 8px 32px var(--button-glow), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                            willChange: 'transform, box-shadow',
                        }}
                    >
                        {}
                        <motion.div
                            className="absolute inset-0 rounded-full pointer-events-none"
                            initial={{ scale: 1, opacity: 0 }}
                            whileTap={{
                                scale: [1, 2.5],
                                opacity: [0.35, 0],
                                transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }
                            }}
                            style={{
                                background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)',
                                opacity: 0.3,
                            }}
                        />

                        {}
                        <motion.span
                            className="relative z-10 text-lg font-medium flex items-center gap-3 transition-colors duration-500"
                            whileHover={{ x: 2 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 10 }}
                            style={{
                                fontFamily: "'Inter', system-ui, sans-serif",
                                fontWeight: 500,
                                color: 'var(--text)',
                            }}
                        >
                            Enter
                            <motion.span
                                whileHover={{ x: 4 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 8 }}
                            >
                                →
                            </motion.span>
                        </motion.span>

                        {}
                        <motion.div
                            className="absolute inset-0 rounded-full"
                            initial={{ opacity: 0.25 }}
                            whileHover={{ opacity: 0.4 }}
                            transition={{ duration: 0.3 }}
                            style={{
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 50%)',
                            }}
                        />
                    </motion.button>
                </motion.div>

                {}
                <motion.div
                    key={`signup-button-${currentTheme}`}
                    initial={{ opacity: 0 }}
                    animate={isLoaded ? (isExiting ? {
                        opacity: 0,
                        y: 20,
                    } : {
                        opacity: 1,
                    }) : {}}
                    transition={isExiting ? {
                        duration: 0.5,
                    } : {
                        delay: 0.9,
                        duration: 0.6,
                    }}
                    className="mt-3"
                >
                    <motion.button
                        onClick={() => navigate('/signup')}
                        whileHover={{
                            scale: 1.02,
                            y: -2,
                            transition: {
                                type: 'spring',
                                stiffness: 400,
                                damping: 15,
                            }
                        }}
                        whileTap={{ scale: 0.98 }}
                        className="px-8 py-3 rounded-full text-sm font-medium transition-all duration-300"
                        style={{
                            fontFamily: "'Inter', system-ui, sans-serif",
                            fontWeight: 400,
                            background: 'rgba(255, 255, 255, 0.2)',
                            backdropFilter: 'blur(12px)',
                            WebkitBackdropFilter: 'blur(12px)',
                            border: '1px solid rgba(168, 85, 247, 0.2)',
                            color: 'var(--text-secondary)',
                            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
                        }}
                    >
                        New here? Create an account
                    </motion.button>
                </motion.div>

                {}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={isLoaded ? (isExiting ? {
                        opacity: 0,
                    } : { opacity: 1 }) : {}}
                    transition={isExiting ? {
                        duration: 0.5,
                    } : {
                        delay: 1.1,
                        duration: 0.9,
                    }}
                    className="absolute bottom-4 text-xs font-light tracking-widest uppercase transition-colors duration-500"
                    style={{
                        fontFamily: "'Inter', system-ui, sans-serif",
                        fontWeight: 300,
                        color: 'var(--text-muted)',
                        opacity: 0.6,
                    }}
                >
                    Powered by Real-Time Intelligence
                </motion.p>
            </motion.div >

            {}
            {
                isExiting && (
                    <motion.div
                        className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.5 }}
                    >
                        {}
                        <motion.div
                            className="absolute rounded-full"
                            style={{
                                border: '2px solid var(--glow)',
                                boxShadow: '0 0 40px var(--glow), inset 0 0 40px var(--glow)',
                            }}
                            initial={{ width: '0px', height: '0px', opacity: 0 }}
                            animate={{
                                width: ['0px', '1200px', '1600px'],
                                height: ['0px', '1200px', '1600px'],
                                opacity: [0, 0.8, 0],
                            }}
                            transition={{
                                duration: 1.8,
                                ease: [0.16, 1, 0.3, 1],
                                delay: 0.3,
                            }}
                        />

                        {}
                        <motion.div
                            className="absolute rounded-full"
                            style={{
                                background: 'var(--glow)',
                            }}
                            initial={{ width: '0px', height: '0px', opacity: 0 }}
                            animate={{
                                width: ['0px', '800px'],
                                height: ['0px', '800px'],
                                opacity: [0, 0.3, 0],
                            }}
                            transition={{
                                duration: 1.5,
                                ease: [0.16, 1, 0.3, 1],
                                delay: 0.5,
                            }}
                        />
                    </motion.div>
                )
            }

            {}
            {
                isExiting && (
                    <motion.div
                        className="fixed inset-0 z-40"
                        style={{
                            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.8) 100%)',
                        }}
                        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                        animate={{
                            opacity: 1,
                            backdropFilter: 'blur(30px)',
                        }}
                        transition={{
                            duration: 1.5,
                            ease: [0.25, 0.1, 0.25, 1],
                        }}
                    />
                )
            }


            {}
            <div
                className="absolute inset-0 opacity-[0.012] pointer-events-none mix-blend-overlay"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
            />
        </div >
    );
};

export default Welcome;
