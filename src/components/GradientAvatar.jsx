
import React from 'react';
import { motion } from 'framer-motion';
import RoleIcon from './RoleIcon';
import useThemeStore from '../store/themeStore';
import '../styles/avatar-gradients.css';


export const GRADIENT_PRESETS = {
    aurora: {
        id: 'aurora',
        name: 'Aurora Mist',
        description: 'Soft Blue → Lavender',
        className: 'avatar-gradient-aurora',
    },
    plum: {
        id: 'plum',
        name: 'Neo Plum',
        description: 'Grape Purple → Rose Magenta',
        className: 'avatar-gradient-plum',
    },
    silver: {
        id: 'silver',
        name: 'Silver Frost',
        description: 'White-Silver → Mist Gray',
        className: 'avatar-gradient-silver',
    },
    arctic: {
        id: 'arctic',
        name: 'Arctic Cyan',
        description: 'Teal → Ice Blue',
        className: 'avatar-gradient-arctic',
    },
    iris: {
        id: 'iris',
        name: 'Midnight Iris',
        description: 'Deep Indigo → Electric Violet',
        className: 'avatar-gradient-iris',
    },
};


const SIZE_CLASSES = {
    xs: 'premium-avatar-xs',
    sm: 'premium-avatar-sm',
    md: 'premium-avatar-md',
    lg: 'premium-avatar-lg',
    xl: 'premium-avatar-xl',
    '2xl': 'premium-avatar-2xl',
};


const ICON_SIZES = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 28,
    '2xl': 40,
};


const GradientAvatar = ({
    gradient = 'aurora',
    role = 'student',
    size = 'md',
    name = '',
    imageUrl = null,
    showShadow = true,
    showRing = false,
    animate = true,
    className = '',
    onClick = null,
}) => {
    const { currentTheme } = useThemeStore();
    const isDark = currentTheme === 'dark';

    
    const gradientConfig = GRADIENT_PRESETS[gradient] || GRADIENT_PRESETS.aurora;
    const gradientClass = gradientConfig.className;

    
    const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;
    const iconSize = ICON_SIZES[size] || ICON_SIZES.md;

    
    const avatarClasses = [
        'premium-avatar',
        'avatar-gradient',
        gradientClass,
        sizeClass,
        showShadow ? 'premium-avatar-shadow' : '',
        showRing ? 'premium-avatar-ring' : '',
        className,
    ].filter(Boolean).join(' ');

    
    const getInitials = (name) => {
        if (!name) return '';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    const content = (
        <>
            {imageUrl ? (
                <img
                    src={imageUrl}
                    alt={name}
                    className="w-full h-full object-cover"
                />
            ) : (
                <RoleIcon
                    role={role}
                    size={iconSize}
                    animate={false}
                />
            )}
        </>
    );

    if (animate) {
        return (
            <motion.div
                className={avatarClasses}
                onClick={onClick}
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                style={{ cursor: onClick ? 'pointer' : 'default' }}
            >
                {content}
            </motion.div>
        );
    }

    return (
        <div
            className={avatarClasses}
            onClick={onClick}
            style={{ cursor: onClick ? 'pointer' : 'default' }}
        >
            {content}
        </div>
    );
};


export const GradientAvatarPicker = ({ value, onChange, role = 'student', size = 'lg' }) => {
    return (
        <div className="flex flex-wrap gap-3 items-center justify-center">
            {Object.values(GRADIENT_PRESETS).map((preset) => (
                <motion.button
                    key={preset.id}
                    onClick={() => onChange(preset.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative rounded-full p-0.5 transition-all duration-200 ${value === preset.id
                            ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-900'
                            : 'ring-1 ring-transparent hover:ring-gray-200 dark:hover:ring-gray-700'
                        }`}
                    title={preset.name}
                >
                    <GradientAvatar
                        gradient={preset.id}
                        role={role}
                        size={size}
                        animate={false}
                        showShadow={value === preset.id}
                    />
                    {value === preset.id && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -bottom-1 -right-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center"
                        >
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </motion.div>
                    )}
                </motion.button>
            ))}
        </div>
    );
};

export default GradientAvatar;
