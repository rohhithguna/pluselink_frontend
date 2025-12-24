
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../services/api';

const themes = [
    { id: 'default', name: 'Default', color: '#a855f7', bg: '#ffffff' },
    { id: 'waterGlass', name: 'Water Glass', color: '#0ea5e9', bg: '#f0f9ff' },
    { id: 'luxury', name: 'Luxury', color: '#d4af37', bg: '#0f0f23' },
    { id: 'space', name: 'Space', color: '#818cf8', bg: '#0f0c29' },
    { id: 'natureCalm', name: 'Nature', color: '#059669', bg: '#ecfdf5' },
    { id: 'darkStealth', name: 'Dark', color: '#ef4444', bg: '#0a0a0a' },
];

const OnboardingModal = ({ isOpen, onComplete, userName }) => {
    const [selectedTheme, setSelectedTheme] = useState('default');
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);

    const handleComplete = async () => {
        setLoading(true);
        try {
            await api.post('/users/me/complete-onboarding', {
                theme: selectedTheme,
                sound_enabled: soundEnabled,
            });
            toast.success('Welcome to PulseLink! 🎉');
            onComplete();
        } catch (error) {
            console.error('Error completing onboarding:', error);
            toast.error('Failed to save preferences');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: 'spring', damping: 25 }}
                className="w-full max-w-lg rounded-3xl overflow-hidden"
                style={{
                    background: 'rgba(255, 255, 255, 0.98)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 100px rgba(168, 85, 247, 0.2)',
                }}
            >
                {}
                <div
                    className="p-8 text-center"
                    style={{
                        background: 'linear-gradient(135deg, #a855f7 0%, #8b5cf6 100%)',
                    }}
                >
                    <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-6xl mb-4"
                    >
                        ✨
                    </motion.div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                        Welcome, {userName || 'there'}!
                    </h2>
                    <p className="text-white/80">
                        Let's personalize your experience
                    </p>
                </div>

                {}
                <div className="p-6">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                    Choose your theme
                                </h3>
                                <div className="grid grid-cols-3 gap-3">
                                    {themes.map(theme => (
                                        <motion.button
                                            key={theme.id}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setSelectedTheme(theme.id)}
                                            className={`p-4 rounded-xl transition-all ${selectedTheme === theme.id
                                                ? 'ring-2 ring-purple-500 ring-offset-2'
                                                : ''
                                                }`}
                                            style={{
                                                background: theme.bg,
                                                border: '1px solid rgba(0,0,0,0.1)',
                                            }}
                                        >
                                            <div
                                                className="w-8 h-8 rounded-full mx-auto mb-2"
                                                style={{ background: theme.color }}
                                            />
                                            <p
                                                className="text-xs font-medium"
                                                style={{ color: theme.color }}
                                            >
                                                {theme.name}
                                            </p>
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                    Notification sounds
                                </h3>
                                <div className="space-y-3">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        onClick={() => setSoundEnabled(true)}
                                        className={`w-full p-4 rounded-xl flex items-center gap-4 transition-all ${soundEnabled
                                            ? 'bg-purple-100 ring-2 ring-purple-500'
                                            : 'bg-gray-50 hover:bg-gray-100'
                                            }`}
                                    >
                                        <span className="text-3xl">🔔</span>
                                        <div className="text-left">
                                            <p className="font-medium text-gray-800">Sounds On</p>
                                            <p className="text-sm text-gray-500">
                                                Hear alert sounds for notifications
                                            </p>
                                        </div>
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        onClick={() => setSoundEnabled(false)}
                                        className={`w-full p-4 rounded-xl flex items-center gap-4 transition-all ${!soundEnabled
                                            ? 'bg-purple-100 ring-2 ring-purple-500'
                                            : 'bg-gray-50 hover:bg-gray-100'
                                            }`}
                                    >
                                        <span className="text-3xl">🔕</span>
                                        <div className="text-left">
                                            <p className="font-medium text-gray-800">Sounds Off</p>
                                            <p className="text-sm text-gray-500">
                                                Silent mode - visual notifications only
                                            </p>
                                        </div>
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {}
                    <div className="flex justify-center gap-2 mt-6">
                        <div className={`w-2 h-2 rounded-full ${step === 1 ? 'bg-purple-500' : 'bg-gray-200'}`} />
                        <div className={`w-2 h-2 rounded-full ${step === 2 ? 'bg-purple-500' : 'bg-gray-200'}`} />
                    </div>

                    {}
                    <div className="flex gap-3 mt-6">
                        {step > 1 && (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setStep(step - 1)}
                                className="flex-1 py-3 rounded-xl font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200"
                            >
                                Back
                            </motion.button>
                        )}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                                if (step < 2) {
                                    setStep(step + 1);
                                } else {
                                    handleComplete();
                                }
                            }}
                            disabled={loading}
                            className="flex-1 py-3 rounded-xl font-semibold text-white disabled:opacity-50"
                            style={{
                                background: 'linear-gradient(135deg, #a855f7 0%, #8b5cf6 100%)',
                            }}
                        >
                            {loading ? '...' : step < 2 ? 'Next' : 'Get Started 🚀'}
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default OnboardingModal;
