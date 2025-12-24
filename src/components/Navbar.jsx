import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../store/authStore';
import useThemeStore from '../store/themeStore';
import useSettingsStore from '../store/settingsStore';
import GradientAvatar from './GradientAvatar';
import LiquidOrbThemeToggle from './Nav/LiquidOrbThemeToggle';
import '../styles/nav-liquid-glass.css';


const premiumTransition = {
    type: 'spring',
    stiffness: 400,
    damping: 30,
};


const getNavbarThemeStyles = (theme) => {
    const styles = {
        light: {
            navbar: {
                background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
                backdropFilter: 'blur(24px) saturate(180%)',
                WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                borderBottom: '1px solid rgba(168, 85, 247, 0.08)',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04), 0 8px 16px rgba(0,0,0,0.05)',
            },
            navPill: {
                background: 'rgba(255,255,255,0.5)',
                border: '1px solid rgba(168, 85, 247, 0.05)',
            },
            activeIndicator: {
                background: 'linear-gradient(90deg, transparent, #a855f7, transparent)',
                boxShadow: '0 2px 8px rgba(168, 85, 247, 0.4)',
            },
            text: { color: '#374151' },
            activeText: { color: '#7c3aed' },
        },
        dark: {
            navbar: {
                background: 'linear-gradient(180deg, rgba(15,15,15,0.98) 0%, rgba(10,10,10,0.95) 100%)',
                backdropFilter: 'blur(24px) saturate(150%)',
                WebkitBackdropFilter: 'blur(24px) saturate(150%)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                boxShadow: '0 4px 24px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255,255,255,0.03)',
            },
            navPill: {
                background: 'rgba(30, 30, 30, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
            },
            activeIndicator: {
                background: 'linear-gradient(90deg, transparent, #a855f7, transparent)',
                boxShadow: '0 0 12px rgba(168, 85, 247, 0.6), 0 2px 8px rgba(168, 85, 247, 0.4)',
            },
            text: { color: '#9ca3af' },
            activeText: { color: '#c4b5fd' },
        },
        glass: {
            navbar: {
                background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%)',
                backdropFilter: 'blur(32px) saturate(200%)',
                WebkitBackdropFilter: 'blur(32px) saturate(200%)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3), 0 8px 32px rgba(0,0,0,0.1)',
            },
            navPill: {
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
            },
            activeIndicator: {
                background: 'linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.8), transparent)',
                boxShadow: '0 0 16px rgba(168, 85, 247, 0.4), 0 0 0 1px rgba(255,255,255,0.1)',
            },
            text: { color: '#374151' },
            activeText: { color: '#7c3aed' },
        },
        neo: {
            navbar: {
                background: '#e8ecef',
                backdropFilter: 'none',
                WebkitBackdropFilter: 'none',
                borderBottom: 'none',
                boxShadow: `
                    0 4px 8px rgba(166, 180, 200, 0.2),
                    inset 0 1px 0 rgba(255, 255, 255, 0.5),
                    inset 0 -1px 0 rgba(166, 180, 200, 0.1)
                `,
            },
            navPill: {
                background: '#e8ecef',
                border: 'none',
                boxShadow: 'inset 2px 2px 4px rgba(166, 180, 200, 0.2), inset -2px -2px 4px rgba(255, 255, 255, 0.5)',
            },
            activeIndicator: {
                background: 'linear-gradient(90deg, transparent, #a855f7, transparent)',
                boxShadow: '0 2px 6px rgba(168, 85, 247, 0.3)',
                transform: 'translateY(-1px)',
            },
            text: { color: '#374151' },
            activeText: { color: '#7c3aed' },
        },
    };
    return styles[theme] || styles.light;
};

