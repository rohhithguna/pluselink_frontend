
import React, { createContext, useContext, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import useSettingsStore from '../store/settingsStore';

const SpatialContext = createContext({});

export const useSpatial = () => useContext(SpatialContext);

export const SpatialModeProvider = ({ children }) => {
    const {
        spatialModeEnabled,
        spatialMotionIntensity,
        spatialDepthBlur,
        spatialParallax
    } = useSettingsStore();

    const containerRef = useRef(null);

    
    const mouseX = useMotionValue(0.5);
    const mouseY = useMotionValue(0.5);

    
    const smoothMouseX = useSpring(mouseX, {
        stiffness: spatialMotionIntensity === 'reduced' ? 30 : 50,
        damping: spatialMotionIntensity === 'reduced' ? 30 : 20
    });
    const smoothMouseY = useSpring(mouseY, {
        stiffness: spatialMotionIntensity === 'reduced' ? 30 : 50,
        damping: spatialMotionIntensity === 'reduced' ? 30 : 20
    });

    
    const intensity = useMemo(() => {
        switch (spatialMotionIntensity) {
            case 'off': return 0;
            case 'reduced': return 0.3;
            case 'full': return 1;
            default: return 1;
        }
    }, [spatialMotionIntensity]);

    
    const parallaxX = useTransform(smoothMouseX, [0, 1], [-20 * intensity, 20 * intensity]);
    const parallaxY = useTransform(smoothMouseY, [0, 1], [-20 * intensity, 20 * intensity]);

    
    const lightX = useTransform(smoothMouseX, [0, 1], [0, 100]);
    const lightY = useTransform(smoothMouseY, [0, 1], [0, 100]);

    
    const ambientLightBg = useTransform(
        [lightX, lightY],
        ([x, y]) => `radial-gradient(600px circle at ${x}% ${y}%, rgba(168, 85, 247, 0.06) 0%, transparent 50%)`
    );

    
    const handleMouseMove = useCallback((e) => {
        if (!spatialModeEnabled || spatialMotionIntensity === 'off') return;

        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
            mouseX.set((e.clientX - rect.left) / rect.width);
            mouseY.set((e.clientY - rect.top) / rect.height);
        }
    }, [spatialModeEnabled, spatialMotionIntensity, mouseX, mouseY]);

    useEffect(() => {
        if (spatialModeEnabled) {
            document.body.classList.add('spatial-mode');
        } else {
            document.body.classList.remove('spatial-mode');
        }
        return () => document.body.classList.remove('spatial-mode');
    }, [spatialModeEnabled]);

    const contextValue = useMemo(() => ({
        enabled: spatialModeEnabled,
        intensity,
        depthBlur: spatialDepthBlur,
        parallaxEnabled: spatialParallax,
        mouseX: smoothMouseX,
        mouseY: smoothMouseY,
        parallaxX,
        parallaxY,
        lightX,
        lightY,
    }), [spatialModeEnabled, intensity, spatialDepthBlur, spatialParallax,
        smoothMouseX, smoothMouseY, parallaxX, parallaxY, lightX, lightY]);

    if (!spatialModeEnabled) {
        return <>{children}</>;
    }

    return (
        <SpatialContext.Provider value={contextValue}>
            <div
                ref={containerRef}
                onMouseMove={handleMouseMove}
                className="spatial-container min-h-screen relative"
                style={{
                    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                }}
            >
                {}
                <motion.div
                    className="fixed inset-0 pointer-events-none z-0"
                    style={{
                        background: ambientLightBg,
                    }}
                />

                {}
                <div className="relative z-10">
                    {children}
                </div>
            </div>
        </SpatialContext.Provider>
    );
};


