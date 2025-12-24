import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import useAuthStore from './store/authStore';
import useThemeStore from './store/themeStore';
import useSettingsStore from './store/settingsStore';
import wsService from './services/websocket';
import ProtectedRoute from './components/ProtectedRoute';
import AmbientMotion from './components/AmbientMotion';
import LiquidThemeSelector from './components/LiquidThemeSelector';
import OnboardingModal from './components/OnboardingModal';
import { SpatialModeProvider } from './components/SpatialModeProvider';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CreateAlert from './pages/CreateAlert';
import AlertHistory from './pages/AlertHistory';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import UserManagement from './pages/UserManagement';
import PendingUsers from './pages/PendingUsers';
import ControlCenter from './pages/ControlCenter';
import { Toaster } from 'react-hot-toast';
import './styles/animations.css';
import './styles/emergency-mode.css';
import './styles/theme-transitions.css';
import './styles/avatar-gradients.css';
import './styles/liquid-glass.css';


const isColorDark = (hexColor) => {
    if (!hexColor) return false;
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance < 0.5;
};

function App() {
    const { isAuthenticated, user } = useAuthStore();
    const { accentColor, currentTheme } = useThemeStore();
    const settingsTheme = useSettingsStore((s) => s.theme);
    const settingsThemePreview = useSettingsStore((s) => s.themePreview);
    const themes = useSettingsStore((s) => s.themes);
    const customThemes = useSettingsStore((s) => s.customThemes);

    
    const [showOnboarding, setShowOnboarding] = useState(false);

    
    useEffect(() => {
        if (accentColor) {
            document.documentElement.style.setProperty('--color-primary', accentColor.primary);
            document.documentElement.style.setProperty('--color-primary-light', accentColor.light);
            document.documentElement.style.setProperty('--color-primary-dark', accentColor.dark);
        }
    }, [accentColor]);

    
    useEffect(() => {
        document.body.className = document.body.className
            .replace(/theme-\w+/g, '')
            .trim();
        document.body.classList.add(`theme-${currentTheme}`);
        
        document.documentElement.setAttribute('data-theme', currentTheme);
    }, [currentTheme]);

    
    useEffect(() => {
        const activeThemeName = settingsThemePreview || settingsTheme;
        const allThemes = { ...themes, ...customThemes };
        const themeConfig = allThemes[activeThemeName];

        if (themeConfig) {
            const root = document.documentElement;

            
            root.style.setProperty('--theme-accent', themeConfig.accent || '#a855f7');
            root.style.setProperty('--theme-background', themeConfig.background || '#ffffff');
            root.style.setProperty('--theme-text', themeConfig.text || '#1a1a1a');
            root.style.setProperty('--theme-glass', themeConfig.glass || 'rgba(255, 255, 255, 0.6)');

            
            root.style.setProperty('--color-primary', themeConfig.accent || '#a855f7');

            
            const isDark = isColorDark(themeConfig.background);
            document.body.classList.toggle('dark-theme', isDark);
            document.body.style.backgroundColor = themeConfig.background;
            document.body.style.color = themeConfig.text;
        }
    }, [settingsTheme, settingsThemePreview, themes, customThemes]);

    
    useEffect(() => {
        useSettingsStore.getState().initSettings(isAuthenticated);
    }, [isAuthenticated]);

    
    useEffect(() => {
        const verifySession = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                await useAuthStore.getState().verifyToken();
            }
        };
        verifySession();
    }, []);

    
    useEffect(() => {
        if (isAuthenticated) {
            wsService.connect();
        } else {
            wsService.disconnect();
        }

        return () => {
            wsService.disconnect();
        };
    }, [isAuthenticated]);

    
    useEffect(() => {
        if (isAuthenticated && user?.first_login) {
            setShowOnboarding(true);
        }
    }, [isAuthenticated, user]);

    const handleOnboardingComplete = () => {
        setShowOnboarding(false);
        
        const currentUser = useAuthStore.getState().user;
        if (currentUser) {
            useAuthStore.setState({
                user: { ...currentUser, first_login: false }
            });
            localStorage.setItem('user', JSON.stringify({ ...currentUser, first_login: false }));
        }
    };

    return (
        <Router>
            <SpatialModeProvider>
                <AmbientMotion />

                {}
                {isAuthenticated && <LiquidThemeSelector />}

                {}
                <OnboardingModal
                    isOpen={showOnboarding}
                    onComplete={handleOnboardingComplete}
                    userName={user?.full_name || user?.username}
                />

                <div style={{ position: 'relative', zIndex: 1, background: 'transparent' }}>
                    <AnimatePresence mode="wait">
                        <Routes>
                            <Route
                                path="/"
                                element={<Welcome />}
                            />

                            <Route
                                path="/login"
                                element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
                            />

                            <Route
                                path="/signup"
                                element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Signup />}
                            />

                            <Route
                                path="/dashboard"
                                element={
                                    <ProtectedRoute>
                                        <Dashboard />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/create-alert"
                                element={
                                    <ProtectedRoute roles={['super_admin', 'college_admin', 'faculty']}>
                                        <CreateAlert />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/history"
                                element={
                                    <ProtectedRoute>
                                        <AlertHistory />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/analytics"
                                element={
                                    <ProtectedRoute>
                                        <Analytics />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/profile"
                                element={
                                    <ProtectedRoute>
                                        <Profile />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/settings"
                                element={
                                    <ProtectedRoute>
                                        <Settings />
                                    </ProtectedRoute>
                                }
                            />

                            {}
                            <Route
                                path="/admin/users"
                                element={
                                    <ProtectedRoute roles={['super_admin']}>
                                        <UserManagement />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/admin/pending-users"
                                element={
                                    <ProtectedRoute roles={['super_admin']}>
                                        <PendingUsers />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/admin/control-center"
                                element={
                                    <ProtectedRoute roles={['super_admin']}>
                                        <ControlCenter />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="*"
                                element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} replace />}
                            />
                        </Routes>
                    </AnimatePresence>

                    {}
                    <Toaster
                        position="top-right"
                        containerStyle={{
                            top: 80,  
                            right: 20,
                        }}
                        gutter={12}  
                        toastOptions={{
                            duration: 2000,  
                            style: {
                                background: 'rgba(255, 255, 255, 0.95)',
                                color: '#1f2937',
                                border: '1px solid rgba(168, 85, 247, 0.2)',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                                padding: '12px 16px',
                                borderRadius: '12px',
                                fontSize: '14px',
                            },
                            success: {
                                iconTheme: {
                                    primary: '#a855f7',
                                    secondary: 'white',
                                },
                            },
                        }}
                    />
                </div>
            </SpatialModeProvider>
        </Router>
    );
}

export default App;
