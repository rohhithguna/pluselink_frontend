


export const THEMES = {
    DEFAULT: 'default',
    LIGHT: 'light',
    DARK: 'dark',
    GLASS: 'glass',
    NEO: '3d',
};

export const THEME_ORDER = ['default', 'dark', 'glass', '3d'];


const STORAGE_KEY = 'pulseconnect-theme';
const TRANSITION_DURATION = 350;


class ThemeEngine {
    constructor() {
        this.currentTheme = this.getStoredTheme();
        this.listeners = new Set();
        this.isTransitioning = false;
    }

    
    getStoredTheme() {
        if (typeof window === 'undefined') return THEMES.DEFAULT;
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored && Object.values(THEMES).includes(stored) ? stored : THEMES.DEFAULT;
    }

    
    getTheme() {
        return this.currentTheme;
    }

    
    isTheme(theme) {
        return this.currentTheme === theme;
    }

    
    applyTheme(theme, animate = true) {
        if (typeof document === 'undefined') return;

        const validTheme = Object.values(THEMES).includes(theme) ? theme : THEMES.DEFAULT;

        if (animate) {
            this.startTransition();
        }

        
        document.documentElement.setAttribute('data-theme', validTheme);
        document.body.setAttribute('data-theme', validTheme);

        
        this.currentTheme = validTheme;

        
        document.documentElement.className = document.documentElement.className
            .replace(/theme-\w+/g, '')
            .trim();
        document.documentElement.classList.add(`theme-${validTheme}`);

        
        localStorage.setItem(STORAGE_KEY, validTheme);

        
        if (animate) {
            this.createRippleEffect();

            
            setTimeout(() => {
                this.endTransition();
            }, TRANSITION_DURATION);
        }

        
        this.notifyListeners(validTheme);

        return validTheme;
    }

    
    setTheme(theme) {
        return this.applyTheme(theme, true);
    }

    
    cycleTheme() {
        const currentIndex = THEME_ORDER.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % THEME_ORDER.length;
        const nextTheme = THEME_ORDER[nextIndex];
        return this.setTheme(nextTheme);
    }

    
    startTransition() {
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        document.documentElement.setAttribute('data-theme-transitioning', 'true');
        document.body.classList.add('theme-transitioning');
    }

    
    endTransition() {
        this.isTransitioning = false;
        document.documentElement.removeAttribute('data-theme-transitioning');
        document.body.classList.remove('theme-transitioning');
    }

    
    createRippleEffect() {
        
        const ripple = document.createElement('div');
        ripple.className = 'theme-ripple-effect';
        ripple.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            width: 10px;
            height: 10px;
            background: var(--accent-primary);
            border-radius: 50%;
            opacity: 0.15;
            pointer-events: none;
            z-index: 99999;
            transform: translate(-50%, -50%) scale(0);
            animation: themeRipple ${TRANSITION_DURATION}ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        `;

        
        if (!document.getElementById('theme-ripple-keyframes')) {
            const style = document.createElement('style');
            style.id = 'theme-ripple-keyframes';
            style.textContent = `
                @keyframes themeRipple {
                    0% {
                        transform: translate(-50%, -50%) scale(0);
                        opacity: 0.2;
                    }
                    50% {
                        opacity: 0.1;
                    }
                    100% {
                        transform: translate(-50%, -50%) scale(300);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(ripple);

        
        setTimeout(() => {
            ripple.remove();
        }, TRANSITION_DURATION);
    }

    
    subscribe(callback) {
        this.listeners.add(callback);
        return () => this.listeners.delete(callback);
    }

    
    notifyListeners(theme) {
        this.listeners.forEach(callback => {
            try {
                callback(theme);
            } catch (e) {
                console.error('Theme listener error:', e);
            }
        });
    }

    
    initialize() {
        
        this.applyTheme(this.currentTheme, false);

        
        if (typeof window !== 'undefined' && window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
                
                const stored = localStorage.getItem(STORAGE_KEY);
                if (!stored) {
                    this.setTheme(e.matches ? THEMES.DARK : THEMES.DEFAULT);
                }
            });
        }

        return this;
    }

    
    async syncWithBackend(userId, apiEndpoint) {
        if (!userId || !apiEndpoint) return;

        try {
            const response = await fetch(`${apiEndpoint}/users/${userId}/preferences`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    theme: this.currentTheme,
                }),
            });

            if (!response.ok) {
                console.warn('Failed to sync theme with backend');
            }
        } catch (error) {
            console.warn('Theme sync error:', error);
        }
    }

    
    async loadFromBackend(userId, apiEndpoint) {
        if (!userId || !apiEndpoint) return;

        try {
            const response = await fetch(`${apiEndpoint}/users/${userId}/preferences`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                if (data.theme && Object.values(THEMES).includes(data.theme)) {
                    this.setTheme(data.theme);
                }
            }
        } catch (error) {
            console.warn('Failed to load theme from backend:', error);
        }
    }

    
    getCSSVariable(variableName) {
        if (typeof window === 'undefined') return '';
        return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
    }

    
    isDarkMode() {
        return this.currentTheme === THEMES.DARK;
    }

    
    hasGlassEffect() {
        return this.currentTheme === THEMES.GLASS;
    }

    
    isNeomorphic() {
        return this.currentTheme === THEMES.NEO;
    }
}


const themeEngine = new ThemeEngine();


export default themeEngine;


export const getTheme = () => themeEngine.getTheme();
export const setTheme = (theme) => themeEngine.setTheme(theme);
export const cycleTheme = () => themeEngine.cycleTheme();
export const subscribeToTheme = (callback) => themeEngine.subscribe(callback);
export const initializeTheme = () => themeEngine.initialize();
export const isDarkMode = () => themeEngine.isDarkMode();
export const hasGlassEffect = () => themeEngine.hasGlassEffect();
export const isNeomorphic = () => themeEngine.isNeomorphic();


if (typeof window !== 'undefined') {
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => themeEngine.initialize());
    } else {
        themeEngine.initialize();
    }
}
