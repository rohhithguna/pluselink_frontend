
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';


const THEME_PREVIEWS = {
    default: { accent: '#a855f7', bg: '#ffffff', text: '#1a1a1a', name: 'Default' },
    waterGlass: { accent: '#0ea5e9', bg: '#f0f9ff', text: '#0c4a6e', name: 'Water-Glass' },
    luxury: { accent: '#d4af37', bg: '#0f0f23', text: '#f5f5f5', name: 'Luxury' },
    space: { accent: '#818cf8', bg: '#0f0c29', text: '#e0e7ff', name: 'Space' },
    minimalWhite: { accent: '#374151', bg: '#ffffff', text: '#111827', name: 'Minimal White' },
    natureCalm: { accent: '#059669', bg: '#ecfdf5', text: '#064e3b', name: 'Nature Calm' },
    darkStealth: { accent: '#ef4444', bg: '#0a0a0a', text: '#f5f5f5', name: 'Dark Stealth' },
};


const MiniParticle = ({ delay, x }) => (
    <motion.div
        className="absolute w-2 h-2 rounded-full"
        style={{
            background: 'radial-gradient(circle, rgba(168,85,247,0.9) 0%, rgba(168,85,247,0.3) 100%)',
            left: `${x}%`,
            top: '50%',
        }}
        animate={{
            y: [-10, 10, -10],
            x: [-5, 5, -5],
            scale: [1, 1.2, 1],
            opacity: [0.6, 1, 0.6],
        }}
        transition={{
            duration: 2,
            delay,
            repeat: Infinity,
            ease: 'easeInOut',
        }}
    />
);


const ThemePreview = ({ data }) => {
    const themeName = data?.theme || 'default';
    const theme = THEME_PREVIEWS[themeName] || THEME_PREVIEWS.default;

    return (
        <div className="space-y-3">
            {}
            <div className="text-xs text-white/60 text-center">
                Previewing: <span className="text-white/90 font-medium">{theme.name}</span>
            </div>

            {}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-xl p-4 relative overflow-hidden"
                style={{
                    background: theme.bg,
                    border: `1px solid ${theme.accent}22`,
                    boxShadow: `0 4px 20px ${theme.accent}20`,
                }}
            >
                {}
                <div
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ background: `linear-gradient(90deg, ${theme.accent}, ${theme.accent}88)` }}
                />

                <div className="flex items-center gap-3 mb-3">
                    <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm"
                        style={{ background: theme.accent }}
                    >
                        📢
                    </div>
                    <div>
                        <div className="text-sm font-semibold" style={{ color: theme.text }}>
                            Sample Alert
                        </div>
                        <div className="text-xs opacity-60" style={{ color: theme.text }}>
                            Just now
                        </div>
                    </div>
                </div>

                <div className="text-xs opacity-70 mb-3" style={{ color: theme.text }}>
                    This is how your alerts will appear with this theme.
                </div>

                {}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    className="w-full py-2 rounded-lg text-xs font-medium text-white"
                    style={{ background: theme.accent }}
                >
                    View Details
                </motion.button>
            </motion.div>
        </div>
    );
};


const MotionPreview = ({ data }) => {
    const isEnabled = data?.cursorGravity || data?.parallaxBackground;

    return (
        <div className="space-y-3">
            <div className="text-xs text-white/60 text-center">
                {isEnabled ? 'Motion effects enabled' : 'Motion effects preview'}
            </div>

            <div
                className="relative h-24 rounded-xl overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, rgba(168,85,247,0.1) 0%, rgba(139,92,246,0.05) 100%)',
                    border: '1px solid rgba(168,85,247,0.2)',
                }}
            >
                {}
                <MiniParticle delay={0} x={20} />
                <MiniParticle delay={0.3} x={50} />
                <MiniParticle delay={0.6} x={80} />

                {}
                <motion.div
                    className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full -translate-x-1/2 -translate-y-1/2"
                    style={{
                        background: 'rgba(168,85,247,0.3)',
                        boxShadow: '0 0 20px rgba(168,85,247,0.5)',
                    }}
                    animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />

                {}
                <div className="absolute bottom-2 left-0 right-0 text-center text-xs text-white/50">
                    Particles react to cursor
                </div>
            </div>
        </div>
    );
};


