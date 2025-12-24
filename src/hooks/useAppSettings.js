
import { useCallback, useMemo } from 'react';
import useSettingsStore from '../store/settingsStore';


const SPEED_MULTIPLIERS = {
    slow: 1.5,
    normal: 1,
    fast: 0.6,
};


const PHYSICS_VALUES = {
    off: 0,
    soft: 0.3,
    medium: 0.6,
    strong: 1,
};


const SOUND_PROFILES = {
    water: { frequencies: [600, 400, 500], duration: 0.12, type: 'sine' },
    digital: { frequencies: [880, 660, 770], duration: 0.08, type: 'square' },
    glass: { frequencies: [1200, 900, 1050], duration: 0.1, type: 'sine' },
    click: { frequencies: [400, 300, 350], duration: 0.05, type: 'triangle' },
};

const useAppSettings = () => {
    const settings = useSettingsStore();

    
    const getAnimationDuration = useCallback((baseDuration = 0.3) => {
        const multiplier = SPEED_MULTIPLIERS[settings.animationSpeed] || 1;
        return baseDuration * multiplier;
    }, [settings.animationSpeed]);

    
    const getSpringConfig = useMemo(() => {
        const speedMultiplier = SPEED_MULTIPLIERS[settings.animationSpeed] || 1;
        return {
            stiffness: 300 / speedMultiplier,
            damping: 20 * speedMultiplier,
        };
    }, [settings.animationSpeed]);

    
    const physicsValue = useMemo(() => {
        return PHYSICS_VALUES[settings.physicsStrength] || 0.6;
    }, [settings.physicsStrength]);

    
    const playUISound = useCallback((soundType = 'tap', customVolume) => {
        if (!settings.interfaceSounds) return;

        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            const profile = SOUND_PROFILES[settings.soundStyle] || SOUND_PROFILES.glass;
            const freqIndex = soundType === 'tap' ? 0 : soundType === 'success' ? 1 : 2;

            oscillator.type = profile.type;
            oscillator.frequency.value = profile.frequencies[freqIndex];
            gainNode.gain.value = (customVolume ?? settings.notificationVolume) * 0.1;

            oscillator.start();
            gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + profile.duration);
            oscillator.stop(ctx.currentTime + profile.duration);
        } catch (e) {
            
        }
    }, [settings.interfaceSounds, settings.soundStyle, settings.notificationVolume]);

    
    const playLoginSound = useCallback(() => {
        if (!settings.loginSound) return;

        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.type = 'sine';
            oscillator.frequency.value = 880;
            gainNode.gain.value = settings.notificationVolume * 0.1;

            oscillator.start();

            
            oscillator.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.15);
            gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
            oscillator.stop(ctx.currentTime + 0.2);
        } catch (e) {
            
        }
    }, [settings.loginSound, settings.notificationVolume]);

    
    const playEmergencySound = useCallback((priority = 'emergency') => {
        if (settings.silentEmergencyMode) return;

        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            const freqs = priority === 'emergency' ? [880, 660] : [660, 550];
            oscillator.type = 'sine';
            oscillator.frequency.value = freqs[0];
            gainNode.gain.value = settings.notificationVolume * 0.15;

            oscillator.start();
            oscillator.frequency.setValueAtTime(freqs[1], ctx.currentTime + 0.1);
            oscillator.frequency.setValueAtTime(freqs[0], ctx.currentTime + 0.2);
            gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
            oscillator.stop(ctx.currentTime + 0.3);
        } catch (e) {
            
        }
    }, [settings.silentEmergencyMode, settings.notificationVolume]);

    
    const triggerHaptic = useCallback((intensity = 'light') => {
        if (!settings.hapticFeedback) return;

        if (navigator.vibrate) {
            const durations = { light: 10, medium: 25, heavy: 50 };
            navigator.vibrate(durations[intensity] || 10);
        }
    }, [settings.hapticFeedback]);

    
    const emergencyVisualConfig = useMemo(() => {
        const configs = {
            basic: {
                pulseScale: 1.02,
                glowIntensity: 0.3,
                shakeDuration: 0.3,
                overlayOpacity: 0.1,
            },
            enhanced: {
                pulseScale: 1.05,
                glowIntensity: 0.5,
                shakeDuration: 0.5,
                overlayOpacity: 0.2,
            },
            cinematic: {
                pulseScale: 1.08,
                glowIntensity: 0.8,
                shakeDuration: 0.8,
                overlayOpacity: 0.3,
            },
        };
        return configs[settings.emergencyVisualMode] || configs.enhanced;
    }, [settings.emergencyVisualMode]);

    
    const getShakeAnimation = useCallback((priority) => {
        if (priority !== 'emergency' && priority !== 'important') return {};
        if (!settings.urgentShake || settings.reducedEmergencyMotion) return {};

        const intensity = settings.emergencyVisualMode === 'cinematic' ? 8 :
            settings.emergencyVisualMode === 'enhanced' ? 5 : 3;

        return {
            x: [0, -intensity, intensity, -intensity, intensity, 0],
            transition: { duration: 0.4 }
        };
    }, [settings.urgentShake, settings.reducedEmergencyMotion, settings.emergencyVisualMode]);

    
    const getReactionAnimation = useCallback(() => {
        const animations = {
            none: {},
            soft: { scale: [1, 1.05, 1], transition: { duration: 0.2 } },
            bounce: { scale: [1, 1.2, 0.9, 1.1, 1], transition: { duration: 0.4, type: 'spring' } },
            confetti: { scale: [1, 1.3, 1], rotate: [0, 10, -10, 0], transition: { duration: 0.5 } },
        };
        return animations[settings.reactionAnimation] || animations.soft;
    }, [settings.reactionAnimation]);

    
    const layoutConfig = useMemo(() => {
        const configs = {
            compact: { cardPadding: 'p-3', gap: 'gap-3', gridCols: 'grid-cols-1 md:grid-cols-3 lg:grid-cols-4' },
            standard: { cardPadding: 'p-4', gap: 'gap-4', gridCols: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' },
            immersive: { cardPadding: 'p-6', gap: 'gap-6', gridCols: 'grid-cols-1 md:grid-cols-2' },
        };
        return configs[settings.layoutMode] || configs.standard;
    }, [settings.layoutMode]);

    return {
        
        ...settings,

        
        getAnimationDuration,
        getSpringConfig,
        physicsValue,
        emergencyVisualConfig,
        layoutConfig,

        
        getShakeAnimation,
        getReactionAnimation,

        
        playUISound,
        playLoginSound,
        playEmergencySound,

        
        triggerHaptic,
    };
};

export default useAppSettings;
