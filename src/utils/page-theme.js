


export const getPageBackground = (theme) => {
    const backgrounds = {
        light: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 40%, #f1f5f9 100%)',
        dark: 'linear-gradient(180deg, #0f172a 0%, #020617 40%, #000000 100%)',
        glass: 'linear-gradient(180deg, #ffffff 0%, #faf5ff 30%, #f5f3ff 70%, #f8fafc 100%)',
        neo: 'linear-gradient(145deg, #E8ECEF 0%, #DDE2E6 50%, #E4E8EB 100%)',
    };
    return backgrounds[theme] || backgrounds.light;
};


export const getCardStyle = (theme) => {
    const styles = {
        light: {
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(16px) saturate(180%)',
            border: '1px solid rgba(241, 245, 249, 0.7)',
            boxShadow: '0 18px 60px rgba(15, 23, 42, 0.06)',
        },
        dark: {
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(20px) saturate(150%)',
            border: '1px solid rgba(51, 65, 85, 0.7)',
            boxShadow: '0 18px 60px rgba(0, 0, 0, 0.4)',
        },
        glass: {
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(24px) saturate(200%)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 18px 60px rgba(0, 0, 0, 0.08)',
        },
        neo: {
            background: '#E4E8EB',
            backdropFilter: 'none',
            border: 'none',
            boxShadow: '8px 15px 24px rgba(166, 180, 200, 0.28), -6px -6px 16px rgba(255, 255, 255, 0.85), inset 1px 1px 2px rgba(255, 255, 255, 0.3)',
        },
    };
    return styles[theme] || styles.light;
};


export const getTextColors = (theme) => {
    const colors = {
        light: {
            primary: '#111827',
            secondary: '#4B5563',
            muted: '#9CA3AF',
            accent: '#7C3AED',
        },
        dark: {
            primary: '#F1F5F9',
            secondary: '#94A3B8',
            muted: '#64748B',
            accent: '#A78BFA',
        },
        glass: {
            primary: '#111827',
            secondary: '#374151',
            muted: '#6B7280',
            accent: '#8B5CF6',
        },
        neo: {
            primary: '#1A1D21',
            secondary: '#4A5568',
            muted: '#718096',
            accent: '#7C3AED',
        },
    };
    return colors[theme] || colors.light;
};


export const getStatCardStyle = (theme) => {
    const base = getCardStyle(theme);
    const text = getTextColors(theme);

    return {
        container: base,
        labelColor: text.secondary,
        valueColor: text.primary,
        subtextColor: text.muted,
    };
};


export const getTableStyle = (theme) => {
    const text = getTextColors(theme);

    const styles = {
        light: {
            headerBg: 'rgba(248, 250, 252, 0.8)',
            headerBorder: 'rgba(241, 245, 249, 0.8)',
            rowHover: 'rgba(168, 85, 247, 0.04)',
            rowBorder: 'rgba(241, 245, 249, 0.6)',
            zebraEven: 'rgba(248, 250, 252, 0.3)',
        },
        dark: {
            headerBg: 'rgba(30, 41, 59, 0.8)',
            headerBorder: 'rgba(51, 65, 85, 0.6)',
            rowHover: 'rgba(168, 85, 247, 0.08)',
            rowBorder: 'rgba(51, 65, 85, 0.3)',
            zebraEven: 'rgba(30, 41, 59, 0.3)',
        },
        glass: {
            headerBg: 'rgba(255, 255, 255, 0.1)',
            headerBorder: 'rgba(255, 255, 255, 0.15)',
            rowHover: 'rgba(168, 85, 247, 0.06)',
            rowBorder: 'rgba(255, 255, 255, 0.08)',
            zebraEven: 'rgba(255, 255, 255, 0.05)',
        },
        neo: {
            headerBg: '#DDE2E6',
            headerBorder: 'rgba(166, 180, 200, 0.2)',
            headerShadow: '0 4px 8px rgba(166, 180, 200, 0.15)',
            rowHover: 'rgba(168, 85, 247, 0.05)',
            rowBorder: 'rgba(166, 180, 200, 0.15)',
            zebraEven: 'rgba(166, 180, 200, 0.08)',
        },
    };

    return {
        ...styles[theme] || styles.light,
        text,
    };
};


export const getRoleBadgeStyle = (role, theme) => {
    const roles = {
        super_admin: {
            label: 'Super Admin',
            icon: '👑',
            lightBg: 'bg-red-500',
            darkBg: 'rgba(239, 68, 68, 0.2)',
            darkText: '#FCA5A5',
        },
        college_admin: {
            label: 'College Admin',
            icon: '⚡',
            lightBg: 'bg-amber-500',
            darkBg: 'rgba(245, 158, 11, 0.2)',
            darkText: '#FCD34D',
        },
        faculty: {
            label: 'Faculty',
            icon: '🎓',
            lightBg: 'bg-blue-500',
            darkBg: 'rgba(59, 130, 246, 0.2)',
            darkText: '#93C5FD',
        },
        student: {
            label: 'Student',
            icon: '📚',
            lightBg: 'bg-purple-500',
            darkBg: 'rgba(168, 85, 247, 0.2)',
            darkText: '#C4B5FD',
        },
    };

    const roleConfig = roles[role] || roles.student;
    const isDark = theme === 'dark';

    return {
        ...roleConfig,
        style: isDark ? {
            background: roleConfig.darkBg,
            color: roleConfig.darkText,
        } : undefined,
        className: isDark ? '' : `${roleConfig.lightBg} text-white`,
    };
};


