


let audioContext = null;

const getAudioContext = () => {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContext;
};


export const themeSounds = {
    
    default: () => {
        const ctx = getAudioContext();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.1);
    },

    
    aurora: () => {
        const ctx = getAudioContext();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.value = 1200;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.15);
    },

    
    serenity: () => {
        const ctx = getAudioContext();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.value = 150;
        oscillator.type = 'triangle';
        filter.type = 'lowpass';
        filter.frequency.value = 400;

        gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.12);
    },

    
    cyber: () => {
        const ctx = getAudioContext();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.setValueAtTime(1400, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.08);
        oscillator.type = 'square';

        gainNode.gain.setValueAtTime(0.06, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.08);
    },

    
    royal: () => {
        const ctx = getAudioContext();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.value = 400;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.18);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.18);
    },

    
    festival: () => {
        const ctx = getAudioContext();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.setValueAtTime(2000, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.05);
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.1);
    },
};


export const playThemeSound = (themeId, soundEnabled) => {
    if (!soundEnabled) return;

    const soundFn = themeSounds[themeId];
    if (soundFn) {
        try {
            soundFn();
        } catch (error) {
            console.warn('Failed to play theme sound:', error);
        }
    }
};
