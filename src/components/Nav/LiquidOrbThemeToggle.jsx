import React from 'react';
import { motion } from 'framer-motion';
import useThemeStore from '../../store/themeStore';
import useLiquidOrb from '../../hooks/useLiquidOrb';


const LiquidOrbThemeToggle = () => {
    const { currentTheme, cycleTheme } = useThemeStore();
    const { orbRef, orbStyle, shouldBreathe, handlers } = useLiquidOrb({
        maxTilt: 20,
        scale: 1.1,
    });

    
    const themeToMode = {
        light: 'light',
        dark: 'dark',
        glass: 'glass',
        neo: 'neo',
    };

    
    const themeIcons = {
        light: '☀️',
        dark: '🌙',
        glass: '💎',
        neo: '✨',
    };

    
    const themeLabels = {
        light: 'Light theme',
        dark: 'Dark theme',
        glass: 'Glass theme',
        neo: 'Neo 3D theme',
    };

    const mode = themeToMode[currentTheme] || 'light';

    
    const handleClick = () => {
        cycleTheme();
    };

    
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            cycleTheme();
        }
    };

    return (
        <div className="liquid-orb-container">
            <motion.button
                ref={orbRef}
                className={`liquid-orb ${shouldBreathe ? 'liquid-orb-breathing' : ''}`}
                data-mode={mode}
                style={orbStyle}
                onClick={handleClick}
                onKeyDown={handleKeyDown}
                aria-label={`Current: ${themeLabels[currentTheme]}. Click to switch theme.`}
                role="button"
                tabIndex={0}
                whileTap={{ scale: 0.95 }}
                {...handlers}
            >
                <span className="liquid-orb-icon" aria-hidden="true">
                    {themeIcons[currentTheme]}
                </span>
            </motion.button>
        </div>
    );
};

export default LiquidOrbThemeToggle;
