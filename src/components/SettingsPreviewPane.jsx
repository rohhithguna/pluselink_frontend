
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useSettingsStore from '../store/settingsStore';

const SettingsPreviewPane = ({ pendingSettings = {}, onApply, onReset }) => {
    const currentSettings = useSettingsStore();

    
    const previewSettings = { ...currentSettings, ...pendingSettings };
    const hasPendingChanges = Object.keys(pendingSettings).length > 0;

    
    const getPreviewTheme = () => {
        const themeName = pendingSettings.theme || currentSettings.theme;
        const themes = currentSettings.getAllThemes();
        return themes[themeName] || themes.default;
    };

    const theme = getPreviewTheme();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="sticky top-24"
        >
            <div
                className="rounded-3xl overflow-hidden"
                style={{
                    background: 'rgba(255, 255, 255, 0.6)',
                    backdropFilter: 'blur(20px) saturate(180%)',
                    border: '1px solid rgba(168, 85, 247, 0.1)',
                    boxShadow: '0 8px 32px rgba(168, 85, 247, 0.06)',
                }}
            >
                {}
                <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                            <span className="text-lg">👁️</span>
                            Live Preview
                        </h3>
                        {hasPendingChanges && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-600"
                            >
                                Unsaved
                            </motion.span>
                        )}
                    </div>
                </div>

                {}
                <div className="p-4 space-y-4">
                    {}
                    <div
                        className="rounded-2xl p-4 relative overflow-hidden"
                        style={{
                            background: theme.preview || 'linear-gradient(135deg, #f5f5f5 0%, #e5e5e5 100%)',
                            minHeight: '140px',
                        }}
                    >
                        {}
                        <motion.div
                            className="rounded-xl p-3 mb-3"
                            style={{
                                background: theme.glass || 'rgba(255, 255, 255, 0.8)',
                                backdropFilter: previewSettings.spatialModeEnabled ? 'blur(20px)' : 'blur(8px)',
                            }}
                            animate={previewSettings.cursorGravity ? { y: [0, -2, 0] } : {}}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-500 text-white">
                                    🚨 Emergency
                                </span>
                            </div>
                            <p className="text-sm font-medium" style={{ color: theme.text || '#1a1a1a' }}>
                                Sample Alert Title
                            </p>
                        </motion.div>

                        {}
                        <motion.button
                            className="px-4 py-2 rounded-xl text-sm font-medium text-white"
                            style={{
                                background: `linear-gradient(135deg, ${theme.accent || '#a855f7'} 0%, ${theme.accent || '#8b5cf6'} 100%)`,
                                boxShadow: `0 4px 12px ${theme.accent || '#a855f7'}33`,
                            }}
                            whileHover={previewSettings.cursorGravity ? { scale: 1.02 } : {}}
                            whileTap={previewSettings.hapticFeedback ? { scale: 0.98 } : {}}
                        >
                            Sample Button
                        </motion.button>

                        {}
                        <AnimatePresence>
                            {previewSettings.emergencyVisualMode === 'cinematic' && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: [0, 0.1, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="absolute inset-0 bg-red-500 pointer-events-none rounded-2xl"
                                />
                            )}
                        </AnimatePresence>
                    </div>

                    {}
                    <div className="text-xs text-gray-500 space-y-1">
                        <p>🎨 Theme: <span className="font-medium text-gray-700">{theme.name}</span></p>
                        <p>✨ Motion: <span className="font-medium text-gray-700">{previewSettings.physicsStrength}</span></p>
                        <p>🔊 Sound: <span className="font-medium text-gray-700">{previewSettings.interfaceSounds ? 'On' : 'Off'}</span></p>
                        <p>🚨 Emergency: <span className="font-medium text-gray-700">{previewSettings.emergencyVisualMode}</span></p>
                        {previewSettings.spatialModeEnabled && (
                            <p>🌌 Spatial: <span className="font-medium text-purple-600">Enabled</span></p>
                        )}
                    </div>
                </div>

                {}
                {hasPendingChanges && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="p-4 border-t border-gray-100 flex gap-2"
                    >
                        <motion.button
                            onClick={onApply}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
                            style={{
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                            }}
                        >
                            ✓ Save Settings
                        </motion.button>
                        <motion.button
                            onClick={onReset}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200"
                        >
                            Reset
                        </motion.button>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export default SettingsPreviewPane;
