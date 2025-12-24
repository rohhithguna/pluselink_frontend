import React from 'react';
import { motion } from 'framer-motion';
import useThemeStore from '../store/themeStore';

const Button = ({
    children,
    variant = 'primary',
    type = 'button',
    disabled = false,
    className = '',
    ...props
}) => {
    const { theme } = useThemeStore();

    const baseStyles = `
        px-6 py-2.5 rounded-xl font-medium text-sm
        transition-premium
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2
        shadow-md hover:shadow-lg
    `;

    const variants = {
        primary: 'bg-primary text-white hover:bg-primary-dark',
        outline: `${theme.buttonOutline}`,
        ghost: 'text-neutral-700 hover:bg-neutral-100',
    };

    return (
        <motion.button
            type={type}
            disabled={disabled}
            whileHover={!disabled ? { scale: 1.02 } : {}}
            whileTap={!disabled ? { scale: 0.98 } : {}}
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </motion.button>
    );
};

export default Button;
