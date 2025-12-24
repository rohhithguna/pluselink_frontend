
import { create } from 'zustand';
import api from '../services/api';


const DEFAULT_SETTINGS = {
    
    theme: 'default',
    themePreview: null,
    customThemes: {},

    
    avatarGradient: 'aurora',

    
    cursorGravity: true,
    physicsStrength: 'medium',
    parallaxBackground: true,
    animationSpeed: 'normal',
    hapticFeedback: false,

    
    interfaceSounds: false,
    soundStyle: 'glass',
    loginSound: true,
    notificationVolume: 0.5,

    
    emergencyVisualMode: 'enhanced',
    notificationPopups: true,
    urgentShake: true,
    reactionAnimation: 'bounce',
    reducedEmergencyMotion: false,
    silentEmergencyMode: false,
    autoAcknowledgeOnOpen: false,

    
    layoutMode: 'standard',
    splitViewEnabled: false,
    autoCollapseSidebar: false,

    
    spatialModeEnabled: false,
    spatialMotionIntensity: 'full',
    spatialDepthBlur: 0.5,
    spatialParallax: true,
};


const THEMES = {
    default: {
        name: 'Default',
        description: 'Clean, balanced interface',
        preview: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
        accent: '#a855f7',
        background: '#ffffff',
        text: '#1a1a1a',
        glass: 'rgba(255, 255, 255, 0.6)',
    },
    waterGlass: {
        name: 'Water-Glass',
        description: 'Liquid transparency effects',
        preview: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 50%, #7dd3fc 100%)',
        accent: '#0ea5e9',
        background: '#f0f9ff',
        text: '#0c4a6e',
        glass: 'rgba(224, 242, 254, 0.7)',
    },
    luxury: {
        name: 'Luxury',
        description: 'Premium gold accents',
        preview: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
        accent: '#d4af37',
        background: '#0f0f23',
        text: '#f5f5f5',
        glass: 'rgba(26, 26, 46, 0.8)',
    },
    space: {
        name: 'Space / Futuristic',
        description: 'Deep cosmic aesthetics',
        preview: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
        accent: '#818cf8',
        background: '#0f0c29',
        text: '#e0e7ff',
        glass: 'rgba(48, 43, 99, 0.7)',
    },
    minimalWhite: {
        name: 'Minimal White',
        description: 'Ultra-clean simplicity',
        preview: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
        accent: '#374151',
        background: '#ffffff',
        text: '#111827',
        glass: 'rgba(255, 255, 255, 0.9)',
    },
    natureCalm: {
        name: 'Nature Calm',
        description: 'Organic earth tones',
        preview: 'linear-gradient(135deg, #d4edda 0%, #a8d5ba 50%, #7bc9a0 100%)',
        accent: '#059669',
        background: '#ecfdf5',
        text: '#064e3b',
        glass: 'rgba(212, 237, 218, 0.7)',
    },
    darkStealth: {
        name: 'Dark Stealth',
        description: 'Hidden mode — pure darkness',
        preview: 'linear-gradient(135deg, #0a0a0a 0%, #171717 50%, #0a0a0a 100%)',
        accent: '#ef4444',
        background: '#0a0a0a',
        text: '#f5f5f5',
        glass: 'rgba(10, 10, 10, 0.9)',
        hidden: true,
    },
};


const CUSTOM_THEME_TEMPLATE = {
    name: 'My Theme',
    description: 'Custom theme',
    primaryColor: '#a855f7',
    accentGlow: '#8b5cf6',
    typography: 'sans',
    backgroundTexture: 'clean',
    buttonStyle: 'softGlass',
    motionIntensity: 0.5,
    notificationAnimation: 'slide',
    preview: 'linear-gradient(135deg, #a855f7 0%, #8b5cf6 100%)',
};