const EmergencyPreview = ({ data }) => {
    const mode = data?.emergencyVisualMode || 'enhanced';
    const intensity = mode === 'cinematic' ? 0.5 : mode === 'enhanced' ? 0.3 : 0.15;

    return (
        <div className="space-y-3">
            <div className="text-xs text-white/60 text-center">
                Emergency mode: <span className="text-white/90">{mode}</span>
            </div>

            <motion.div
                className="relative h-28 rounded-xl overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, #1a0a0a 0%, #0a0a0a 100%)',
                    border: '1px solid rgba(239,68,68,0.3)',
                }}
            >
                {}
                <motion.div
                    className="absolute inset-0"
                    animate={{
                        opacity: [0, intensity, 0],
                        boxShadow: [
                            'inset 0 0 30px rgba(239,68,68,0)',
                            `inset 0 0 60px rgba(239,68,68,${intensity})`,
                            'inset 0 0 30px rgba(239,68,68,0)',
                        ],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                    style={{
                        background: 'radial-gradient(circle at center, rgba(239,68,68,0.1) 0%, transparent 70%)',
                    }}
                />

                {}
                <motion.div
                    className="absolute inset-4 rounded-lg p-3 flex items-center gap-3"
                    style={{
                        background: 'rgba(239,68,68,0.15)',
                        border: '1px solid rgba(239,68,68,0.3)',
                    }}
                    animate={{
                        scale: [1, 1.02, 1],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                >
                    <motion.span
                        className="text-2xl"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                    >
                        🚨
                    </motion.span>
                    <div>
                        <div className="text-sm font-bold text-red-400">EMERGENCY</div>
                        <div className="text-xs text-red-300/70">Critical alert preview</div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};


const SoundPreview = ({ data }) => {
    const style = data?.soundStyle || 'glass';
    const [played, setPlayed] = useState(false);

    useEffect(() => {
        
        setPlayed(true);
        const timer = setTimeout(() => setPlayed(false), 500);
        return () => clearTimeout(timer);
    }, [style]);

    return (
        <div className="space-y-3">
            <div className="text-xs text-white/60 text-center">
                Sound style: <span className="text-white/90 capitalize">{style}</span>
            </div>

            <div
                className="relative h-24 rounded-xl flex items-center justify-center"
                style={{
                    background: 'linear-gradient(135deg, rgba(168,85,247,0.08) 0%, rgba(139,92,246,0.04) 100%)',
                    border: '1px solid rgba(168,85,247,0.15)',
                }}
            >
                {}
                <div className="flex items-center gap-4">
                    <motion.div
                        animate={played ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 0.3 }}
                        className="text-3xl"
                    >
                        🔊
                    </motion.div>

                    {}
                    <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                className="w-1 bg-purple-400/60 rounded-full"
                                animate={{
                                    height: ['12px', '24px', '12px'],
                                }}
                                transition={{
                                    duration: 0.5,
                                    delay: i * 0.1,
                                    repeat: Infinity,
                                }}
                            />
                        ))}
                    </div>
                </div>

                {}
                <AnimatePresence>
                    {played && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="absolute bottom-2 text-xs text-purple-300"
                        >
                            ♪ Sound played
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};


const AnimationPreview = ({ data }) => {
    const speed = data?.animationSpeed || 'normal';
    const speedMultiplier = speed === 'slow' ? 1.5 : speed === 'fast' ? 0.5 : 1;

    return (
        <div className="space-y-3">
            <div className="text-xs text-white/60 text-center">
                Animation speed: <span className="text-white/90 capitalize">{speed}</span>
            </div>

            <div
                className="relative h-24 rounded-xl flex items-center justify-center"
                style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.1)',
                }}
            >
                {}
                <motion.button
                    className="px-6 py-2.5 rounded-xl text-sm font-medium text-white"
                    style={{
                        background: 'linear-gradient(135deg, rgba(168,85,247,0.9) 0%, rgba(139,92,246,0.9) 100%)',
                        boxShadow: '0 4px 16px rgba(168,85,247,0.3)',
                    }}
                    animate={{
                        scale: [1, 1.05, 1],
                        boxShadow: [
                            '0 4px 16px rgba(168,85,247,0.3)',
                            '0 8px 24px rgba(168,85,247,0.5)',
                            '0 4px 16px rgba(168,85,247,0.3)',
                        ],
                    }}
                    transition={{
                        duration: 1.5 * speedMultiplier,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                >
                    Hover Effect Demo
                </motion.button>
            </div>

            <div className="text-xs text-white/40 text-center">
                Animation timing: {speed === 'slow' ? '1.5x' : speed === 'fast' ? '0.5x' : '1x'}
            </div>
        </div>
    );
};


