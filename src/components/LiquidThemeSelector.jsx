import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useThemeStore from '../store/themeStore';
import '../styles/liquid-selector.css';


const LiquidThemeSelector = () => {
    const { currentTheme, setTheme, cycleTheme } = useThemeStore();
    const [ripples, setRipples] = useState([]);
    const [expanded, setExpanded] = useState(false);
    const [magneticOffset, setMagneticOffset] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);

    
    const themeIcons = {
        light: '☀️',
        dark: '🌙',
        glass: '💎',
        neo: '🔮'
    };

    
    const themeNames = {
        light: 'Light',
        dark: 'Dark',
        glass: 'Glass',
        neo: '3D Mode'
    };

    
    const createRipple = useCallback((e) => {
        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const id = Date.now();

        setRipples(prev => [...prev, { id, x, y }]);
        setTimeout(() => {
            setRipples(prev => prev.filter(r => r.id !== id));
        }, 800);
    }, []);

    
    const handleMouseMove = useCallback((e) => {
        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = (e.clientX - centerX) * 0.15;
        const deltaY = (e.clientY - centerY) * 0.15;

        setMagneticOffset({ x: deltaX, y: deltaY });
    }, []);

    const handleMouseLeave = useCallback(() => {
        setMagneticOffset({ x: 0, y: 0 });
        setExpanded(false);
    }, []);

    
    const handleClick = useCallback((e) => {
        createRipple(e);

        
        if (!expanded) {
            setExpanded(true);
        } else {
            cycleTheme();
            setExpanded(false);
        }
    }, [createRipple, expanded, cycleTheme]);

    
    const selectTheme = useCallback((themeName, e) => {
        e.stopPropagation();
        createRipple(e);
        setTheme(themeName);
        setExpanded(false);

        
        const flash = document.createElement('div');
        flash.className = `theme-flash ${themeName}`;
        document.body.appendChild(flash);
        setTimeout(() => flash.remove(), 600);

        
        document.body.classList.add('theme-transitioning');
        setTimeout(() => {
            document.body.classList.remove('theme-transitioning');
        }, 500);
    }, [createRipple, setTheme]);

    
    useEffect(() => {
        document.body.className = document.body.className
            .replace(/theme-\w+/g, '')
            .trim();
        document.body.classList.add(`theme-${currentTheme}`);
    }, [currentTheme]);

    const themes = ['light', 'dark', 'glass', 'neo'];

    return (
        <div
            className="liquid-selector-container"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <motion.div
                ref={containerRef}
                className={`liquid-selector ${expanded ? 'expanded' : ''} magnetic`}
                onClick={handleClick}
                animate={{
                    x: magneticOffset.x,
                    y: magneticOffset.y,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
                {}
                <div className="liquid-pulse-ring" />

                {}
                <motion.div
                    className={`liquid-blob ${currentTheme}`}
                    animate={{
                        scale: expanded ? 0.9 : 1,
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                    <span className="liquid-icon">
                        {themeIcons[currentTheme]}
                    </span>

                    {}
                    {ripples.map(ripple => (
                        <span
                            key={ripple.id}
                            className="liquid-ripple"
                            style={{ left: ripple.x, top: ripple.y }}
                        />
                    ))}
                </motion.div>

                {}
                <span className="liquid-label">
                    {themeNames[currentTheme]}
                </span>

                {}
                <div className="liquid-orbit">
                    {themes.filter(t => t !== currentTheme).map(themeName => (
                        <motion.div
                            key={themeName}
                            className={`orbit-dot ${themeName}`}
                            onClick={(e) => selectTheme(themeName, e)}
                            whileHover={{ scale: 1.3 }}
                            whileTap={{ scale: 0.9 }}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{
                                opacity: expanded ? 1 : 0,
                                scale: expanded ? 1 : 0.5,
                            }}
                            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                            title={themeNames[themeName]}
                        >
                            {expanded && (
                                <span style={{ fontSize: expanded ? 16 : 10 }}>
                                    {themeIcons[themeName]}
                                </span>
                            )}
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default LiquidThemeSelector;