const useSettingsStore = create((set, get) => ({
    
    ...DEFAULT_SETTINGS,

    
    themes: THEMES,

    
    syncStatus: 'idle', 
    lastSynced: null,
    isLoggedIn: false,
    conflictData: null,

    
    initSettings: async (isLoggedIn = false) => {
        set({ isLoggedIn });

        
        const saved = localStorage.getItem('pulseconnect_settings');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                set({ ...DEFAULT_SETTINGS, ...parsed });
            } catch (e) {
                console.error('Failed to parse saved settings');
            }
        }

        
        if (isLoggedIn) {
            await get().syncFromServer();
        }
    },

    
    syncFromServer: async () => {
        set({ syncStatus: 'syncing' });

        try {
            const response = await api.get('/settings/sync/');

            if (response.data.success && response.data.settings && Object.keys(response.data.settings).length > 0) {
                const serverSettings = response.data.settings;

                
                
                set({
                    ...serverSettings,
                    syncStatus: 'synced',
                    lastSynced: new Date().toISOString()
                });
                get().saveToLocalStorage();
            } else {
                
                const localSettings = get().getSettingsObject();
                const hasLocalChanges = Object.keys(localSettings).some(k => localSettings[k] !== DEFAULT_SETTINGS[k]);

                if (hasLocalChanges) {
                    
                    await get().syncToServer();
                }
                set({ syncStatus: 'synced', lastSynced: new Date().toISOString() });
            }
        } catch (error) {
            console.error('Failed to sync from server:', error);
            set({ syncStatus: 'offline' });
        }
    },

    
    syncToServer: async () => {
        const state = get();
        if (!state.isLoggedIn) return;

        set({ syncStatus: 'syncing' });

        try {
            const settings = state.getSettingsObject();
            await api.post('/settings/sync/', settings);
            set({ syncStatus: 'synced', lastSynced: new Date().toISOString() });
        } catch (error) {
            console.error('Failed to sync to server:', error);
            set({ syncStatus: 'offline' });
        }
    },

    
    resolveConflict: (useServer) => {
        const state = get();
        if (useServer && state.conflictData?.server) {
            set({
                ...state.conflictData.server,
                syncStatus: 'synced',
                conflictData: null
            });
            get().saveToLocalStorage();
        } else {
            set({ syncStatus: 'synced', conflictData: null });
            get().syncToServer();
        }
    },

    
    getSettingsObject: () => {
        const state = get();
        return {
            theme: state.theme,
            customThemes: state.customThemes,
            avatarGradient: state.avatarGradient,
            cursorGravity: state.cursorGravity,
            physicsStrength: state.physicsStrength,
            parallaxBackground: state.parallaxBackground,
            animationSpeed: state.animationSpeed,
            hapticFeedback: state.hapticFeedback,
            interfaceSounds: state.interfaceSounds,
            soundStyle: state.soundStyle,
            loginSound: state.loginSound,
            notificationVolume: state.notificationVolume,
            emergencyVisualMode: state.emergencyVisualMode,
            notificationPopups: state.notificationPopups,
            urgentShake: state.urgentShake,
            reactionAnimation: state.reactionAnimation,
            reducedEmergencyMotion: state.reducedEmergencyMotion,
            silentEmergencyMode: state.silentEmergencyMode,
            autoAcknowledgeOnOpen: state.autoAcknowledgeOnOpen,
            layoutMode: state.layoutMode,
            splitViewEnabled: state.splitViewEnabled,
            autoCollapseSidebar: state.autoCollapseSidebar,
            spatialModeEnabled: state.spatialModeEnabled,
            spatialMotionIntensity: state.spatialMotionIntensity,
            spatialDepthBlur: state.spatialDepthBlur,
            spatialParallax: state.spatialParallax,
        };
    },

    
    saveToLocalStorage: () => {
        const settings = get().getSettingsObject();
        localStorage.setItem('pulseconnect_settings', JSON.stringify(settings));
    },

    
    updateSetting: (key, value) => {
        set({ [key]: value });
        get().saveToLocalStorage();

        
        if (get().isLoggedIn) {
            clearTimeout(get()._syncTimeout);
            const timeout = setTimeout(() => get().syncToServer(), 1000);
            set({ _syncTimeout: timeout });
        }
    },

    
    updateSettings: (updates) => {
        set(updates);
        get().saveToLocalStorage();
        if (get().isLoggedIn) {
            get().syncToServer();
        }
    },

    
    previewTheme: (themeName) => {
        set({ themePreview: themeName });
    },

    
    applyPreviewedTheme: () => {
        const preview = get().themePreview;
        if (preview) {
            get().updateSetting('theme', preview);
            set({ themePreview: null });
        }
    },

    
    cancelPreview: () => {
        set({ themePreview: null });
    },

    
    createCustomTheme: (themeName, themeData) => {
        const customThemes = { ...get().customThemes };
        const id = `custom_${Date.now()}`;
        customThemes[id] = {
            ...CUSTOM_THEME_TEMPLATE,
            ...themeData,
            name: themeName,
            id,
        };
        get().updateSetting('customThemes', customThemes);
        return id;
    },

    updateCustomTheme: (themeId, updates) => {
        const customThemes = { ...get().customThemes };
        if (customThemes[themeId]) {
            customThemes[themeId] = { ...customThemes[themeId], ...updates };
            get().updateSetting('customThemes', customThemes);
        }
    },

    duplicateCustomTheme: (themeId) => {
        const customThemes = get().customThemes;
        if (customThemes[themeId]) {
            const original = customThemes[themeId];
            return get().createCustomTheme(
                `${original.name} (Copy)`,
                { ...original }
            );
        }
        return null;
    },

    deleteCustomTheme: (themeId) => {
        const customThemes = { ...get().customThemes };
        delete customThemes[themeId];
        get().updateSetting('customThemes', customThemes);

        
        if (get().theme === themeId) {
            get().updateSetting('theme', 'default');
        }
    },

    
    exportTheme: (themeId) => {
        const customThemes = get().customThemes;
        if (customThemes[themeId]) {
            return JSON.stringify(customThemes[themeId], null, 2);
        }
        return null;
    },

    
    importTheme: (jsonString) => {
        try {
            const themeData = JSON.parse(jsonString);
            if (themeData.name) {
                return get().createCustomTheme(themeData.name, themeData);
            }
        } catch (e) {
            console.error('Failed to import theme');
        }
        return null;
    },

    
    resetAllSettings: () => {
        set({ ...DEFAULT_SETTINGS });
        localStorage.removeItem('pulseconnect_settings');
        if (get().isLoggedIn) {
            get().syncToServer();
        }
    },

    
    exportSettings: () => {
        return JSON.stringify(get().getSettingsObject(), null, 2);
    },

    
    importSettings: (jsonString) => {
        try {
            const parsed = JSON.parse(jsonString);
            set({ ...DEFAULT_SETTINGS, ...parsed });
            get().saveToLocalStorage();
            if (get().isLoggedIn) {
                get().syncToServer();
            }
            return true;
        } catch (e) {
            console.error('Failed to import settings');
            return false;
        }
    },

    
    getActiveTheme: () => {
        const state = get();
        const themeName = state.themePreview || state.theme;

        
        if (state.customThemes[themeName]) {
            const custom = state.customThemes[themeName];
            return {
                ...custom,
                preview: custom.preview || `linear-gradient(135deg, ${custom.primaryColor} 0%, ${custom.accentGlow} 100%)`,
                accent: custom.primaryColor,
            };
        }

        return THEMES[themeName] || THEMES.default;
    },

    
    getAllThemes: () => {
        const state = get();
        const allThemes = { ...THEMES };

        Object.entries(state.customThemes).forEach(([id, theme]) => {
            allThemes[id] = {
                ...theme,
                isCustom: true,
                preview: theme.preview || `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.accentGlow} 100%)`,
            };
        });

        return allThemes;
    },
}));

export default useSettingsStore;
export { THEMES, DEFAULT_SETTINGS, CUSTOM_THEME_TEMPLATE };