export const SpatialPanel = ({ children, className = '', depth = 1, ...props }) => {
    const { enabled, intensity, parallaxX, parallaxY, lightX, lightY } = useSpatial();

    
    const xTransform = useTransform(parallaxX || 0, v => (v || 0) * depth * 0.3 * (intensity || 0));
    const yTransform = useTransform(parallaxY || 0, v => (v || 0) * depth * 0.3 * (intensity || 0));
    const refractionBg = useTransform(
        [lightX || 0, lightY || 0],
        ([x, y]) => `linear-gradient(${135 + ((x || 50) - 50) * 0.5}deg, 
            rgba(255,255,255,${0.1 + ((y || 0) / 200)}) 0%, 
            transparent 50%,
            rgba(255,255,255,${0.05 + ((x || 0) / 400)}) 100%
        )`
    );

    const depthShadow = 8 + (depth * 12);
    const blurAmount = 20 + (depth * 5);

    if (!enabled) {
        return <div className={className} {...props}>{children}</div>;
    }

    return (
        <motion.div
            className={`spatial-panel ${className}`}
            style={{
                background: 'rgba(255, 255, 255, 0.6)',
                backdropFilter: `blur(${blurAmount}px) saturate(180%)`,
                WebkitBackdropFilter: `blur(${blurAmount}px) saturate(180%)`,
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '24px',
                boxShadow: `
                    0 ${depthShadow}px ${depthShadow * 2}px rgba(0,0,0,0.08),
                    0 ${depthShadow / 2}px ${depthShadow}px rgba(168, 85, 247, 0.04),
                    inset 0 1px 1px rgba(255,255,255,0.6)
                `,
                x: xTransform,
                y: yTransform,
            }}
            whileHover={{
                scale: 1.005,
                boxShadow: `
                    0 ${depthShadow * 1.5}px ${depthShadow * 3}px rgba(0,0,0,0.1),
                    0 ${depthShadow}px ${depthShadow * 1.5}px rgba(168, 85, 247, 0.06),
                    inset 0 1px 2px rgba(255,255,255,0.8)
                `,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            {...props}
        >
            {}
            <motion.div
                className="absolute inset-0 rounded-3xl pointer-events-none overflow-hidden"
                style={{
                    background: refractionBg,
                }}
            />
            <div className="relative z-10">{children}</div>
        </motion.div>
    );
};


export const SpatialButton = ({ children, variant = 'default', className = '', ...props }) => {
    const { enabled, intensity } = useSpatial();

    const variants = {
        default: {
            background: 'rgba(255, 255, 255, 0.8)',
            border: '1px solid rgba(168, 85, 247, 0.1)',
            color: '#1a1a1a',
        },
        primary: {
            background: 'linear-gradient(135deg, #a855f7 0%, #8b5cf6 100%)',
            border: 'none',
            color: 'white',
        },
        glass: {
            background: 'rgba(255, 255, 255, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: '#1a1a1a',
        },
    };

    const style = variants[variant] || variants.default;

    return (
        <motion.button
            className={`
                px-6 py-3 rounded-2xl font-medium
                backdrop-blur-md relative overflow-hidden
                ${className}
            `}
            style={{
                ...style,
                boxShadow: enabled
                    ? '0 8px 24px rgba(0,0,0,0.08), inset 0 1px 1px rgba(255,255,255,0.4)'
                    : '0 4px 12px rgba(0,0,0,0.05)',
            }}
            whileHover={{
                scale: 1.02,
                y: enabled ? -2 : 0,
                boxShadow: enabled
                    ? '0 12px 32px rgba(0,0,0,0.12), inset 0 1px 2px rgba(255,255,255,0.6)'
                    : '0 6px 16px rgba(0,0,0,0.08)',
            }}
            whileTap={{
                scale: 0.98,
                y: 0,
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            {...props}
        >
            {}
            {enabled && (
                <motion.div
                    className="absolute inset-0 pointer-events-none"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%)',
                    }}
                />
            )}
            <span className="relative z-10">{children}</span>
        </motion.button>
    );
};


export const SpatialBackdrop = ({ isOpen, onClose, children }) => {
    const { enabled, depthBlur } = useSpatial();

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={onClose}
        >
            {}
            <motion.div
                className="absolute inset-0"
                initial={{ backdropFilter: 'blur(0px)' }}
                animate={{
                    backdropFilter: enabled
                        ? `blur(${depthBlur * 20}px)`
                        : 'blur(4px)',
                    background: 'rgba(0,0,0,0.3)',
                }}
                transition={{ duration: 0.3 }}
            />

            {}
            <motion.div
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: 10, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                onClick={(e) => e.stopPropagation()}
                className="relative z-10"
            >
                {children}
            </motion.div>
        </motion.div>
    );
};

export default SpatialModeProvider;
