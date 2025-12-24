


let turbulenceEl = null;
let displaceEl = null;
let rafId = null;
let isEnabled = false;


const defaults = {
    baseFrequency: 0.012,
    scale: 0,
    maxScale: 40,
};


let currentParams = { ...defaults };


export const initLiquidFilter = () => {
    turbulenceEl = document.getElementById('liquid-turbulence');
    displaceEl = document.getElementById('liquid-displace');

    if (!turbulenceEl || !displaceEl) {
        console.warn('Liquid filter SVG elements not found');
        return false;
    }

    isEnabled = true;
    return true;
};


export const setScale = (scale) => {
    currentParams.scale = Math.max(0, Math.min(defaults.maxScale, scale));
    scheduleUpdate();
};


export const setFrequency = (frequency) => {
    currentParams.baseFrequency = Math.max(0.001, Math.min(0.05, frequency));
    scheduleUpdate();
};


export const resetFilter = () => {
    currentParams = { ...defaults };
    scheduleUpdate();
};


export const enableFilter = (enabled) => {
    isEnabled = enabled;
    if (!enabled) {
        resetFilter();
    }
};


const scheduleUpdate = () => {
    if (rafId) return;

    rafId = requestAnimationFrame(() => {
        applyParams();
        rafId = null;
    });
};


const applyParams = () => {
    if (!turbulenceEl || !displaceEl || !isEnabled) return;

    turbulenceEl.setAttribute('baseFrequency', currentParams.baseFrequency);
    displaceEl.setAttribute('scale', currentParams.scale);
};


export const getParams = () => ({ ...currentParams });


export const isFilterEnabled = () => isEnabled && turbulenceEl && displaceEl;


export const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;


export { defaults as liquidFilterDefaults };
