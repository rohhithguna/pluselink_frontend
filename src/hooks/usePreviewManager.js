
import { useState, useCallback, useRef } from 'react';
import useSettingsStore from '../store/settingsStore';


export const PREVIEW_MODES = {
    THEME: 'THEME',
    MOTION: 'MOTION',
    EMERGENCY: 'EMERGENCY',
    SOUND: 'SOUND',
    ANIMATION: 'ANIMATION',
    LAYOUT: 'LAYOUT',
    SPATIAL: 'SPATIAL',
};


const PREVIEW_SOUNDS = {
    glass: { frequency: 1200, duration: 0.08, type: 'sine' },
    water: { frequency: 600, duration: 0.12, type: 'sine' },
    digital: { frequency: 880, duration: 0.06, type: 'square' },
    click: { frequency: 400, duration: 0.04, type: 'triangle' },
};

const usePreviewManager = () => {
    
    const [isVisible, setIsVisible] = useState(false);

    
    const [mode, setMode] = useState(null);
    const [previewData, setPreviewData] = useState(null);

    
    const [pendingChanges, setPendingChanges] = useState({});

    
    const originalSettingsRef = useRef({});

    
    const audioContextRef = useRef(null);

    
    const updateSetting = useSettingsStore((s) => s.updateSetting);
    const getSettingsObject = useSettingsStore((s) => s.getSettingsObject);

    
    const playPreviewSound = useCallback((style = 'glass') => {
        try {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            }

            const ctx = audioContextRef.current;
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            const sound = PREVIEW_SOUNDS[style] || PREVIEW_SOUNDS.glass;
            oscillator.type = sound.type;
            oscillator.frequency.value = sound.frequency;
            gainNode.gain.value = 0.08;

            oscillator.start();
            gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + sound.duration);
            oscillator.stop(ctx.currentTime + sound.duration);
        } catch (e) {
            
        }
    }, []);

    
    const triggerPreview = useCallback((previewMode, data) => {
        
        if (!isVisible) {
            originalSettingsRef.current = getSettingsObject();
        }

        
        setMode(previewMode);
        setPreviewData(data);
        setPendingChanges((prev) => ({ ...prev, ...data }));
        setIsVisible(true);

        
        if (previewMode === PREVIEW_MODES.SOUND && data.soundStyle) {
            playPreviewSound(data.soundStyle);
        }
    }, [isVisible, getSettingsObject, playPreviewSound]);

    
    const applyChanges = useCallback(() => {
        
        Object.entries(pendingChanges).forEach(([key, value]) => {
            updateSetting(key, value);
        });

        
        playPreviewSound('glass');

        
        setIsVisible(false);
        setMode(null);
        setPreviewData(null);
        setPendingChanges({});
        originalSettingsRef.current = {};
    }, [pendingChanges, updateSetting, playPreviewSound]);

    
    const revertChanges = useCallback(() => {
        
        setIsVisible(false);
        setMode(null);
        setPreviewData(null);
        setPendingChanges({});
        originalSettingsRef.current = {};
    }, []);

    
    const hidePreview = useCallback(() => {
        setIsVisible(false);
    }, []);

    
    const addPendingChange = useCallback((key, value) => {
        setPendingChanges((prev) => ({ ...prev, [key]: value }));
    }, []);

    
    const hasUnsavedChanges = Object.keys(pendingChanges).length > 0;

    return {
        
        isVisible,
        mode,
        previewData,
        pendingChanges,
        hasUnsavedChanges,

        
        triggerPreview,
        applyChanges,
        revertChanges,
        hidePreview,
        addPendingChange,
        playPreviewSound,

        
        PREVIEW_MODES,
    };
};

export default usePreviewManager;
