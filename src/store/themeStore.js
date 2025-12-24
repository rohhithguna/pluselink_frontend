import { create } from 'zustand';


const accentColors = {
    purple: {
        name: 'Purple',
        primary: '#A855F7',
        light: '#C084FC',
        dark: '#7E22CE',
    },
    blue: {
        name: 'Blue',
        primary: '#3B82F6',
        light: '#60A5FA',
        dark: '#1D4ED8',
    },
    emerald: {
        name: 'Emerald',
        primary: '#10B981',
        light: '#34D399',
        dark: '#047857',
    },
    rose: {
        name: 'Rose',
        primary: '#F43F5E',
        light: '#FB7185',
        dark: '#BE123C',
    },
};


const themes = {
    light: {
        name: 'Light',
        bg: 'bg-white',
        text: 'text-neutral-900',
        textMuted: 'text-neutral-500',
        textStyle: { color: '#111827', WebkitTextFillColor: '#111827' },
        textMutedStyle: { color: '#6b7280', WebkitTextFillColor: '#6b7280' },
        card: 'bg-white border border-neutral-200/60',
        cardHover: 'hover:border-neutral-300/60 hover:shadow-soft-lg',
        navbar: 'bg-white/80 backdrop-blur-xl border-b border-neutral-200/60',
        input: 'bg-white border-neutral-300 focus:border-primary text-gray-900 placeholder-gray-500 shadow-sm',
        button: 'bg-primary text-white hover:bg-primary-dark shadow-md',
        buttonOutline: 'border-2 border-neutral-300 text-neutral-700 hover:bg-neutral-100 bg-white',
    },
    dark: {
        name: 'Dark',
        bg: 'bg-neutral-950',
        text: 'text-white',
        textMuted: 'text-neutral-400',
        textStyle: { color: '#ffffff', WebkitTextFillColor: '#ffffff' },
        textMutedStyle: { color: '#9ca3af', WebkitTextFillColor: '#9ca3af' },
        card: 'bg-neutral-900 border border-neutral-800',
        cardHover: 'hover:border-neutral-700 hover:shadow-soft-lg',
        navbar: 'bg-neutral-900/80 backdrop-blur-xl border-b border-neutral-800',
        input: 'bg-black/50 backdrop-blur-sm border-neutral-700 focus:border-primary text-white placeholder-gray-400',
        button: 'bg-primary text-white hover:bg-primary-dark',
        buttonOutline: 'border border-neutral-700 text-neutral-300 hover:bg-neutral-800',
    },
    glass: {
        name: 'Glass',
        bg: 'bg-gradient-to-br from-neutral-50 via-white to-neutral-100',
        text: 'text-neutral-900',
        textMuted: 'text-neutral-600',
        textStyle: { color: '#111827', WebkitTextFillColor: '#111827' },
        textMutedStyle: { color: '#4b5563', WebkitTextFillColor: '#4b5563' },
        card: 'bg-white/60 backdrop-blur-xl border border-white/40',
        cardHover: 'hover:bg-white/70 hover:border-white/60 hover:shadow-glass',
        navbar: 'bg-white/40 backdrop-blur-2xl border-b border-white/30',
        input: 'bg-white/90 backdrop-blur-sm border-white/60 focus:border-primary text-gray-900 placeholder-gray-500',
        button: 'bg-primary/90 backdrop-blur-sm text-white hover:bg-primary',
        buttonOutline: 'border border-white/60 backdrop-blur-sm text-neutral-700 hover:bg-white/50 bg-white/30',
    },
    neo: {
        name: 'Neo',
        bg: 'bg-gradient-to-br from-neutral-100 via-neutral-50 to-neutral-100',
        text: 'text-neutral-900',
        textMuted: 'text-neutral-600',
        textStyle: { color: '#111827', WebkitTextFillColor: '#111827' },
        textMutedStyle: { color: '#4b5563', WebkitTextFillColor: '#4b5563' },
        card: 'bg-neutral-100 shadow-[8px_8px_16px_#d1d5db,-8px_-8px_16px_#ffffff]',
        cardHover: 'hover:shadow-[12px_12px_24px_#d1d5db,-12px_-12px_24px_#ffffff]',
        navbar: 'bg-neutral-100/90 backdrop-blur-xl border-b border-neutral-200 shadow-[0_2px_8px_rgba(0,0,0,0.05)]',
        input: 'bg-neutral-100 border-neutral-200 shadow-inner focus:border-primary',
        button: 'bg-gradient-to-br from-primary-light to-primary text-white shadow-lg hover:shadow-xl',
        buttonOutline: 'border border-neutral-300 text-neutral-700 shadow-sm hover:shadow-md',
    },
};

const themeOrder = ['light', 'dark', 'glass', 'neo'];


const applyThemeToDOM = (themeName) => {
    if (typeof document === 'undefined') return;

    
    const cssThemeMap = {
        'light': 'default',
        'dark': 'dark',
        'glass': 'glass',
        'neo': '3d',
    };
    const cssTheme = cssThemeMap[themeName] || 'default';

    
    document.documentElement.setAttribute('data-theme-transitioning', 'true');
    document.body.classList.add('theme-transitioning');

    
    document.documentElement.setAttribute('data-theme', cssTheme);
    document.body.setAttribute('data-theme', cssTheme);

    
    setTimeout(() => {
        document.documentElement.removeAttribute('data-theme-transitioning');
        document.body.classList.remove('theme-transitioning');
    }, 350);
};


if (typeof document !== 'undefined') {
    const storedTheme = localStorage.getItem('theme') || 'light';
    const cssThemeMap = {
        'light': 'default',
        'dark': 'dark',
        'glass': 'glass',
        'neo': '3d',
    };
    document.documentElement.setAttribute('data-theme', cssThemeMap[storedTheme] || 'default');
    document.body.setAttribute('data-theme', cssThemeMap[storedTheme] || 'default');
}

const useThemeStore = create((set, get) => ({
    currentTheme: localStorage.getItem('theme') || 'light',
    currentAccent: localStorage.getItem('accent') || 'purple',
    theme: { ...themes[localStorage.getItem('theme') || 'light'] },
    accentColor: accentColors[localStorage.getItem('accent') || 'purple'],

    setTheme: (themeName) => {
        if (themes[themeName]) {
            localStorage.setItem('theme', themeName);
            const accent = get().accentColor;

            
            applyThemeToDOM(themeName);

            set({
                currentTheme: themeName,
                theme: { ...themes[themeName] },
                accentColor: accent
            });
        }
    },

    cycleTheme: () => {
        const current = get().currentTheme;
        const currentIndex = themeOrder.indexOf(current);
        const nextIndex = (currentIndex + 1) % themeOrder.length;
        const nextTheme = themeOrder[nextIndex];
        get().setTheme(nextTheme);
    },

    setAccent: (accentName) => {
        if (accentColors[accentName]) {
            localStorage.setItem('accent', accentName);
            set({
                currentAccent: accentName,
                accentColor: accentColors[accentName]
            });
        }
    },

    getAccentColors: () => accentColors,
}));

export default useThemeStore;