const LayoutPreview = ({ data }) => {
    const mode = data?.layoutMode || 'standard';
    const gridClass = mode === 'compact' ? 'grid-cols-4' : mode === 'immersive' ? 'grid-cols-2' : 'grid-cols-3';

    return (
        <div className="space-y-3">
            <div className="text-xs text-white/60 text-center">
                Layout: <span className="text-white/90 capitalize">{mode}</span>
            </div>

            <div
                className="relative rounded-xl p-3"
                style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.1)',
                }}
            >
                {}
                <div className={`grid ${gridClass} gap-2`}>
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="h-8 rounded-lg"
                            style={{
                                background: i === 1
                                    ? 'linear-gradient(135deg, rgba(168,85,247,0.4) 0%, rgba(139,92,246,0.4) 100%)'
                                    : 'rgba(255,255,255,0.08)',
                                border: '1px solid rgba(255,255,255,0.1)',
                            }}
                        />
                    ))}
                </div>
            </div>

            <div className="text-xs text-white/40 text-center">
                {mode === 'compact' ? '4 columns, dense' : mode === 'immersive' ? '2 columns, spacious' : '3 columns, balanced'}
            </div>
        </div>
    );
};


const SpatialPreview = ({ data }) => {
    const enabled = data?.spatialModeEnabled;

    return (
        <div className="space-y-3">
            <div className="text-xs text-white/60 text-center">
                Spatial Mode: <span className="text-white/90">{enabled ? 'Enabled' : 'Disabled'}</span>
            </div>

            <motion.div
                className="relative h-28 rounded-xl overflow-hidden perspective-1000"
                style={{
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.1)',
                }}
            >
                {}
                <motion.div
                    className="absolute inset-4 rounded-lg"
                    style={{
                        background: 'rgba(255,255,255,0.08)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        boxShadow: enabled
                            ? '0 20px 40px rgba(0,0,0,0.3), 0 0 30px rgba(168,85,247,0.1)'
                            : '0 4px 8px rgba(0,0,0,0.2)',
                    }}
                    animate={enabled ? {
                        rotateX: [0, 5, 0],
                        rotateY: [-5, 5, -5],
                        z: [0, 20, 0],
                    } : {}}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                >
                    <div className="p-3 text-center">
                        <div className="text-lg mb-1">🌌</div>
                        <div className="text-xs text-white/70">Depth Effect</div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};


const PreviewContent = ({ mode, data }) => {
    const renderContent = () => {
        switch (mode) {
            case 'THEME':
                return <ThemePreview data={data} />;
            case 'MOTION':
                return <MotionPreview data={data} />;
            case 'EMERGENCY':
                return <EmergencyPreview data={data} />;
            case 'SOUND':
                return <SoundPreview data={data} />;
            case 'ANIMATION':
                return <AnimationPreview data={data} />;
            case 'LAYOUT':
                return <LayoutPreview data={data} />;
            case 'SPATIAL':
                return <SpatialPreview data={data} />;
            default:
                return (
                    <div className="text-center text-white/50 text-sm py-8">
                        Select a setting to preview
                    </div>
                );
        }
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={mode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
            >
                {renderContent()}
            </motion.div>
        </AnimatePresence>
    );
};

export default PreviewContent;