export const getStatusStyle = (isActive, theme) => {
    const isDark = theme === 'dark';

    if (isActive) {
        return isDark ? {
            background: 'rgba(34, 197, 94, 0.15)',
            color: '#86EFAC',
            border: '1px solid rgba(34, 197, 94, 0.3)',
        } : {
            className: 'bg-green-100 text-green-700',
        };
    } else {
        return isDark ? {
            background: 'rgba(239, 68, 68, 0.15)',
            color: '#FCA5A5',
            border: '1px solid rgba(239, 68, 68, 0.3)',
        } : {
            className: 'bg-red-100 text-red-700',
        };
    }
};


export const getInputStyle = (theme) => {
    const styles = {
        light: {
            background: 'rgba(255, 255, 255, 0.8)',
            border: '1px solid #E5E7EB',
            borderFocus: '1px solid #A855F7',
            color: '#111827',
            placeholder: '#9CA3AF',
        },
        dark: {
            background: 'rgba(30, 41, 59, 0.8)',
            border: '1px solid rgba(51, 65, 85, 0.8)',
            borderFocus: '1px solid rgba(168, 85, 247, 0.6)',
            color: '#F1F5F9',
            placeholder: '#64748B',
        },
        glass: {
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderFocus: '1px solid rgba(168, 85, 247, 0.4)',
            color: '#111827',
            placeholder: '#6B7280',
        },
        neo: {
            background: '#E4E8EB',
            border: 'none',
            boxShadow: 'inset 3px 3px 6px rgba(166, 180, 200, 0.25), inset -3px -3px 6px rgba(255, 255, 255, 0.7)',
            color: '#1A1D21',
            placeholder: '#718096',
        },
    };
    return styles[theme] || styles.light;
};


export const getPrimaryButtonStyle = (theme) => {
    return {
        background: 'linear-gradient(135deg, #A855F7 0%, #8B5CF6 100%)',
        color: '#FFFFFF',
        boxShadow: theme === 'dark'
            ? '0 4px 16px rgba(168, 85, 247, 0.4)'
            : '0 4px 12px rgba(168, 85, 247, 0.25)',
    };
};

export const getSecondaryButtonStyle = (theme) => {
    const styles = {
        light: {
            background: '#F3F4F6',
            color: '#4B5563',
            hover: '#E5E7EB',
        },
        dark: {
            background: 'rgba(51, 65, 85, 0.8)',
            color: '#E2E8F0',
            hover: 'rgba(71, 85, 105, 0.8)',
        },
        glass: {
            background: 'rgba(255, 255, 255, 0.1)',
            color: '#374151',
            hover: 'rgba(255, 255, 255, 0.2)',
        },
        neo: {
            background: '#E4E8EB',
            color: '#4A5568',
            boxShadow: '4px 4px 8px rgba(166, 180, 200, 0.25), -4px -4px 8px rgba(255, 255, 255, 0.7)',
        },
    };
    return styles[theme] || styles.light;
};

export const getDangerButtonStyle = (theme) => {
    return theme === 'dark' ? {
        background: 'rgba(239, 68, 68, 0.2)',
        color: '#FCA5A5',
        border: '1px solid rgba(239, 68, 68, 0.3)',
    } : {
        background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
        color: '#FFFFFF',
    };
};


export const getEmptyStateStyle = (theme) => {
    const base = getCardStyle(theme);
    const text = getTextColors(theme);

    return {
        container: base,
        iconBg: theme === 'dark'
            ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(139, 92, 246, 0.15) 100%)'
            : 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%)',
        title: text.primary,
        subtitle: text.muted,
    };
};


export const getModalStyle = (theme) => {
    const text = getTextColors(theme);

    const styles = {
        light: {
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: 'none',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        },
        dark: {
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(51, 65, 85, 0.6)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
        },
        glass: {
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(30px) saturate(200%)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 25px 50px rgba(0, 0, 0, 0.15)',
        },
        neo: {
            background: '#E4E8EB',
            backdropFilter: 'blur(8px)',
            border: 'none',
            boxShadow: '12px 22px 36px rgba(166, 180, 200, 0.35), -10px -10px 26px rgba(255, 255, 255, 0.95)',
        },
    };

    return {
        ...styles[theme] || styles.light,
        text,
    };
};


export const getProgressBarStyle = (theme, color = 'purple') => {
    const trackColors = {
        light: 'rgba(241, 245, 249, 0.8)',
        dark: 'rgba(51, 65, 85, 0.5)',
        glass: 'rgba(255, 255, 255, 0.1)',
        neo: 'rgba(166, 180, 200, 0.2)',
    };

    return {
        track: trackColors[theme] || trackColors.light,
        fill: `linear-gradient(90deg, var(--color-${color}-500) 0%, var(--color-${color}-400) 100%)`,
    };
};

export default {
    getPageBackground,
    getCardStyle,
    getTextColors,
    getStatCardStyle,
    getTableStyle,
    getRoleBadgeStyle,
    getStatusStyle,
    getInputStyle,
    getPrimaryButtonStyle,
    getSecondaryButtonStyle,
    getDangerButtonStyle,
    getEmptyStateStyle,
    getModalStyle,
    getProgressBarStyle,
};
