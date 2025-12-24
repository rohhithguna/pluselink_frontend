import React from 'react';
import useThemeStore from '../store/themeStore';

const Input = ({
    label,
    error,
    className = '',
    ...props
}) => {
    const { theme } = useThemeStore();

    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium mb-2" style={{ color: '#111827' }}>
                    {label}
                    {props.required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <input
                className={`
                    w-full px-4 py-2.5 rounded-xl
                    bg-white border border-gray-200
                    transition-premium
                    focus:outline-none focus:ring-2 focus:ring-primary/20
                    ${error ? 'border-red-500 focus:ring-red-500/20' : ''}
                    ${className}
                `}
                style={{ color: '#111827' }}
                {...props}
            />
            {error && (
                <p className="mt-1.5 text-sm text-red-500">{error}</p>
            )}
        </div>
    );
};

export default Input;
