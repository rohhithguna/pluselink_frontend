import React from 'react';
import { motion } from 'framer-motion';
import useThemeStore from '../store/themeStore';


const getThemeStyles = (theme) => {
    const styles = {
        light: {
            base: {
                background: 'rgba(255, 255, 255, 0.88)',
                backdropFilter: 'blur(16px) saturate(180%)',
                WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                boxShadow: `
                    inset 0 1px 2px rgba(255,255,255,0.7),
                    0 8px 16px rgba(0, 0, 0, 0.10),
                    0 2px 4px rgba(0, 0, 0, 0.04)
                `,
                color: '#111827',
            },
            hover: {
                y: -3,
                scale: 1.01,
                boxShadow: `
                    inset 0 1px 2px rgba(255,255,255,0.8),
                    0 16px 32px rgba(0, 0, 0, 0.12),
                    0 4px 8px rgba(0, 0, 0, 0.06)
                `,
            },
        },
        dark: {
            base: {
                background: 'linear-gradient(145deg, rgba(30, 30, 30, 0.95) 0%, rgba(20, 20, 20, 0.98) 100%)',
                backdropFilter: 'blur(20px) saturate(150%)',
                WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: `
                    0 8px 32px rgba(0, 0, 0, 0.5),
                    0 0 0 1px rgba(255, 255, 255, 0.05),
                    inset 0 1px 0 rgba(255, 255, 255, 0.05)
                `,
                color: '#f1f5f9',
            },
            hover: {
                y: -4,
                scale: 1.01,
                boxShadow: `
                    0 16px 48px rgba(0, 0, 0, 0.6),
                    0 0 24px rgba(168, 85, 247, 0.15),
                    0 0 0 1px rgba(168, 85, 247, 0.2),
                    inset 0 1px 0 rgba(255, 255, 255, 0.08)
                `,
            },
        },
        glass: {
            base: {
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.05) 100%)',
                backdropFilter: 'blur(24px) saturate(180%)',
                WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                boxShadow: `
                    inset 0 1px 0 rgba(255, 255, 255, 0.4),
                    inset 0 -1px 0 rgba(255, 255, 255, 0.1),
                    0 8px 32px rgba(0, 0, 0, 0.12),
                    0 0 0 1px rgba(255, 255, 255, 0.1)
                `,
                color: '#111827',
            },
            hover: {
                y: -4,
                scale: 1.01,
                boxShadow: `
                    inset 0 1px 0 rgba(255, 255, 255, 0.5),
                    inset 0 -1px 0 rgba(255, 255, 255, 0.15),
                    0 16px 48px rgba(0, 0, 0, 0.15),
                    0 0 24px rgba(168, 85, 247, 0.1),
                    0 0 0 1px rgba(255, 255, 255, 0.2)
                `,
            },
        },
        neo: {
            base: {
                background: '#e8ecef',
                backdropFilter: 'none',
                WebkitBackdropFilter: 'none',
                border: 'none',
                boxShadow: `
                    6px 6px 12px rgba(166, 180, 200, 0.35),
                    -6px -6px 12px rgba(255, 255, 255, 0.8),
                    inset 1px 1px 2px rgba(255, 255, 255, 0.3),
                    inset -1px -1px 2px rgba(166, 180, 200, 0.15)
                `,
                color: '#111827',
            },
            hover: {
                y: -2,
                scale: 1.01,
                rotateX: 1,
                rotateY: -1,
                boxShadow: `
                    8px 8px 16px rgba(166, 180, 200, 0.4),
                    -8px -8px 16px rgba(255, 255, 255, 0.9),
                    inset 1px 1px 2px rgba(255, 255, 255, 0.4),
                    inset -1px -1px 2px rgba(166, 180, 200, 0.2)
                `,
            },
        },
    };
    return styles[theme] || styles.light;
};

const Card = ({ children, className = '', onClick, style = {}, ...props }) => {
    const { currentTheme } = useThemeStore();
    const themeStyles = getThemeStyles(currentTheme);

    return (
        <motion.div
            className={`p-5 rounded-2xl ${className}`}
            onClick={onClick}
            style={{
                ...themeStyles.base,
                transformStyle: currentTheme === 'neo' ? 'preserve-3d' : 'flat',
                perspective: currentTheme === 'neo' ? '1000px' : 'none',
                ...style,
            }}
            whileHover={themeStyles.hover}
            transition={{
                duration: 0.2,
                ease: [0.16, 1, 0.3, 1],
            }}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default Card;
