import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useThemeStore from '../store/themeStore';


const premiumTransition = {
    type: 'spring',
    stiffness: 400,
    damping: 30,
};


const getSearchThemeStyles = (theme, isFocused) => {
    const styles = {
        light: {
            container: {
                background: isFocused ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.8)',
                border: isFocused ? '1px solid rgba(168, 85, 247, 0.25)' : '1px solid rgba(168, 85, 247, 0.08)',
                boxShadow: isFocused
                    ? '0 0 0 3px rgba(168, 85, 247, 0.12), 0 8px 16px rgba(0, 0, 0, 0.10)'
                    : '0 8px 16px rgba(0, 0, 0, 0.06)',
            },
            input: { color: '#111827', WebkitTextFillColor: '#111827' },
            placeholder: isFocused ? '#a855f7' : '#9ca3af',
            clearBtn: { color: '#9ca3af', hoverBg: 'rgba(0,0,0,0.05)' },
        },
        dark: {
            container: {
                background: isFocused ? 'rgba(35, 35, 35, 0.95)' : 'rgba(25, 25, 25, 0.9)',
                border: isFocused ? '1px solid rgba(168, 85, 247, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: isFocused
                    ? '0 0 0 3px rgba(168, 85, 247, 0.2), 0 0 24px rgba(168, 85, 247, 0.15), 0 8px 24px rgba(0, 0, 0, 0.4)'
                    : '0 8px 24px rgba(0, 0, 0, 0.3)',
            },
            input: { color: '#f1f5f9', WebkitTextFillColor: '#f1f5f9' },
            placeholder: isFocused ? '#c4b5fd' : '#6b7280',
            clearBtn: { color: '#6b7280', hoverBg: 'rgba(255,255,255,0.1)' },
        },
        glass: {
            container: {
                background: isFocused ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                border: isFocused ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid rgba(255, 255, 255, 0.15)',
                boxShadow: isFocused
                    ? 'inset 0 1px 0 rgba(255,255,255,0.4), 0 0 24px rgba(168, 85, 247, 0.1), 0 8px 32px rgba(0, 0, 0, 0.1)'
                    : 'inset 0 1px 0 rgba(255,255,255,0.3), 0 8px 24px rgba(0, 0, 0, 0.08)',
            },
            input: { color: '#111827', WebkitTextFillColor: '#111827' },
            placeholder: isFocused ? '#a855f7' : '#6b7280',
            clearBtn: { color: '#6b7280', hoverBg: 'rgba(0,0,0,0.08)' },
        },
        neo: {
            container: {
                background: '#e8ecef',
                border: 'none',
                boxShadow: isFocused
                    ? 'inset 4px 4px 8px rgba(166, 180, 200, 0.4), inset -4px -4px 8px rgba(255, 255, 255, 0.9), 0 0 0 2px rgba(168, 85, 247, 0.2)'
                    : 'inset 3px 3px 6px rgba(166, 180, 200, 0.3), inset -3px -3px 6px rgba(255, 255, 255, 0.8)',
            },
            input: { color: '#111827', WebkitTextFillColor: '#111827' },
            placeholder: isFocused ? '#a855f7' : '#9ca3af',
            clearBtn: { color: '#6b7280', hoverBg: 'rgba(0,0,0,0.05)' },
        },
    };
    return styles[theme] || styles.light;
};

const SearchBar = ({ onSearch, placeholder = 'Search alerts...' }) => {
    const [value, setValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const { currentTheme } = useThemeStore();

    const themeStyles = getSearchThemeStyles(currentTheme, isFocused);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(value);
    };

    const handleChange = (e) => {
        setValue(e.target.value);
        onSearch(e.target.value);
    };

    const handleClear = () => {
        setValue('');
        onSearch('');
    };

    return (
        <form onSubmit={handleSubmit} className="relative w-full">
            <motion.div
                initial={false}
                animate={themeStyles.container}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="relative rounded-full overflow-hidden"
                style={{
                    backdropFilter: currentTheme === 'glass' ? 'blur(24px) saturate(180%)' : 'blur(16px) saturate(180%)',
                    WebkitBackdropFilter: currentTheme === 'glass' ? 'blur(24px) saturate(180%)' : 'blur(16px) saturate(180%)',
                }}
            >
                {}
                <motion.span
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-base pointer-events-none"
                    animate={{
                        color: themeStyles.placeholder,
                        filter: isFocused && currentTheme === 'dark' ? 'drop-shadow(0 0 4px rgba(168, 85, 247, 0.5))' : 'none',
                    }}
                    transition={{ duration: 0.2 }}
                >
                    🔍
                </motion.span>

                {}
                <input
                    type="text"
                    value={value}
                    onChange={handleChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    className="w-full pl-11 pr-11 py-3.5 rounded-full text-sm font-medium outline-none bg-transparent"
                    style={themeStyles.input}
                />

                {}
                <AnimatePresence>
                    {value && (
                        <motion.button
                            type="button"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={premiumTransition}
                            onClick={handleClear}
                            whileHover={{ scale: 1.1, backgroundColor: themeStyles.clearBtn.hoverBg }}
                            whileTap={{ scale: 0.9 }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center transition-colors text-xs"
                            style={{ color: themeStyles.clearBtn.color }}
                        >
                            ✕
                        </motion.button>
                    )}
                </AnimatePresence>
            </motion.div>
        </form>
    );
};

export default SearchBar;