const Navbar = () => {
    const { user, logout } = useAuthStore();
    const { theme, currentTheme, currentAccent, cycleTheme, setAccent, getAccentColors } = useThemeStore();
    const avatarGradient = useSettingsStore((s) => s.avatarGradient);
    const navigate = useNavigate();
    const location = useLocation();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const userMenuRef = useRef(null);

    
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
        };

        if (showUserMenu) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('touchstart', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [showUserMenu]);

    const themeStyles = getNavbarThemeStyles(currentTheme);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isSuperAdmin = user?.role === 'super_admin';

    const navLinks = [
        { path: '/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/history', label: 'History', icon: '📜' },
        { path: '/analytics', label: 'Analytics', icon: '📈' },
        { path: '/settings', label: 'Settings', icon: '⚙️' },
        { path: '/profile', label: 'Profile', icon: '👤' },
    ];

    const adminLinks = [
        { path: '/admin/control-center', label: 'Control', icon: '🎛️' },
        { path: '/admin/pending-users', label: 'Approvals', icon: '⏳' },
        { path: '/admin/users', label: 'Users', icon: '👥' },
    ];

    const canCreateAlert = user && ['super_admin', 'college_admin', 'faculty'].includes(user.role);

    const isActive = (path) => location.pathname === path;

    const themeIcons = {
        light: '☀️',
        dark: '🌙',
        glass: '🌊',
        neo: '💎',
    };

    const accentColors = getAccentColors();

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    
    const NavItem = ({ to, icon, label, isAdminLink = false }) => {
        const active = isActive(to);
        return (
            <Link to={to} className="relative">
                <motion.div
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={premiumTransition}
                    className="px-4 py-2 rounded-xl flex flex-col items-center justify-center relative min-w-[56px]"
                    style={{
                        ...themeStyles.text,
                        ...(active ? themeStyles.activeText : {}),
                        background: active
                            ? isAdminLink
                                ? currentTheme === 'dark' ? 'rgba(251, 191, 36, 0.15)' : 'rgba(251, 191, 36, 0.12)'
                                : currentTheme === 'dark' ? 'rgba(168, 85, 247, 0.12)' : 'rgba(168, 85, 247, 0.08)'
                            : 'transparent',
                        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                    title={label}
                >
                    {}
                    <motion.span
                        className="text-lg"
                        animate={active && currentTheme === 'dark' ? {
                            filter: isAdminLink ? 'drop-shadow(0 0 4px rgba(251, 191, 36, 0.5))' : 'drop-shadow(0 0 4px rgba(168, 85, 247, 0.5))'
                        } : {
                            filter: 'none'
                        }}
                    >
                        {icon}
                    </motion.span>

                    {}
                    <span
                        className="text-[9px] font-medium mt-0.5 tracking-wide uppercase"
                        style={{
                            color: active
                                ? isAdminLink
                                    ? currentTheme === 'dark' ? '#fcd34d' : '#d97706'
                                    : currentTheme === 'dark' ? '#c4b5fd' : '#7c3aed'
                                : currentTheme === 'dark' ? '#6b7280' : '#9ca3af',
                        }}
                    >
                        {label}
                    </span>

                    {}
                    {active && (
                        <motion.div
                            layoutId="nav-underline"
                            className="absolute -bottom-0.5 left-1/2 w-6 h-0.5 rounded-full"
                            style={{
                                x: '-50%',
                                background: isAdminLink
                                    ? 'linear-gradient(90deg, transparent, #f59e0b, transparent)'
                                    : themeStyles.activeIndicator.background,
                                boxShadow: isAdminLink
                                    ? currentTheme === 'dark' ? '0 0 12px rgba(245, 158, 11, 0.6)' : '0 2px 8px rgba(245, 158, 11, 0.4)'
                                    : themeStyles.activeIndicator.boxShadow,
                                ...(currentTheme === 'neo' ? { transform: 'translateY(-1px)' } : {}),
                            }}
                            transition={premiumTransition}
                        />
                    )}
                </motion.div>
            </Link>
        );
    };

    return (
        <div className="sticky top-0 z-50 px-4 py-2">
            <motion.nav
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="nav-liquid-glass relative"
            >
                {}
                <div className="nav-liquid-glass-noise" />

                {}
                <div className="nav-underglow" />

                <div className="relative z-10 w-full px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">

                        {}
                        <Link to="/dashboard" className="flex items-center gap-3 flex-shrink-0">
                            <div className="flex flex-col items-center">
                                <motion.span
                                    whileHover={{ rotate: 15, scale: 1.1 }}
                                    transition={premiumTransition}
                                    className="text-2xl"
                                >
                                    📡
                                </motion.span>
                                <span
                                    className="text-[9px] font-medium tracking-wider uppercase mt-0.5"
                                    style={{ color: currentTheme === 'dark' ? '#9ca3af' : '#6b7280' }}
                                >
                                    Campus
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                                    PulseLink
                                </span>
                                <span
                                    className="text-[10px] font-medium tracking-wide -mt-0.5"
                                    style={{ color: currentTheme === 'dark' ? '#6b7280' : '#9ca3af' }}
                                >
                                    Real-time Alert System
                                </span>
                            </div>
                        </Link>

                        {}
                        <div className="flex-1 flex items-center justify-center">
                            <div className="flex items-center gap-0.5 px-2 py-1 rounded-2xl"
                                style={{
                                    ...themeStyles.navPill,
                                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                                }}
                            >
                                {navLinks.map((link) => (
                                    <NavItem key={link.path} to={link.path} icon={link.icon} label={link.label} />
                                ))}

                                {}
                                {isSuperAdmin && (
                                    <>
                                        <div className="w-px h-5 mx-1" style={{ background: currentTheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />
                                        {adminLinks.map((link) => (
                                            <NavItem key={link.path} to={link.path} icon={link.icon} label={link.label} isAdminLink />
                                        ))}
                                    </>
                                )}

                                {}
                                {canCreateAlert && (
                                    <>
                                        <div className="w-px h-5 mx-1" style={{ background: currentTheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />
                                        <Link to="/create-alert">
                                            <motion.div
                                                whileHover={{ y: -2, scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                transition={premiumTransition}
                                                className={`
                                                px-3 py-2 rounded-xl text-sm font-semibold
                                                flex items-center gap-1.5
                                                ${isActive('/create-alert')
                                                        ? 'bg-purple-600 text-white shadow-lg'
                                                        : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                                                    }
                                            `}
                                                style={{
                                                    boxShadow: isActive('/create-alert')
                                                        ? '0 4px 12px rgba(168, 85, 247, 0.3)'
                                                        : 'none',
                                                }}
                                            >
                                                <span className="text-base">✨</span>
                                                <span className="hidden xl:inline">Create</span>
                                            </motion.div>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>

                        {}
                        <div className="flex items-center gap-3 flex-shrink-0">
                            {}
                            <LiquidOrbThemeToggle />

                            {}
                            {user && (
                                <div ref={userMenuRef} className="relative" style={{ zIndex: 100 }}>
                                    <button
                                        type="button"
                                        onClick={() => setShowUserMenu(!showUserMenu)}
                                        className="block rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                                        style={{
                                            cursor: 'pointer',
                                            position: 'relative',
                                            zIndex: 101,
                                        }}
                                        aria-label="User menu"
                                        aria-expanded={showUserMenu}
                                    >
                                        <GradientAvatar
                                            gradient={avatarGradient || 'aurora'}
                                            role={user.role || 'student'}
                                            size="md"
                                            name={user.full_name}
                                            showShadow={true}
                                            animate={true}
                                        />
                                    </button>

                                    {}
                                    <AnimatePresence>
                                        {showUserMenu && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95, y: 8 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95, y: 8 }}
                                                transition={premiumTransition}
                                                className="absolute right-0 top-full mt-2 w-52 rounded-2xl overflow-hidden z-50"
                                                style={{
                                                    background: currentTheme === 'dark' ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255,255,255,0.95)',
                                                    backdropFilter: 'blur(20px)',
                                                    border: currentTheme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(168, 85, 247, 0.1)',
                                                    boxShadow: currentTheme === 'dark' ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.12)',
                                                }}
                                            >
                                                {}
                                                <div className="px-4 py-3 flex items-center gap-3" style={{ borderBottom: currentTheme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)' }}>
                                                    <GradientAvatar
                                                        gradient={avatarGradient || 'aurora'}
                                                        role={user.role || 'student'}
                                                        size="sm"
                                                        animate={false}
                                                        showShadow={false}
                                                    />
                                                    <div>
                                                        <p className="text-sm font-semibold" style={{ color: currentTheme === 'dark' ? '#f1f5f9' : '#111827' }}>{user.full_name}</p>
                                                        <p className="text-xs capitalize" style={{ color: currentTheme === 'dark' ? '#9ca3af' : '#6b7280' }}>{user.role?.replace('_', ' ')}</p>
                                                    </div>
                                                </div>

                                                {}
                                                <motion.button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setShowUserMenu(false);
                                                        handleLogout();
                                                    }}
                                                    whileHover={{ backgroundColor: 'rgba(239, 68, 68, 0.08)' }}
                                                    className="w-full px-4 py-3 text-left text-sm font-medium text-red-600 flex items-center gap-2 transition-colors"
                                                >
                                                    <span>🚪</span>
                                                    <span>Logout</span>
                                                </motion.button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.nav>
        </div>
    );
};

export default Navbar;
