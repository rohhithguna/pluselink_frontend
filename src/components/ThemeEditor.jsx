
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useSettingsStore, { CUSTOM_THEME_TEMPLATE } from '../store/settingsStore';


const ColorPicker = ({ label, value, onChange }) => {
    return (
        <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-medium text-gray-700">{label}</span>
            <div className="flex items-center gap-2">
                <input
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-10 h-10 rounded-xl cursor-pointer border-2 border-white shadow-md"
                    style={{ WebkitAppearance: 'none' }}
                />
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-24 px-3 py-2 rounded-xl text-xs font-mono bg-gray-50 border border-gray-200"
                />
            </div>
        </div>
    );
};


const SelectDropdown = ({ label, value, options, onChange }) => {
    return (
        <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-medium text-gray-700">{label}</span>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-sm cursor-pointer"
            >
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        </div>
    );
};


const LiquidSlider = ({ label, value, onChange, min = 0, max = 1, step = 0.1 }) => {
    return (
        <div className="space-y-2">
            <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">{label}</span>
                <span className="text-xs text-gray-500">{Math.round(value * 100)}%</span>
            </div>
            <div className="relative h-3 rounded-full overflow-hidden" style={{ background: 'rgba(168, 85, 247, 0.1)' }}>
                <motion.div
                    className="absolute left-0 top-0 h-full rounded-full"
                    style={{
                        width: `${value * 100}%`,
                        background: 'linear-gradient(90deg, #a855f7, #ec4899)',
                    }}
                    layoutId="slider-fill"
                />
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => onChange(parseFloat(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
            </div>
        </div>
    );
};


const ThemePreview = ({ themeData }) => {
    const previewGradient = themeData.preview ||
        `linear-gradient(135deg, ${themeData.primaryColor} 0%, ${themeData.accentGlow} 100%)`;

    return (
        <motion.div
            className="rounded-2xl overflow-hidden h-48 relative"
            style={{ background: previewGradient }}
            animate={{ scale: [1, 1.01, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
            {}
            <div className="absolute inset-3 rounded-xl overflow-hidden"
                style={{
                    background: 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(8px)',
                }}>
                {}
                <div className="h-8 px-3 flex items-center gap-2"
                    style={{ background: 'rgba(255,255,255,0.2)' }}>
                    <div className="w-2 h-2 rounded-full bg-red-400" />
                    <div className="w-2 h-2 rounded-full bg-yellow-400" />
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                </div>

                {}
                <div className="p-3 space-y-2">
                    <motion.div
                        className="h-4 rounded-full"
                        style={{
                            background: `linear-gradient(90deg, ${themeData.primaryColor}60, transparent)`,
                            width: '60%',
                        }}
                        animate={{ opacity: [0.5, 0.8, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                    <div className="flex gap-2">
                        <motion.div
                            className="flex-1 h-12 rounded-lg"
                            style={{
                                background: 'rgba(255,255,255,0.2)',
                                border: `1px solid ${themeData.primaryColor}40`,
                            }}
                            whileHover={{ scale: 1.02 }}
                        />
                        <motion.div
                            className="flex-1 h-12 rounded-lg"
                            style={{
                                background: 'rgba(255,255,255,0.15)',
                                border: `1px solid ${themeData.accentGlow}40`,
                            }}
                            whileHover={{ scale: 1.02 }}
                        />
                    </div>

                    {}
                    <motion.div
                        className="w-20 h-6 rounded-lg mt-2"
                        style={{
                            background: themeData.buttonStyle === 'glowPulse'
                                ? `linear-gradient(135deg, ${themeData.primaryColor}, ${themeData.accentGlow})`
                                : themeData.buttonStyle === 'neumorphic'
                                    ? 'rgba(255,255,255,0.3)'
                                    : 'rgba(255,255,255,0.25)',
                            boxShadow: themeData.buttonStyle === 'glowPulse'
                                ? `0 0 15px ${themeData.primaryColor}60`
                                : 'none',
                        }}
                        animate={themeData.buttonStyle === 'glowPulse' ? {
                            boxShadow: [
                                `0 0 10px ${themeData.primaryColor}40`,
                                `0 0 20px ${themeData.primaryColor}60`,
                                `0 0 10px ${themeData.primaryColor}40`,
                            ],
                        } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </div>
            </div>

            {}
            <motion.div
                className="absolute w-16 h-16 rounded-full"
                style={{
                    background: `radial-gradient(circle, ${themeData.accentGlow}40, transparent)`,
                    right: '10%',
                    bottom: '10%',
                }}
                animate={{
                    y: [0, -10, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
        </motion.div>
    );
};

const ThemeEditor = ({ onClose }) => {
    const {
        customThemes,
        createCustomTheme,
        updateCustomTheme,
        duplicateCustomTheme,
        deleteCustomTheme,
        exportTheme,
        importTheme,
        updateSetting,
        theme: activeTheme,
    } = useSettingsStore();

    const [selectedThemeId, setSelectedThemeId] = useState(null);
    const [editingTheme, setEditingTheme] = useState({ ...CUSTOM_THEME_TEMPLATE });
    const [isCreating, setIsCreating] = useState(false);
    const [themeName, setThemeName] = useState('My Theme');
    const [showImportModal, setShowImportModal] = useState(false);
    const [importJson, setImportJson] = useState('');
    const [saveIndicator, setSaveIndicator] = useState(false);

    
    const typographyOptions = [
        { value: 'sans', label: 'Sans (Clean)' },
        { value: 'rounded', label: 'Rounded (Friendly)' },
        { value: 'futuristic', label: 'Futuristic (Tech)' },
        { value: 'serifMinimal', label: 'Serif Minimal (Elegant)' },
    ];

    
    const textureOptions = [
        { value: 'clean', label: 'Clean' },
        { value: 'liquidGlass', label: 'Liquid Glass' },
        { value: 'blur', label: 'Blur' },
        { value: 'parallax', label: 'Parallax' },
        { value: 'particleField', label: 'Particle Field' },
    ];

    
    const buttonOptions = [
        { value: 'softGlass', label: 'Soft Glass' },
        { value: 'minimalFlat', label: 'Minimal Flat' },
        { value: 'neumorphic', label: 'Neumorphic' },
        { value: 'glowPulse', label: 'Glow Pulse' },
    ];

    
    const notificationOptions = [
        { value: 'slide', label: 'Slide' },
        { value: 'fade', label: 'Fade' },
        { value: 'bounce', label: 'Bounce' },
        { value: 'scale', label: 'Scale' },
    ];

    
    useEffect(() => {
        if (selectedThemeId && customThemes[selectedThemeId]) {
            setEditingTheme({ ...customThemes[selectedThemeId] });
            setThemeName(customThemes[selectedThemeId].name);
            setIsCreating(false);
        }
    }, [selectedThemeId, customThemes]);

    
    const updateProperty = (key, value) => {
        setEditingTheme(prev => ({
            ...prev,
            [key]: value,
            preview: key === 'primaryColor' || key === 'accentGlow'
                ? `linear-gradient(135deg, ${key === 'primaryColor' ? value : prev.primaryColor} 0%, ${key === 'accentGlow' ? value : prev.accentGlow} 100%)`
                : prev.preview,
        }));
    };

    
    const handleSave = () => {
        if (isCreating) {
            const id = createCustomTheme(themeName, editingTheme);
            setSelectedThemeId(id);
            setIsCreating(false);
        } else if (selectedThemeId) {
            updateCustomTheme(selectedThemeId, { ...editingTheme, name: themeName });
        }
        setSaveIndicator(true);
        setTimeout(() => setSaveIndicator(false), 1500);
    };

    
    const handleCreateNew = () => {
        setIsCreating(true);
        setSelectedThemeId(null);
        setEditingTheme({ ...CUSTOM_THEME_TEMPLATE });
        setThemeName('My Theme ' + (Object.keys(customThemes).length + 1));
    };

    
    const handleDuplicate = () => {
        if (selectedThemeId) {
            const newId = duplicateCustomTheme(selectedThemeId);
            if (newId) setSelectedThemeId(newId);
        }
    };

    
    const handleDelete = () => {
        if (selectedThemeId && window.confirm('Delete this theme?')) {
            deleteCustomTheme(selectedThemeId);
            setSelectedThemeId(null);
            setIsCreating(false);
            setEditingTheme({ ...CUSTOM_THEME_TEMPLATE });
        }
    };

    
    const handleExport = () => {
        if (selectedThemeId) {
            const json = exportTheme(selectedThemeId);
            if (json) {
                navigator.clipboard.writeText(json);
                setSaveIndicator(true);
                setTimeout(() => setSaveIndicator(false), 1500);
            }
        }
    };

    
    const handleImport = () => {
        const id = importTheme(importJson);
        if (id) {
            setSelectedThemeId(id);
            setShowImportModal(false);
            setImportJson('');
        }
    };

    
    const handleApply = () => {
        if (selectedThemeId) {
            updateSetting('theme', selectedThemeId);
        }
    };

    
    const handleReset = () => {
        setEditingTheme({ ...CUSTOM_THEME_TEMPLATE });
        setThemeName('My Theme');
    };

    const customThemeList = Object.entries(customThemes);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.5)' }}
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 10 }}
                className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl"
                style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {}
                <AnimatePresence>
                    {saveIndicator && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-4 py-2 rounded-full text-sm font-medium"
                            style={{
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                color: 'white',
                            }}
                        >
                            ✓ Saved
                        </motion.div>
                    )}
                </AnimatePresence>

                {}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                        🎨 Theme Editor
                    </h2>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onClose}
                        className="p-2 rounded-xl hover:bg-gray-100"
                    >
                        ✕
                    </motion.button>
                </div>

                <div className="flex h-[calc(90vh-120px)]">
                    {}
                    <div className="w-64 border-r border-gray-100 p-4 overflow-y-auto">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleCreateNew}
                            className="w-full p-3 rounded-xl text-sm font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 mb-4"
                        >
                            + Create New Theme
                        </motion.button>

                        {customThemeList.length === 0 ? (
                            <p className="text-sm text-gray-400 text-center py-4">
                                No custom themes yet
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {customThemeList.map(([id, theme]) => (
                                    <motion.button
                                        key={id}
                                        whileHover={{ scale: 1.02, x: 4 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setSelectedThemeId(id)}
                                        className={`
                                            w-full p-3 rounded-xl text-left text-sm
                                            ${selectedThemeId === id
                                                ? 'bg-purple-100 border-2 border-purple-300'
                                                : 'bg-gray-50 hover:bg-gray-100'
                                            }
                                        `}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-6 h-6 rounded-lg"
                                                style={{ background: theme.preview }}
                                            />
                                            <span className="font-medium truncate">{theme.name}</span>
                                        </div>
                                        {activeTheme === id && (
                                            <span className="text-xs text-purple-500 ml-8">Active</span>
                                        )}
                                    </motion.button>
                                ))}
                            </div>
                        )}

                        {}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setShowImportModal(true)}
                            className="w-full p-3 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 mt-4"
                        >
                            📥 Import Theme
                        </motion.button>
                    </div>

                    {}
                    <div className="flex-1 p-6 overflow-y-auto">
                        {(isCreating || selectedThemeId) ? (
                            <div className="space-y-6">
                                {}
                                <div>
                                    <label className="text-sm font-medium text-gray-700 block mb-2">
                                        Theme Name
                                    </label>
                                    <input
                                        type="text"
                                        value={themeName}
                                        onChange={(e) => setThemeName(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-300 focus:outline-none"
                                        placeholder="My Awesome Theme"
                                    />
                                </div>

                                {}
                                <div>
                                    <label className="text-sm font-medium text-gray-700 block mb-2">
                                        Live Preview
                                    </label>
                                    <ThemePreview themeData={editingTheme} />
                                </div>

                                {}
                                <div className="grid grid-cols-2 gap-6">
                                    <ColorPicker
                                        label="Primary Color"
                                        value={editingTheme.primaryColor}
                                        onChange={(v) => updateProperty('primaryColor', v)}
                                    />
                                    <ColorPicker
                                        label="Accent Glow"
                                        value={editingTheme.accentGlow}
                                        onChange={(v) => updateProperty('accentGlow', v)}
                                    />
                                </div>

                                {}
                                <div className="grid grid-cols-2 gap-6">
                                    <SelectDropdown
                                        label="Typography"
                                        value={editingTheme.typography}
                                        options={typographyOptions}
                                        onChange={(v) => updateProperty('typography', v)}
                                    />
                                    <SelectDropdown
                                        label="Background Texture"
                                        value={editingTheme.backgroundTexture}
                                        options={textureOptions}
                                        onChange={(v) => updateProperty('backgroundTexture', v)}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <SelectDropdown
                                        label="Button Style"
                                        value={editingTheme.buttonStyle}
                                        options={buttonOptions}
                                        onChange={(v) => updateProperty('buttonStyle', v)}
                                    />
                                    <SelectDropdown
                                        label="Notification Animation"
                                        value={editingTheme.notificationAnimation}
                                        options={notificationOptions}
                                        onChange={(v) => updateProperty('notificationAnimation', v)}
                                    />
                                </div>

                                {}
                                <LiquidSlider
                                    label="Motion Intensity"
                                    value={editingTheme.motionIntensity}
                                    onChange={(v) => updateProperty('motionIntensity', v)}
                                />

                                {}
                                <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleSave}
                                        className="px-6 py-3 rounded-xl font-medium text-white"
                                        style={{
                                            background: 'linear-gradient(135deg, #a855f7 0%, #8b5cf6 100%)',
                                        }}
                                    >
                                        💾 Save Theme
                                    </motion.button>

                                    {selectedThemeId && (
                                        <>
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={handleApply}
                                                className="px-6 py-3 rounded-xl font-medium text-purple-700 bg-purple-100"
                                            >
                                                ✓ Apply Theme
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={handleDuplicate}
                                                className="px-6 py-3 rounded-xl font-medium text-gray-600 bg-gray-100"
                                            >
                                                📋 Duplicate
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={handleExport}
                                                className="px-6 py-3 rounded-xl font-medium text-gray-600 bg-gray-100"
                                            >
                                                📤 Export
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={handleDelete}
                                                className="px-6 py-3 rounded-xl font-medium text-red-600 bg-red-50"
                                            >
                                                🗑️ Delete
                                            </motion.button>
                                        </>
                                    )}

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleReset}
                                        className="px-6 py-3 rounded-xl font-medium text-gray-500 bg-gray-50"
                                    >
                                        Reset to Default
                                    </motion.button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                                <div className="text-center">
                                    <div className="text-5xl mb-4">🎨</div>
                                    <p>Select a theme to edit or create a new one</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

            {}
            <AnimatePresence>
                {showImportModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] flex items-center justify-center p-4"
                        style={{ background: 'rgba(0,0,0,0.5)' }}
                        onClick={() => setShowImportModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.95 }}
                            className="bg-white rounded-2xl p-6 w-full max-w-md"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-lg font-bold mb-4">Import Theme</h3>
                            <textarea
                                value={importJson}
                                onChange={(e) => setImportJson(e.target.value)}
                                placeholder="Paste theme JSON here..."
                                className="w-full h-40 p-4 rounded-xl border border-gray-200 text-sm font-mono"
                            />
                            <div className="flex gap-3 mt-4">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleImport}
                                    className="flex-1 py-3 rounded-xl font-medium text-white bg-purple-500"
                                >
                                    Import
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setShowImportModal(false)}
                                    className="flex-1 py-3 rounded-xl font-medium text-gray-600 bg-gray-100"
                                >
                                    Cancel
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ThemeEditor;
